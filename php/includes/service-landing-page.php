<?php
require_once __DIR__ . '/service-seo-data.php';

if (!isset($servicePageSlug)) {
    http_response_code(500);
    exit('Service page slug missing.');
}

$servicePage = getServiceLandingPage($servicePageSlug);

if ($servicePage === null) {
    http_response_code(404);
    exit('Service page not found.');
}

$basePath = '';
$currentPage = 'services';
$pageTitle = $servicePage['pageTitle'];
$pageDescription = $servicePage['pageDescription'];
$pageKeywords = $servicePage['pageKeywords'];
$canonicalUrl = 'https://www.cwsindia.online/' . $servicePage['slug'];
$ogUrl = $canonicalUrl;
$ogImage = 'https://www.cwsindia.online/assets/images/logo.png';

$service = $servicePage['service'];
$primaryKeyword = strtolower($service) . ' in Zirakpur';
$secondaryKeywords = [
    strtolower($service) . ' in Chandigarh',
    strtolower($service) . ' in Mohali',
    strtolower($service) . ' near me',
];

$themeMap = [
    'website-development-zirakpur' => ['start' => '#1e3a8a', 'mid' => '#2563eb', 'end' => '#3b82f6', 'accent' => '#93c5fd', 'icon' => 'fas fa-globe', 'badge' => 'Responsive Business Websites'],
    'digital-marketing-zirakpur' => ['start' => '#f97316', 'mid' => '#fb923c', 'end' => '#1e3a8a', 'accent' => '#fed7aa', 'icon' => 'fas fa-bullhorn', 'badge' => 'SEO, Ads and Lead Growth'],
    'ecommerce-website-zirakpur' => ['start' => '#0f766e', 'mid' => '#14b8a6', 'end' => '#0f172a', 'accent' => '#99f6e4', 'icon' => 'fas fa-cart-shopping', 'badge' => 'Sell Products Online'],
    'ui-ux-design-zirakpur' => ['start' => '#14b8a6', 'mid' => '#2dd4bf', 'end' => '#1e3a8a', 'accent' => '#ccfbf1', 'icon' => 'fas fa-palette', 'badge' => 'Modern Product Design'],
    'custom-software-development-zirakpur' => ['start' => '#1e3a8a', 'mid' => '#2563eb', 'end' => '#3b82f6', 'accent' => '#93c5fd', 'icon' => 'fas fa-laptop-code', 'badge' => 'Tailored Business Solutions'],
    'crm-development-zirakpur' => ['start' => '#0f766e', 'mid' => '#10b981', 'end' => '#34d399', 'accent' => '#d1fae5', 'icon' => 'fas fa-users-cog', 'badge' => 'Lead and Sales Management'],
    'erp-hrm-software-zirakpur' => ['start' => '#1d4ed8', 'mid' => '#3b82f6', 'end' => '#0f766e', 'accent' => '#bfdbfe', 'icon' => 'fas fa-cogs', 'badge' => 'Operations and HR Control'],
    'mobile-app-development-zirakpur' => ['start' => '#059669', 'mid' => '#10b981', 'end' => '#34d399', 'accent' => '#d1fae5', 'icon' => 'fas fa-mobile-alt', 'badge' => 'Android and iOS Apps'],
    'blockchain-development-zirakpur' => ['start' => '#1e3a8a', 'mid' => '#6366f1', 'end' => '#8b5cf6', 'accent' => '#ddd6fe', 'icon' => 'fas fa-cubes', 'badge' => 'Web3 Product Development'],
    'smart-contract-development-zirakpur' => ['start' => '#4338ca', 'mid' => '#6366f1', 'end' => '#8b5cf6', 'accent' => '#ddd6fe', 'icon' => 'fas fa-file-contract', 'badge' => 'Secure Contract Logic'],
    'graphic-designing-zirakpur' => ['start' => '#ec4899', 'mid' => '#f472b6', 'end' => '#8b5cf6', 'accent' => '#fbcfe8', 'icon' => 'fas fa-pen-nib', 'badge' => 'Creative Brand Assets'],
    'seo-services-zirakpur' => ['start' => '#ea580c', 'mid' => '#f59e0b', 'end' => '#1d4ed8', 'accent' => '#fde68a', 'icon' => 'fas fa-chart-line', 'badge' => 'Rank Better on Google'],
    'wordpress-website-zirakpur' => ['start' => '#1d4ed8', 'mid' => '#3b82f6', 'end' => '#0f172a', 'accent' => '#bfdbfe', 'icon' => 'fab fa-wordpress', 'badge' => 'Easy to Manage Websites'],
    'shopify-website-zirakpur' => ['start' => '#047857', 'mid' => '#10b981', 'end' => '#065f46', 'accent' => '#bbf7d0', 'icon' => 'fas fa-store', 'badge' => 'Conversion Focused Stores'],
    'cms-based-website-zirakpur' => ['start' => '#1e40af', 'mid' => '#3b82f6', 'end' => '#14b8a6', 'accent' => '#bfdbfe', 'icon' => 'fas fa-file-lines', 'badge' => 'Editable Business Websites'],
    'website-maintenance-zirakpur' => ['start' => '#334155', 'mid' => '#475569', 'end' => '#1d4ed8', 'accent' => '#cbd5e1', 'icon' => 'fas fa-screwdriver-wrench', 'badge' => 'Support and Ongoing Updates'],
    'ppc-services-zirakpur' => ['start' => '#b91c1c', 'mid' => '#ef4444', 'end' => '#f59e0b', 'accent' => '#fecaca', 'icon' => 'fas fa-bullseye', 'badge' => 'Google Ads Lead Campaigns'],
    'social-media-marketing-zirakpur' => ['start' => '#7c3aed', 'mid' => '#a855f7', 'end' => '#ec4899', 'accent' => '#e9d5ff', 'icon' => 'fas fa-hashtag', 'badge' => 'Social Reach and Engagement'],
];

$theme = $themeMap[$servicePageSlug] ?? ['start' => '#1e3a8a', 'mid' => '#2563eb', 'end' => '#0f766e', 'accent' => '#bfdbfe', 'icon' => 'fas fa-briefcase', 'badge' => 'Professional Service Solutions'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include __DIR__ . '/head.php'; ?>
    <style>
        :root {
            --service-start: <?php echo $theme['start']; ?>;
            --service-mid: <?php echo $theme['mid']; ?>;
            --service-end: <?php echo $theme['end']; ?>;
            --service-accent: <?php echo $theme['accent']; ?>;
        }
        .service-location-hero {
            padding: 140px 0 100px;
            background: linear-gradient(135deg, var(--service-start) 0%, var(--service-mid) 55%, var(--service-end) 100%);
            color: #fff;
            position: relative;
            overflow: hidden;
        }
        .service-location-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .service-location-hero .floating-shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            filter: blur(2px);
        }
        .service-location-hero .shape-1 {
            width: 180px;
            height: 180px;
            top: 70px;
            right: 7%;
        }
        .service-location-hero .shape-2 {
            width: 120px;
            height: 120px;
            bottom: 50px;
            left: 5%;
        }
        .service-location-hero .shape-3 {
            width: 70px;
            height: 70px;
            top: 45%;
            right: 18%;
        }
        .service-location-hero .container,
        .service-location-section .container {
            position: relative;
            z-index: 1;
        }
        .service-location-kicker {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            border-radius: 999px;
            background: linear-gradient(135deg, var(--service-start), var(--service-mid));
            box-shadow: 0 15px 35px rgba(15, 23, 42, 0.18);
            font-size: 0.95rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .service-location-kicker i {
            color: #fef3c7;
        }
        .service-location-hero h1 {
            font-size: clamp(2.2rem, 4vw, 3.8rem);
            line-height: 1.15;
            margin-bottom: 18px;
        }
        .service-location-hero p {
            max-width: 760px;
            font-size: 1.05rem;
            color: rgba(255, 255, 255, 0.88);
        }
        .service-location-preview {
            background: #fff;
            border-radius: 22px;
            padding: 1.5rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            color: #0f172a;
        }
        .service-location-preview-window {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-bottom: 14px;
            margin-bottom: 18px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.25);
        }
        .service-location-preview-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        .service-location-preview-dot.red { background: #ef4444; }
        .service-location-preview-dot.yellow { background: #f59e0b; }
        .service-location-preview-dot.green { background: #10b981; }
        .service-location-preview-code {
            border-radius: 14px;
            padding: 16px;
            background: #0f172a;
            color: #cbd5e1;
            font-family: "Courier New", monospace;
            font-size: 0.82rem;
            line-height: 1.7;
            margin-bottom: 18px;
        }
        .service-location-metric {
            background: #f8fafc;
            border-radius: 16px;
            padding: 14px;
            text-align: center;
            height: 100%;
        }
        .service-location-metric strong {
            display: block;
            font-size: 1.2rem;
            color: var(--service-start);
        }
        .service-location-section {
            padding: 80px 0;
        }
        .service-location-section.alt {
            background: #f8fafc;
        }
        .service-location-copy {
            max-width: 880px;
        }
        .service-location-copy h3 {
            font-size: clamp(1.9rem, 3vw, 2.5rem);
            margin-bottom: 18px;
        }
        .service-location-copy .lead-copy {
            font-size: 1.08rem;
            color: #334155;
            margin-bottom: 18px;
        }
        .service-location-copy .section-copy {
            color: #475569;
            margin-bottom: 0;
        }
        .service-location-benefits {
            list-style: none;
            padding: 0;
            margin: 28px 0 0;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px 24px;
        }
        .service-location-benefits li {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            color: #1e293b;
            font-weight: 600;
        }
        .service-location-benefits i {
            color: var(--service-start);
            margin-top: 4px;
        }
        .service-location-block {
            background: #fff;
            border-radius: 28px;
            padding: 38px;
            border: 1px solid rgba(148, 163, 184, 0.18);
        }
        .service-location-block-header {
            max-width: 760px;
            margin-bottom: 26px;
        }
        .service-location-block-header h3 {
            margin-bottom: 12px;
        }
        .service-location-block-header p {
            color: #64748b;
            margin-bottom: 0;
        }
        .service-location-deliverables {
            columns: 2;
            column-gap: 34px;
            padding: 0;
            margin: 0;
            list-style: none;
        }
        .service-location-deliverables li {
            break-inside: avoid;
            display: flex;
            gap: 12px;
            align-items: flex-start;
            padding: 0 0 16px;
            color: #334155;
        }
        .service-location-deliverables i {
            color: var(--service-start);
            margin-top: 5px;
        }
        .service-location-process-layout {
            display: grid;
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
            gap: 40px;
            align-items: start;
        }
        .service-location-process-copy p,
        .service-location-related-copy p {
            color: #64748b;
        }
        .service-location-card {
            height: 100%;
            padding: 28px;
            border-radius: 22px;
            background: #fff;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
            border: 1px solid rgba(148, 163, 184, 0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .service-location-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--service-start), var(--service-mid));
        }
        .service-location-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 22px 55px rgba(30, 58, 138, 0.15);
        }
        .service-location-card h3,
        .service-location-card h4 {
            margin-bottom: 14px;
        }
        .service-location-icon {
            width: 60px;
            height: 60px;
            border-radius: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 18px;
            background: linear-gradient(135deg, var(--service-start), var(--service-mid));
            color: #fff;
            font-size: 1.25rem;
        }
        .service-location-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .service-location-list li {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        .service-location-list li i {
            color: var(--service-start);
            margin-top: 4px;
        }
        .service-location-steps {
            counter-reset: serviceStep;
        }
        .service-location-step {
            position: relative;
            padding-left: 78px;
            min-height: 58px;
            margin-bottom: 26px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        }
        .service-location-step:last-child {
            margin-bottom: 0;
            border-bottom: 0;
        }
        .service-location-step h4 {
            margin-bottom: 8px;
        }
        .service-location-step p {
            color: #64748b;
            margin-bottom: 0;
        }
        .service-location-step::before {
            counter-increment: serviceStep;
            content: counter(serviceStep);
            position: absolute;
            left: 0;
            top: 0;
            width: 52px;
            height: 52px;
            border-radius: 16px;
            background: linear-gradient(135deg, var(--service-start), var(--service-mid));
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1rem;
        }
        .service-location-link-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 16px;
        }
        .service-location-link {
            display: block;
            padding: 18px 20px;
            border-radius: 18px;
            background: #fff;
            border: 1px solid rgba(148, 163, 184, 0.24);
            color: #0f172a;
            text-decoration: none;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
            transition: all 0.3s ease;
        }
        .service-location-link:hover {
            color: var(--service-start);
            transform: translateY(-2px);
        }
        .service-location-cta {
            padding: 34px;
            border-radius: 28px;
            background: linear-gradient(135deg, var(--service-start), var(--service-end));
            color: #fff;
        }
        .service-location-cta p {
            color: rgba(255, 255, 255, 0.82);
            margin-bottom: 0;
        }
        .service-location-faq .accordion-item {
            border: 1px solid rgba(148, 163, 184, 0.24);
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 14px;
        }
        .service-location-faq .accordion-button {
            font-weight: 700;
        }
        .service-location-faq-shell {
            background: #fff;
            border-radius: 28px;
            padding: 38px;
            border: 1px solid rgba(148, 163, 184, 0.18);
        }
        @media (max-width: 767.98px) {
            .service-location-hero {
                padding: 115px 0 75px;
            }
            .service-location-benefits,
            .service-location-deliverables,
            .service-location-process-layout {
                grid-template-columns: 1fr;
                columns: 1;
            }
            .service-location-block,
            .service-location-faq-shell,
            .service-location-card,
            .service-location-cta {
                padding: 22px;
            }
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/header.php'; ?>

    <section class="service-location-hero">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="container">
            <div class="row align-items-center g-4">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <span class="service-location-kicker">
                        <i class="<?php echo htmlspecialchars($theme['icon'], ENT_QUOTES, 'UTF-8'); ?>"></i>
                        <?php echo htmlspecialchars($theme['badge'], ENT_QUOTES, 'UTF-8'); ?>
                    </span>
                    <h1><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></h1>
                    <p><?php echo htmlspecialchars($servicePage['intro'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <div class="d-flex gap-3 flex-wrap mt-4">
                        <a href="contact" class="btn btn-light btn-lg px-4">
                            <i class="fas fa-rocket me-2"></i> Get Started
                        </a>
                        <a href="tel:+917015969967" class="btn btn-outline-light btn-lg px-4">
                            <i class="fas fa-phone-alt me-2"></i> Free Consultation
                        </a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="service-location-preview">
                        <div class="service-location-preview-window">
                            <span class="service-location-preview-dot red"></span>
                            <span class="service-location-preview-dot yellow"></span>
                            <span class="service-location-preview-dot green"></span>
                            <span class="ms-2 text-muted small"><?php echo htmlspecialchars($servicePage['slug'], ENT_QUOTES, 'UTF-8'); ?></span>
                        </div>
                        <div class="service-location-preview-code">
                            <span style="color:#60a5fa;">// Location-focused service page</span><br>
                            <span style="color:#f472b6;">const</span> service = <span style="color:#fbbf24;">"<?php echo htmlspecialchars($service, ENT_QUOTES, 'UTF-8'); ?>"</span>;<br>
                            <span style="color:#f472b6;">const</span> city = <span style="color:#34d399;">"Zirakpur"</span>;<br>
                            <span style="color:#f472b6;">return</span> <span style="color:#a78bfa;">rankBetter</span>(service, city);
                        </div>
                        <div class="row g-3">
                            <div class="col-6">
                                <div class="service-location-metric">
                                    <strong>SEO Ready</strong>
                                    <span class="text-muted small">Clean headings and crawlable content</span>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="service-location-metric">
                                    <strong>Responsive</strong>
                                    <span class="text-muted small">Modern layout for desktop and mobile</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="service-location-section">
        <div class="container">
            <div class="service-location-copy" data-aos="fade-up" data-aos-duration="900">
                <h3><?php echo htmlspecialchars($service . ' in Zirakpur', ENT_QUOTES, 'UTF-8'); ?></h3>
                <p class="lead-copy"><?php echo htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8'); ?></p>
                <p class="section-copy">We keep each service page focused on clarity, trust, and real conversion intent so the content reads like a professional business page instead of a template-heavy sales sheet.</p>
                <ul class="service-location-benefits">
                    <?php foreach ($servicePage['benefits'] as $benefit): ?>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span><?php echo htmlspecialchars($benefit, ENT_QUOTES, 'UTF-8'); ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </section>

    <section class="service-location-section alt">
        <div class="container">
            <div class="service-location-block" data-aos="fade-up" data-aos-duration="900">
                <div class="service-location-block-header">
                    <h3>What We Deliver</h3>
                    <p>Clear scope, practical deliverables, and business-ready execution without stuffing every detail into separate visual cards.</p>
                </div>
                <ul class="service-location-deliverables">
                    <?php foreach ($servicePage['deliverables'] as $deliverable): ?>
                        <li>
                            <i class="fas fa-check"></i>
                            <span><?php echo htmlspecialchars($deliverable, ENT_QUOTES, 'UTF-8'); ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div class="service-location-process-layout mt-4" data-aos="fade-up" data-aos-duration="900" data-aos-delay="120">
                <div class="service-location-process-copy">
                    <span class="section-badge">
                        <span class="dot"></span> OUR PROCESS <span class="dot"></span>
                    </span>
                    <h3 class="mt-3">How We Work</h3>
                    <p>Our process stays structured, readable, and client-friendly. Instead of boxing every paragraph, we use a clean flow that feels more like a proper company presentation.</p>
                    <p class="mb-0">This helps the page look sharper while still keeping key steps easy to scan.</p>
                </div>
                <div class="service-location-block">
                    <div class="service-location-steps">
                        <div class="service-location-step">
                            <h4>Local requirement discovery</h4>
                            <p>We understand your offer, target audience, and the search intent around Zirakpur, Chandigarh, and Mohali.</p>
                        </div>
                        <div class="service-location-step">
                            <h4>Page and offer positioning</h4>
                            <p>We shape the service message, page structure, and conversion points around the exact service keyword.</p>
                        </div>
                        <div class="service-location-step">
                            <h4>Launch with crawlable structure</h4>
                            <p>We keep headings, links, metadata, and content blocks easy for both users and search engines to follow.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="service-location-section">
        <div class="container">
            <div class="service-location-cta">
                <div class="row g-4 align-items-center">
                    <div class="col-lg-8">
                        <h3 class="mb-2"><?php echo htmlspecialchars($service . ' near me', ENT_QUOTES, 'UTF-8'); ?> with local business focus</h3>
                        <p>Need help from a team that understands local search intent, fast delivery, and conversion-ready service pages? Call us and we will plan the right scope for your business.</p>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <a href="contact" class="btn btn-light btn-lg me-2 mb-2">Get a Quote</a>
                        <a href="tel:+917015969967" class="btn btn-outline-light btn-lg mb-2">Call Now</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="service-location-section alt">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="service-location-faq-shell">
                        <h3>Frequently Asked Questions</h3>
                        <div class="accordion service-location-faq" id="serviceFaq">
                            <?php foreach ($servicePage['faq'] as $index => $item): ?>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="faqHeading<?php echo $index; ?>">
                                        <button class="accordion-button<?php echo $index > 0 ? ' collapsed' : ''; ?>" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse<?php echo $index; ?>" aria-expanded="<?php echo $index === 0 ? 'true' : 'false'; ?>" aria-controls="faqCollapse<?php echo $index; ?>">
                                            <?php echo htmlspecialchars($item['question'], ENT_QUOTES, 'UTF-8'); ?>
                                        </button>
                                    </h2>
                                    <div id="faqCollapse<?php echo $index; ?>" class="accordion-collapse collapse<?php echo $index === 0 ? ' show' : ''; ?>" aria-labelledby="faqHeading<?php echo $index; ?>" data-bs-parent="#serviceFaq">
                                        <div class="accordion-body">
                                            <?php echo htmlspecialchars($item['answer'], ENT_QUOTES, 'UTF-8'); ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="service-location-related-copy mb-4">
                        <span class="section-badge">
                            <span class="dot"></span> RELATED PAGES <span class="dot"></span>
                        </span>
                        <h3 class="mt-3">Related Service Pages</h3>
                        <p class="mb-0">Internal links should feel useful and natural. This layout keeps them lightweight and professional instead of wrapping another large text block inside a card.</p>
                    </div>
                    <div class="service-location-link-grid">
                        <?php foreach ($servicePage['related'] as $relatedSlug): ?>
                            <?php $relatedPage = getServiceLandingPage($relatedSlug); ?>
                            <?php if ($relatedPage !== null): ?>
                                <a class="service-location-link" href="<?php echo htmlspecialchars($relatedPage['slug'], ENT_QUOTES, 'UTF-8'); ?>">
                                    <?php echo htmlspecialchars($relatedPage['pageTitle'], ENT_QUOTES, 'UTF-8'); ?>
                                </a>
                            <?php endif; ?>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php include __DIR__ . '/footer.php'; ?>

    <script type="application/ld+json">
    <?php
    echo json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'Service',
        'name' => $pageTitle,
        'url' => $canonicalUrl,
        'description' => $pageDescription,
        'provider' => [
            '@type' => 'Organization',
            'name' => 'Creative Web Solutions',
            'url' => 'https://www.cwsindia.online',
        ],
        'areaServed' => ['Zirakpur', 'Chandigarh', 'Mohali'],
        'keywords' => array_merge([$primaryKeyword], $secondaryKeywords),
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    ?>
    </script>
</body>
</html>
