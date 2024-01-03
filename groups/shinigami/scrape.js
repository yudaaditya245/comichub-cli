// import puppeteer from "puppeteer";
import chalk from "chalk";
import { convertStringToTimestamp } from "../../helpers/convertTime.js";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

export const shinigamiList = async (url = "https://shinigami.moe/") => {
  let browser;

  try {
    puppeteer.use(StealthPlugin());
    browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded"
    });

    // SCRAPPING THE WEBSITE
    const clist = await page.evaluate(() => {
      const comicLists = document.querySelectorAll(".latest div.col-6.col-sm-6.col-md-6");

      return Array.from(comicLists).map(comic => {
        // get title
        const _title = comic.querySelector(".series-box .series-title").innerText;
        let title;
        if (_title.endsWith("...")) {
          title = _title.slice(0, -3);
        } else {
          title = _title;
        }

        const cover_img = comic.querySelector(".series-card img").getAttribute("src");

        const link = comic.querySelector(".series-box a").getAttribute("href");

        const chap = comic.querySelector(".series-content .series-chapter-item:first-child > span.series-badge")?.innerText;
        const chapp = chap.split(" ");
        const chapter = parseFloat(chapp[1]);

        const link_chapter = comic.querySelector(".series-content > a:first-child").getAttribute("href");

        const updated_at = comic.querySelector(".series-content .series-chapter-item:first-child > span.series-time").innerText;

        return {
          title,
          source: "shinigami",
          lang: "id",
          latest_chapter: chapter,
          updated_at,
          link,
          link_chapter,
          cover_img
        };
      });
    });

    for (const comic of clist) {
      console.log(chalk.greenBright.bold("Scrapped shinigami! ~"), comic.title);
    }
    console.log("/============/");
    // return and change time style
    // return clist;
    return clist.map(data => {
      return { ...data, updated_at: convertStringToTimestamp(data.updated_at) };
    });
  } catch (err) {
    return {
      error: true,
      source: "shinigami",
      message: err.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// shinigamiList()
//   .then(res => {
//     console.log(res);
//   })
//   .catch(e => {
//     console.log(e.message);
//   });
