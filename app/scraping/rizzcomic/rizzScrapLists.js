import puppeteer from "puppeteer";
import { convertRizzTime } from "./convertRizzTime.js";

export const rizzLists = async (url = "https://rizzcomic.com/") => {
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
      const comicLists = document.querySelectorAll(
        ".listupd > div.utao.styletwo"
      );

      return Array.from(comicLists).map((comic) => {
        // get title
        const title = comic
          .querySelector(".uta .luf > a")
          .getAttribute("title");

        // get image
        const assimg = comic
          .querySelector(".uta .imgu > a > img")
          .getAttribute("src");
        const cover_img = "https://rizzcomic.com" + assimg;

        // get chapter
        const chap = comic.querySelector(
          ".uta .luf > ul.Manhwa > li:first-child > a"
        ).innerText;
        const chapp = chap.split(" ");
        const chapter = parseInt(chapp[1]);

        // get link
        const link = comic.querySelector(".uta .luf > a").getAttribute("href");

        // get chapter link
        const link_chapter = comic
          .querySelector(".uta .luf > ul.Manhwa > li:first-child > a")
          .getAttribute("href");

        // get updated_at
        const updated_at = comic.querySelector(
          ".uta .luf > ul.Manhwa > li:first-child > span > span"
        ).innerText;

        return {
          title,
          source: "rizzcomic",
          latest_chapter: chapter,
          updated_at,
          link,
          link_chapter,
          cover_img,
        };
      });
    });

    // for (const comic of clist) {
    //   console.log("Scrapped! - ", comic.title);
    // }
    // return and change time style

    return clist.map((data) => {
      return {
        ...data,
        updated_at: convertRizzTime(data.updated_at)
      };
    });
  } catch (err) {
    console.log(err.message);
    return;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// rizzLists()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e.message);
//   });
