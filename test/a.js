import puppeteer from "puppeteer";

const asura = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage({
    headless: true,
  });

  await page.goto("https://asuratoon.com/", {
    waitUntil: "domcontentloaded",
  });

  // SCRAPPING THE WEBSITE
  const clist = await page.evaluate(() => {
    const comicLists = document.querySelectorAll(".uta");

    return Array.from(comicLists).map((comic) => {
      const img = comic.querySelector(".imgu > a > img").getAttribute("src");

      const title = comic.querySelector(".uta .series > h4").innerText;

      const chap = comic.querySelector(".uta ul > li > a").innerText;
      const chapp = chap.split(" ");
      const chapter = parseInt(chapp[1]);

      const link = comic.querySelector(".uta .series").getAttribute("href");
      const link_chapter = comic.querySelector(".uta ul > li > a").getAttribute("href");      

      return {
        title,
        latest_chapter: chapter,
        source: "asurascans",
        link,
        link_chapter,
        img
      };
    });
  });

  console.log(" ");
  console.log(clist.length > 1 && "Scrape from asura success!");
  console.log("Total", clist.length,"comics scrapped!");
  console.log("=================");
  console.log(clist[0]);
  await browser.close();

  return clist

};

asura()