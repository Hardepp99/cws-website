<?php
$basePath = '';  // IMPORTANT: Use '../' for service pages
$currentPage = 'services';
$pageTitle = 'Logo Design Services in Chandigarh, Mohali | Professional Logo Designer | Creative Web Solutions';
$pageDescription = 'Professional logo design services in Chandigarh, Mohali, Zirakpur. Custom logo, brand identity, business logo design. Starting â‚¹1,999. Call +91-7015969967';
$pageKeywords = 'logo design Chandigarh, logo designer Mohali, brand identity design, business logo, custom logo design, Tricity, Zirakpur, Patiala, corporate logo';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include __DIR__ . '/../includes/head.php'; ?>
</head>
    
    <style>
        .service-hero {
            background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
            padding: 140px 0 100px;
            position: relative;
            overflow: hidden;
        }
        .service-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50m-40 0a40,40 0 1,0 80,0a40,40 0 1,0 -80,0' fill='none' stroke='%23ffffff' stroke-opacity='0.05' stroke-width='2'/%3E%3C/svg%3E");
        }
        .logo-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(139, 92, 246, 0.1);
            transition: all 0.3s ease;
            text-align: center;
        }
        .logo-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(139, 92, 246, 0.2);
        }
        .logo-card .icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: #8b5cf6;
            margin: 0 auto 1.5rem;
        }
        .price-tag {
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-weight: 700;
            display: inline-block;
            margin-top: 1rem;
        }
        .package-card {
            background: white;
            border-radius: 25px;
            padding: 2.5rem;
            box-shadow: 0 15px 50px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
            height: 100%;
        }
        .package-card.featured {
            border: 3px solid #8b5cf6;
            transform: scale(1.05);
        }
        .package-card.featured::before {
            content: 'MOST POPULAR';
            position: absolute;
            top: 20px;
            right: -35px;
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            color: white;
            padding: 5px 40px;
            font-size: 0.75rem;
            font-weight: 700;
            transform: rotate(45deg);
        }
        .package-price {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .brand-badge {
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .logo-showcase {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }
        .logo-showcase-item {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 1;
            transition: all 0.3s ease;
        }
        .logo-showcase-item:hover {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1));
            transform: scale(1.05);
        }
        .process-step {
            text-align: center;
            position: relative;
        }
        .process-step::after {
            content: '';
            position: absolute;
            top: 40px;
            right: -50%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #8b5cf6, transparent);
        }
        .process-step:last-child::after {
            display: none;
        }
        .step-number {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: 800;
            color: white;
            margin: 0 auto 1.5rem;
            position: relative;
            z-index: 1;
        }
    </style>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>

    <!-- Service Hero -->
    <section class="service-hero">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <span class="brand-badge mb-3">
                        <i class="fas fa-crown"></i> Premium Logo Design
                    </span>
                    <h1 class="display-4 text-white fw-bold mb-4">
                        Professional <span style="color: #fef3c7;">Logo Design</span> Services
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Create a powerful brand identity with our custom logo design services. Unique, memorable, and timeless logos that represent your business perfectly. Best logo designers in Chandigarh, Mohali & Tricity.
                    </p>
                    <div class="d-flex gap-3 flex-wrap">
                        <a href="../contact" class="btn btn-light btn-lg px-4">
                            <i class="fas fa-rocket me-2"></i> Starting @ â‚¹1,999
                        </a>
                        <a href="tel:+91-7015969967" class="btn btn-outline-light btn-lg px-4">
                            <i class="fas fa-phone-alt me-2"></i> Free Consultation
                        </a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="logo-showcase">
                        <div class="logo-showcase-item">
                            <i class="fas fa-store fa-3x" style="color: #8b5cf6;"></i>
                        </div>
                        <div class="logo-showcase-item">
                            <i class="fas fa-utensils fa-3x" style="color: #ec4899;"></i>
                        </div>
                        <div class="logo-showcase-item">
                            <i class="fas fa-hospital fa-3x" style="color: #10b981;"></i>
                        </div>
                        <div class="logo-showcase-item">
                            <i class="fas fa-graduation-cap fa-3x" style="color: #f59e0b;"></i>
                        </div>
                        <div class="logo-showcase-item">
                            <i class="fas fa-car fa-3x" style="color: #3b82f6;"></i>
                        </div>
                        <div class="logo-showcase-item">
                            <i class="fas fa-dumbbell fa-3x" style="color: #ef4444;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Logo Types Section -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> LOGO TYPES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Types of <span class="gradient-text">Logo Designs</span> We Create
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="logo-card">
                        <div class="icon">
                            <i class="fas fa-font"></i>
                        </div>
                        <h4>Wordmark Logo</h4>
                        <p>Text-based logos with stylized company name. Perfect for unique brand names.</p>
                        <span class="price-tag">â‚¹1,999</span>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="logo-card">
                        <div class="icon">
                            <i class="fas fa-shapes"></i>
                        </div>
                        <h4>Symbol/Icon Logo</h4>
                        <p>Iconic graphics that represent your brand. Great for instant recognition.</p>
                        <span class="price-tag">â‚¹2,999</span>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="logo-card">
                        <div class="icon">
                            <i class="fas fa-object-group"></i>
                        </div>
                        <h4>Combination Logo</h4>
                        <p>Text + symbol combined. Most versatile and widely used logo type.</p>
                        <span class="price-tag">â‚¹3,999</span>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="logo-card">
                        <div class="icon">
                            <i class="fas fa-certificate"></i>
                        </div>
                        <h4>Emblem Logo</h4>
                        <p>Badge or seal-style logos. Classic look for traditional businesses.</p>
                        <span class="price-tag">â‚¹4,999</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Packages -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> PRICING PACKAGES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Choose Your <span class="gradient-text">Logo Package</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Starter</h4>
                        <div class="package-price">â‚¹1,999</div>
                        <p class="text-muted mb-4">Perfect for startups</p>
                        <ul class="list-unstyled mb-4">
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> 2 Initial Concepts</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> 2 Revisions</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> PNG & JPG Files</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Social Media Kit</li>
                            <li class="mb-3 text-muted"><i class="fas fa-times me-2"></i> Source Files</li>
                            <li class="mb-3 text-muted"><i class="fas fa-times me-2"></i> Brand Guidelines</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="package-card featured">
                        <h4 class="text-muted mb-3">Professional</h4>
                        <div class="package-price">â‚¹4,999</div>
                        <p class="text-muted mb-4">Best for businesses</p>
                        <ul class="list-unstyled mb-4">
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> 4 Initial Concepts</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Unlimited Revisions</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> All File Formats</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Source Files (AI, PSD)</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Social Media Kit</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Business Card Design</li>
                        </ul>
                        <a href="../contact" class="btn btn-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Enterprise</h4>
                        <div class="package-price">â‚¹9,999</div>
                        <p class="text-muted mb-4">Complete branding</p>
                        <ul class="list-unstyled mb-4">
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> 6 Initial Concepts</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Unlimited Revisions</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> All File Formats</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Complete Brand Kit</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Brand Guidelines PDF</li>
                            <li class="mb-3"><i class="fas fa-check text-success me-2"></i> Stationery Design</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Process Section -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> OUR PROCESS <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    How We Create Your <span class="gradient-text">Perfect Logo</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="process-step">
                        <div class="step-number">1</div>
                        <h5>Discovery</h5>
                        <p class="text-muted">Understand your brand, target audience, and design preferences.</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="process-step">
                        <div class="step-number">2</div>
                        <h5>Concepts</h5>
                        <p class="text-muted">Create multiple unique logo concepts based on your requirements.</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="process-step">
                        <div class="step-number">3</div>
                        <h5>Refinement</h5>
                        <p class="text-muted">Refine the chosen concept with your feedback until perfect.</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="process-step">
                        <div class="step-number">4</div>
                        <h5>Delivery</h5>
                        <p class="text-muted">Deliver final files in all formats with brand guidelines.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Industries Section -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> INDUSTRIES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Logo Design for <span class="gradient-text">Every Industry</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="100">
                    <div class="logo-card py-4">
                        <i class="fas fa-utensils fa-2x mb-2" style="color: #8b5cf6;"></i>
                        <h6 class="mb-0">Restaurant</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="150">
                    <div class="logo-card py-4">
                        <i class="fas fa-hospital fa-2x mb-2" style="color: #8b5cf6;"></i>
                        <h6 class="mb-0">Healthcare</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="200">
                    <div class="logo-card py-4">
                        <i class="fas fa-graduation-cap fa-2x mb-2" style="color: #8b5cf6;"></i>
                        <h6 class="mb-0">Education</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="250">
                    <div class="logo-card py-4">
                        <i class="fas fa-building fa-2x mb-2" style="color: #8b5cf6;"></i>
                        <h6 class="mb-0">Real Estate</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="300">
                    <div class="logo-card py-4">
                        <i class="fas fa-laptop fa-2x mb-2" style="color: #8b5cf6;"></i>
                        <h6 class="mb-0">Technology</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="350">
                    <div class="logo-card py-4">
                        <i class="fas fa-shopping-bag fa-2x mb-2" style="color: #8b5cf6;"></i>
                        <h6 class="mb-0">E-commerce</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'Logo Design';
    include '../includes/service-areas.php'; 
    ?>

    <!-- CTA Section -->
    <section class="cta-section" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa);">
        <div class="container">
            <div class="cta-content text-center" data-aos="zoom-in" data-aos-duration="1000">
                <h2 class="text-white mb-4">Ready to Create Your Iconic Brand Identity?</h2>
                <p class="text-white opacity-90 mb-4">Get a stunning logo that represents your business perfectly. Free consultation available!</p>
                <div class="d-flex gap-3 justify-content-center flex-wrap">
                    <a href="../contact" class="btn btn-light btn-lg px-5">
                        <i class="fas fa-paper-plane me-2"></i> Get Free Quote
                    </a>
                    <a href="tel:+91-7015969967" class="btn btn-outline-light btn-lg px-5">
                        <i class="fas fa-phone-alt me-2"></i> +91-7015969967
                    </a>
                </div>
            </div>
        </div>
    </section>

    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>


