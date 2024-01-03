import { PrismaClient } from "@prisma/client";
import { anilistAPI } from "./apis.js";
import chalk from "chalk";
import { bindMainId, checkingComic, createMainData } from "./func.js";

const prisma = new PrismaClient();

export async function fetchAPI(limit = 80) {
  let created = 0,
    binded = 0,
    ignored = 0;

  const getScraps = await prisma.scraps.findMany({
    where: {
      main_id: null
    },
    take: limit,
    orderBy: {
      updated_at: "desc"
    }
  });

  for (const comic of getScraps) {
    console.log("-> fetching :", comic.title);

    const apiData = await anilistAPI(comic.title);

    if (apiData.length < 1) {
      console.log(chalk.yellowBright("=== NOT FOUND!\n"));
      ignored++;
    } else {
      let logging = "~ data found, checking data in comics_";
      const isMainDataExist = await checkingComic(apiData[0].id);

      if (!isMainDataExist) {
        // if api found, but main_id doesnt exist in comics
        logging += " ~ data not found in comics, inserting fetched data.";
        await createMainData(apiData, comic);

        console.log(logging, chalk.greenBright("\n=== CREATED!\n"));
        created++;
      } else {
        // if api found, and main_id already exist in comics
        logging += " ~ data found in comics, binding data";
        console.log(logging, chalk.blueBright("\n=== DATA BINDED ONLY!\n"));
        binded++;
      }

      await bindMainId(comic, apiData);
    }
  }

  console.log({ created, binded, ignored });
  await prisma.$disconnect();
}
