<?php
$basePath = '../';  // IMPORTANT: Use '../' for service pages
$currentPage = 'services';
$pageTitle = 'Custom Software Development in Chandigarh | Bespoke Solutions | Starting ₹49,999 | Creative Web Solutions';
$pageDescription = 'Custom software development in Chandigarh, Mohali. Tailored business solutions, web apps, desktop apps, automation. Starting ₹49,999. Call +91-7015969967';
$pageKeywords = 'custom software development Chandigarh, bespoke software Mohali, tailored solutions, business software, web application, desktop application, Tricity, Punjab';
?>
<!DOCTYPE html>
<html lang="en">
<?php include '../includes/head.php'; ?>
<body>
    <?php include '../includes/header.php'; ?>

    <style>
        .service-hero {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
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
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .custom-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(30, 58, 138, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .custom-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #1e3a8a, #3b82f6);
        }
        .custom-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(30, 58, 138, 0.2);
        }
        .custom-card .icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.1), rgba(59, 130, 246, 0.1));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #1e3a8a;
            margin-bottom: 1.5rem;
        }
        .price-badge {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-weight: 700;
            display: inline-block;
        }
        .process-step {
            text-align: center;
            padding: 2rem;
        }
        .process-step .step-number {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 auto 1rem;
        }
        .tech-badge {
            background: #f1f5f9;
            color: #1e3a8a;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0.25rem;
        }
        .custom-preview {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        .code-block {
            background: #1e293b;
            border-radius: 10px;
            padding: 1rem;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            color: #10b981;
            overflow: hidden;
        }
    </style>

    <!-- Service Hero -->
    <section class="service-hero">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <span class="price-badge mb-3">
                        <i class="fas fa-tag me-2"></i> Starting @ ₹49,999
                    </span>
                    <h1 class="display-4 text-white fw-bold mb-4">
                        Custom Software <span style="color: #93c5fd;">Development</span>
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Tailored software solutions built specifically for your unique business needs. From web applications to desktop software, we develop custom solutions that streamline your operations. Best custom software company in Chandigarh, Mohali & Tricity.
                    </p>
                    <div class="d-flex gap-3 flex-wrap">
                        <a href="../contact" class="btn btn-light btn-lg px-4">
                            <i class="fas fa-rocket me-2"></i> Get Started
                        </a>
                        <a href="tel:+91-7015969967" class="btn btn-outline-light btn-lg px-4">
                            <i class="fas fa-phone-alt me-2"></i> Free Consultation
                        </a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="custom-preview">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0 fw-bold"><i class="fas fa-code me-2" style="color:#1e3a8a;"></i>Your Solution</h5>
                            <span class="badge bg-success">Custom Built</span>
                        </div>
                        <div class="code-block mb-3">
                            <span style="color:#60a5fa;">// Your Custom Solution</span><br>
                            <span style="color:#f472b6;">function</span> <span style="color:#fbbf24;">buildBusiness</span>() {<br>
                            &nbsp;&nbsp;<span style="color:#a78bfa;">const</span> solution = <span style="color:#34d399;">tailored</span>();<br>
                            &nbsp;&nbsp;<span style="color:#f472b6;">return</span> <span style="color:#fbbf24;">success</span>;<br>
                            }
                        </div>
                        <div class="row g-2">
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-2 text-center">
                                    <h5 class="text-primary mb-0">100%</h5>
                                    <small class="text-muted" style="font-size:0.7rem;">Customized</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-2 text-center">
                                    <h5 class="text-success mb-0">Scalable</h5>
                                    <small class="text-muted" style="font-size:0.7rem;">Architecture</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- What We Build -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> OUR EXPERTISE <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    What We <span class="gradient-text">Build</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="custom-card">
                        <div class="icon">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h4>Web Applications</h4>
                        <p>Custom web apps, portals, dashboards, SaaS platforms, and cloud-based solutions using modern technologies.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="custom-card">
                        <div class="icon">
                            <i class="fas fa-desktop"></i>
                        </div>
                        <h4>Desktop Applications</h4>
                        <p>Windows desktop software, point-of-sale systems, inventory tools, and offline-capable business applications.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="custom-card">
                        <div class="icon">
                            <i class="fas fa-database"></i>
                        </div>
                        <h4>Database Solutions</h4>
                        <p>Custom database design, data migration, reporting tools, and business intelligence dashboards.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="custom-card">
                        <div class="icon">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <h4>Business Automation</h4>
                        <p>Workflow automation, document processing, email automation, and custom integrations to save time.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="custom-card">
                        <div class="icon">
                            <i class="fas fa-plug"></i>
                        </div>
                        <h4>API Development</h4>
                        <p>RESTful APIs, third-party integrations, payment gateways, and microservices architecture.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="custom-card">
                        <div class="icon">
                            <i class="fas fa-sync"></i>
                        </div>
                        <h4>Legacy Modernization</h4>
                        <p>Upgrade old systems, migrate to cloud, convert desktop to web, and modernize technology stack.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Development Process -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> OUR PROCESS <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Development <span class="gradient-text">Process</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-2 col-md-4 col-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="process-step">
                        <div class="step-number">1</div>
                        <h5>Discovery</h5>
                        <p class="text-muted small">Understanding your requirements</p>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="process-step">
                        <div class="step-number">2</div>
                        <h5>Planning</h5>
                        <p class="text-muted small">Architecture & timeline</p>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="process-step">
                        <div class="step-number">3</div>
                        <h5>Design</h5>
                        <p class="text-muted small">UI/UX mockups</p>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="process-step">
                        <div class="step-number">4</div>
                        <h5>Development</h5>
                        <p class="text-muted small">Agile coding</p>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="process-step">
                        <div class="step-number">5</div>
                        <h5>Testing</h5>
                        <p class="text-muted small">Quality assurance</p>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="process-step">
                        <div class="step-number">6</div>
                        <h5>Launch</h5>
                        <p class="text-muted small">Deployment & support</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Technologies -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> TECHNOLOGIES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Our Tech <span class="gradient-text">Stack</span>
                </h2>
            </div>
            <div class="row justify-content-center" data-aos="fade-up" data-aos-delay="200">
                <div class="col-lg-10">
                    <div class="text-center">
                        <span class="tech-badge"><i class="fab fa-php"></i> PHP/Laravel</span>
                        <span class="tech-badge"><i class="fab fa-node"></i> Node.js</span>
                        <span class="tech-badge"><i class="fab fa-python"></i> Python</span>
                        <span class="tech-badge"><i class="fab fa-react"></i> React</span>
                        <span class="tech-badge"><i class="fab fa-vuejs"></i> Vue.js</span>
                        <span class="tech-badge"><i class="fab fa-angular"></i> Angular</span>
                        <span class="tech-badge"><i class="fas fa-database"></i> MySQL</span>
                        <span class="tech-badge"><i class="fas fa-database"></i> PostgreSQL</span>
                        <span class="tech-badge"><i class="fas fa-database"></i> MongoDB</span>
                        <span class="tech-badge"><i class="fab fa-aws"></i> AWS</span>
                        <span class="tech-badge"><i class="fab fa-docker"></i> Docker</span>
                        <span class="tech-badge"><i class="fas fa-cog"></i> .NET</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Industries -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> INDUSTRIES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Industries We <span class="gradient-text">Serve</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="100">
                    <div class="custom-card text-center py-4">
                        <i class="fas fa-heartbeat fa-2x mb-2" style="color: #1e3a8a;"></i>
                        <h6 class="mb-0">Healthcare</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="150">
                    <div class="custom-card text-center py-4">
                        <i class="fas fa-graduation-cap fa-2x mb-2" style="color: #1e3a8a;"></i>
                        <h6 class="mb-0">Education</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="200">
                    <div class="custom-card text-center py-4">
                        <i class="fas fa-shopping-cart fa-2x mb-2" style="color: #1e3a8a;"></i>
                        <h6 class="mb-0">E-Commerce</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="250">
                    <div class="custom-card text-center py-4">
                        <i class="fas fa-industry fa-2x mb-2" style="color: #1e3a8a;"></i>
                        <h6 class="mb-0">Manufacturing</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="300">
                    <div class="custom-card text-center py-4">
                        <i class="fas fa-landmark fa-2x mb-2" style="color: #1e3a8a;"></i>
                        <h6 class="mb-0">Finance</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="350">
                    <div class="custom-card text-center py-4">
                        <i class="fas fa-truck fa-2x mb-2" style="color: #1e3a8a;"></i>
                        <h6 class="mb-0">Logistics</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> WHY US <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Why Choose <span class="gradient-text">Creative Web Solutions</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="custom-card text-center">
                        <div class="icon mx-auto">
                            <i class="fas fa-users-cog"></i>
                        </div>
                        <h5>Experienced Team</h5>
                        <p class="text-muted small">Skilled developers with 5+ years of experience</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="custom-card text-center">
                        <div class="icon mx-auto">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h5>On-Time Delivery</h5>
                        <p class="text-muted small">We respect deadlines and deliver as promised</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="custom-card text-center">
                        <div class="icon mx-auto">
                            <i class="fas fa-headset"></i>
                        </div>
                        <h5>Dedicated Support</h5>
                        <p class="text-muted small">Post-launch support and maintenance</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="custom-card text-center">
                        <div class="icon mx-auto">
                            <i class="fas fa-rupee-sign"></i>
                        </div>
                        <h5>Affordable Pricing</h5>
                        <p class="text-muted small">Competitive rates without compromising quality</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'Custom Software Development';
    include '../includes/service-areas.php'; 
    ?>

    <!-- CTA Section -->
    <section class="cta-section" style="background: linear-gradient(135deg, #1e3a8a, #3b82f6);">
        <div class="container">
            <div class="cta-content text-center" data-aos="zoom-in" data-aos-duration="1000">
                <h2 class="text-white mb-4">Have a Custom Software Idea?</h2>
                <p class="text-white opacity-90 mb-4">Let's discuss your requirements. Free consultation!</p>
                <div class="d-flex gap-3 justify-content-center flex-wrap">
                    <a href="../contact" class="btn btn-light btn-lg px-5">
                        <i class="fas fa-paper-plane me-2"></i> Get Quote
                    </a>
                    <a href="tel:+91-7015969967" class="btn btn-outline-light btn-lg px-5">
                        <i class="fas fa-phone-alt me-2"></i> +91-7015969967
                    </a>
                </div>
            </div>
        </div>
    </section>

    <?php include '../includes/footer.php'; ?>
</body>
</html>
