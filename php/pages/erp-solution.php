<?php
$basePath = '../';  // IMPORTANT: Use '../' for service pages
$currentPage = 'services';
$pageTitle = 'ERP Software in Chandigarh, Mohali | Enterprise Resource Planning | Starting ₹49,999 | Creative Web Solutions';
$pageDescription = 'Best ERP software in Chandigarh, Mohali, Zirakpur. Complete enterprise resource planning with inventory, accounting, HR. Starting ₹49,999. Call +91-7015969967';
$pageKeywords = 'ERP software Chandigarh, ERP solution Mohali, enterprise resource planning, inventory management, accounting software, HR management, Tricity, Punjab';
?>
<!DOCTYPE html>
<html lang="en">
<?php include '../includes/head.php'; ?>
    
    <style>
        .service-hero {
            background: linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%);
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
        .erp-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(3, 105, 161, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .erp-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #0369a1, #0ea5e9);
        }
        .erp-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(3, 105, 161, 0.2);
        }
        .erp-card .icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, rgba(3, 105, 161, 0.1), rgba(14, 165, 233, 0.1));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #0369a1;
            margin-bottom: 1.5rem;
        }
        .price-badge {
            background: linear-gradient(135deg, #0369a1, #0ea5e9);
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
            border: 3px solid #0369a1;
            transform: scale(1.05);
        }
        .package-card.featured::before {
            content: 'POPULAR';
            position: absolute;
            top: 20px;
            right: -35px;
            background: linear-gradient(135deg, #0369a1, #0ea5e9);
            color: white;
            padding: 5px 40px;
            font-size: 0.75rem;
            font-weight: 700;
            transform: rotate(45deg);
        }
        .package-price {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #0369a1, #0ea5e9);
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
        .erp-preview {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        .module-flow {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .module-item {
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            font-weight: 600;
            color: #0369a1;
        }
        .module-arrow {
            color: #0ea5e9;
            font-size: 1.5rem;
        }
    </style>
<body>
    <?php include '../includes/header.php'; ?>

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
                        ERP Software <span style="color: #bae6fd;">Solution</span>
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Streamline your entire business operations with our comprehensive ERP solution. Integrate inventory, accounting, HR, manufacturing & sales in one powerful platform. Best ERP software in Chandigarh, Mohali & Tricity.
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
                    <div class="erp-preview">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0 fw-bold">ERP Dashboard</h5>
                            <span class="badge bg-success">Connected</span>
                        </div>
                        <div class="module-flow mb-3">
                            <div class="module-item"><i class="fas fa-boxes me-2"></i>Inventory</div>
                            <i class="fas fa-arrow-right module-arrow d-none d-md-block"></i>
                            <div class="module-item"><i class="fas fa-industry me-2"></i>Production</div>
                            <i class="fas fa-arrow-right module-arrow d-none d-md-block"></i>
                            <div class="module-item"><i class="fas fa-rupee-sign me-2"></i>Accounts</div>
                        </div>
                        <div class="row g-2">
                            <div class="col-4">
                                <div class="bg-light rounded-3 p-2 text-center">
                                    <h5 class="text-primary mb-0">1,250</h5>
                                    <small class="text-muted" style="font-size:0.7rem;">Products</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="bg-light rounded-3 p-2 text-center">
                                    <h5 class="text-success mb-0">₹45L</h5>
                                    <small class="text-muted" style="font-size:0.7rem;">Revenue</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="bg-light rounded-3 p-2 text-center">
                                    <h5 class="text-warning mb-0">85</h5>
                                    <small class="text-muted" style="font-size:0.7rem;">Employees</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ERP Modules -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> ERP MODULES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Integrated <span class="gradient-text">ERP Modules</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-boxes"></i>
                        </div>
                        <h4>Inventory Management</h4>
                        <p>Stock tracking, multiple warehouses, batch/serial management, low stock alerts, barcode/QR support, and real-time inventory updates.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <h4>Accounting & Finance</h4>
                        <p>Ledger, journal entries, P&L, balance sheet, GST filing, bank reconciliation, and multi-currency support.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-users-cog"></i>
                        </div>
                        <h4>HR & Payroll</h4>
                        <p>Employee database, attendance, leave management, payroll processing, PF/ESI compliance, and performance tracking.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <h4>Purchase Management</h4>
                        <p>Vendor management, purchase orders, quotation comparison, GRN, purchase returns, and vendor payment tracking.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-cash-register"></i>
                        </div>
                        <h4>Sales & Billing</h4>
                        <p>Quotations, sales orders, invoicing, GST billing, credit notes, e-invoicing, and sales analytics.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-industry"></i>
                        </div>
                        <h4>Manufacturing</h4>
                        <p>BOM management, work orders, production planning, quality control, and cost tracking for manufacturers.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="700">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <h4>Supply Chain</h4>
                        <p>Order fulfillment, shipping management, delivery tracking, and logistics optimization.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="800">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <h4>Business Intelligence</h4>
                        <p>Custom dashboards, KPI tracking, trend analysis, and data-driven decision making tools.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="900">
                    <div class="erp-card">
                        <div class="icon">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <h4>Asset Management</h4>
                        <p>Fixed asset tracking, depreciation, maintenance schedules, and asset lifecycle management.</p>
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
                    ERP Software <span class="gradient-text">Packages</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Basic ERP</h4>
                        <div class="package-price">₹49,999</div>
                        <p class="text-muted mb-4">One-time / 5 Users</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> Inventory Module</li>
                            <li><i class="fas fa-check-circle"></i> Purchase Module</li>
                            <li><i class="fas fa-check-circle"></i> Sales & Billing</li>
                            <li><i class="fas fa-check-circle"></i> Basic Accounting</li>
                            <li><i class="fas fa-check-circle"></i> 1 Year Support</li>
                            <li class="text-muted"><i class="fas fa-times-circle text-muted"></i> HR Module</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="package-card featured">
                        <h4 class="text-muted mb-3">Business ERP</h4>
                        <div class="package-price">₹99,999</div>
                        <p class="text-muted mb-4">One-time / 15 Users</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Basic Modules</li>
                            <li><i class="fas fa-check-circle"></i> HR & Payroll</li>
                            <li><i class="fas fa-check-circle"></i> GST Reports</li>
                            <li><i class="fas fa-check-circle"></i> Multi-branch</li>
                            <li><i class="fas fa-check-circle"></i> Mobile App</li>
                            <li><i class="fas fa-check-circle"></i> Email Alerts</li>
                        </ul>
                        <a href="../contact" class="btn btn-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Enterprise ERP</h4>
                        <div class="package-price">₹1,99,999</div>
                        <p class="text-muted mb-4">One-time / Unlimited Users</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Business Modules</li>
                            <li><i class="fas fa-check-circle"></i> Manufacturing</li>
                            <li><i class="fas fa-check-circle"></i> Custom Workflows</li>
                            <li><i class="fas fa-check-circle"></i> BI Dashboard</li>
                            <li><i class="fas fa-check-circle"></i> API Integration</li>
                            <li><i class="fas fa-check-circle"></i> Source Code</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Industries -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> INDUSTRIES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    ERP for <span class="gradient-text">Every Business</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="100">
                    <div class="erp-card text-center py-4">
                        <i class="fas fa-industry fa-2x mb-2" style="color: #0369a1;"></i>
                        <h6 class="mb-0">Manufacturing</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="150">
                    <div class="erp-card text-center py-4">
                        <i class="fas fa-store fa-2x mb-2" style="color: #0369a1;"></i>
                        <h6 class="mb-0">Retail</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="200">
                    <div class="erp-card text-center py-4">
                        <i class="fas fa-truck-loading fa-2x mb-2" style="color: #0369a1;"></i>
                        <h6 class="mb-0">Distribution</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="250">
                    <div class="erp-card text-center py-4">
                        <i class="fas fa-warehouse fa-2x mb-2" style="color: #0369a1;"></i>
                        <h6 class="mb-0">Wholesale</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="300">
                    <div class="erp-card text-center py-4">
                        <i class="fas fa-utensils fa-2x mb-2" style="color: #0369a1;"></i>
                        <h6 class="mb-0">Food & Bev</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="350">
                    <div class="erp-card text-center py-4">
                        <i class="fas fa-tshirt fa-2x mb-2" style="color: #0369a1;"></i>
                        <h6 class="mb-0">Textile</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'ERP Solution';
    include '../includes/service-areas.php'; 
    ?>

    <!-- CTA Section -->
    <section class="cta-section" style="background: linear-gradient(135deg, #0369a1, #0ea5e9);">
        <div class="container">
            <div class="cta-content text-center" data-aos="zoom-in" data-aos-duration="1000">
                <h2 class="text-white mb-4">Ready to Transform Your Business with ERP?</h2>
                <p class="text-white opacity-90 mb-4">Get a free consultation and demo of our ERP software!</p>
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

    <?php include '../includes/footer.php'; ?>
</body>
</html>
