import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const prisma = new PrismaClient();

export async function updateLink(comic) {
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
}

export async function createScrape(comic) {
  await prisma.scraps.create({
    data: comic,
  });

  console.log("~ data not found in scraps, creating new data ...");
  console.log(chalk.greenBright("=== SCRAPE CREATED! \n\n"));
}

export async function updateScrape(comic) {
  await prisma.scraps.updateMany({
    where: {
      title: comic.title,
      source: comic.source,
    },
    data: {
      latest_chapter: comic.latest_chapter,
      link_chapter: comic.link_chapter,
      images: null,
    },
  });
}

export async function updateRecaped(comic, checkScrape, logging) {
  const checkMainData = await prisma.comicsLang.findFirst({
    where: {
      comic_id: checkScrape.main_id,
      lang: comic.lang,
      latest_chapter: { lt: comic.latest_chapter },
    },
  });

  if (!checkMainData) {
    logging += " ~ main data found, but chapter still fresh, do nothing";
  } else {
    logging += " ~ main data found with old chapter, updating main data";

    await prisma.comicsLang.updateMany({
      where: {
        comic_id: checkScrape.main_id,
        lang: comic.lang,
      },
      data: {
        scrap_id: checkScrape.id,
        latest_chapter: comic.latest_chapter,
        updated_at: comic.updated_at,
      },
    });
  }
}
