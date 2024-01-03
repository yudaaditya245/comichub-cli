import { PrismaClient } from "@prisma/client";
import { createChapter, createScrape, updateLink, updateScrape } from "./func.js";
import chalk from "chalk";

const prisma = new PrismaClient();

export async function upsertScraps(comics) {
  let created = 0,
    updated = 0,
    ignored = 0;

  for (const comic of comics) {
    // if scrape from groups return error, update error log
    if (comic.error) {
      await prisma.groups.update({
        where: {
          slug: comic.source
        },
        data: {
          error_at: new Date(),
          error_message: comic.message
        }
      });
    }

    // if no error
    if (!comic.error) {
      console.log("-->", comic.source, ":", comic.title);

      const checkScrape = await prisma.scraps.findFirst({
        where: {
          title: comic.title,
          source: comic.source
        }
      });

      if (!checkScrape) {
        // if data not found in scraps, create new data
        await createScrape(comic);

        created++;
      } else {
        // if data found in scrap, update the link in case it changed
        await updateLink(comic);

        if (checkScrape && checkScrape.latest_chapter >= comic.latest_chapter) {
          // if data found in scraps, and chapter still updated
          console.log(`~ data found in scraps, but chapter still updated: ${checkScrape.latest_chapter}`);
          console.log(chalk.yellowBright("=== NOTHING CHANGED! \n"));

          // run createChapter even latest_chapter updated, just in case
          await createChapter(checkScrape.id, comic);
          ignored++;
        } else {
          // if data found in scraps, and chapter lag behind
          let logging = `~ data found with old chapter, updating: ${checkScrape.latest_chapter} > ${comic.latest_chapter}`;
          await updateScrape(checkScrape.id, comic);

          console.log(logging, chalk.blueBright("\n=== UPDATED!\n"));
          updated++;
        }
      }
    }
  }

  console.log({ created, updated, ignored });

  await prisma.$disconnect();
}
