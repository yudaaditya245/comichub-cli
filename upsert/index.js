import { PrismaClient } from "@prisma/client";
import {
  createScrape,
  updateLink,
  updateRecaped,
  updateScrape,
} from "./func.js";
import chalk from "chalk";

const prisma = new PrismaClient();

export async function upsertScraps(comics) {
  for (const comic of comics) {
    // if scrape from groups return error, update
    if (comic.error) {
      await prisma.groups.update({
        where: {
          slug: comic.source,
        },
        data: {
          error_at: new Date(),
          error_message: comic.message,
        },
      });
    }

    if (!comic.error) {
      console.log("-->", comic.title);

      const checkScrape = await prisma.scraps.findFirst({
        where: {
          title: comic.title,
          source: comic.source,
        },
      });

      if (!checkScrape) {
        // if data not found in scraps, create new data
        await createScrape(comic);
      } else {
        // if data found in scrap, update the link in case it changed
        await updateLink(comic);

        if (checkScrape && checkScrape.latest_chapter >= comic.latest_chapter) {
          // if data found in scraps, and chapter still updated
          console.log("~ data found in scraps, but chapter still updated");
          console.log(chalk.yellowBright("=== NOTHING CHANGED! \n"));
        } else {
          // if data found in scraps, and chapter lag behind
          let logging = "~ data found with old chapter, updating ...";
          await updateScrape(comic);

          // if main_id exist, then also update chapter in main comics data
          if (checkScrape.main_id) {
            await updateRecaped(comic, checkScrape, logging);
          }

          console.log(logging, chalk.blueBright("\n=== UPDATED!\n"));
        }
      }
    }
  }

  await prisma.$disconnect();
}
