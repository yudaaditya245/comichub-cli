import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { justForStatus } from "../helpers/terminalOnly.js";

const prisma = new PrismaClient();

export async function fetchKitsuList(totalData = 50) {
  let updated = 0,
    notFound = 0;

  // get data which dont have main id
  const dataWithoutMainId = await prisma.scraps.findMany({
    where: {
      mainId: null,
    },
    take: totalData,
    orderBy: {
      updated_at: "desc",
    },
  });

  for (const comic of dataWithoutMainId) {
    // get main id and detail from api, based on the title
    const kitsuData = await kitsuAPI(comic.title);
    const kitsuDataId = parseInt(kitsuData[0].id);
    // console.log(kitsuDataId);

    // if retrieved api exist, then simply insert to main data
    if (kitsuData.length > 0) {
      // get data if the detail already in the main data
      const existMainData = await prisma.comics.findUnique({
        where: {
          id: kitsuDataId,
        },
      });

      // if detail doesnt exist in main data, then add new main data
      if (!existMainData) {
        await prisma.comics.create({
          data: {
            id : kitsuDataId,
            title: comic.title,
            description: kitsuData[0].attributes.description ?? kitsuData[0].attributes.synopsis ?? "",
            img: kitsuData[0].attributes.posterImage.original,
            latest_chapter: comic.latest_chapter,
            link_chapter: comic.link_chapter,
            updated_at: comic.updated_at,
            synonyms: JSON.stringify(
              [
                kitsuData[0].attributes.canonicalTitle,
                ...kitsuData[0].attributes.abbreviatedTitles,
                Object.values(kitsuData[0].attributes.titles),
              ].filter((value) => value !== undefined && value !== null)
            ),
          },
        });
      }

      // if main data exist, and chapter lag behind, than update
      if (
        existMainData &&
        existMainData.latest_chapter >= comic.latest_chapter
      ) {
        await prisma.comics.update({
          where: {
            id: kitsuDataId,
          },
          data: {
            latest_chapter: comic.latest_chapter,
            link_chapter: comic.link_chapter,
            updated_at: comic.updated_at,
          },
        });
      }

      // dont forget to also bind main id found in the api, into the scrap data
      await prisma.scraps.update({
        where: {
          id: comic.id,
        },
        data: {
          mainId: kitsuDataId,
        },
      });

      console.log("Updating -", justForStatus(comic.title), " : Found!");
      updated++;
    } else {
      console.log("Updating -", justForStatus(comic.title), " : Not found!");
      notFound++;
    }

    await prisma.$disconnect();
  }

  console.log({
    updated,
    notFound,
  });
}

async function kitsuAPI(title) {
  try {
    const { data } = await axios.get(
      `https://kitsu.io/api/edge/manga?filter[text]=${title}&page[limit]=2`
    );

    return data.data;
  } catch (error) {
    console.log(error.message);
  }
}
