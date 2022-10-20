# About

Starter package for creating node cli scripts. This is helpful for creating quick cli tools locally and running scripts to interact with apis.

# Installation

```
git clone https://github.com/human-nyc/beni-contentful-scripts.git
cd node-cli-starter
mv .env.sample .env
npm install
```

# Run

Create your script in bin/index.js. Then run:

## Get Unlinked Variants

Finds all unlinked variants in Contentful and outputs their data to a static file in data/unlinked-variants.json.

```
npm run get-unlinked-variants
```

## Delete Unlinked Variants

Gets a list of unlinked variants from data/unlinked-variants.json and deletes them

```
npm run delete-unlinked-variants
```

## Get Unlinked Assets

Finds all unlinked assets in Contentful and outputs their data to a static file in data/unlinked-assets.json.

```
npm run get-unlinked-assets
```

## Delete Unlinked Assets

Gets a list of unlinked assets from data/unlinked-assets.json and deletes them

```
npm run delete-unlinked-assets
```

# Resources

- (Get An Assets Linked Entries)[https://www.contentfulcommunity.com/t/get-an-assets-linked-entries/3419]
- (Automatically Delete Records)[https://www.contentfulcommunity.com/t/is-it-possible-to-automatically-delete-records-which-are-no-longer-live-on-our-website/2481]
