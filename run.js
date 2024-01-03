import { fetchAPI } from "./fetchAPI/index.js";
import { asuraList } from "./groups/asurascans/scrape.js";
import { drakeList } from "./groups/drakescans/scrape.js";
import { flameList } from "./groups/flamecomics/scrape.js";
import { rizzList } from "./groups/rizzcomic/scrape.js";
import { shinigamiList } from "./groups/shinigami/scrape.js";
import { upsertScraps } from "./upsert/index.js";

async function run() {
  console.log("Getting comics...\n");

  const chapterData = (
    await Promise.all([
      asuraList(), 
      flameList(), 
      rizzList(), 
      drakeList(),
      shinigamiList(),
    ])
  ).flat();
  
  await upsertScraps(chapterData);
  
  console.log("\n=== FETCHING API ===\n");
  await fetchAPI(10);
}

run();
