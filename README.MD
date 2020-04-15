# Donut API Project

This is a project that will provide you with a Donut API. When you build this project it will fetch the
latest and most up-to-date info about donuts being sold on Krispy Kreme's website. It will include names,
descriptions, images, image alt text, banners and nutritional facts for your donuts.

If there are any issues with this API, please submit an issue on the repo. Or (BETTER) submit a Pull
Request to address the issue.

There are two scripts in this package:

-   `npm run build`
    -   This builds the API out by scraping the Krispy Kreme website for all current donuts and types.
        As donuts are seasonal, you will want to run this every so often to update the `donuts.json` in
        your project folder.
    -   You must run this at least once before running the server.
-   `npm run serve`
    -   This runs a server to serve your data on `localhost:3000`.

## APIS

The following APIs are available **AFTER** you run `npm run build`:

-   `/donuts` - Returns all donuts from the API
-   `/donuts/:donutId` - Returns a donut from the API
-   `/types` - Returns all donut types from the API

### `/donuts`

This API will return all of the donuts that were scraped from the Krispy Kreme website during the
build of the API. You can add one query param to this API: `type`. This allows you to do an
inclusive filter of types:

```bash
GET /donuts // Return all donuts
GET /donuts?type=Iced // Return donuts with the type of "Iced"
GET /donuts?type=Iced,Filled // Return donuts with the types "Iced" OR "Filled"
```

### `/donuts/:donutId`

This API will return one donut that was scraped from the Krispy Kreme website during the build of
the API.

```bash
GET /donuts/glazed-blueberry-cake-doughnut-holes // Return one donut from the API
```

### `/types`

This API will return all of the possible types that you can filter on.

```bash
GET /donuts/glazed-blueberry-cake-doughnut-holes // Return one donut from the API
```
