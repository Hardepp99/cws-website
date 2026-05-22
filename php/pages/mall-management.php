<?php
$basePath = '';  // IMPORTANT: Use '../' for service pages
$currentPage = 'services';
$pageTitle = 'Mall Management Software in Chandigarh | Shopping Mall ERP | Starting â‚¹49,999 | Creative Web Solutions';
$pageDescription = 'Best mall management software in Chandigarh, Mohali. Tenant management, rent billing, parking, foot traffic analytics. Starting â‚¹49,999. Call +91-7015969967';
$pageKeywords = 'mall management software Chandigarh, shopping mall ERP Mohali, tenant management, rent billing software, mall parking system, Tricity, Punjab';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include __DIR__ . '/../includes/head.php'; ?>
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>

    <style>
        .service-hero {
            background: linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%);
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
        .mall-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(180, 83, 9, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .mall-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #b45309, #f59e0b);
        }
        .mall-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(180, 83, 9, 0.2);
        }
        .mall-card .icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, rgba(180, 83, 9, 0.1), rgba(245, 158, 11, 0.1));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #b45309;
            margin-bottom: 1.5rem;
        }
        .price-badge {
            background: linear-gradient(135deg, #b45309, #f59e0b);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-weight: 700;
            display: inline-block;
        }
        .package-card {
            background: white;
            border-radius: 25px;
            padding: 2.5rem;
            box-shadow: 0 15px 50px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
            height: 100%;
            text-align: center;
        }
        .package-card.featured {
            border: 3px solid #b45309;
            transform: scale(1.05);
        }
        .package-card.featured::before {
            content: 'POPULAR';
            position: absolute;
            top: 20px;
            right: -35px;
            background: linear-gradient(135deg, #b45309, #f59e0b);
            color: white;
            padding: 5px 40px;
            font-size: 0.75rem;
            font-weight: 700;
            transform: rotate(45deg);
        }
        .package-price {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #b45309, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .feature-list li {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
            text-align: left;
        }
        .feature-list li i {
            color: #10b981;
            font-size: 1.25rem;
        }
        .mall-preview {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
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
                        <i class="fas fa-tag me-2"></i> Starting @ â‚¹49,999
                    </span>
                    <h1 class="display-4 text-white fw-bold mb-4">
                        Mall Management <span style="color: #fef3c7;">Software</span>
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Complete mall management solution for shopping malls & commercial complexes. Tenant management, rent billing, parking system, foot traffic analytics, and facilities management. Best mall software in Chandigarh, Mohali & Tricity.
                    </p>
                    <div class="d-flex gap-3 flex-wrap">
                        <a href="../contact" class="btn btn-light btn-lg px-4">
                            <i class="fas fa-rocket me-2"></i> Get Started
                        </a>
                        <a href="tel:+91-7015969967" class="btn btn-outline-light btn-lg px-4">
                            <i class="fas fa-phone-alt me-2"></i> Free Demo
                        </a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="mall-preview">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0 fw-bold"><i class="fas fa-store me-2" style="color:#b45309;"></i>Mall Dashboard</h5>
                            <span class="badge bg-success">Live</span>
                        </div>
                        <div class="row g-3 mb-3">
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="mb-0" style="color:#b45309;">125</h4>
                                    <small class="text-muted">Total Shops</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-success mb-0">â‚¹45L</h4>
                                    <small class="text-muted">Monthly Rent</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-primary mb-0">2,450</h4>
                                    <small class="text-muted">Daily Footfall</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-warning mb-0">96%</h4>
                                    <small class="text-muted">Occupancy</small>
                                </div>
                            </div>
                        </div>
                        <div class="progress mb-2" style="height: 8px;">
                            <div class="progress-bar" style="width: 92%; background: linear-gradient(90deg, #b45309, #f59e0b);"></div>
                        </div>
                        <small class="text-muted">Rent Collection: 92% this month</small>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mall Features -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> MALL MODULES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Complete <span class="gradient-text">Mall Management</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-store"></i>
                        </div>
                        <h4>Tenant Management</h4>
                        <p>Shop allotment, tenant database, lease agreements, document management, and tenant communication portal.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-file-invoice-dollar"></i>
                        </div>
                        <h4>Rent & Billing</h4>
                        <p>Automated rent calculation, CAM charges, utility billing, GST invoicing, and payment tracking.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-parking"></i>
                        </div>
                        <h4>Parking Management</h4>
                        <p>Parking tickets, monthly passes, slot availability, vehicle tracking, and revenue reports.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4>Visitor Analytics</h4>
                        <p>Foot traffic counting, heat maps, peak hours analysis, visitor demographics, and trend reports.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <h4>Facility Management</h4>
                        <p>Maintenance requests, housekeeping schedule, AMC tracking, equipment maintenance, and vendor management.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h4>Security Management</h4>
                        <p>Guard duty roster, incident reporting, CCTV integration, access control, and emergency protocols.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="700">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <h4>Energy Management</h4>
                        <p>Power consumption tracking, sub-metering, energy audits, and cost allocation to tenants.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="800">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-bullhorn"></i>
                        </div>
                        <h4>Marketing & Events</h4>
                        <p>Event management, promotional campaigns, digital signage control, and tenant promotions.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="900">
                    <div class="mall-card">
                        <div class="icon">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <h4>Reports & Analytics</h4>
                        <p>Revenue reports, occupancy analytics, expense tracking, and management dashboards.</p>
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
                    <span class="dot"></span> PRICING <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Mall Software <span class="gradient-text">Packages</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Basic</h4>
                        <div class="package-price">â‚¹49,999</div>
                        <p class="text-muted mb-4">One-time / Up to 50 Shops</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> Tenant Management</li>
                            <li><i class="fas fa-check-circle"></i> Rent Billing</li>
                            <li><i class="fas fa-check-circle"></i> Payment Tracking</li>
                            <li><i class="fas fa-check-circle"></i> Basic Reports</li>
                            <li><i class="fas fa-check-circle"></i> 1 Year Support</li>
                            <li class="text-muted"><i class="fas fa-times-circle text-muted"></i> Parking Module</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="package-card featured">
                        <h4 class="text-muted mb-3">Professional</h4>
                        <div class="package-price">â‚¹99,999</div>
                        <p class="text-muted mb-4">One-time / Up to 150 Shops</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Basic Features</li>
                            <li><i class="fas fa-check-circle"></i> Parking Management</li>
                            <li><i class="fas fa-check-circle"></i> Facility Management</li>
                            <li><i class="fas fa-check-circle"></i> Visitor Analytics</li>
                            <li><i class="fas fa-check-circle"></i> Mobile App</li>
                            <li><i class="fas fa-check-circle"></i> Email/SMS Alerts</li>
                        </ul>
                        <a href="../contact" class="btn btn-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Enterprise</h4>
                        <div class="package-price">â‚¹1,99,999</div>
                        <p class="text-muted mb-4">One-time / Unlimited</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Pro Features</li>
                            <li><i class="fas fa-check-circle"></i> Multi-Property</li>
                            <li><i class="fas fa-check-circle"></i> Security Module</li>
                            <li><i class="fas fa-check-circle"></i> Energy Management</li>
                            <li><i class="fas fa-check-circle"></i> API Integration</li>
                            <li><i class="fas fa-check-circle"></i> Source Code</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Target Clients -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> IDEAL FOR <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Perfect for <span class="gradient-text">Commercial Spaces</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="100">
                    <div class="mall-card text-center py-4">
                        <i class="fas fa-shopping-bag fa-2x mb-2" style="color: #b45309;"></i>
                        <h6 class="mb-0">Shopping Malls</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="150">
                    <div class="mall-card text-center py-4">
                        <i class="fas fa-building fa-2x mb-2" style="color: #b45309;"></i>
                        <h6 class="mb-0">Commercial Complex</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="200">
                    <div class="mall-card text-center py-4">
                        <i class="fas fa-hotel fa-2x mb-2" style="color: #b45309;"></i>
                        <h6 class="mb-0">Business Centers</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="250">
                    <div class="mall-card text-center py-4">
                        <i class="fas fa-store-alt fa-2x mb-2" style="color: #b45309;"></i>
                        <h6 class="mb-0">Retail Chains</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'Mall Management Software';
    include '../includes/service-areas.php'; 
    ?>

    <!-- CTA Section -->
    <section class="cta-section" style="background: linear-gradient(135deg, #b45309, #f59e0b);">
        <div class="container">
            <div class="cta-content text-center" data-aos="zoom-in" data-aos-duration="1000">
                <h2 class="text-white mb-4">Ready to Streamline Your Mall Operations?</h2>
                <p class="text-white opacity-90 mb-4">Get a free demo of our mall management software!</p>
                <div class="d-flex gap-3 justify-content-center flex-wrap">
                    <a href="../contact" class="btn btn-light btn-lg px-5">
                        <i class="fas fa-paper-plane me-2"></i> Request Demo
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


