import { PrismaClient } from "@prisma/client";
import { anilistAPI } from "./apis.js";
import chalk from "chalk";

const prisma = new PrismaClient();

export async function fetchAPI(totalData = 50) {
  let updated = 0,
    notFound = 0;

  // get data which dont have main id
  const dataWithoutMainId = await prisma.scraps.findMany({
    where: {
      mainId: null,
    },
    take: totalData,
    orderBy: {
      updated_at: "desc",
    },
  });

  for (const comic of dataWithoutMainId) {
    let logging = "";
    console.log("-> Fetching :", comic.title);

    // get main id and detail from anilist api, based on the title
    const apiData = await anilistAPI(comic.title);
    // console.log(comic.title);
    // console.log(apiData[0]);

    // if retrieved api exist, then simply insert to main data
    if (apiData.length > 0) {
      logging += ` ~ found detail : ${(
        apiData[0].title.english ??
        apiData[0].title.userPreferred ??
        apiData[0].title.native
      ).substr(0, 25)}`;

      // get data if the detail already in the main data
      const existMainData = await prisma.comics.findUnique({
        where: {
          id: apiData[0].id,
        },
      });

      // if detail doesnt exist in main data, then add new main data
      if (!existMainData) {
        logging += " ~ main data does not exist, adding main data...";
        await prisma.comics.create({
          data: {
            id: apiData[0].id,
            title: comic.title,
            description: apiData[0].description,
            cover_img: apiData[0].coverImage.extraLarge,
            latest_chapter: comic.latest_chapter,
            link_chapter: comic.link_chapter,
            updated_at: comic.updated_at,
            type: apiData[0].countryOfOrigin,
            genres: JSON.stringify(apiData[0].genres),
            synonyms: JSON.stringify(
              [...apiData[0].synonyms, Object.values(apiData[0].title)].filter(
                (value) => value !== undefined && value !== null
              )
            ),
            anilist_url: apiData[0].siteUrl,
            score: apiData[0].averageScore
          },
        });

        console.log(logging, chalk.greenBright("\n=== MAIN DATA CREATED!\n"));

        // if main data exist, and chapter lag behind, than update
      } else if (
        existMainData &&
        existMainData.latest_chapter < comic.latest_chapter
      ) {
        logging += ` ~ main data exist, but chapter lag, updating chapter : ${existMainData.latest_chapter} > ${comic.latest_chapter}`;

        await prisma.comics.update({
          where: {
            id: apiData[0].id,
          },
          data: {
            latest_chapter: comic.latest_chapter,
            link_chapter: comic.link_chapter,
            updated_at: comic.updated_at,
          },
        });
        console.log(logging, chalk.blueBright("\n=== MAIN DATA CHAPTER UPDATED!\n"));

        // if main data exist, but chapter still fresh, just update log
      } else if (
        existMainData &&
        existMainData.latest_chapter >= comic.latest_chapter
      ) {
        logging += ` ~ main data exist, and chapter still new, main data not updated : ${existMainData.latest_chapter}`;
        console.log(logging, chalk.blueBright("\n=== CURRENT DATA BINDED WITH MAIN DATA!\n"));
      }

      // dont forget to also bind main id found in the api, into the scrap data
      await prisma.scraps.update({
        where: {
          id: comic.id,
        },
        data: {
          mainId: apiData[0].id,
        },
      });

      updated++;
    } else {
      console.log(chalk.redBright("=== DETAIL NOT FOUND!\n"));
      notFound++;
    }

    await prisma.$disconnect();
  }

  console.log({
    updated,
    notFound,
  });
}
