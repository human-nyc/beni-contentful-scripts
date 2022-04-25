/*-----------------------
Imports
-----------------------*/

import ora from "ora";
import fs from "fs";
import { URL } from "url";
import Bottleneck from "bottleneck";
import isAssetLinked from "./helpers/isAssetLinked.js";
import getAssets from "./helpers/getAssets.js";

/*-----------------------
Get Unlinked Assets
-----------------------*/

// Get all assets
const spinner = ora(`Getting assets.`).start();
const assets = await getAssets(0, 1000);
spinner.succeed(`Found ${assets.length} assets.`);

// Check unlinked assets.
spinner.start(`Checking for unlinked assets.`).start();

const unlinkedAssets = [];

// Setup a limiter to control api requests.
const limiter = new Bottleneck({
  maxConcurrent: 10, // Limiting to 10 at a time just in case the queue builds up.
  minTime: 20, // Max 55 requests per second so thats appx 20ms until a new request is launched.
});

// Pass all the assets through the limiter. It'll resolve once all the assets have been checked.
await Promise.all(
  assets.map(async (asset) => {
    await limiter.schedule(async () => {
      const linked = await isAssetLinked(asset.sys.id);
      // If not linked then push to the unlinked assets array.
      if (!linked) {
        unlinkedAssets.push(asset.sys.id);
      }
      return;
    });
  })
);

// Write the unlinked assets to a file so we can check it and run a separate deletion script.
fs.writeFileSync(
  new URL("../data/unlinked-assets.json", import.meta.url),
  JSON.stringify(unlinkedAssets)
);

// Success
spinner.succeed(`Found ${unlinkedAssets.length} unlinked assets.`);
