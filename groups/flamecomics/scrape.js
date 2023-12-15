import axios from "axios";
import chalk from "chalk";
import * as cheerio from "cheerio";
import { convertStringToTimestamp } from "../../helpers/convertTime.js";

export const flameList = async (url = "https://flamecomics.com/") => {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);

    const clist = $(".latest-updates > div")
      .map((_, comic) => {
        const title = $(comic).find(".bsx .bigor .info > a").attr("title");

        const cover_img = $(comic)
          .find(".bsx > a > div.limit > img")
          .attr("src");

        const chap = $(comic)
          .find(".bsx .bigor .chapter-list > a:first-child > div > div.epxs")
          .text();
        const chapp = chap.split(" ");
        const chapter = parseInt(chapp[1]);

        const link = $(comic).find(".bsx .bigor .info > a").attr("href");

        const link_chapter = $(comic)
          .find(".bsx .bigor .chapter-list > a:first-child")
          .attr("href");

        const updated_at = $(comic)
          .find(".bsx .bigor .chapter-list > a:first-child > div > div.epxdate")
          .text();

        return {
          title,
          source: "flamecomics",
          lang: "en",
          latest_chapter: chapter,
          updated_at,
          link,
          link_chapter,
          cover_img,
        };
      })
      .get();

    for (const comic of clist) {
      console.log(chalk.greenBright.bold("Scrapped flame! ~"), comic.title);
    }
    console.log("/============/");

    // return and change time style
    return clist.map((data) => {
      return { ...data, updated_at: convertStringToTimestamp(data.updated_at) };
    });
  } catch (err) {
    return {
      error: true,
      source: 'flamecomics',
      message: err.message
    };
  }
};

// flameList();
