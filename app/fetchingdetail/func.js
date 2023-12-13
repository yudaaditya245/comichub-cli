import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function insertMainData(comicData, apiData) {
  //   console.log({ comicData, apiData });
  await prisma.comics.create({
    data: {
      id: apiData[0].id,
      title: comicData.title,
      description: apiData[0].description,
      cover_img: apiData[0].coverImage.extraLarge,
      type: apiData[0].countryOfOrigin,
      genres: JSON.stringify(apiData[0].genres),
      synonyms: JSON.stringify(
        [...apiData[0].synonyms, Object.values(apiData[0].title)].filter(
          (value) => value !== undefined && value !== null
        )
      ),
      anilist_url: apiData[0].siteUrl,
      score: apiData[0].averageScore,
    },
  });

  await prisma.comicsLang.create({
    data: {
      lang: comicData.lang,
      scrap_id: comicData.id,
      comic_id: apiData[0].id,
      latest_chapter: comicData.latest_chapter,
      updated_at: comicData.updated_at,
    },
  });
}

export async function upsertChapLang(comicData, apiData) {
  // check chapLang table
  const checkChapLang = await prisma.comicsLang.findFirst({
    where: {
      comic_id: apiData[0].id,
      lang: comicData.lang,
    },
  });

  if (checkChapLang.latest_chapter >= comicData.latest_chapter) {
    // if the chapter stil fresh
    return false;
  } else {
    // if the chapter lag behind

    await prisma.comicsLang.update({
      where: {
        comic_id: apiData[0].id,
        lang: comicData.lang,
      },
      data: {
        latest_chapter: comicData.latest_chapter,
        updated_at: comicData.updated_at,
      },
    });
    return true
  }
}
