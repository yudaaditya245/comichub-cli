import { asuraList } from "./groups/asurascans/scrape.js";
import { drakeList } from "./groups/drakescans/scrape.js";
import { flameList } from "./groups/flamecomics/scrape.js";
import { rizzList } from "./groups/rizzcomic/scrape.js";

async function run() {
  console.log("Getting comics...\n");

  const chapterData = await Promise.all([
    asuraList(), 
    flameList(), 
    rizzList(),
    drakeList()
  ]);

  // console.log(chapterData.flat());
}

run();
