import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function upsertScraps(comics) {
  console.log(" ");
  console.log("=== Updating scraped data to table ===");
  try {
    let added = 0,
      updated = 0,
      ignored = 0;

    for (const comic of comics) {
      const checkData = await prisma.scraps.findFirst({
        where: {
          title: comic.title,
          source: comic.source,
        },
      });

      // CHECKED IF DATA EXIST in scrap
      if (checkData) {

        // // only check if the link updated, otherwise nothing really change
        await prisma.scraps.updateMany({
          where: {
            title: comic.title,
            source: comic.source,
          },
          data: {
            link: comic.link,
            link_chapter: comic.link_chapter,
          },
        });

        // if exist and the chapter the same, means already updated, nothing change
        if (checkData.latest_chapter >= comic.latest_chapter) {
          console.log(
            comic.title.substr(0, 20),
            " : NOTHING CHANGED, data already updated!"
          );
          ignored++;

        // if exist but the chapter < scrapped chapter, means chapter still behind, must update
        } else {
          const timestampnow = new Date().toISOString();

          await prisma.scraps.updateMany({
            where: {
              title: comic.title,
              source: comic.source,
            },
            data: {
              latest_chapter: comic.latest_chapter,
              updated_at: timestampnow,
            },
          });

          // after update the chapter, also update in main data
          // if the data has no mainId yet, then do nothing, will be handle in next process
          await prisma.comics.update({
            where: {
              id: checkData.mainId,
            },
            data: {
              latest_chapter: comic.latest_chapter,
              updated_at: timestampnow,
            },
          });

          console.log(comic.title.substr(0, 20), " : UPDATED!");
          updated++;
        }

        // IF DATA NOT EXIST, THEN SIMPLY ADD THE DATA TO DATABASE
        // MEANS PERHAPS IT IS NEW COMIC
      } else {
        await prisma.scraps.create({
          data: {
            ...comic,
            updated_at: new Date().toISOString(),
          },
        });

        console.log(comic.title.substr(0, 20), " : ADDED!");
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
