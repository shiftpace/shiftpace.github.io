/* ShiftPace analytics — GA4 + Microsoft Clarity + click events.
   Fill in the two IDs below. While an ID is empty, that tool stays off. */
(function () {
  var GA_ID = "";       // e.g. "G-XXXXXXXXXX"
  var CLARITY_ID = "";  // e.g. "abc123xyz"

  // Stripe Payment Link -> product name + price (USD)
  var PRODUCTS = {
    "fZu5kD6fCfxL5xRekpgUM00": ["2027 Money Reset", 17],
    "8x23cvfQc5Xb6BV2BHgUM01": ["Debt Payoff Tracker", 8],
    "eVq7sL1ZmgBPgcvfotgUM03": ["Small Business & Etsy Seller Tracker", 17],
    "8x24gz33q85jd0j905gUM04": ["2027 Habit & Goals Tracker", 10],
    "4gMaEX33q0CR0dx2BHgUM05": ["Life Reset Bundle", 29]
  };
  var FREE_FORM = "ZF1CtVQ3ZNn6azVT9";
  var TESTER_FORM = "eVHk3EZzbBcGjg5e6";
  var REVIEW_FORM = "zaQWP1CWdz6su3kCA";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };

  if (GA_ID) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    var cfg = {};
    if (/[?&]debug=1/.test(location.search)) cfg.debug_mode = true; // add ?debug=1 to see events in DebugView
    gtag("config", GA_ID, cfg);
  }

  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  function send(name, params) {
    params = params || {};
    params.transport_type = "beacon"; // survives the page navigating away
    params.page = location.pathname;
    gtag("event", name, params);
    if (window.clarity) window.clarity("event", name);
  }

  // One delegated listener: also catches links whose href is set later by page scripts.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.href || "";
    if (href.indexOf("buy.stripe.com") > -1) {
      var key = href.split("/").pop().split("?")[0];
      var p = PRODUCTS[key] || ["Unknown product", 0];
      send("begin_checkout", {
        currency: "USD", value: p[1],
        items: [{ item_id: key, item_name: p[0], price: p[1], quantity: 1 }],
        product_name: p[0], button_text: (a.textContent || "").trim().slice(0, 60)
      });
    } else if (href.indexOf(FREE_FORM) > -1) {
      send("generate_lead", { lead_source: "free_planner" });
    } else if (href.indexOf(TESTER_FORM) > -1) {
      send("tester_apply");
    } else if (href.indexOf(REVIEW_FORM) > -1) {
      send("review_click");
    }
  }, true);
})();
