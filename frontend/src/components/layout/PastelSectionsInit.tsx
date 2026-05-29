/**
 * Assigns a random pastel `data-tint` to each eligible section in <main>.
 * Runs synchronously at end of main (after sections are parsed) to avoid a white flash.
 */
export function PastelSectionsInit() {
  const script = `(function(){
  var pool=["yellow","pink","sky","green","yellow","pink","sky","green","white"];
  function pick(){return pool[Math.floor(Math.random()*pool.length)];}
  function hasCustomBg(el){
    var s=el.style;
    if(s.background||s.backgroundColor||s.backgroundImage)return true;
    return false;
  }
  function apply(el){
    if(el.getAttribute("data-tint"))return;
    if(hasCustomBg(el))return;
    el.classList.add("page-section-pastel");
    el.setAttribute("data-tint",pick());
  }
  var main=document.querySelector("main.site-main");
  if(!main)return;
  var selectors=[
    "section.corp-section",
    "section.content-page-section",
    "section.page-trust-strip",
    "section.page-conversion-band",
    "section.cta-section.page-conversion-band",
    "section.cta-section.service-detail-cta",
    "section.portfolio-page__showcase-band.home-section-band--light",
    "section.desimentor-section",
    "section.service-detail-intro",
    "section.service-detail-section",
    "section.portfolio-detail__related",
    "div.corp-section:not(.page-header)"
  ];
  main.querySelectorAll(selectors.join(",")).forEach(function(el){
    if(el.closest(".home-page .home-section-band--light"))return;
    if(el.closest(".home-page .home-section-band--dark"))return;
    if(el.classList.contains("page-header"))return;
    apply(el);
  });
})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
