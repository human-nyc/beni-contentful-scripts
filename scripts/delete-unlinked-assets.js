/*-----------------------
Imports
-----------------------*/

import { contentfulManagementClient } from "../config/contentfulClients.js";
import ora from "ora";
import { createRequire } from "module";
import Bottleneck from "bottleneck";

/*-----------------------
Delete Unlinked Assets
-----------------------*/

// Get the unlinked assets from our static json file.
const require = createRequire(import.meta.url);
const unlinkedAssets = require("../data/unlinked-assets.json");

// Start
const spinner = ora(
  `Deleting ${unlinkedAssets.length} unlinked assets.`
).start();

// Setup a limiter to control api requests.
const limiter = new Bottleneck({
  maxConcurrent: 10, // Limiting to 10 at a time just in case the queue builds up.
  minTime: 150, // Max 7 requests per second so thats appx 150ms until a new request is launched.
});

// Pass all the assets through the limiter. It'll resolve once all the assets have been deleted.
await Promise.all(
  unlinkedAssets.map(async (variant) => {
    await limiter.schedule(async () => {
      const space = await contentfulManagementClient.getSpace(
        `${process.env.CONTENTFUL_SPACE_ID}`
      );
      const environment = await space.getEnvironment(
        `${process.env.CONTENTFUL_ENVIRONMENT_ID}`
      );
      const asset = await environment.getAsset(variant);
      // await asset.delete();
      return;
    });
  })
);

// Success
spinner.succeed(`Success.`);
