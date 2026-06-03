/**
 * Neutral section backgrounds only — all tints map to light grey.
 */
export function PastelSectionsInit() {
  const script = `(function(){
  function apply(el){
    if(el.getAttribute("data-tint"))return;
    el.classList.add("page-section-pastel");
    el.setAttribute("data-tint","white");
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
