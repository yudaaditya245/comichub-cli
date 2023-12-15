import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkingComic(main_id) {
  if (
    await prisma.comics.findFirst({
      where: {
        id: main_id,
      },
    })
  ) {
    return true;
  } else {
    return false;
  }
}

export async function createMainData(apiData, comicData) {
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

export async function compareMainData(comic, main_id) {
  const getLangChap = await prisma.comicsLang.findFirst({
    where: {
      comic_id: main_id,
      lang: comic.lang,
    },
  });

  if (getLangChap.latest_chapter < comic.latest_chapter) {
    await prisma.comicsLang.updateMany({
      where: {
        comic_id: main_id,
        lang: comic.lang,
      },
      data: {
        scrap_id: comic.id,
        latest_chapter: comic.latest_chapter,
        updated_at: comic.updated_at,
      },
    });

    return true;
  } else {
    return false;
  }
}

export async function bindMainId(comic, apiData) {
  await prisma.scraps.update({
    where: {
      id: comic.id,
    },
    data: {
      main_id: apiData[0].id,
    },
  });
}
