<?php
$basePath = '';  // IMPORTANT: Use '../' for service pages
$currentPage = 'services';
$pageTitle = 'School Management Software in Chandigarh | School ERP | Starting â‚¹29,999 | Creative Web Solutions';
$pageDescription = 'Best school management software in Chandigarh, Mohali. Student management, fees, attendance, exams, transport. Starting â‚¹29,999. Call +91-7015969967';
$pageKeywords = 'school management software Chandigarh, school ERP Mohali, student management system, fees management, attendance software, Tricity, Punjab';
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
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
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
        .school-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(30, 64, 175, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .school-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #1e40af, #60a5fa);
        }
        .school-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(30, 64, 175, 0.2);
        }
        .school-card .icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(96, 165, 250, 0.1));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #1e40af;
            margin-bottom: 1.5rem;
        }
        .price-badge {
            background: linear-gradient(135deg, #1e40af, #60a5fa);
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
            border: 3px solid #1e40af;
            transform: scale(1.05);
        }
        .package-card.featured::before {
            content: 'POPULAR';
            position: absolute;
            top: 20px;
            right: -35px;
            background: linear-gradient(135deg, #1e40af, #60a5fa);
            color: white;
            padding: 5px 40px;
            font-size: 0.75rem;
            font-weight: 700;
            transform: rotate(45deg);
        }
        .package-price {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #1e40af, #60a5fa);
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
        .school-preview {
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
                        <i class="fas fa-tag me-2"></i> Starting @ â‚¹29,999
                    </span>
                    <h1 class="display-4 text-white fw-bold mb-4">
                        School Management <span style="color: #bfdbfe;">System</span>
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Complete school ERP solution for student management, fees collection, attendance, exams, transport & more. Parent & teacher mobile apps included. Best school software in Chandigarh, Mohali & Tricity.
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
                    <div class="school-preview">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0 fw-bold"><i class="fas fa-school me-2" style="color:#1e40af;"></i>School Dashboard</h5>
                            <span class="badge bg-success">Live</span>
                        </div>
                        <div class="row g-3 mb-3">
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-primary mb-0">1,250</h4>
                                    <small class="text-muted">Total Students</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-success mb-0">â‚¹28.5L</h4>
                                    <small class="text-muted">Fees Collected</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-warning mb-0">92%</h4>
                                    <small class="text-muted">Attendance</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="bg-light rounded-3 p-3 text-center">
                                    <h4 class="text-info mb-0">85</h4>
                                    <small class="text-muted">Teachers</small>
                                </div>
                            </div>
                        </div>
                        <div class="progress mb-2" style="height: 8px;">
                            <div class="progress-bar" style="width: 78%; background: linear-gradient(90deg, #1e40af, #60a5fa);"></div>
                        </div>
                        <small class="text-muted">Fee Collection: 78% this term</small>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- School Features -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <span class="section-badge">
                    <span class="dot"></span> SCHOOL MODULES <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Complete <span class="gradient-text">School ERP</span>
                </h2>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <h4>Student Management</h4>
                        <p>Admissions, student database, class allocation, TC generation, alumni tracking, and student ID cards.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-rupee-sign"></i>
                        </div>
                        <h4>Fees Management</h4>
                        <p>Fee structure, online payments, fee receipts, due reminders, late fee calculation, and fee reports.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <h4>Attendance System</h4>
                        <p>Student & staff attendance, biometric integration, SMS alerts to parents, and attendance reports.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <h4>Exam & Results</h4>
                        <p>Exam scheduling, marks entry, report card generation, grade calculation, and result analysis.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <h4>Staff & HR</h4>
                        <p>Staff database, payroll, leave management, timetable, and performance tracking.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-bus"></i>
                        </div>
                        <h4>Transport Management</h4>
                        <p>Route management, vehicle tracking, driver details, transport fees, and GPS integration.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="700">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <h4>Library Management</h4>
                        <p>Book catalog, issue/return, fine calculation, member management, and library reports.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="800">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h4>Parent App</h4>
                        <p>Attendance alerts, fee payment, homework, announcements, and parent-teacher communication.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="900">
                    <div class="school-card">
                        <div class="icon">
                            <i class="fas fa-laptop"></i>
                        </div>
                        <h4>Online Classes</h4>
                        <p>Virtual classrooms, Zoom/Google Meet integration, recorded sessions, and online assignments.</p>
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
                    School ERP <span class="gradient-text">Packages</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Basic</h4>
                        <div class="package-price">â‚¹29,999</div>
                        <p class="text-muted mb-4">One-time / Up to 500 Students</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> Student Management</li>
                            <li><i class="fas fa-check-circle"></i> Fees Management</li>
                            <li><i class="fas fa-check-circle"></i> Attendance</li>
                            <li><i class="fas fa-check-circle"></i> Exams & Results</li>
                            <li><i class="fas fa-check-circle"></i> Basic Reports</li>
                            <li class="text-muted"><i class="fas fa-times-circle text-muted"></i> Mobile App</li>
                        </ul>
                        <a href="../contact" class="btn btn-outline-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="package-card featured">
                        <h4 class="text-muted mb-3">Professional</h4>
                        <div class="package-price">â‚¹59,999</div>
                        <p class="text-muted mb-4">One-time / Up to 1500 Students</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Basic Features</li>
                            <li><i class="fas fa-check-circle"></i> Parent Mobile App</li>
                            <li><i class="fas fa-check-circle"></i> Transport Module</li>
                            <li><i class="fas fa-check-circle"></i> Library Module</li>
                            <li><i class="fas fa-check-circle"></i> SMS/WhatsApp Alerts</li>
                            <li><i class="fas fa-check-circle"></i> Online Fee Payment</li>
                        </ul>
                        <a href="../contact" class="btn btn-primary w-100">Get Started</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="package-card">
                        <h4 class="text-muted mb-3">Enterprise</h4>
                        <div class="package-price">â‚¹99,999</div>
                        <p class="text-muted mb-4">One-time / Unlimited</p>
                        <ul class="list-unstyled feature-list mb-4">
                            <li><i class="fas fa-check-circle"></i> All Pro Features</li>
                            <li><i class="fas fa-check-circle"></i> Teacher App</li>
                            <li><i class="fas fa-check-circle"></i> Online Classes</li>
                            <li><i class="fas fa-check-circle"></i> HR & Payroll</li>
                            <li><i class="fas fa-check-circle"></i> Multi-Branch</li>
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
                    <span class="dot"></span> PERFECT FOR <span class="dot"></span>
                </span>
                <h2 class="section-title mt-3">
                    Ideal for <span class="gradient-text">Educational Institutions</span>
                </h2>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="100">
                    <div class="school-card text-center py-4">
                        <i class="fas fa-school fa-2x mb-2" style="color: #1e40af;"></i>
                        <h6 class="mb-0">Schools</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="150">
                    <div class="school-card text-center py-4">
                        <i class="fas fa-graduation-cap fa-2x mb-2" style="color: #1e40af;"></i>
                        <h6 class="mb-0">Colleges</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="200">
                    <div class="school-card text-center py-4">
                        <i class="fas fa-book-reader fa-2x mb-2" style="color: #1e40af;"></i>
                        <h6 class="mb-0">Coaching</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="250">
                    <div class="school-card text-center py-4">
                        <i class="fas fa-child fa-2x mb-2" style="color: #1e40af;"></i>
                        <h6 class="mb-0">Play Schools</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="300">
                    <div class="school-card text-center py-4">
                        <i class="fas fa-university fa-2x mb-2" style="color: #1e40af;"></i>
                        <h6 class="mb-0">Institutes</h6>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="350">
                    <div class="school-card text-center py-4">
                        <i class="fas fa-laptop-code fa-2x mb-2" style="color: #1e40af;"></i>
                        <h6 class="mb-0">Training</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'School Management System';
    include '../includes/service-areas.php'; 
    ?>

    <!-- CTA Section -->
    <section class="cta-section" style="background: linear-gradient(135deg, #1e40af, #60a5fa);">
        <div class="container">
            <div class="cta-content text-center" data-aos="zoom-in" data-aos-duration="1000">
                <h2 class="text-white mb-4">Ready to Digitize Your School?</h2>
                <p class="text-white opacity-90 mb-4">Get a free demo of our school management software!</p>
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


