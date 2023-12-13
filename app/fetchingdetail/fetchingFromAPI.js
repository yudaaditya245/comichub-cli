import { PrismaClient } from "@prisma/client";
import { anilistAPI } from "./apis.js";
import chalk from "chalk";
import { insertMainData, upsertChapLang } from "./func.js";

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
      updated_at: "asc",
    },
  });

  for (const comic of dataWithoutMainId) {
    let logging = "";
    console.log("-> Fetching :", comic.title);

    // get main id and detail from anilist api, based on the title
    const apiData = await anilistAPI(comic.title);

    // if retrieved api DONT exist
    if (apiData.length < 1) {
      console.log(chalk.redBright("=== DETAIL NOT FOUND!\n"));
      notFound++;
    }

    // if retrieved api exist
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

        await insertMainData(comic, apiData);
        console.log(logging, chalk.greenBright("\n=== MAIN DATA CREATED!\n"));
      } else {
        // if main data exist, update depend on the chapter
        const updateChap = await upsertChapLang(comic, apiData);

        if (updateChap) {
          logging += ` ~ main data exist, but chapter lag, updating chapter : ${existMainData.latest_chapter} > ${comic.latest_chapter}`;
          console.log(
            logging,
            chalk.blueBright("\n=== MAIN DATA CHAPTER UPDATED!\n")
          );
        } else {
          logging += ` ~ main data exist, and chapter still updated, main data not updated : ${existMainData.latest_chapter}`;
          console.log(
            logging,
            chalk.blueBright("\n=== CURRENT DATA BINDED WITH MAIN DATA!\n")
          );
        }
      }
      // else if (
      //   existMainData &&
      //   existMainData.latest_chapter < comic.latest_chapter
      // ) {

      //   await prisma.comics.update({
      //     where: {
      //       id: apiData[0].id,
      //     },
      //     data: {
      //       latest_chapter: comic.latest_chapter,
      //       latest_scrap_id: comic.id,
      //     },
      //   });
      //   console.log(
      //     logging,
      //     chalk.blueBright("\n=== MAIN DATA CHAPTER UPDATED!\n")
      //   );

      //   // if main data exist, but chapter still fresh, just update log
      // } else if (
      //   existMainData &&
      //   existMainData.latest_chapter >= comic.latest_chapter
      // ) {
      //   logging += ` ~ main data exist, and chapter still updated, main data not updated : ${existMainData.latest_chapter}`;
      //   console.log(
      //     logging,
      //     chalk.blueBright("\n=== CURRENT DATA BINDED WITH MAIN DATA!\n")
      //   );
      // }

      // // dont forget to also bind main id found in the api, into the scrap data
      // await prisma.scraps.update({
      //   where: {
      //     id: comic.id,
      //   },
      //   data: {
      //     main_id: apiData[0].id,
      //   },
      // });

      updated++;
    }

    await prisma.$disconnect();
  }

  console.log({
    updated,
    notFound,
  });
}
