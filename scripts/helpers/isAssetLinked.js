/*-----------------------
Imports
-----------------------*/

import { contentfulDeliveryClient } from "../../config/contentfulClients.js";

/*-----------------------
Is Entry Linked
-----------------------*/

export default async function isEntryLinked(assetId) {
  // Check the contentful api to see if an entry is linked to any products.
  const response = await contentfulDeliveryClient.getEntries({
    links_to_asset: assetId,
  });

  // If an entry is linked then there will be a non zero total in the response.
  return response.total > 0;
}
