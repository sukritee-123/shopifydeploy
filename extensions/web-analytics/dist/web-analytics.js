(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // extensions/web-analytics/node_modules/@shopify/web-pixels-extension/build/esm/globals.mjs
  var EXTENSION_POINT;
  var init_globals = __esm({
    "extensions/web-analytics/node_modules/@shopify/web-pixels-extension/build/esm/globals.mjs"() {
      EXTENSION_POINT = "WebPixel::Render";
    }
  });

  // extensions/web-analytics/node_modules/@shopify/web-pixels-extension/build/esm/register.mjs
  var register;
  var init_register = __esm({
    "extensions/web-analytics/node_modules/@shopify/web-pixels-extension/build/esm/register.mjs"() {
      init_globals();
      register = (extend) => shopify.extend(EXTENSION_POINT, extend);
    }
  });

  // extensions/web-analytics/node_modules/@shopify/web-pixels-extension/build/esm/index.mjs
  var init_esm = __esm({
    "extensions/web-analytics/node_modules/@shopify/web-pixels-extension/build/esm/index.mjs"() {
      init_register();
    }
  });

  // extensions/web-analytics/node_modules/@shopify/web-pixels-extension/index.mjs
  var init_web_pixels_extension = __esm({
    "extensions/web-analytics/node_modules/@shopify/web-pixels-extension/index.mjs"() {
      init_esm();
    }
  });

  // extensions/web-analytics/src/index.js
  var require_src = __commonJS({
    "extensions/web-analytics/src/index.js"(exports) {
      init_web_pixels_extension();
      register((_0) => __async(exports, [_0], function* ({ configuration, analytics, browser, init }) {
        const { window } = init.context;
        analytics.subscribe("page_viewed", (event) => __async(exports, null, function* () {
          let utmContentValue = new URL(window.location.href).searchParams.get("utm_content");
          browser.localStorage.getItem("oia_shopify").then((res) => {
            const storedetail = JSON.parse(res);
            const newpayload = JSON.stringify({ event, storedetail });
            browser.sendBeacon("https://shopifyapi.inopenapp.com/api/v1/visit/store-visit", newpayload);
          }).catch((err) => {
            console.log(err);
          });
          if (utmContentValue === "oia") {
            browser.sessionStorage.setItem("openinapp", utmContentValue);
          }
        }));
      }));
      register((_0) => __async(exports, [_0], function* ({ configuration, analytics, browser }) {
        analytics.subscribe(
          "checkout_completed",
          (event) => __async(exports, null, function* () {
            const result = yield browser.localStorage.getItem("oia_shopify").then((res) => {
              return res;
            }).catch((err) => {
              console.log(err);
            });
            const isOIA = yield browser.sessionStorage.getItem("openinapp").then((res) => {
              return res;
            }).catch((err) => {
              console.log(err);
            });
            const storedetail = JSON.parse(result);
            if (result && isOIA) {
              const newpayload = JSON.stringify({ event, storedetail });
              browser.sendBeacon("https://shopifyapi.inopenapp.com/api/v1/checkout/storePurchase", newpayload);
            }
          })
        );
      }));
    }
  });

  // <stdin>
  var import_src = __toESM(require_src());
})();
