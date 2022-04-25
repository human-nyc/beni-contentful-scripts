/*-----------------------
Imports
-----------------------*/

import { contentfulDeliveryClient } from "../../config/contentfulClients.js";

/*-----------------------
Get Assets
-----------------------*/

// Assets
const assets = [];

// Recursive function to call the api in paginated batches.
async function getAssetsRecursive(skip, perPage) {
  // Query contentful for all assets. By default, the api returns only published assets.
  const response = await contentfulDeliveryClient.getAssets({
    skip,
    limit: perPage,
  });

  // Add the items to the assets.
  assets.push(...response.items);

  // If the amount of items in the response is less than the total we are querying for then we've hit the end.
  if (response.items.length < perPage) {
    return assets;
  }
  // Else make a recursive call to the api for more assets.
  else {
    await getAssetsRecursive(skip + perPage, perPage);
  }
}

// Main function to call externally.
// The recursive function needs to be called in the same file to have access to the same context.
export default async function getAssets(initialSkip, perPage) {
  await getAssetsRecursive(initialSkip, perPage);
  return assets;
}
