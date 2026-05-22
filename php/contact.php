<?php
$basePath = '';
$currentPage = 'contact';
$pageTitle = 'Contact Us | Creative Web Solutions - Get in Touch for IT Services & Training';
$pageDescription = 'Contact Creative Web Solutions for web development, app development, digital marketing services, and IT training courses. Call +91-7015969967 or email info@cwsindia.online';
$pageKeywords = 'contact Creative Web Solutions, IT company contact, web development inquiry, training enrollment, digital marketing quote';
?>
<!DOCTYPE html>
<html lang="en">
<?php include 'includes/head.php'; ?>
<body>
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
                <h1>Contact <span class="gradient-text">Us</span></h1>
                <nav class="breadcrumb-nav">
                    <a href="index">Home</a>
                    <i class="fas fa-chevron-right"></i>
                    <span>Contact</span>
                </nav>
            </div>
        </div>
    </section>

    <!-- Contact Info Cards -->
    <section class="contact-info-section">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                    <div class="contact-info-card">
                        <div class="contact-info-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <h4>Visit Us</h4>
                        <p>#313, 3rd Floor, D & E Block<br>VIP Road, Zirakpur<br>Punjab 140603, India</p>
                        <a href="https://www.google.com/maps/place/VIP+Rd,+Zirakpur,+Punjab+140603" target="_blank" class="info-link">Get Directions <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                    <div class="contact-info-card">
                        <div class="contact-info-icon">
                            <i class="fas fa-phone-alt"></i>
                        </div>
                        <h4>Call Us</h4>
                        <p><a href="tel:+91-7015969967">+91-7015969967</a><br>Available for Call & WhatsApp<br>Mon - Sat: 9 AM - 7 PM</p>
                        <a href="tel:+91-7015969967" class="info-link">Call Now <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                    <div class="contact-info-card">
                        <div class="contact-info-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <h4>Email Us</h4>
                        <p><a href="mailto:hardeppsiingh@gmail.com">hardeppsiingh@gmail.com</a><br>We respond within 24 hours<br>Business inquiries welcome</p>
                        <a href="mailto:hardeppsiingh@gmail.com" class="info-link">Send Email <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section" style="background: var(--light-color);">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <div class="contact-form-content">
                        <span class="section-badge">
                            <span class="dot"></span> GET IN TOUCH <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            Let's Start a <span class="gradient-text">Conversation</span>
                        </h2>
                        <p class="section-description">
                            Have a project in mind or want to learn more about our services? Fill out the form and our team will get back to you within 24 hours.
                        </p>
                        
                        <div class="contact-features">
                            <div class="contact-feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="feature-text">
                                    <h5>Quick Response</h5>
                                    <p>We respond to all inquiries within 24 hours</p>
                                </div>
                            </div>
                            <div class="contact-feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-comments"></i>
                                </div>
                                <div class="feature-text">
                                    <h5>Free Consultation</h5>
                                    <p>Get expert advice on your project requirements</p>
                                </div>
                            </div>
                            <div class="contact-feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-handshake"></i>
                                </div>
                                <div class="feature-text">
                                    <h5>No Obligation Quote</h5>
                                    <p>Receive detailed proposal with no commitment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="contact-form-wrapper">
                        <form id="contactForm" class="contact-form" method="POST">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="name">Full Name *</label>
                                        <input type="text" class="form-control" id="name" name="name" placeholder="Enter your full name" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="email">Email Address *</label>
                                        <input type="email" class="form-control" id="email" name="email" placeholder="your@email.com" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="phone">Phone Number *</label>
                                        <input type="tel" class="form-control" id="phone" name="phone" placeholder="+91 XXXXX XXXXX" required pattern="[0-9]{10}" maxlength="10">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="subject">Subject *</label>
                                        <input type="text" class="form-control" id="subject" name="subject" placeholder="What is your inquiry about?" required>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="budget">Budget Range *</label>
                                        <select class="form-select" id="budget" name="budget" required>
                                            <option value="" selected disabled>Select your budget</option>
                                            <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                                            <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                                            <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                                            <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                                            <option value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</option>
                                            <option value="Above ₹2,00,000">Above ₹2,00,000</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="message">Your Message *</label>
                                        <textarea class="form-control" id="message" name="message" rows="5" placeholder="Tell us about your project or requirements..." required></textarea>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <button type="submit" class="btn btn-primary btn-submit" id="submitBtn">
                                        <span class="btn-text">Send Message</span>
                                        <span class="btn-spinner" style="display: none;">
                                            <i class="fas fa-circle-notch fa-spin"></i> Sending...
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                        <!-- Success Message -->
                        <div id="successMessage" class="success-message" style="display: none;">
                            <div class="success-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h3>Message Sent Successfully!</h3>
                            <p>Thank you for contacting us. We have received your message and will get back to you within 24 hours.</p>
                            <button class="btn btn-primary" onclick="resetForm()">Send Another Message</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Map Section -->
    <section class="map-section">
        <div class="container-fluid px-0">
            <div class="map-wrapper">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.0!2d76.8!3d30.64!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f9563b1a3a2e9%3A0x0!2sVIP%20Road%2C%20Zirakpur%2C%20Punjab%20140603!5e0!3m2!1sen!2sin!4v1738000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="450" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Creative Web Solutions Office - Zirakpur, Punjab">
                </iframe>
            </div>
        </div>
    </section>

    <!-- Business Hours Section -->
    <section class="hours-section">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8" data-aos="fade-up" data-aos-duration="1000">
                    <div class="hours-card">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <h3><i class="far fa-clock"></i> Business Hours</h3>
                                <ul class="hours-list">
                                    <li>
                                        <span class="day">Monday - Friday</span>
                                        <span class="time">9:00 AM - 7:00 PM</span>
                                    </li>
                                    <li>
                                        <span class="day">Saturday</span>
                                        <span class="time">10:00 AM - 5:00 PM</span>
                                    </li>
                                    <li>
                                        <span class="day">Sunday</span>
                                        <span class="time">Closed</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <div class="quick-contact">
                                    <h4>Need Immediate Help?</h4>
                                    <p>For urgent inquiries, reach out to us directly:</p>
                                    <a href="https://wa.me/917015969967" class="btn btn-whatsapp">
                                        <i class="fab fa-whatsapp"></i> Chat on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section" style="background: var(--light-color);">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center" data-aos="fade-up" data-aos-duration="1000">
                    <span class="section-badge">
                        <span class="dot"></span> FAQs <span class="dot"></span>
                    </span>
                    <h2 class="section-title">
                        Frequently Asked <span class="gradient-text">Questions</span>
                    </h2>
                </div>
            </div>
            <div class="row justify-content-center mt-5">
                <div class="col-lg-8">
                    <div class="accordion" id="faqAccordion">
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                    What services does Creative Web Solutions offer?
                                </button>
                            </h2>
                            <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Creative Web Solutions offers comprehensive IT services including web development (PHP, Laravel, React, Node.js), mobile app development, UI/UX design, digital marketing, SEO services, and professional IT training courses. We cater to businesses of all sizes across various industries.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                    How long does it take to complete a website project?
                                </button>
                            </h2>
                            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Project timelines vary based on complexity and requirements. A simple website typically takes 2-4 weeks, while complex web applications may take 2-4 months. We provide detailed timelines during our initial consultation after understanding your specific needs.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                    Do you offer training courses for beginners?
                                </button>
                            </h2>
                            <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Yes! Our training programs are designed for all skill levels, from complete beginners to experienced developers. We offer PHP, React.js, Node.js, Python, Django, and comprehensive Full Stack Development courses with hands-on projects and placement assistance.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                    What is your pricing structure?
                                </button>
                            </h2>
                            <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Our pricing is project-based and depends on the scope, complexity, and timeline. We offer competitive rates with flexible payment options. Contact us for a free consultation and customized quote tailored to your specific requirements.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                                    Do you provide ongoing support after project completion?
                                </button>
                            </h2>
                            <div id="faq5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Absolutely! We provide comprehensive post-launch support including bug fixes, updates, and maintenance. Our standard support packages range from 3 to 12 months, and we also offer extended support and retainer agreements for long-term partnerships.
                                </div>
                            </div>
                        </div>
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
                        <h2>Ready to Get Started?</h2>
                        <p>Let's discuss how we can help transform your business with innovative digital solutions.</p>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <a href="tel:+91-7015969967" class="btn btn-white">
                            <i class="fas fa-phone-alt"></i> Call Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>
    
    <!-- Additional Contact Page Styles -->
    <style>
        .contact-info-section {
            padding: 80px 0;
            margin-top: -60px;
            position: relative;
            z-index: 10;
        }
        .contact-info-card {
            background: var(--white);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: var(--shadow-xl);
            transition: var(--transition);
            height: 100%;
        }
        .contact-info-card:hover {
            transform: translateY(-10px);
        }
        .contact-info-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 25px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .contact-info-icon i {
            font-size: 32px;
            color: var(--white);
        }
        .contact-info-card h4 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 15px;
        }
        .contact-info-card p {
            color: var(--gray);
            margin-bottom: 20px;
            line-height: 1.8;
        }
        .contact-info-card p a {
            color: var(--gray);
            transition: var(--transition);
        }
        .contact-info-card p a:hover {
            color: var(--accent-color);
        }
        .info-link {
            color: var(--primary-color);
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
        }
        .info-link:hover {
            color: var(--accent-color);
            gap: 12px;
        }
        
        /* Contact Form Section */
        .contact-form-section {
            padding: 100px 0;
        }
        .contact-feature-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 25px;
        }
        .contact-feature-item .feature-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .contact-feature-item .feature-icon i {
            font-size: 20px;
            color: var(--white);
        }
        .contact-feature-item .feature-text h5 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        .contact-feature-item .feature-text p {
            font-size: 14px;
            color: var(--gray);
            margin: 0;
        }
        
        /* Contact Form */
        .contact-form-wrapper {
            background: var(--white);
            padding: 50px;
            border-radius: 20px;
            box-shadow: var(--shadow-xl);
        }
        .contact-form .form-group {
            margin-bottom: 20px;
        }
        .contact-form label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .contact-form .form-control,
        .contact-form .form-select {
            padding: 15px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 15px;
            transition: var(--transition);
        }
        .contact-form .form-control:focus,
        .contact-form .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1);
        }
        .contact-form textarea.form-control {
            resize: none;
        }
        .btn-submit {
            width: 100%;
            padding: 16px 30px;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        /* Map Section */
        .map-section {
            position: relative;
        }
        .map-wrapper {
            position: relative;
        }
        .map-wrapper iframe {
            display: block;
            filter: grayscale(0.3);
        }
        
        /* Hours Section */
        .hours-section {
            padding: 80px 0;
        }
        .hours-card {
            background: var(--white);
            padding: 50px;
            border-radius: 20px;
            box-shadow: var(--shadow-xl);
        }
        .hours-card h3 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .hours-card h3 i {
            color: var(--accent-color);
        }
        .hours-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .hours-list li {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px dashed #ddd;
        }
        .hours-list li:last-child {
            border-bottom: none;
        }
        .hours-list .day {
            font-weight: 600;
        }
        .hours-list .time {
            color: var(--accent-color);
            font-weight: 600;
        }
        .quick-contact {
            padding: 30px;
            background: var(--light-color);
            border-radius: 16px;
            text-align: center;
        }
        .quick-contact h4 {
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 10px;
        }
        .quick-contact p {
            color: var(--gray);
            margin-bottom: 20px;
        }
        .btn-whatsapp {
            background: #25d366;
            color: var(--white);
            padding: 14px 28px;
            border-radius: 50px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: var(--transition);
        }
        .btn-whatsapp:hover {
            background: #128c7e;
            color: var(--white);
            transform: translateY(-3px);
        }
        
        /* FAQ Section */
        .faq-section {
            padding: 100px 0;
        }
        .accordion-item {
            background: var(--white);
            border: none;
            border-radius: 16px !important;
            margin-bottom: 15px;
            box-shadow: var(--shadow-sm);
            overflow: hidden;
        }
        .accordion-button {
            padding: 25px 30px;
            font-size: 18px;
            font-weight: 700;
            font-family: var(--font-heading);
            background: var(--white);
            color: var(--dark);
            box-shadow: none;
        }
        .accordion-button:not(.collapsed) {
            background: var(--white);
            color: var(--primary-color);
        }
        .accordion-button::after {
            background-size: 18px;
        }
        .accordion-body {
            padding: 0 30px 25px;
            color: var(--gray);
            line-height: 1.8;
        }
        
        /* Footer Contact */
        .footer-contact {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .footer-contact li {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            align-items: flex-start;
        }
        .footer-contact li i {
            color: var(--accent-color);
            margin-top: 4px;
        }
        .footer-contact li span,
        .footer-contact li a {
            color: rgba(255, 255, 255, 0.7);
        }
        .footer-contact li a:hover {
            color: var(--accent-color);
        }
        
        /* Success Message Styles */
        .success-message {
            text-align: center;
            padding: 60px 40px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05));
            border-radius: 20px;
            animation: slideIn 0.5s ease-out;
        }
        .success-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleIn 0.5s ease-out;
        }
        .success-icon i {
            font-size: 50px;
            color: white;
        }
        .success-message h3 {
            color: var(--primary-color);
            font-size: 28px;
            margin-bottom: 15px;
            font-weight: 700;
        }
        .success-message p {
            color: var(--text-color);
            font-size: 16px;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        .btn-spinner {
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes scaleIn {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
            }
        }
        
        @media (max-width: 991px) {
            .contact-form-wrapper {
                margin-top: 50px;
                padding: 30px;
            }
            .quick-contact {
                margin-top: 30px;
            }
            .success-message {
                padding: 40px 20px;
            }
            .success-message h3 {
                font-size: 24px;
            }
        }
    </style>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        const formWrapper = form.parentElement;
        const successMessage = document.getElementById('successMessage');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-flex';

            // Get form data
            const formData = new FormData(form);

            try {
                // Send to backend
                const response = await fetch('process-contact.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Hide form and show success message
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                } else {
                    alert('Error: ' + (result.message || 'Something went wrong. Please try again.'));
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnSpinner.style.display = 'none';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to send message. Please try again or contact us directly.');
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnSpinner.style.display = 'none';
            }
        });
    });

    function resetForm() {
        const form = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');

        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
    }
    </script>
</body>
</html>
