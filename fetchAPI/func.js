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
