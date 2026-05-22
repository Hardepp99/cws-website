<?php
$basePath = '';  // IMPORTANT: Use '../' for service pages
$currentPage = 'services';
$pageTitle = 'Bank Management Software in Chandigarh | Co-operative Bank Software | Starting â‚¹99,999 | Creative Web Solutions';
$pageDescription = 'Best banking software in Chandigarh, Mohali. Co-operative bank, micro-finance, NBFC software with core banking, loan management. Starting â‚¹99,999. Call +91-7015969967';
$pageKeywords = 'bank management software Chandigarh, co-operative bank software Mohali, NBFC software, micro-finance software, core banking solution, loan management, Tricity, Punjab';
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
            background: linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%);
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
        .bank-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(6, 95, 70, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .bank-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #065f46, #10b981);
        }
        .bank-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(6, 95, 70, 0.2);
        }
        .bank-card .icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, rgba(6, 95, 70, 0.1), rgba(16, 185, 129, 0.1));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #065f46;
            margin-bottom: 1.5rem;
        }
        .price-badge {
            background: linear-gradient(135deg, #065f46, #10b981);
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
            border: 3px solid #065f46;
            transform: scale(1.05);
        }
        .package-card.featured::before {
            content: 'RECOMMENDED';
            position: absolute;
            top: 20px;
            right: -45px;
            background: linear-gradient(135deg, #065f46, #10b981);
            color: white;
            padding: 5px 50px;
            font-size: 0.7rem;
            font-weight: 700;
            transform: rotate(45deg);
        }
        .package-price {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #065f46, #10b981);
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
        .bank-preview {
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
                        <i class="fas fa-tag me-2"></i> Starting @ â‚¹99,999
                    </span>
                    <h1 class="display-4 text-white fw-bold mb-4">
                        Bank Management <span style="color: #d1fae5;">Software</span>
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Comprehensive banking software for co-operative banks, NBFCs, and micro-finance institutions. RBI compliant core banking, loan management, and account management. Best banking software in Chandigarh, Mohali & Tricity.
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
                    <div class="bank-preview">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0 fw-bold"><i class="fas fa-university me-2" style="color:#065f46;"></i>Core Banking</h5>
                            <span class="badge bg-success">Secure</span>
                        </div>
                        <div class="row g-3 mb-3">
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-success mb-0">â‚¹12.5 Cr</h4>
                                    <small class="text-muted">Total Deposits</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-primary mb-0">â‚¹8.2 Cr</h4>
                                    <small class="text-muted">Loan Portfolio</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-warning mb-0">5,420</h4>
                                    <small class="text-muted">Members</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-info mb-0">2.8%</h4>
                                    <small class="text-muted">NPA Ratio</small>
                                </div>
                            </div>
                        </div>
                        <div class="progress mb-2" style="height: 8px;">
                            <div class="progress-bar bg-success" style="width: 85%;"></div>
                        </div>
                        <small class="text-muted">Loan Recovery: 85% on track</small>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Bank Features -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> BANKING MODULES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Complete <span class="gradient-text">Banking Solution</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-piggy-bank"></i>
                        </div>
                        <h4>Savings Account</h4>
                        <p>Member savings accounts, interest calculation, passbook printing, statement generation, and balance tracking.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h4>Fixed Deposit (FD/RD)</h4>
                        <p>FD & RD management, auto-interest calculation, maturity alerts, TDS deduction, and renewal processing.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-hand-holding-usd"></i>
                        </div>
                        <h4>Loan Management</h4>
                        <p>All loan types - personal, gold, home, vehicle. EMI calculator, disbursement, recovery tracking, and NPA management.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4>Member Management</h4>
                        <p>KYC documentation, share capital, nominee details, membership fees, and member 360Â° view.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        <h4>Transaction Processing</h4>
                        <p>Cash deposits, withdrawals, fund transfers, cheque clearing, and multi-branch transactions.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-file-invoice-dollar"></i>
                        </div>
                        <h4>Accounting & Reports</h4>
                        <p>General ledger, trial balance, P&L, balance sheet, RBI returns, and statutory reports.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="700">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h4>Mobile & SMS Banking</h4>
                        <p>Mobile app for members, SMS alerts for transactions, balance inquiry, and mini statements.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="800">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h4>Security & Compliance</h4>
                        <p>Role-based access, audit trails, data encryption, RBI compliance, and backup management.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="900">
                    <div class="bank-card">
                        <div class="icon">
                            <i class="fas fa-building"></i>
                        </div>
                        <h4>Multi-Branch</h4>
                        <p>Centralized database, branch-wise reports, inter-branch transactions, and consolidated reporting.</p>
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
                    Banking Software <span class="gradient-text">Packages</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Basic CBS</h4>
                        <div class="package-price">â‚¹99,999</div>
                        <p class="text-muted mb-4">One-time / Single Branch</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> Savings Account</li>
                            <li><i class="fas fa-check-circle"></i> FD/RD Module</li>
                            <li><i class="fas fa-check-circle"></i> Basic Loans</li>
                            <li><i class="fas fa-check-circle"></i> Member Management</li>
                            <li><i class="fas fa-check-circle"></i> Basic Reports</li>
                            <li class="text-muted"><i class="fas fa-times-circle text-muted"></i> Mobile App</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="package-card featured">
                        <h4 class="text-muted mb-3">Professional CBS</h4>
                        <div class="package-price">â‚¹1,99,999</div>
                        <p class="text-muted mb-4">One-time / 5 Branches</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Basic Features</li>
                            <li><i class="fas fa-check-circle"></i> Advanced Loans</li>
                            <li><i class="fas fa-check-circle"></i> SMS Alerts</li>
                            <li><i class="fas fa-check-circle"></i> RBI Returns</li>
                            <li><i class="fas fa-check-circle"></i> Mobile App</li>
                            <li><i class="fas fa-check-circle"></i> Multi-branch</li>
                        </ul>
                        <a href="../contact" class="btn btn-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Enterprise CBS</h4>
                        <div class="package-price">â‚¹3,99,999</div>
                        <p class="text-muted mb-4">One-time / Unlimited</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Pro Features</li>
                            <li><i class="fas fa-check-circle"></i> Net Banking</li>
                            <li><i class="fas fa-check-circle"></i> IMPS/NEFT/RTGS</li>
                            <li><i class="fas fa-check-circle"></i> ATM Integration</li>
                            <li><i class="fas fa-check-circle"></i> API Access</li>
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
                    <span class="dot"></span> WHO WE SERVE <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Banking Software <span class="gradient-text">For</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="100">
                    <div class="bank-card text-center py-4">
                        <i class="fas fa-landmark fa-2x mb-2" style="color: #065f46;"></i>
                        <h6 class="mb-0">Co-operative Banks</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="150">
                    <div class="bank-card text-center py-4">
                        <i class="fas fa-hand-holding-usd fa-2x mb-2" style="color: #065f46;"></i>
                        <h6 class="mb-0">NBFCs</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="200">
                    <div class="bank-card text-center py-4">
                        <i class="fas fa-users fa-2x mb-2" style="color: #065f46;"></i>
                        <h6 class="mb-0">Credit Societies</h6>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="250">
                    <div class="bank-card text-center py-4">
                        <i class="fas fa-coins fa-2x mb-2" style="color: #065f46;"></i>
                        <h6 class="mb-0">Micro-Finance</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'Bank Management Software';
    include '../includes/service-areas.php'; 
    ?>

    <!-- CTA Section -->
    <section class="cta-section" style="background: linear-gradient(135deg, #065f46, #10b981);">
        <div class="container">
            <div class="cta-content text-center" data-aos="zoom-in" data-aos-duration="1000">
                <h2 class="text-white mb-4">Ready to Modernize Your Bank?</h2>
                <p class="text-white opacity-90 mb-4">Get a free demo of our core banking software. RBI compliant & secure!</p>
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


