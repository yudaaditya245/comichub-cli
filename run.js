import { fetchAPI } from "./app/fetchingdetail/fetchingFromAPI.js";
import { asuraList } from "./app/scraping/asurascans/asuraScrapLists.js";
import { flameLists } from "./app/scraping/flamecomics/flameScrapLists.js";
import { rizzLists } from "./app/scraping/rizzcomic/rizzScrapLists.js";
import { upsertScraps } from "./app/upserting/upsertScraps.js";

async function run() {
  // console.log("Getting comics...\n");
  // const chapterData = await flameLists()
  // const chapterData = await rizzLists()
  // const chapterData = await asuraList()
  // console.log("\nGot", chapterData.length, "data scrapped!");
  // console.log(chapterData);

  // console.log("\n/=====/\n");
  
  // console.log("Updating chapter to database...\n");
  // await upsertScraps(chapterData)
  
  // console.log("\n/=====/\n");
  
  console.log("Scraping detailed data from 3rd-party API...\n");
  await fetchAPI(50);

}

run();
