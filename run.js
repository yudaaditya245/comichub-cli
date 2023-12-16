import { fetchAPI } from "./fetchAPI/index.js";
import { asuraList } from "./groups/asurascans/scrape.js";
import { drakeList } from "./groups/drakescans/scrape.js";
import { flameList } from "./groups/flamecomics/scrape.js";
import { rizzList } from "./groups/rizzcomic/scrape.js";
import { upsertScraps } from "./upsert/index.js";

async function run() {
  console.log("Getting comics...\n");

  const chapterData = (
    await Promise.all([
      asuraList(), 
      flameList(), 
      rizzList(), 
      drakeList()
    ])
  ).flat();

  // console.log(chapterData);

  await upsertScraps(chapterData);

  await fetchAPI();
}

run();
