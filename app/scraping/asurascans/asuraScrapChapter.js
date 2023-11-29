import puppeteer from "puppeteer";

export async function asuraChapterBulk(bulkData) {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    timeout: 0,
  });
  console.log("Scraping images");
  const page = await browser.newPage();
  
  let updatedData = [];

  for (const data of bulkData) {
    const url = data.link_chapter;

    console.log("Opening page :", url);
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    // SCRAPPING THE WEBSITE
    const cimages = await page.evaluate(() => {
      const imgs = document.querySelectorAll("#readerarea.rdminimal img");

      return Array.from(imgs).map((images) => {
        return images.getAttribute("src");
      });
    });
    console.log("Done");

    updatedData.push({ ...data, images: JSON.stringify(cimages) });
  }

  await browser.close();

  return updatedData;
}

export const asuraChapter = async (url) => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
  });
  const page = await browser.newPage();

  console.log("Opening page :", url);
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // SCRAPPING THE WEBSITE
  const cimages = await page.evaluate(() => {
    const imgs = document.querySelectorAll("#readerarea.rdminimal img");

    return Array.from(imgs).map((images) => {
      return images.getAttribute("src");
    });
  });

  console.log(" ");
  console.log("Total", cimages.length, "image scrapped!");
  console.log("=================");
  await browser.close();

  return cimages;
};

// asuraChapter()
//   .then((res) => {
//     const string = JSON.stringify(res);
//     const array = JSON.parse(string);
//     console.log({ string, array });
//   })
//   .catch((e) => {
//     console.log(e.message);
//   });
