// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import axios from "axios";
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());

app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());


app.use(express.json());



app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});



app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});


// app.post("/api/script_tags", async (req, res) => {
//   const dd = await res.locals.shopify.session;
//   let scriptTagExist=false;
//   const {shop, accessToken} = res.locals.shopify.session;
//   const url=`https://${shop}/admin/api/2023-07/script_tags.json`

//   const shopifyHeader = (token) => ({
//     'Content-Type': 'application/json',
//     'X-Shopify-Access-Token': token,
//   })

//   const response = await axios.get(url, { headers: shopifyHeader(accessToken) });
//   const scriptTags = response.data.script_tags;

//   scriptTags.forEach((script) => {
//     if(script.src === req.body.src){
//       scriptTagExist=true;
//     }
//   });

//  if(!scriptTagExist){
//   try {
//     const session = await res.locals.shopify.session;
//     const tempShop = await res.locals.shopify
//     const script_tag = new shopify.api.rest.ScriptTag({ session: session });
//     script_tag.event = "onload";
//     script_tag.src = req.body.src;
//     script_tag.cache = false;
//     script_tag.display_scope = "online_store";
//     await script_tag.save({
//       update: true,
//     });
//     res.status(200).send({ success: true, data: script_tag });
//   }
//     catch (e) {
//     console.log(e);
//     res.status(500).send({ success: false, data: dd });
//   }
//  }
//  else{
//   res.status(409).send({ success: false, data: "Script Tag already exist" });
//  }
 
// });

app.get('/api/store_details', async (_req, res) => {
  const { shop, accessToken } = res.locals.shopify.session;
  const url = `https://${shop}/admin/api/2023-07/shop.json`
  const shopifyHeader = (token) => ({
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': token,
  })

  const getStore = await axios.get(url, { headers: shopifyHeader(accessToken) })
  res.status(200).send({ data: getStore.data });
})

app.post("/api/script_tags_loader", async (req, res) => {
  const dd = await res.locals.shopify.session;
  try {
    const session = await res.locals.shopify.session;
    const script_tag = new shopify.api.rest.ScriptTag({ session: session });
    script_tag.event = "onload";
    script_tag.src = req.body.src;
    script_tag.cache = false;
    script_tag.display_scope = "online_store";
    await script_tag.save({
      update: true,
    });
    res.status(200).send({ success: true, data: script_tag });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, data: dd });
  }
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});


app.listen(PORT);
