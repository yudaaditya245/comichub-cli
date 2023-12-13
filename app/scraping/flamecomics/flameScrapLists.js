import puppeteer from "puppeteer";
import { convertStringToTimestamp } from "../../../helpers/convertTime.js";
import chalk from "chalk";

export const flameLists = async (url = "https://flamecomics.com/") => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    // SCRAPPING THE WEBSITE
    const clist = await page.evaluate(() => {
      const comicLists = document.querySelectorAll(".latest-updates > div");

      return Array.from(comicLists).map((comic) => {
        // get title
        const title = comic
          .querySelector(".bsx .bigor .info > a")
          .getAttribute("title");

        // get image
        const cover_img = comic
          .querySelector(".bsx > a > div.limit > img")
          .getAttribute("src");

        // get chapter
        const chap = comic.querySelector(
          ".bsx .bigor .chapter-list > a:first-child > div > div.epxs"
        ).innerText;
        const chapp = chap.split(" ");
        const chapter = parseInt(chapp[1]);

        // get link
        const link = comic
          .querySelector(".bsx .bigor .info > a")
          .getAttribute("href");

        // get chapter link
        const link_chapter = comic
          .querySelector(".bsx .bigor .chapter-list > a:first-child")
          .getAttribute("href");

        // get updated_at
        const updated_at = comic.querySelector(
          ".bsx .bigor .chapter-list > a:first-child > div > div.epxdate"
        ).innerText;

        return {
          title,
          source: "flamecomics",
          lang : 'en',
          latest_chapter: chapter,
          updated_at,
          link,
          link_chapter,
          cover_img,
        };
      });
    });

    for (const comic of clist) {
      console.log(chalk.greenBright.bold("Scrapped flame! ~"), comic.title);
    }
    console.log("/============/");
    // return and change time style

    return clist.map((data) => {
      return { ...data, updated_at: convertStringToTimestamp(data.updated_at) };
    });
  } catch (err) {
    console.log(err.message);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// flameLists()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e.message);
//   });
