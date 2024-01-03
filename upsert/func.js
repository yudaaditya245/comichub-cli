import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const prisma = new PrismaClient();

export async function updateLink(comic) {
  await prisma.scraps.updateMany({
    where: {
      title: comic.title,
      source: comic.source
    },
    data: {
      link: comic.link,
      link_chapter: comic.link_chapter,
      cover_img: comic.cover_img
    }
  });
}

export async function createScrape(comic) {
  const _create = await prisma.scraps.create({
    data: comic
  });

  await createChapter(_create.id, _create);

  console.log("~ data not found in scraps, creating new data ...");
  console.log(chalk.greenBright("=== SCRAPE CREATED! \n\n"));
}

export async function updateScrape(scrap_id, comic) {
  await prisma.scraps.updateMany({
    where: {
      title: comic.title,
      source: comic.source
    },
    data: {
      latest_chapter: comic.latest_chapter,
      link_chapter: comic.link_chapter,
      updated_at: comic.updated_at,
      images: null
    }
  });

  await createChapter(scrap_id, comic);
}

export async function createChapter(scrap_id, comic) {
  // using delete+craete because in prisma, upsert cannot be used without where id
  // and this using deleteMany, because the same reason.
  await prisma.scrapChapters.deleteMany({
    where: {
      scrap_id,
      chapter: comic.latest_chapter
    }
  });

  await prisma.scrapChapters.create({
    data: {
      scrap_id,
      link: comic.link_chapter,
      chapter: comic.latest_chapter,
      images: null,
      updated_at: comic.updated_at
    }
  });
}
