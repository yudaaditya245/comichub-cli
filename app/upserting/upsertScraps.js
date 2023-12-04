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

      if (!checkData) {
        // id data not found, then adding new data
        logging += ` ~ data not found in scraps, adding new data: ${comic.latest_chapter}`;
        await prisma.scraps.create({
          data: comic,
        });

        console.log(logging, chalk.greenBright.bold("\n=== ADDED!\n"));
        added++;
      } else {
        logging += " ~ data found in scraps!";
        // if data found in scrap, update the link in case it changed
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
              images: null,
            },
          });

          // after update the chapter in scraps, also update in main comics data, by check first
          const mainData = checkData.main_id
            ? await prisma.comics.findUnique({
                where: {
                  id: checkData.main_id,
                },
              })
            : null;

          // if main data chapter still behind current scrap, then update also
          logging += " ~ checking main data...";
          if (
            mainData !== null &&
            mainData.latest_chapter < comic.latest_chapter
          ) {
            logging += ` ~ main data found, but chapter lag behind, updating: ${mainData.latest_chapter} > ${comic.latest_chapter}`;

            await prisma.comics.update({
              where: {
                id: checkData.main_id,
              },
              data: {
                latest_chapter: comic.latest_chapter,
                latest_scrap_id: checkData.id,
              },
            });
          } else {
            logging +=
              mainData === null
                ? " ~ main data not found"
                : ` ~ main data already updated: ${mainData.latest_chapter}`;
          }

          console.log(logging, chalk.blueBright.bold("\n=== UPDATED!\n"));
          updated++;
        }
      }

      // update groups log date
      await prisma.groups.update({
        where: {
          slug: comic.source,
        },
        data: {
          updated_at: new Date(),
        },
      });
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
