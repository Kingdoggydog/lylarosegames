/* =====================================================================
   LYLA ROSE GAMES - SITE-WIDE SETTINGS
   Every page on the site (home page and every game) loads this one file.
   Change something here and it changes everywhere.
   ===================================================================== */

// Google Analytics 4 "Measurement ID" - looks like G-ABC123XYZ.
// Leave it as "" to switch analytics off.
const GA_MEASUREMENT_ID = "G-EM2WKCXBEL";

(function () {
  if (!GA_MEASUREMENT_ID) return;
  // Don't count visits while testing on your own computer
  if (location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1") return;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag("js", new Date());
  // Kid-friendly settings: no ad tracking, no cross-device profiling
  gtag("config", GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
})();
