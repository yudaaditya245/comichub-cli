import { PrismaClient } from "@prisma/client";
import { anilistAPI } from "./apis.js";
import chalk from "chalk";
import {
  bindMainId,
  checkingComic,
  compareMainData,
  createMainData,
} from "./func.js";

const prisma = new PrismaClient();

export async function fetchAPI(limit = 50) {
  const getScraps = await prisma.scraps.findMany({
    where: {
      main_id: null,
    },
    take: limit,
    orderBy : {
      updated_at : 'desc'
    }
  });

  for (const comic of getScraps) {
    console.log("-> fetching :", comic.title);

    const apiData = await anilistAPI(comic.title);

    if (apiData.length < 1) {
      console.log(chalk.yellowBright("=== NOT FOUND!\n"));
    } else {
      let logging = "~ data found, checking data in comics_";
      const isMainDataExist = await checkingComic(apiData[0].id);

      if (!isMainDataExist) {
        logging += " ~ data not found in comics, inserting fetched data.";
        await createMainData(apiData, comic);

        console.log(logging, chalk.greenBright("\n=== CREATED!\n"));
      } else {
        logging += " ~ data found in comics, checking chapter_";

        if (await compareMainData(comic, apiData[0].id)) {
          logging += " ~ chapter lag, update the chapter";
          console.log(logging, chalk.blueBright("\n=== UPDATED!\n"));
        } else {
          logging += " ~ chapter still updated, do nothing!";
          console.log(logging, chalk.blueBright("\n=== DATA BINDED ONLY!\n"));
        }
      }

      await bindMainId(comic, apiData);
    }
  }

  await prisma.$disconnect();
}
