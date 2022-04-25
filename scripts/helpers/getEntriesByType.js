/*-----------------------
Imports
-----------------------*/

import { contentfulDeliveryClient } from "../../config/contentfulClients.js";

/*-----------------------
Get Entries By Type
-----------------------*/

// Entries
const entries = [];

// Recursive function to call the api in paginated batches.
async function getEntriesByTypeRecursive(type, skip, perPage) {
  // Query contentful for all entries. By default, the api returns only published entries.
  const response = await contentfulDeliveryClient.getEntries({
    content_type: type,
    skip,
    limit: perPage,
  });

  // Add the items to the entries.
  entries.push(...response.items);

  // If the amount of items in the response is less than the total we are querying for then we've hit the end.
  if (response.items.length < perPage) {
    return entries;
  }
  // Else make a recursive call to the api for more entries.
  else {
    await getEntriesByTypeRecursive(type, skip + perPage, perPage);
  }
}

// Main function to call externally.
// The recursive function needs to be called in the same file to have access to the same context.
export default async function getEntriesByType(type, initialSkip, perPage) {
  await getEntriesByTypeRecursive(type, initialSkip, perPage);
  return entries;
}
