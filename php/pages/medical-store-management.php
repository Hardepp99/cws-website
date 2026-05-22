<?php
$basePath = '';  // IMPORTANT: Use '../' for service pages
$currentPage = 'services';
$pageTitle = 'Medical Store Software in Chandigarh | Pharmacy Management | Starting â‚¹14,999 | Creative Web Solutions';
$pageDescription = 'Best medical store software in Chandigarh, Mohali. Pharmacy billing, inventory, expiry management, GST. Starting â‚¹14,999. Call +91-7015969967';
$pageKeywords = 'medical store software Chandigarh, pharmacy management software Mohali, chemist billing software, medicine inventory, expiry management, Tricity, Punjab';
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
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
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
        .med-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(220, 38, 38, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .med-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #dc2626, #f87171);
        }
        .med-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(220, 38, 38, 0.2);
        }
        .med-card .icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(248, 113, 113, 0.1));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #dc2626;
            margin-bottom: 1.5rem;
        }
        .price-badge {
            background: linear-gradient(135deg, #dc2626, #f87171);
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
            border: 3px solid #dc2626;
            transform: scale(1.05);
        }
        .package-card.featured::before {
            content: 'BEST SELLER';
            position: absolute;
            top: 20px;
            right: -35px;
            background: linear-gradient(135deg, #dc2626, #f87171);
            color: white;
            padding: 5px 40px;
            font-size: 0.75rem;
            font-weight: 700;
            transform: rotate(45deg);
        }
        .package-price {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #dc2626, #f87171);
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
        .med-preview {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        .expiry-alert {
            background: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 0.75rem 1rem;
            border-radius: 0 8px 8px 0;
            font-size: 0.85rem;
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
                        <i class="fas fa-tag me-2"></i> Starting @ â‚¹14,999
                    </span>
                    <h1 class="display-4 text-white fw-bold mb-4">
                        Medical Store <span style="color: #fecaca;">Software</span>
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Complete pharmacy management solution with fast billing, smart inventory, expiry management, and GST compliance. Perfect for medical stores, chemists & pharmacies. Best pharmacy software in Chandigarh, Mohali & Tricity.
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
                    <div class="med-preview">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0 fw-bold"><i class="fas fa-prescription-bottle-alt me-2" style="color:#dc2626;"></i>Quick Bill</h5>
                            <span class="badge bg-success">Live POS</span>
                        </div>
                        <div class="bg-light rounded-3 p-2 mb-3">
                            <table class="table table-sm mb-0">
                                <thead>
                                    <tr style="font-size:0.8rem;">
                                        <th>Medicine</th>
                                        <th>Qty</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody style="font-size:0.8rem;">
                                    <tr>
                                        <td>Paracetamol 500mg</td>
                                        <td>2</td>
                                        <td>â‚¹24</td>
                                    </tr>
                                    <tr>
                                        <td>Vitamin D3</td>
                                        <td>1</td>
                                        <td>â‚¹180</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <strong>Total:</strong>
                            <strong style="color:#dc2626;">â‚¹204</strong>
                        </div>
                        <div class="expiry-alert">
                            <i class="fas fa-exclamation-triangle me-2" style="color:#dc2626;"></i>
                            <strong>3 items</strong> expiring in next 30 days
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pharmacy Features -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> PHARMACY FEATURES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Complete <span class="gradient-text">Pharmacy Solution</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-cash-register"></i>
                        </div>
                        <h4>Fast Billing (POS)</h4>
                        <p>Lightning-fast medicine billing with barcode scanning, auto-complete, batch selection, and instant invoice printing.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-boxes"></i>
                        </div>
                        <h4>Inventory Management</h4>
                        <p>Track stock levels, batch numbers, purchase history, low stock alerts, and auto reorder suggestions.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-calendar-times"></i>
                        </div>
                        <h4>Expiry Management</h4>
                        <p>Expiry alerts (30/60/90 days), FEFO (First Expiry First Out), expiry returns tracking, and near-expiry reports.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-truck-loading"></i>
                        </div>
                        <h4>Purchase & Vendors</h4>
                        <p>Distributor management, purchase orders, GRN, purchase returns, and payment tracking.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-file-invoice-dollar"></i>
                        </div>
                        <h4>GST Compliance</h4>
                        <p>GST invoicing, HSN codes, GSTR-1/3B reports, e-invoicing ready, and tax-wise reports.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4>Customer Management</h4>
                        <p>Customer database, purchase history, credit management, loyalty points, and due reminders.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="700">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-barcode"></i>
                        </div>
                        <h4>Barcode Support</h4>
                        <p>Scan barcodes for quick billing, print custom barcodes, and barcode-based stocktaking.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="800">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <h4>Reports & Analytics</h4>
                        <p>Sales reports, profit analysis, stock valuation, fast/slow moving items, and daily summaries.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="900">
                    <div class="med-card">
                        <div class="icon">
                            <i class="fas fa-building"></i>
                        </div>
                        <h4>Multi-Store</h4>
                        <p>Manage multiple pharmacy branches, inter-store transfers, and consolidated reporting.</p>
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
                    Pharmacy Software <span class="gradient-text">Packages</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Basic</h4>
                        <div class="package-price">â‚¹14,999</div>
                        <p class="text-muted mb-4">One-time / Single Store</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> Fast Billing POS</li>
                            <li><i class="fas fa-check-circle"></i> Inventory Management</li>
                            <li><i class="fas fa-check-circle"></i> Expiry Alerts</li>
                            <li><i class="fas fa-check-circle"></i> GST Invoicing</li>
                            <li><i class="fas fa-check-circle"></i> Basic Reports</li>
                            <li class="text-muted"><i class="fas fa-times-circle text-muted"></i> Multi-Store</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="package-card featured">
                        <h4 class="text-muted mb-3">Professional</h4>
                        <div class="package-price">â‚¹24,999</div>
                        <p class="text-muted mb-4">One-time / 2 PCs</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Basic Features</li>
                            <li><i class="fas fa-check-circle"></i> Customer Management</li>
                            <li><i class="fas fa-check-circle"></i> Credit/Dues Tracking</li>
                            <li><i class="fas fa-check-circle"></i> Barcode Printing</li>
                            <li><i class="fas fa-check-circle"></i> Advanced Reports</li>
                            <li><i class="fas fa-check-circle"></i> WhatsApp Bills</li>
                        </ul>
                        <a href="../contact" class="btn btn-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Chain Store</h4>
                        <div class="package-price">â‚¹49,999</div>
                        <p class="text-muted mb-4">One-time / Unlimited Stores</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Pro Features</li>
                            <li><i class="fas fa-check-circle"></i> Multi-Store Support</li>
                            <li><i class="fas fa-check-circle"></i> Inter-Store Transfer</li>
                            <li><i class="fas fa-check-circle"></i> Centralized Inventory</li>
                            <li><i class="fas fa-check-circle"></i> Chain Reports</li>
                            <li><i class="fas fa-check-circle"></i> API Access</li>
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
                    <span class="dot"></span> PERFECT FOR <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Ideal for <span class="gradient-text">Pharmacy Business</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="100">
                    <div class="med-card text-center py-4">
                        <i class="fas fa-prescription-bottle-alt fa-2x mb-2" style="color: #dc2626;"></i>
                        <h6 class="mb-0">Medical Stores</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="150">
                    <div class="med-card text-center py-4">
                        <i class="fas fa-clinic-medical fa-2x mb-2" style="color: #dc2626;"></i>
                        <h6 class="mb-0">Pharmacy Chains</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="200">
                    <div class="med-card text-center py-4">
                        <i class="fas fa-hospital fa-2x mb-2" style="color: #dc2626;"></i>
                        <h6 class="mb-0">Hospital Pharmacy</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="250">
                    <div class="med-card text-center py-4">
                        <i class="fas fa-warehouse fa-2x mb-2" style="color: #dc2626;"></i>
                        <h6 class="mb-0">Distributors</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'Medical Store Management';
    include '../includes/service-areas.php'; 
    ?>

    <!-- CTA Section -->
    <section class="cta-section" style="background: linear-gradient(135deg, #dc2626, #f87171);">
        <div class="container">
            <div class="cta-content text-center" data-aos="zoom-in" data-aos-duration="1000">
                <h2 class="text-white mb-4">Ready to Digitize Your Pharmacy?</h2>
                <p class="text-white opacity-90 mb-4">Get a free demo of our medical store software. Fast billing guaranteed!</p>
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


