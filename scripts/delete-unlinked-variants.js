/*-----------------------
Imports
-----------------------*/

import { contentfulManagementClient } from "../config/contentfulClients.js";
import ora from "ora";
import { createRequire } from "module";
import Bottleneck from "bottleneck";

/*-----------------------
Delete Unlinked Variants
-----------------------*/

// Get the unlinked variants from our static json file.
const require = createRequire(import.meta.url);
const unlinkedVariants = require("../data/unlinked-variants.json");

// Start
const spinner = ora(
  `Deleting ${unlinkedVariants.length} unlinked variants.`
).start();

// Setup a limiter to control api requests.
const limiter = new Bottleneck({
  maxConcurrent: 10, // Limiting to 10 at a time just in case the queue builds up.
  minTime: 150, // Max 7 requests per second so thats appx 150ms until a new request is launched.
});

// Pass all the variants through the limiter. It'll resolve once all the variants have been deleted.
await Promise.all(
  unlinkedVariants.map(async (variant) => {
    await limiter.schedule(async () => {
      const space = await contentfulManagementClient.getSpace(
        `${process.env.CONTENTFUL_SPACE_ID}`
      );
      const environment = await space.getEnvironment(
        `${process.env.CONTENTFUL_ENVIRONMENT_ID}`
      );
      const entry = await environment.getEntry(variant);
      // await entry.delete();
      return;
    });
  })
);

// Success
spinner.succeed(`Success.`);
