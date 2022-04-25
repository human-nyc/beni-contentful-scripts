/*-----------------------
Imports
-----------------------*/

import { contentfulDeliveryClient } from "../../config/contentfulClients.js";

/*-----------------------
Is Entry Linked
-----------------------*/

export default async function isEntryLinked(entryId) {
  // Check the contentful api to see if an entry is linked to any products.
  const response = await contentfulDeliveryClient.getEntries({
    content_type: "product",
    links_to_entry: entryId,
  });

  // If an entry is linked then there will be a non zero total in the response.
  return response.total > 0;
}
