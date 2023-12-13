import { fetchAPI } from "./app/fetchingdetail/fetchingFromAPI.js";
import { asuraList } from "./app/scraping/asurascans/asuraScrapLists.js";
import { flameLists } from "./app/scraping/flamecomics/flameScrapLists.js";
import { rizzLists } from "./app/scraping/rizzcomic/rizzScrapLists.js";
import { upsertScraps } from "./app/upserting/upsertScraps.js";

async function handleAsyncCall(asyncFunction, dataArray, errors) {
  try {
    const result = await asyncFunction();
    dataArray = dataArray.concat(result);
  } catch (error) {
    console.error(`Error in ${asyncFunction.name}: ${error.message}`);
    errors.push({ functionName: asyncFunction.name, error: error.message });
  }
  return dataArray;
}

async function run() {
  console.log("Getting comics...\n");

  let chapterData = [];
  let errors = [];

  chapterData = await handleAsyncCall(asuraList, chapterData, errors);
  // chapterData = await handleAsyncCall(flameLists, chapterData, errors);
  // chapterData = await handleAsyncCall(rizzLists, chapterData, errors);

  // // // console.log(chapterData);
  console.log("\nGot", chapterData.length, "data scrapped!");
  if (errors.length > 0) {
    console.log("Errors:", errors);
  }

  // console.log("\n/=====/\n");

  console.log("Updating chapter to database...\n");
  await upsertScraps(chapterData);

  console.log("\n/=====/\n");

  // console.log("Scraping detailed data from 3rd-party API...\n");
  await fetchAPI(5);
}

run();
