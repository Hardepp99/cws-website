<?php
$basePath = '';  // IMPORTANT: Use '../' for service pages
$currentPage = 'services';
$pageTitle = 'GST Billing Software in Chandigarh, Mohali | GST Return Filing Software | Creative Web Solutions';
$pageDescription = 'Best GST billing software in Chandigarh, Mohali, Zirakpur & Patiala. GST return filing, e-invoicing, e-way bill generation. Starting â‚¹4,999. Call +91-7015969967';
$pageKeywords = 'GST software Chandigarh, GST billing software Mohali, GST return filing software, e-invoicing software, e-way bill software, GSTR-1, GSTR-3B, GST software Tricity, Zirakpur, Patiala';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include __DIR__ . '/../includes/head.php'; ?>
</head>
    
    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "GST Billing Software",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Windows, Web",
        "offers": {
            "@type": "Offer",
            "price": "4999",
            "priceCurrency": "INR"
        },
        "provider": {
            "@type": "Organization",
            "name": "Creative Web Solutions",
            "telephone": "+91-7015969967",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Chandigarh",
                "addressRegion": "Punjab",
                "addressCountry": "IN"
            }
        }
    }
    </script>
    
    <style>
        .service-hero {
            background: linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%);
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
        .gst-icon-box {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #ea580c, #f97316);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            margin-bottom: 1.5rem;
            box-shadow: 0 10px 30px rgba(234, 88, 12, 0.3);
        }
        .gst-feature-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(234, 88, 12, 0.1);
            transition: all 0.3s ease;
        }
        .gst-feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(234, 88, 12, 0.15);
        }
        .gst-feature-card .icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, rgba(234, 88, 12, 0.1), rgba(249, 115, 22, 0.1));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: #ea580c;
            margin-bottom: 1rem;
        }
        .compliance-badge {
            background: linear-gradient(135deg, #ea580c, #f97316);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .gstr-card {
            background: white;
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        .gstr-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(234, 88, 12, 0.2);
        }
        .gstr-card h4 {
            color: #ea580c;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .price-highlight {
            background: linear-gradient(135deg, #ea580c, #f97316);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 2.5rem;
            font-weight: 800;
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
                    <span class="compliance-badge mb-3">
                        <i class="fas fa-check-circle"></i> 100% GST Compliant
                    </span>
                    <h1 class="display-4 text-white fw-bold mb-4">
                        GST Billing & <span style="color: #fef3c7;">Compliance Software</span>
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Complete GST solution with e-invoicing, e-way bill, GSTR filing, and automated compliance. Best GST software in Chandigarh, Mohali, Zirakpur & Patiala.
                    </p>
                    <div class="d-flex gap-3 flex-wrap">
                        <a href="../contact" class="btn btn-light btn-lg px-4">
                            <i class="fas fa-rocket me-2"></i> Get Started @ â‚¹4,999
                        </a>
                        <a href="tel:+91-7015969967" class="btn btn-outline-light btn-lg px-4">
                            <i class="fas fa-phone-alt me-2"></i> Free Demo
                        </a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="text-center">
                        <div class="gst-preview-card bg-white rounded-4 p-4 shadow-lg">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="mb-0 fw-bold text-dark">GST Invoice</h5>
                                <span class="badge bg-success">Generated</span>
                            </div>
                            <div class="invoice-preview bg-light rounded-3 p-3 mb-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <small class="text-muted">GSTIN:</small>
                                    <small class="fw-bold">03XXXXX1234X1ZX</small>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <small class="text-muted">Invoice No:</small>
                                    <small class="fw-bold">INV-2026-001234</small>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <small class="text-muted">Taxable Amount:</small>
                                    <small class="fw-bold">â‚¹10,000.00</small>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <small class="text-muted">CGST (9%):</small>
                                    <small class="fw-bold text-success">â‚¹900.00</small>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <small class="text-muted">SGST (9%):</small>
                                    <small class="fw-bold text-success">â‚¹900.00</small>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-between">
                                    <strong>Total:</strong>
                                    <strong class="text-primary">â‚¹11,800.00</strong>
                                </div>
                            </div>
                            <div class="d-flex gap-2">
                                <span class="badge bg-primary"><i class="fas fa-file-pdf me-1"></i> PDF</span>
                                <span class="badge bg-warning text-dark"><i class="fas fa-qrcode me-1"></i> E-Invoice</span>
                                <span class="badge bg-info"><i class="fas fa-truck me-1"></i> E-Way Bill</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- GST Returns Section -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> GST RETURNS <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    All <span class="gradient-text">GSTR Filing</span> Supported
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-6 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="100">
                    <div class="gstr-card">
                        <h4>GSTR-1</h4>
                        <small class="text-muted">Sales Return</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="200">
                    <div class="gstr-card">
                        <h4>GSTR-2A</h4>
                        <small class="text-muted">Auto-drafted</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="300">
                    <div class="gstr-card">
                        <h4>GSTR-2B</h4>
                        <small class="text-muted">ITC Statement</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="400">
                    <div class="gstr-card">
                        <h4>GSTR-3B</h4>
                        <small class="text-muted">Monthly Return</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="500">
                    <div class="gstr-card">
                        <h4>GSTR-9</h4>
                        <small class="text-muted">Annual Return</small>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="600">
                    <div class="gstr-card">
                        <h4>GSTR-9C</h4>
                        <small class="text-muted">Reconciliation</small>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> KEY FEATURES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Complete GST <span class="gradient-text">Compliance Solution</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="gst-feature-card">
                        <div class="icon">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <h4>E-Invoicing (IRN)</h4>
                        <p>Generate IRN instantly with QR code. Auto-sync with GST portal. Supports all invoice types - B2B, B2C, Credit/Debit Notes.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="gst-feature-card">
                        <div class="icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <h4>E-Way Bill Generation</h4>
                        <p>Auto-generate e-way bills with invoice. Part-A & Part-B filling, vehicle updates, multi-vehicle support, and validity extension.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="gst-feature-card">
                        <div class="icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <h4>Auto Tax Calculation</h4>
                        <p>Automatic CGST, SGST, IGST calculation based on place of supply. HSN/SAC code wise tax rates. Reverse charge mechanism.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="gst-feature-card">
                        <div class="icon">
                            <i class="fas fa-sync-alt"></i>
                        </div>
                        <h4>ITC Reconciliation</h4>
                        <p>Match purchase invoices with GSTR-2A/2B. Identify mismatches, missing invoices, and maximize ITC claims.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="gst-feature-card">
                        <div class="icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <h4>Direct GSTN Integration</h4>
                        <p>File returns directly from software. Real-time GSTIN validation. Download returns and ledger from portal.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="gst-feature-card">
                        <div class="icon">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <h4>Reports & Analytics</h4>
                        <p>Tax liability reports, ITC summary, HSN-wise summary, party-wise reports, and export-ready formats for CA/Auditors.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> AFFORDABLE PRICING <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    GST Software <span class="gradient-text">Starting @ â‚¹4,999</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="gst-feature-card text-center">
                        <h4 class="text-muted mb-3">Basic</h4>
                        <div class="price-highlight">â‚¹4,999</div>
                        <p class="text-muted mb-4">Per Year</p>
                        <ul class="list-unstyled text-start mb-4">
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> GST Invoicing</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> GSTR-1 & 3B Filing</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Basic Reports</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Single User</li>
                            <li class="mb-2 text-muted"><i class="fas fa-times me-2"></i> E-Invoicing</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="gst-feature-card text-center" style="border: 2px solid #ea580c;">
                        <span class="badge bg-warning text-dark mb-3">Most Popular</span>
                        <h4 class="text-muted mb-3">Professional</h4>
                        <div class="price-highlight">â‚¹9,999</div>
                        <p class="text-muted mb-4">Per Year</p>
                        <ul class="list-unstyled text-start mb-4">
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> All Basic Features</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> E-Invoicing (IRN)</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> E-Way Bill</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> ITC Reconciliation</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> 3 Users</li>
                        </ul>
                        <a href="../contact" class="btn btn-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="gst-feature-card text-center">
                        <h4 class="text-muted mb-3">Enterprise</h4>
                        <div class="price-highlight">â‚¹19,999</div>
                        <p class="text-muted mb-4">Per Year</p>
                        <ul class="list-unstyled text-start mb-4">
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> All Pro Features</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Multi-Branch</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> API Integration</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Unlimited Users</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Priority Support</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'GST Software';
    include '../includes/service-areas.php'; 
    ?>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-content text-center" data-aos="zoom-in" data-aos-duration="1000">
                <h2 class="text-white mb-4">Ready to Simplify Your GST Compliance?</h2>
                <p class="text-white opacity-90 mb-4">Get free demo of our GST software. Expert support & training included.</p>
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


