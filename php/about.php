<?php
$basePath = '';
$currentPage = 'about';
$pageTitle = 'About Us | Creative Web Solutions - Leading IT Company in India';
$pageDescription = 'Learn about Creative Web Solutions - a leading web development company in India with 10+ years of experience. Meet our expert team and discover our mission to deliver innovative digital solutions.';
$pageKeywords = 'about Creative Web Solutions, IT company india, web development team, software development company, digital agency india';
?>
<!DOCTYPE html>
<html lang="en">
<?php include 'includes/head.php'; ?>
<body class="about-page">
    <?php include 'includes/header.php'; ?>

    <!-- Page Header -->
    <section class="page-header">
        <!-- Floating Shapes -->
        <div class="header-shape header-shape-1"></div>
        <div class="header-shape header-shape-2"></div>
        <div class="header-shape header-shape-3"></div>
        <div class="header-shape header-shape-4"></div>
        <div class="container">
            <div class="page-header-content">
                <h1>About Us</h1>
                <nav class="breadcrumb-nav">
                    <a href="index">Home</a>
                    <i class="fas fa-chevron-right"></i>
                    <span>About Us</span>
                </nav>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <div class="about-image">
                        <div class="image-grid">
                            <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400" alt="Website developer office environment in Chandigarh, Zirakpur, India" decoding="async" class="grid-img img-1" loading="lazy">
                            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400" alt="Website developer team collaboration in Chandigarh, Zirakpur, India" decoding="async" class="grid-img img-2" loading="lazy">
                            <div class="experience-badge">
                                <span class="years">10+</span>
                                <span class="text">Years Experience</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="about-content">
                        <span class="section-badge">
                            <span class="dot"></span> WHO WE ARE <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            Your Trusted Partner for <span class="gradient-text">Digital Success</span>
                        </h2>
                        <p class="section-description">
                            Founded in 2016, Creative Web Solutions has grown from a small startup to a leading IT solutions provider in India. We specialize in creating innovative digital experiences that help businesses transform and thrive in the modern digital landscape.
                        </p>
                        <p class="section-description">
                            Our team of expert developers, designers, and digital strategists work collaboratively to deliver solutions that not only meet but exceed client expectations. We believe in building long-term partnerships based on trust, transparency, and exceptional results.
                        </p>
                        <div class="about-features">
                            <div class="feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="feature-text">
                                    <h4>500+ Projects Delivered</h4>
                                    <p>Successfully completed projects across various industries</p>
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="feature-text">
                                    <h4>200+ Happy Clients</h4>
                                    <p>Trusted by businesses worldwide for digital solutions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mission & Vision Section -->
    <section class="mission-section" style="background: var(--light-color); padding: 100px 0;">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000">
                    <div class="service-card-light" style="height: 100%;">
                        <div class="service-icon">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <h3>Our Mission</h3>
                        <p>To empower businesses with innovative digital solutions that drive growth, enhance efficiency, and create lasting value. We are committed to delivering excellence in every project while fostering long-term partnerships with our clients.</p>
                        <p>We strive to stay at the forefront of technology, continuously learning and adapting to provide cutting-edge solutions that meet the evolving needs of our clients.</p>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                    <div class="service-card-light" style="height: 100%;">
                        <div class="service-icon">
                            <i class="fas fa-eye"></i>
                        </div>
                        <h3>Our Vision</h3>
                        <p>To become the most trusted and innovative IT solutions provider globally, recognized for our commitment to quality, creativity, and customer satisfaction.</p>
                        <p>We envision a future where every business, regardless of size, has access to world-class digital solutions that enable them to compete and succeed in the global marketplace.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="team-section" id="team">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center" data-aos="fade-up" data-aos-duration="1000">
                    <span class="section-badge">
                        <span class="dot"></span> OUR TEAM <span class="dot"></span>
                    </span>
                    <h2 class="section-title">
                        Meet Our <span class="gradient-text">Expert Team</span>
                    </h2>
                    <p class="section-subtitle">
                        Our talented professionals are the backbone of our success. Get to know the people behind Creative Web Solutions.
                    </p>
                </div>
            </div>
            <div class="row g-4 mt-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                    <div class="team-card">
                        <div class="team-image">
                            <img src="assets/images/PHP-Developer.jpeg" alt="PHP website developer in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="team-social">
                                <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                <a href="#"><i class="fab fa-twitter"></i></a>
                                <a href="#"><i class="fas fa-envelope"></i></a>
                            </div>
                        </div>
                        <div class="team-info">
                            <h4>Neha Kumari</h4>
                            <span>Developer</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                    <div class="team-card">
                        <div class="team-image">
                            <img src="assets/images/marketing.jpeg" alt="Digital marketing specialist in Zirakpur, Chandigarh, India" decoding="async" loading="lazy">
                            <div class="team-social">
                                <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                <a href="#"><i class="fab fa-twitter"></i></a>
                                <a href="#"><i class="fas fa-envelope"></i></a>
                            </div>
                        </div>
                        <div class="team-info">
                            <h4>Harpreet Kaur</h4>
                            <span>Marketing Manager</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                    <div class="team-card">
                        <div class="team-image">
                            <img src="assets/images/digital.jpg" alt="UI UX design head at website development company in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                            <div class="team-social">
                                <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                <a href="#"><i class="fab fa-twitter"></i></a>
                                <a href="#"><i class="fas fa-envelope"></i></a>
                            </div>
                        </div>
                        <div class="team-info">
                            <h4>Pooja Kumari</h4>
                            <span>Digital Marketing </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <span class="section-badge light">
                        <span class="dot"></span> WHY CHOOSE US <span class="dot"></span>
                    </span>
                    <h2 class="section-title text-white">
                        What Sets Us <span class="gradient-text">Apart</span>
                    </h2>
                    <div class="why-features">
                        <div class="why-item">
                            <div class="why-icon">
                                <i class="fas fa-award"></i>
                            </div>
                            <div class="why-content">
                                <h4>Industry Experience</h4>
                                <p>10+ years of delivering exceptional digital solutions</p>
                            </div>
                        </div>
                        <div class="why-item">
                            <div class="why-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="why-content">
                                <h4>Expert Team</h4>
                                <p>50+ skilled professionals across various domains</p>
                            </div>
                        </div>
                        <div class="why-item">
                            <div class="why-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="why-content">
                                <h4>On-Time Delivery</h4>
                                <p>98% projects delivered on or before deadline</p>
                            </div>
                        </div>
                        <div class="why-item">
                            <div class="why-icon">
                                <i class="fas fa-headset"></i>
                            </div>
                            <div class="why-content">
                                <h4>24/7 Support</h4>
                                <p>Round-the-clock assistance for all clients</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="why-image">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" alt="Website developer team working in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Careers Section -->
    <section class="careers-section" id="careers" style="background: var(--white);">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center" data-aos="fade-up" data-aos-duration="1000">
                    <span class="section-badge">
                        <span class="dot"></span> CAREERS <span class="dot"></span>
                    </span>
                    <h2 class="section-title">
                        Join Our <span class="gradient-text">Growing Team</span>
                    </h2>
                    <p class="section-subtitle">
                        We're always looking for talented individuals who share our passion for technology and innovation. Explore career opportunities at Creative Web Solutions.
                    </p>
                </div>
            </div>
            <div class="row g-4 mt-4">
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                    <div class="service-card">
                        <h3>Senior PHP Developer</h3>
                        <p><strong>Experience:</strong> 4-6 years | <strong>Location:</strong> Gurugram</p>
                        <p>Looking for experienced PHP developers with Laravel expertise to join our backend team.</p>
                        <a href="contact" class="service-link">Apply Now <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                    <div class="service-card">
                        <h3>React.js Developer</h3>
                        <p><strong>Experience:</strong> 2-4 years | <strong>Location:</strong> Remote</p>
                        <p>Join our frontend team to build amazing user interfaces using React and modern JS.</p>
                        <a href="contact" class="service-link">Apply Now <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                    <div class="service-card">
                        <h3>UI/UX Designer</h3>
                        <p><strong>Experience:</strong> 3-5 years | <strong>Location:</strong> Gurugram</p>
                        <p>Creative designers needed to craft beautiful and intuitive user experiences.</p>
                        <a href="contact" class="service-link">Apply Now <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                    <div class="service-card">
                        <h3>Digital Marketing Executive</h3>
                        <p><strong>Experience:</strong> 1-3 years | <strong>Location:</strong> Gurugram</p>
                        <p>Marketing professionals with SEO, PPC, and social media expertise.</p>
                        <a href="contact" class="service-link">Apply Now <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-wrapper" data-aos="zoom-in" data-aos-duration="1000">
                <div class="row align-items-center">
                    <div class="col-lg-8">
                        <h2>Ready to Work With Us?</h2>
                        <p>Let's discuss how we can help transform your business with innovative digital solutions.</p>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <a href="contact" class="btn btn-white">
                            Contact Us <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <!-- Additional Team Card Styles -->
    <style>
        .team-card {
            background: var(--white);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: var(--transition);
        }
        .team-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-xl);
        }
        .team-image {
            position: relative;
            overflow: hidden;
        }
        .team-image img {
            width: 100%;
            height: 280px;
            object-fit: cover;
            transition: var(--transition);
        }
        .team-card:hover .team-image img {
            transform: scale(1.1);
        }
        .team-social {
            position: absolute;
            bottom: -50px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 15px;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            transition: var(--transition);
        }
        .team-card:hover .team-social {
            bottom: 0;
        }
        .team-social a {
            width: 40px;
            height: 40px;
            background: var(--white);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            transition: var(--transition);
        }
        .team-social a:hover {
            background: var(--accent-color);
            color: var(--white);
        }
        .team-info {
            padding: 25px;
            text-align: center;
        }
        .team-info h4 {
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 5px;
        }
        .team-info span {
            font-size: 14px;
            color: var(--accent-color);
            font-weight: 600;
        }

        /* Careers Section Styles */
        .careers-section .service-card {
            background: var(--white);
            border: 2px solid rgba(30, 58, 138, 0.1);
            transition: var(--transition);
        }
        .careers-section .service-card:hover {
            border-color: var(--accent-color);
            transform: translateY(-5px);
        }
        .careers-section .service-card h3 {
            color: var(--primary-color);
            font-size: 22px;
            font-weight: 800;
            margin-bottom: 15px;
        }
        .careers-section .service-card p {
            color: var(--text-color);
            font-size: 15px;
            line-height: 1.7;
            margin-bottom: 12px;
        }
        .careers-section .service-card p strong {
            color: var(--primary-color);
            font-weight: 700;
        }
        .careers-section .service-link {
            color: var(--accent-color);
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
        }
        .careers-section .service-link:hover {
            color: var(--primary-color);
        }
        .careers-section .service-link i {
            transition: var(--transition);
        }
        .careers-section .service-link:hover i {
            transform: translateX(5px);
        }
    </style>
</body>
</html>
