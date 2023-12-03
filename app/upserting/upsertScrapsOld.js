import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const prisma = new PrismaClient();

export async function upsertScraps(comics) {
  let added = 0,
    updated = 0,
    ignored = 0;

  try {
    for (const comic of comics) {
      let logging = "";
      console.info("->", comic.title);

      // check if there exist the corresponding data in "scraps"
      const checkData = await prisma.scraps.findFirst({
        where: {
          title: comic.title,
          source: comic.source,
        },
      });

      // if data already exist in table scraps, then ...
      if (checkData) {
        logging += " ~ data found in scraps!";
        // update the link in case it changed
        await prisma.scraps.updateMany({
          where: {
            title: comic.title,
            source: comic.source,
          },
          data: {
            link: comic.link,
            link_chapter: comic.link_chapter,
            cover_img: comic.cover_img,
          },
        });

        // check the chapter, if it the same or higher than the current data, then it is updated, do nothing
        if (checkData.latest_chapter >= comic.latest_chapter) {
          logging += " ~ chapter already updated, do nothing.";
          console.log(logging, chalk.yellow.bold("\n===NOTHING CHANGED!\n"));
          ignored++;

          // if the chapter < current scrapped chapter, means chapter's old, then update the chapter
        } else {
          logging += ` ~ chapter lag, updating chapter: ${checkData.latest_chapter} > ${comic.latest_chapter}`;
          // update the chapter in table scraps
          await prisma.scraps.updateMany({
            where: {
              title: comic.title,
              source: comic.source,
            },
            data: {
              latest_chapter: comic.latest_chapter,
              updated_at: comic.updated_at,
              images : null
            },
          });

          // after update the chapter in scraps, also update in main comics data, by check first
          const mainData = checkData.mainId
            ? await prisma.comics.findUnique({
                where: {
                  id: checkData.mainId,
                },
              })
            : null;

          // if main data chapter still behind current scrap, then update also
          logging += " ~ checking main data...";
          if (
            mainData != null &&
            mainData.latest_chapter < comic.latest_chapter
          ) {
            logging += ` ~ main data found, but chapter lag behind, updating: ${mainData.latest_chapter} > ${comic.latest_chapter}`;

            await prisma.comics.update({
              where: {
                id: checkData.mainId,
              },
              data: {
                latest_chapter: comic.latest_chapter,
                link_chapter: comic.link_chapter,
                updated_at: comic.updated_at
              },
            });
          } else {
            logging += " ~ main id not found, or already updated.";
          }

          console.log(logging, chalk.blueBright.bold("\n=== UPDATED!\n"));
          updated++;
        }

        // if data do not exist in table scraps, then simply add new data
        // perhaps it is a new comic
      } else {
        logging += ` ~ data not found in scraps, adding new data: ${comic.latest_chapter}`;
        await prisma.scraps.create({
          data: comic,
        });

        console.log(logging, chalk.greenBright.bold("\n=== ADDED!\n"));
        added++;
      }
    }

    // THIS IS SIMPLY RECAP WHAT ACTION IN WHICH DATA
    console.log({
      added: added,
      updated: updated,
      ignored: ignored,
    });

    // CATCH ANY ERROR IN THIS
  } catch (error) {
    console.log(error.message);

    // CLOSE PRISMA CONNECTION IN FINISH
  } finally {
    await prisma.$disconnect();
  }
}
