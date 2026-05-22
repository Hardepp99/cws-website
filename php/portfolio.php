<?php
$basePath = '';
$currentPage = 'portfolio';
$pageTitle = 'Portfolio | Our Work & Projects | Creative Web Solutions';
$pageDescription = 'Explore our portfolio of successful projects. Web development, mobile apps, blockchain solutions, UI/UX designs, and more. See our work and client success stories.';
$pageKeywords = 'portfolio, our work, projects, web development portfolio, mobile app portfolio, blockchain projects, UI/UX design portfolio, case studies';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include 'includes/head.php'; ?>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <style>
        .page-header.portfolio-page {
            position: relative;
            overflow: hidden;
        }

        .page-header.portfolio-page::after {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.16), transparent 24%),
                radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.18), transparent 22%),
                linear-gradient(135deg, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.05));
            pointer-events: none;
        }

        .portfolio-showcase {
            background: linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%);
            border: 1px solid rgba(59, 130, 246, 0.12);
            border-radius: 32px;
            padding: 34px;
            box-shadow: 0 30px 80px rgba(30, 58, 138, 0.08);
            margin-bottom: 42px;
        }

        .portfolio-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            border-radius: 999px;
            background: rgba(30, 58, 138, 0.08);
            color: #1e3a8a;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.16em;
            text-transform: uppercase;
        }

        .portfolio-eyebrow::before {
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.12);
        }

        .portfolio-showcase h2 {
            font-size: clamp(2rem, 4vw, 3.2rem);
            line-height: 1.08;
            margin: 20px 0 16px;
            color: #0f172a;
        }

        .portfolio-showcase p {
            font-size: 1rem;
            color: #5b6b82;
            max-width: 620px;
            margin: 0;
        }

        .portfolio-stats {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
        }

        .portfolio-stat-card {
            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(30, 58, 138, 0.1);
            border-radius: 24px;
            padding: 22px;
            box-shadow: 0 14px 35px rgba(15, 23, 42, 0.08);
        }

        .portfolio-stat-card strong {
            display: block;
            font-size: 2rem;
            font-weight: 900;
            color: #1e3a8a;
            margin-bottom: 6px;
        }

        .portfolio-stat-card span {
            color: #64748b;
            font-size: 0.95rem;
            font-weight: 600;
        }

        .portfolio-page .portfolio-filter {
            gap: 14px;
            margin-bottom: 0;
        }

        .portfolio-page .filter-btn {
            padding: 12px 22px;
            border-color: rgba(30, 58, 138, 0.14);
            background: rgba(255, 255, 255, 0.84);
            box-shadow: 0 10px 24px rgba(30, 58, 138, 0.05);
        }

        .portfolio-page .filter-btn:hover,
        .portfolio-page .filter-btn.active {
            transform: translateY(-3px);
        }

        .portfolio-page .portfolio-card {
            height: 100%;
            border: 1px solid rgba(30, 58, 138, 0.1);
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        }

        .portfolio-page .portfolio-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 24px;
            border: 1px solid transparent;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.28), rgba(16, 185, 129, 0.18)) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.35s ease;
            pointer-events: none;
        }

        .portfolio-page .portfolio-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 28px 70px rgba(30, 58, 138, 0.16);
            border-color: rgba(59, 130, 246, 0.18);
        }

        .portfolio-page .portfolio-card:hover::after {
            opacity: 1;
        }

        .portfolio-page .portfolio-image {
            height: 290px;
            background: #dbeafe;
        }

        .portfolio-page .portfolio-image::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 10%, rgba(15, 23, 42, 0.08) 52%, rgba(15, 23, 42, 0.78) 100%);
            z-index: 1;
            pointer-events: none;
        }

        .portfolio-page .portfolio-image img {
            transform: none;
            filter: saturate(1.04);
        }

        .portfolio-page .portfolio-card:hover .portfolio-image img {
            transform: none;
            filter: brightness(0.78) saturate(1.05);
        }

        .portfolio-float-badge {
            position: absolute;
            top: 18px;
            left: 18px;
            z-index: 3;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.94);
            color: #0f172a;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.14);
        }

        .portfolio-float-badge::before {
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
        }

        .portfolio-page .portfolio-overlay {
            align-items: flex-end;
            justify-content: space-between;
            padding: 22px;
            gap: 16px;
            opacity: 1;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.58));
        }

        .portfolio-page .portfolio-overlay::before {
            background: linear-gradient(180deg, transparent 5%, rgba(15, 23, 42, 0.14) 45%, rgba(15, 23, 42, 0.48) 100%);
        }

        .portfolio-overlay-copy {
            position: relative;
            z-index: 3;
            color: #fff;
            max-width: 68%;
            transform: translateY(16px);
            opacity: 0;
            transition: 0.35s ease;
        }

        .portfolio-overlay-copy span {
            display: block;
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.78);
            margin-bottom: 8px;
            font-weight: 700;
        }

        .portfolio-overlay-copy strong {
            display: block;
            font-size: 1.15rem;
            line-height: 1.3;
        }

        .portfolio-card-actions {
            position: relative;
            z-index: 3;
            display: flex;
            gap: 12px;
            transform: translateY(18px);
            opacity: 0;
            transition: 0.35s ease;
        }

        .portfolio-page .portfolio-card:hover .portfolio-overlay-copy,
        .portfolio-page .portfolio-card:hover .portfolio-card-actions {
            transform: translateY(0);
            opacity: 1;
        }

        .portfolio-page .portfolio-link,
        .portfolio-page .portfolio-zoom {
            width: 52px;
            height: 52px;
            transform: none;
            opacity: 1;
            background: rgba(255, 255, 255, 0.92);
            color: #1e3a8a;
        }

        .portfolio-page .portfolio-link:hover,
        .portfolio-page .portfolio-zoom:hover {
            transform: translateY(-4px);
            background: #ffffff;
            color: #10b981;
            box-shadow: 0 16px 32px rgba(15, 23, 42, 0.18);
        }

        .portfolio-page .portfolio-info {
            padding: 26px 26px 24px;
        }

        .portfolio-page .portfolio-category {
            margin-bottom: 14px;
        }

        .portfolio-page .portfolio-info h4 {
            font-size: 1.2rem;
            margin-bottom: 10px;
        }

        .portfolio-page .portfolio-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 18px;
            padding-top: 16px;
            border-top: 1px solid rgba(148, 163, 184, 0.22);
        }

        .portfolio-page .portfolio-metric {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
        }

        .portfolio-page .portfolio-metric i {
            color: #10b981;
        }

        .portfolio-page .portfolio-open {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #1e3a8a;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }

        .portfolio-page .portfolio-open i {
            transition: transform 0.3s ease;
        }

        .portfolio-page .portfolio-card:hover .portfolio-open i {
            transform: translateX(4px);
        }

        @media (max-width: 991px) {
            .portfolio-showcase {
                padding: 24px;
            }

            .portfolio-stats {
                margin-top: 24px;
            }

            .portfolio-overlay-copy {
                max-width: 100%;
            }
        }

        @media (max-width: 767px) {
            .portfolio-stats {
                grid-template-columns: 1fr;
            }

            .portfolio-page .portfolio-overlay {
                padding: 18px;
                flex-direction: column;
                align-items: flex-start;
            }

            .portfolio-card-actions,
            .portfolio-overlay-copy {
                transform: none;
                opacity: 1;
            }

            .portfolio-page .portfolio-info {
                padding: 22px 20px;
            }
        }
    </style>

    <!-- Page Header -->
    <section class="page-header portfolio-page" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%); padding: 140px 0 80px;">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center text-white">
                    <h1 class="display-4 fw-bold mb-3">Our Portfolio</h1>
                    <p class="lead opacity-90">Explore our successful projects and see how we've helped businesses achieve digital excellence</p>
                    <nav aria-label="breadcrumb" class="mt-4">
                        <ol class="breadcrumb justify-content-center" style="background: transparent;">
                            <li class="breadcrumb-item"><a href="index" class="text-white">Home</a></li>
                            <li class="breadcrumb-item active text-white-50">Portfolio</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    </section>

    <!-- Portfolio Section -->
    <section class="portfolio-section py-5 portfolio-page">
        <div class="container">
            <div class="portfolio-showcase" data-aos="fade-up">
                <div class="row align-items-center g-4">
                    <div class="col-lg-7">
                        <span class="portfolio-eyebrow">Featured Projects</span>
                        <h2>Creative builds that feel modern, perform well, and convert better.</h2>
                        <p>Browse our selected work across web, mobile, blockchain, and product design. Each card gives a richer preview with smoother motion and cleaner interactions.</p>
                    </div>
                    <div class="col-lg-5">
                        <div class="portfolio-stats">
                            <div class="portfolio-stat-card">
                                <strong>120+</strong>
                                <span>Projects designed, shipped, and optimized</span>
                            </div>
                            <div class="portfolio-stat-card">
                                <strong>6</strong>
                                <span>High-demand service categories represented</span>
                            </div>
                            <div class="portfolio-stat-card">
                                <strong>92%</strong>
                                <span>Clients return for upgrades, support, or growth work</span>
                            </div>
                            <div class="portfolio-stat-card">
                                <strong>24/7</strong>
                                <span>Consultation, iteration, and launch support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Portfolio Filter -->
            <div class="portfolio-filter text-center mb-5" data-aos="fade-up">
                <button class="filter-btn active" data-filter="all">All Projects</button>
                <button class="filter-btn" data-filter="web">Web Development</button>
                <button class="filter-btn" data-filter="app">App Development</button>
                <button class="filter-btn" data-filter="design">UI/UX Design</button>
                <button class="filter-btn" data-filter="blockchain">Blockchain</button>
                <button class="filter-btn" data-filter="ecommerce">E-commerce</button>
            </div>

            <div class="row g-4 portfolio-grid">
                <!-- Project 1 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="web" data-aos="fade-up" data-aos-delay="100">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="assets/images/jewellery-website.png" alt="E commerce website project by developers in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                           
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>Jewellery Website</span>
                                   
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="https://heerahut.com" class="portfolio-link" data-website="https://www.heerahut.com" aria-label="Visit website"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="assets/images/jewellery-website.png" data-title="Fashion E-commerce Store" data-description="Complete online shopping platform with 10,000+ products" data-website="https://heerahut.com" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">E-commerce</span>
                            <h4>Jewellery Website</h4>
                            <p>Complete online shopping platform with 10,000+ products</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-chart-line"></i> 38% better product engagement</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 2 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="app" data-aos="fade-up" data-aos-delay="200">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600" alt="Mobile banking app project by developers in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="portfolio-float-badge">Live Project</div>
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>Secure Finance</span>
                                    <strong>Fast onboarding with trust-first mobile UI</strong>
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="#" class="portfolio-link" data-website="https://www.cwsindia.online" aria-label="Visit website"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200" data-title="Mobile Banking App" data-description="Secure banking app with biometric authentication" data-website="https://www.cwsindia.online" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">App Development</span>
                            <h4>Mobile Banking App</h4>
                            <p>Secure banking app with biometric authentication</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-shield-alt"></i> Biometric login and secure flows</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 3 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="blockchain" data-aos="fade-up" data-aos-delay="300">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600" alt="NFT marketplace development project in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="portfolio-float-badge">Web3 Launch</div>
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>Blockchain Product</span>
                                    <strong>Marketplace experience designed for speed and trust</strong>
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="#" class="portfolio-link" data-website="https://www.cwsindia.online" aria-label="Visit website"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200" data-title="NFT Marketplace" data-description="Decentralized NFT trading platform" data-website="https://www.cwsindia.online" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">Blockchain</span>
                            <h4>NFT Marketplace</h4>
                            <p>Decentralized NFT trading platform</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-coins"></i> Wallet, minting, and trading flow</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 4 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="design" data-aos="fade-up" data-aos-delay="400">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600" alt="Dashboard UI design project in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="portfolio-float-badge">Design System</div>
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>Data Storytelling</span>
                                    <strong>Dense analytics made readable and action-ready</strong>
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="#" class="portfolio-link" data-website="https://www.cwsindia.online" aria-label="Visit website"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200" data-title="Analytics Dashboard" data-description="Modern analytics dashboard with data visualization" data-website="https://www.cwsindia.online" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">UI/UX Design</span>
                            <h4>Analytics Dashboard</h4>
                            <p>Modern analytics dashboard with data visualization</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-layer-group"></i> Scalable component-based UI</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 5 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="ecommerce" data-aos="fade-up" data-aos-delay="500">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600" alt="Grocery ecommerce website project in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="portfolio-float-badge">Concept Build</div>
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>Commerce Ops</span>
                                    <strong>Vendor, order, and delivery journeys aligned</strong>
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="#" class="portfolio-link" aria-label="Contact us"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200" data-title="Online Grocery Store" data-description="Multi-vendor grocery platform with delivery tracking" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">E-commerce</span>
                            <h4>Online Grocery Store</h4>
                            <p>Multi-vendor grocery platform with delivery tracking</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-truck"></i> Multi-vendor delivery system</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 6 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="web" data-aos="fade-up" data-aos-delay="600">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600" alt="Healthcare portal development project in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="portfolio-float-badge">Concept Build</div>
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>Healthcare UX</span>
                                    <strong>Patient-first flows for appointments and care</strong>
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="#" class="portfolio-link" aria-label="Contact us"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200" data-title="Healthcare Portal" data-description="Patient management system with telemedicine" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">Web Development</span>
                            <h4>Healthcare Portal</h4>
                            <p>Patient management system with telemedicine</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-heartbeat"></i> Booking, records, and telemedicine</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 7 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="app" data-aos="fade-up" data-aos-delay="100">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=600" alt="Food delivery app project in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="portfolio-float-badge">Live Project</div>
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>Growth App</span>
                                    <strong>Speedy ordering flow with real-time tracking</strong>
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="#" class="portfolio-link" data-website="https://www.cwsindia.online" aria-label="Visit website"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1200" data-title="Food Delivery App" data-description="Real-time food ordering with GPS tracking" data-website="https://www.cwsindia.online" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">App Development</span>
                            <h4>Food Delivery App</h4>
                            <p>Real-time food ordering with GPS tracking</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-map-marker-alt"></i> GPS orders and dispatch flow</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 8 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="blockchain" data-aos="fade-up" data-aos-delay="200">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="https://images.unsplash.com/photo-1642790551116-18e150f248e5?w=600" alt="DeFi platform development project in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="portfolio-float-badge">Web3 Launch</div>
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>DeFi Experience</span>
                                    <strong>Clear staking dashboard for complex financial actions</strong>
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="#" class="portfolio-link" data-website="https://www.cwsindia.online" aria-label="Visit website"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="https://images.unsplash.com/photo-1642790551116-18e150f248e5?w=1200" data-title="DeFi Staking Platform" data-description="Decentralized staking with yield farming" data-website="https://www.cwsindia.online" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">Blockchain</span>
                            <h4>DeFi Staking Platform</h4>
                            <p>Decentralized staking with yield farming</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-wallet"></i> Staking, rewards, and wallet sync</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 9 -->
                <div class="col-lg-4 col-md-6 portfolio-item" data-category="design" data-aos="fade-up" data-aos-delay="300">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600" alt="Mobile app design project in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="portfolio-float-badge">Design System</div>
                            <div class="portfolio-overlay">
                                <div class="portfolio-overlay-copy">
                                    <span>Mobile UX</span>
                                    <strong>Visual system made for habit-building engagement</strong>
                                </div>
                                <div class="portfolio-card-actions">
                                    <a href="#" class="portfolio-link" aria-label="Contact us"><i class="fas fa-link"></i></a>
                                    <a href="#" class="portfolio-zoom" data-image="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200" data-title="Fitness App Design" data-description="Complete UI/UX for workout tracking app" aria-label="View project image"><i class="fas fa-search-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-info">
                            <span class="portfolio-category">UI/UX Design</span>
                            <h4>Fitness App Design</h4>
                            <p>Complete UI/UX for workout tracking app</p>
                            <div class="portfolio-footer">
                                <span class="portfolio-metric"><i class="fas fa-paint-brush"></i> Full app flow and interaction system</span>
                                <span class="portfolio-open">Open Preview <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Portfolio Modal -->
    <div class="modal fade" id="portfolioModal" tabindex="-1" aria-labelledby="portfolioModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content portfolio-modal-content">
                <div class="modal-body p-0">
                    <div class="row g-0 align-items-center">
                        <div class="col-lg-7 portfolio-modal-image">
                            <img id="portfolioModalImage" src="" alt="Website development project preview in Chandigarh, Zirakpur, India" decoding="async" class="img-fluid w-100">
                        </div>
                        <div class="col-lg-5">
                            <div class="portfolio-modal-details p-4 p-lg-5">
                                <h5 id="portfolioModalTitle" class="mb-3">Project Preview</h5>
                                <p id="portfolioModalDescription" class="text-muted mb-4">Select any project to view a larger preview and access the live website if available.</p>
                                <div class="d-flex flex-wrap gap-3">
                                    <a id="portfolioModalWebsiteBtn" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Visit Website</a>
                                    <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-wrapper" data-aos="zoom-in" data-aos-duration="1000">
                <div class="cta-shape cta-shape-1"></div>
                <div class="cta-shape cta-shape-2"></div>
                <div class="row align-items-center">
                    <div class="col-lg-8">
                        <h2>Have a Project in Mind?</h2>
                        <p>Let's work together to create something amazing. Get a free consultation today!</p>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <a href="contact" class="btn btn-white">
                            Start Your Project <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script>
        // Portfolio Filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                document.querySelectorAll('.portfolio-item').forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        item.classList.remove('hide');
                    } else {
                        item.style.display = 'none';
                        item.classList.add('hide');
                    }
                });
            });
        });

        // Portfolio Modal and Website Link
        const portfolioModalEl = document.getElementById('portfolioModal');
        if (portfolioModalEl) {
            const portfolioModal = new bootstrap.Modal(portfolioModalEl);
            const modalImage = document.getElementById('portfolioModalImage');
            const modalTitle = document.getElementById('portfolioModalTitle');
            const modalDescription = document.getElementById('portfolioModalDescription');
            const modalWebsiteBtn = document.getElementById('portfolioModalWebsiteBtn');

            document.querySelectorAll('.portfolio-zoom').forEach(zoomBtn => {
                zoomBtn.addEventListener('click', function(event) {
                    event.preventDefault();
                    const imageSrc = this.dataset.image || this.closest('.portfolio-card').querySelector('img').src;
                    const title = this.dataset.title || 'Portfolio Preview';
                    const description = this.dataset.description || 'View the project image in full size.';
                    const website = this.dataset.website;

                    modalImage.src = imageSrc;
                    modalImage.alt = title;
                    modalTitle.textContent = title;
                    modalDescription.textContent = description;

                    if (website) {
                        modalWebsiteBtn.href = website;
                        modalWebsiteBtn.target = '_blank';
                        modalWebsiteBtn.textContent = 'Visit Website';
                        modalWebsiteBtn.classList.remove('btn-outline-primary');
                        modalWebsiteBtn.classList.add('btn-primary');
                    } else {
                        modalWebsiteBtn.href = 'contact';
                        modalWebsiteBtn.target = '_self';
                        modalWebsiteBtn.textContent = 'Contact Us';
                        modalWebsiteBtn.classList.remove('btn-primary');
                        modalWebsiteBtn.classList.add('btn-outline-primary');
                    }

                    portfolioModal.show();
                });
            });

            document.querySelectorAll('.portfolio-link').forEach(linkBtn => {
                linkBtn.addEventListener('click', function(event) {
                    event.preventDefault();
                    const website = this.dataset.website;
                    if (website) {
                        window.open(website, '_blank', 'noopener');
                    } else {
                        window.location.href = 'contact';
                    }
                });
            });
        }
    </script>
</body>
</html>
