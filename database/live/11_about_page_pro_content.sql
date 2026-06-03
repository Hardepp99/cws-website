-- Sample pro classic HTML for /about (H2 sections, icon list, hero image)
-- Run after 10_page_pro_columns.sql. Safe to re-run.

UPDATE pages
SET
  content_html = CONCAT(
    '<p class="lead">Creative Web Solutions is a product-minded agency: design, engineering, and growth under one roof. We work with founders and marketing teams who need a partner that ships in plain language.</p>',
    '<h2>Who we are</h2>',
    '<figure><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&amp;fit=crop&amp;w=1200&amp;h=800&amp;q=85" alt="Creative Web Solutions team collaborating" /></figure>',
    '<p>Since 2010 we have delivered websites, apps, and campaigns for retail, healthcare, SaaS, and local brands. You get named designers and engineers—not a rotating ticket queue.</p>',
    '<h2>How we work</h2>',
    '<ul>',
    '<li><i class="fas fa-comments"></i> Discovery workshops that capture goals, risks, and success metrics</li>',
    '<li><i class="fas fa-pencil-ruler"></i> UI/UX you approve before we write production code</li>',
    '<li><i class="fas fa-code"></i> Staging demos on a predictable sprint cadence</li>',
    '<li><i class="fas fa-chart-line"></i> SEO, analytics, and CRM hooks so leads are measurable</li>',
    '</ul>',
    '<h2>What you can expect</h2>',
    '<p>Enterprise-grade security practices, documented scope, and handover your team can extend. We answer in plain language—no jargon walls.</p>',
    '<p><a href="/contact" class="btn btn-primary-custom">Book a consultation</a></p>'
  ),
  page_custom_css = '.pro-page__section-title { letter-spacing: -0.03em; }',
  display_mode = 'classic',
  status = 'published'
WHERE slug = 'about' AND is_homepage = 0;
