import puppeteer from "puppeteer";
import { convertStringToTimestamp } from "../../../helpers/convertTime.js";
import chalk from "chalk";

export const asuraList = async (url = "https://asuratoon.com/") => {
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
      const comicLists = document.querySelectorAll(".uta");

      return Array.from(comicLists).map((comic) => {
        // get title
        const title = comic.querySelector(".uta .series > h4").innerText;

        // get image
        const originalImg = comic
          .querySelector(".imgu > a > img")
          .getAttribute("src");
        const newRes = "420x546";
        const cover_img = originalImg.replace(/(\d{2,4}x\d{2,4})/, newRes);

        const link = comic.querySelector(".uta .series").getAttribute("href");

        // get chapter
        const chap = comic.querySelector(".uta ul > li > a")?.innerText;

        let chapter, link_chapter, updated_at;
        if (chap && chap !== null && chap !== undefined) {
          const chapp = chap.split(" ");
          chapter = parseInt(chapp[1]);

          link_chapter = comic
            .querySelector(".uta ul > li > a")
            .getAttribute("href");

          updated_at = comic.querySelector(".uta ul > li > span").innerText;
        } else {
          chapter = 0;
          link_chapter = "";
          updated_at = "now";
        }

        return {
          title,
          source: "asurascans",
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
      console.log(chalk.greenBright.bold("Scrapped asura! ~"), comic.title);
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

// asuraList()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e.message);
//   });
