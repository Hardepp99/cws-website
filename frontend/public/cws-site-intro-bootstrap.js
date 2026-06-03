/**
 * Site intro bootstrap — runs before React hydration.
 * Keep in sync with buildSiteIntroBootstrapScript() in src/lib/site-intro.ts
 * Regenerate: node frontend/scripts/sync-site-intro-bootstrap.mjs
 */
(function () {
  var K = "cws_home_intro_shown";
  var M = 4480;
  var p = location.pathname || "/";
  var h = p === "/" || p === "" || p === "/index" || p === "/index.html";
  var s = !h;
  try {
    if (sessionStorage.getItem(K) === "1") s = true;
  } catch (e) {}
  function d() {
    var e = document.documentElement;
    var b = document.body;
    var pl = document.getElementById("preloader");
    e.classList.remove("is-intro-pending");
    b.classList.add("site-ready");
    if (pl) {
      pl.classList.add("loaded");
      pl.style.display = "none";
      pl.style.pointerEvents = "none";
    }
  }
  function m() {
    try {
      sessionStorage.setItem(K, "1");
    } catch (e) {}
  }
  if (s) {
    d();
    return;
  }
  document.documentElement.classList.add("is-intro-pending");
  window.addEventListener(
    "site-intro-ready",
    function () {
      m();
      d();
    },
    { once: true }
  );
  setTimeout(function () {
    m();
    d();
  }, M);
})();
