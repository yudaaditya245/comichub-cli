import axios from "axios";
import chalk from "chalk";
import * as cheerio from "cheerio";
import { convertStringToTimestamp } from "../../helpers/convertTime.js";

export const asuraList = async (url = "https://asuratoon.com/") => {
  try {
    const { data } = await axios.get(url, { timeout: 20000 });
    const $ = cheerio.load(data);

    const clist = $(".uta")
      .map((_, comic) => {
        const title = $(comic).find(".uta .series > h4").text();

        const originalImg = $(comic).find(".imgu > a > img").attr("src");
        const newRes = "420x546";
        const cover_img = originalImg.replace(/(\d{2,4}x\d{2,4})/, newRes);

        const link = $(comic).find(".uta .series").attr("href");

        const chap = $(comic).find(".uta ul > li > a").text();

        let chapter, link_chapter, updated_at;
        if (chap && chap !== null && chap !== undefined) {
          const chapp = chap.split(" ");
          chapter = parseFloat(chapp[1]);

          link_chapter = $(comic).find(".uta ul > li > a").attr("href");

          updated_at = $(comic).find(".uta ul > li > span").text();
        } else {
          chapter = 0;
          link_chapter = "";
          updated_at = "now";
        }

        return {
          title,
          source: "asurascans",
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
      console.log(chalk.greenBright.bold("Scrapped asura! ~"), comic.title);
    }
    console.log("/============/");

    // return and change time style
    return clist.map((data) => {
      return { ...data, updated_at: convertStringToTimestamp(data.updated_at) };
    });
  } catch (err) {
    return {
        error: true,
        source: 'asurascans',
        message: err.message
      };
  }
};

// asuraList()