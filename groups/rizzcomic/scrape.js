import axios from "axios";
import chalk from "chalk";
import * as cheerio from "cheerio";
import { convertRizzTime } from "../../helpers/convertRizzTime.js";

export const rizzList = async (url = "https://rizzcomics.com/") => {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);

    const clist = $(".listupd > div.utao.styletwo")
      .map((_, comic) => {
        const title = $(comic).find(".uta .luf > a").attr("title");

        const assimg = $(comic).find(".uta .imgu > a > img").attr("src");
        const cover_img = "https://rizzcomic.com" + assimg;

        const chap = $(comic)
          .find(".uta .luf > ul.Manhwa > li:first-child > a")
          .text();
        const chapp = chap.split(" ");
        const chapter = parseInt(chapp[1]);

        const link = $(comic).find(".uta .luf > a").attr("href");

        const link_chapter = $(comic)
          .find(".uta .luf > ul.Manhwa > li:first-child > a")
          .attr("href");

        const updated_at_raw = $(comic)
          .find(".uta > .luf > ul.Manhwa > li:first-child > span")
          .text();
        const updated_at_string = updated_at_raw.match(
          /var chapterTimestamp = (\d+);/
        )[1];
        const updated_at = new Date(parseInt(updated_at_string));

        return {
          title,
          source: "rizzcomic",
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
      console.log(chalk.greenBright.bold("Scrapped rizz! ~"), comic.title);
    }
    console.log("/============/");

    return clist;
  } catch (err) {
    return {
      error: true,
      source: "rizzcomic",
      message: err.message,
    };
  }
};

// rizzList();
