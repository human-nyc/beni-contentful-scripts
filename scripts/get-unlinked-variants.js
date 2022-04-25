/*-----------------------
Imports
-----------------------*/

import ora from "ora";
import fs from "fs";
import { URL } from "url";
import Bottleneck from "bottleneck";
import isEntryLinked from "./helpers/isEntryLinked.js";
import getEntriesByType from "./helpers/getEntriesByType.js";

/*-----------------------
Get Unlinked Variants
---
May take between 3-5 minutes to run given all the api requests to check each entry individually.
-----------------------*/

// Get all variant entries
const spinner = ora(`Getting variant entries.`).start();
const variantEntries = await getEntriesByType("variantImage", 0, 1000);
spinner.succeed(`Found ${variantEntries.length} variant entries.`);

// Check unlinked variant entries.
spinner.start(`Checking for unlinked variant entries.`).start();

const unlinkedVariants = [];

// Setup a limiter to control api requests.
const limiter = new Bottleneck({
  maxConcurrent: 10, // Limiting to 10 at a time just in case the queue builds up.
  minTime: 20, // Max 55 requests per second so thats appx 20ms until a new request is launched.
});

// Pass all the variant entries through the limiter. It'll resolve once all the entries have been checked.
await Promise.all(
  variantEntries.map(async (entry) => {
    await limiter.schedule(async () => {
      const linked = await isEntryLinked(entry.sys.id);
      // If not linked then push to the unlinked variants array.
      if (!linked) {
        unlinkedVariants.push(entry.sys.id);
      }
      return;
    });
  })
);

// Write the unlinked variants to a file so we can check it and run a separate deletion script.
fs.writeFileSync(
  new URL("../data/unlinked-variants.json", import.meta.url),
  JSON.stringify(unlinkedVariants)
);

// Success
spinner.succeed(`Found ${unlinkedVariants.length} unlinked variant entries.`);
