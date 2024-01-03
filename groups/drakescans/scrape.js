import axios from "axios";
import chalk from "chalk";
import * as cheerio from "cheerio";
import { convertStringToTimestamp, slashToTimestamp } from "../../helpers/convertTime.js";

export const drakeList = async (url = "https://drakescans.com/") => {
  try {
    const { data } = await axios.get(url, { timeout: 20000 });
    const $ = cheerio.load(data);

    const clist = $("div#loop-content > .page-listing-item > div > div")
      .map((_, comic) => {
        // title
        const title = $(comic)
          .find("div.item-summary > .post-title > h3 > a")
          .text();

        // chapter
        const chap = $(comic)
          .find(".list-chapter > .chapter-item:first-child > span.chapter > a")
          .text();
        const chapp = chap.split(" ");
        const chapter = parseFloat(chapp[2]);

        // cover
        const cover_raw = $(comic).find(".item-thumb > a").text();
        const cover_img = cover_raw.match(/src="([^"]*)"/)[1];

        // link
        const link = $(comic).find(".item-thumb > a").attr("href");

        // link chapter
        const link_chapter = $(comic)
          .find(".list-chapter > .chapter-item:first-child > span.chapter > a")
          .attr("href");

        // updated_at
        const updated_at_string = $(comic)
          .find(".list-chapter > .chapter-item:first-child > .post-on > a")
          .attr("title");
        const updated_at_slash = $(comic)
          .find(".list-chapter > .chapter-item:first-child > .post-on")
          .text();
        const datePattern = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/;
        const updated_at = updated_at_string
          ? convertStringToTimestamp(updated_at_string)
          : slashToTimestamp(datePattern.exec(updated_at_slash)[0]);

        return {
          title,
          source: "drakescans",
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
      console.log(chalk.greenBright.bold("Scrapped drake! ~"), comic.title);
    }
    console.log("/============/");

    // return and change time style
    return clist;
  } catch (err) {
    return {
      error: true,
      source: "drakescans",
      message: err.message,
    };
  }
};

// drakeList().then((res) => console.log(res));
