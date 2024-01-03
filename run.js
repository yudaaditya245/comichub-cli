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
  
  // console.log("\n=== FETCHING API ===\n");
  // await fetchAPI();

  logLastScrapTime()
}

run();

function logLastScrapTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Add leading zero to minutes if needed
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  const lastScrapTime = `Last scrap: ${formattedHours}:${formattedMinutes} ${ampm}`;
  
  console.log('\n\n', lastScrapTime);
}
