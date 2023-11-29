import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchAnilist() {
  console.log(' ');
  console.log('=== Updating detailed data from anilist API ===');

  let updated = 0, notFound = 0;

  // get data which dont have main id
  const dataWithoutMainId = await prisma.scraps.findMany({
    where: {
      mainId: null,
    }
  });

  for (const comic of dataWithoutMainId) {

    // get main id and detail from anilist api, based on the title
    const apiData = await fetchAniAPI(comic);

    // if detailed info exist, then simply insert to main data
    if (apiData.length > 0) {
      // or if data already exist in main data, do nothing, using upsert cz simpler code
      await prisma.comics.upsert({
        where: {
          id: apiData[0].id,
        },
        create: {
          id: apiData[0].id,
          title: comic.title,
          description: apiData[0].description,
          img: apiData[0].coverImage.large,
          latest_chapter: comic.latest_chapter,
          updated_at: comic.updated_at,
        },
        update : {}
      });

      // dont forget to also bind main id found in the api, into rhe scrap data
      await prisma.scraps.update({
        where: {
          id: comic.id,
        },
        data: {
          mainId: apiData[0].id,
        },
      });

      console.log("Updating -", comic.title, " : Found!");
      updated++
    } else {
      console.log("Updating -", comic.title, " : Not found!");
      notFound++;
    }
  }

  console.log({
    updated,
    notFound,
  });
}

async function fetchAniAPI(comic) {
  const query = `
  query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: MANGA, sort: SEARCH_MATCH) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          large
        }
        description
        synonyms
      }
    }
  }
  `;

  // for (const com of scrap) {
  var variables = {
    search: comic.title,
    perPage: 2,
  };

  var url = "https://graphql.anilist.co";
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };

  try {
    const req = await fetch(url, options);
    const res = await req.json();

    return res.data.Page.media;
  } catch (err) {
    return err.message;
  }
}
