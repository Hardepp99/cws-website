import Link from "next/link";

/**
 * Original long-form copy for India/Chandigarh SMB search intent — not derived from any single competitor site.
 * Keeps the homepage indexable for informational queries alongside flexible ACF sections.
 */
export function HomeSeoAppendix() {
  return (
    <section className="corp-section corp-section-alt home-seo-appendix" aria-labelledby="home-seo-appendix-title">
      <div className="corp-container">
        <h2 id="home-seo-appendix-title" className="section-title mb-3">
          Creative Web Solutions — digital growth partner across India
        </h2>
        <div className="home-seo-appendix__grid">
          <div className="home-seo-appendix__col">
            <p>
              Creative Web Solutions helps businesses plan, build, and grow digital products — from high‑performance
              marketing sites and ecommerce flows to custom web applications, integrations, and ongoing optimisation.
              We work with founders, marketing teams, and IT leads who need clear scope, predictable delivery, and
              measurable outcomes rather than one‑size templates.
            </p>
            <p>
              Every engagement starts with discovery: who you serve, what should convert, which systems must connect
              (CRM, payments, analytics, inventory), and how teams will maintain content over time. That discipline
              reduces rework, keeps accessibility and Core Web Vitals in view, and sets the right SEO baseline —
              semantic structure, clean URLs, metadata, and performance budgets aligned with your goals.
            </p>
          </div>
          <div className="home-seo-appendix__col">
            <p>
              Whether you operate in Chandigarh, Mohali, Zirakpur, or nationally, we structure projects for clarity:
              staged milestones, staging environments, documented handover, and training where needed. Our training
              wing complements delivery — teams can upskill on full‑stack and modern front‑end stacks alongside live
              product work when it makes sense.
            </p>
            <p>
              Explore our <Link href="/services">services overview</Link>, review the{" "}
              <Link href="/portfolio">portfolio</Link> of shipped work, or <Link href="/contact">start a conversation</Link>{" "}
              about timelines, pricing, and the right stack for your roadmap. Ask for a tailored quote when you are ready
              — we respond with concrete next steps, not generic brochures.
            </p>
          </div>
        </div>
        <div className="home-seo-appendix__links mt-3 pt-3 border-top">
          <span className="small text-muted d-block mb-2">Popular next steps</span>
          <ul className="home-seo-appendix__list">
            <li>
              <Link href="/website-development-zirakpur">Website development</Link>
            </li>
            <li>
              <Link href="/digital-marketing-zirakpur">Digital marketing & SEO</Link>
            </li>
            <li>
              <Link href="/mobile-app-development-zirakpur">Mobile app development</Link>
            </li>
            <li>
              <Link href="/courses">Training & courses</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
