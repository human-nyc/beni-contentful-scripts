import contentfulDelivery from "contentful";
import contentfulManagement from "contentful-management";
import "dotenv/config.js";

export const contentfulDeliveryClient = contentfulDelivery.createClient({
  space: `${process.env.CONTENTFUL_SPACE_ID}`,
  environment: `${process.env.CONTENTFUL_ENVIRONMENT_ID}`,
  accessToken: `${process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN}`,
});

export const contentfulManagementClient = contentfulManagement.createClient({
  accessToken: `${process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}`,
});
