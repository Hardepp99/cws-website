<?php
// Base path variable - set before including this file
// For root pages: $basePath = '';
// For services pages: $basePath = '../';
if (!isset($basePath)) {
    $basePath = '';
}
if (!isset($currentPage)) {
    $currentPage = '';
}
?>
<!-- Preloader -->
<div class="preloader" id="preloader">
    <div class="loader">
        <img src="<?php echo $basePath; ?>assets/images/favicon.png" alt="Creative Web Solutions website developer logo in Chandigarh, Zirakpur, India" class="loader-logo" decoding="async" fetchpriority="high">
        <div class="loader-inner"></div>
    </div>
</div>

<script>
// Immediate preloader hide fallback
(function() {
    var preloader = document.getElementById('preloader');
    function hidePreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    }
    // Hide on page load
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }
    // Guaranteed fallback after 1 second
    setTimeout(hidePreloader, 1000);
})();
</script>

<!-- Topbar -->
<div class="topbar" id="topbar">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6 col-md-6 col-6">
                <div class="topbar-left">
                    <a href="tel:+91-7015969967" class="topbar-link">
                        <i class="fas fa-phone-alt"></i>
                        <span>Call: +91-7015969967</span>
                    </a>
                    <a href="mailto:info@cwsindia.online" class="topbar-link d-none d-md-inline-flex">
                        <i class="fas fa-envelope"></i>
                        <span>info@cwsindia.online</span>
                    </a>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-6">
                <div class="topbar-right">
                    <div class="social-links">
                        <a href="https://www.facebook.com/profile.php?id=61565017048983" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.linkedin.com/company/creative-websolutions/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="https://www.instagram.com/creativeweb_solutions?igsh=ZHFvZTJlZmIyaHdx" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Header / Navbar -->
<header class="header" id="header">
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <!-- Logo -->
            <a class="navbar-brand" href="<?php echo $basePath; ?>">
                <img src="<?php echo $basePath; ?>assets/images/logo.png" alt="Creative Web Solutions website developer logo in Chandigarh, Zirakpur, India" class="logo-img" decoding="async" fetchpriority="high">
                <img src="<?php echo $basePath; ?>assets/images/logo-white.png" alt="Creative Web Solutions white logo for website developer in Chandigarh, Zirakpur, India" class="logo-img-white" decoding="async" fetchpriority="high">
            </a>

            <!-- Mobile Toggle -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="toggler-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>

            <!-- Navigation Menu -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link<?php echo ($currentPage == 'home') ? ' active' : ''; ?>" href="<?php echo $basePath; ?>index">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle<?php echo ($currentPage == 'about') ? ' active' : ''; ?>" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                            About
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>about">About Us</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>about#team">Our Team</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>about#careers">Careers</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle<?php echo ($currentPage == 'services') ? ' active' : ''; ?>" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                            Services
                        </a>
                        <ul class="dropdown-menu mega-dropdown">
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>website-development-zirakpur"><i class="fas fa-globe me-2"></i>Website Development</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>web-application"><i class="fas fa-window-restore me-2"></i>Web Application</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>mobile-app-development-zirakpur"><i class="fas fa-mobile-alt me-2"></i>Mobile App Development</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>desktop-application"><i class="fas fa-desktop me-2"></i>Desktop Application</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>custom-software-development-zirakpur"><i class="fas fa-laptop-code me-2"></i>Custom Software</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>blockchain-development-zirakpur"><i class="fas fa-cubes me-2"></i>Blockchain Development</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>smart-contract-development-zirakpur"><i class="fas fa-file-contract me-2"></i>Smart Contract Development</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>exchange-listing"><i class="fas fa-exchange-alt me-2"></i>Exchange Listing</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>crm-development-zirakpur"><i class="fas fa-users-cog me-2"></i>CRM Development</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>erp-hrm-software-zirakpur"><i class="fas fa-cogs me-2"></i>ERP HRM Software</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>gst-software"><i class="fas fa-file-invoice-dollar me-2"></i>GST Software</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>website-redesign"><i class="fas fa-sync-alt me-2"></i>Website Redesign</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>ecommerce-website-zirakpur"><i class="fas fa-shopping-cart me-2"></i>Ecommerce Website</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>ui-ux-design-zirakpur"><i class="fas fa-paint-brush me-2"></i>UI/UX Design</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>logo-design"><i class="fas fa-crown me-2"></i>Logo Design</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>graphic-designing-zirakpur"><i class="fas fa-palette me-2"></i>Graphic Designing</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>digital-marketing-zirakpur"><i class="fas fa-bullhorn me-2"></i>Digital Marketing</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle<?php echo ($currentPage == 'courses') ? ' active' : ''; ?>" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                            Courses & Training
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#php"><i class="fab fa-php me-2"></i>PHP & Laravel Development</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#react"><i class="fab fa-react me-2"></i>React & Node.js</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#python"><i class="fab fa-python me-2"></i>Python & Django</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#fullstack"><i class="fas fa-layer-group me-2"></i>Full Stack Development</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#digital-marketing"><i class="fas fa-bullhorn me-2"></i>Digital Marketing</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#web-design"><i class="fas fa-palette me-2"></i>Website Designing</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#uiux"><i class="fas fa-pencil-ruler me-2"></i>UI/UX Design</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#app-development"><i class="fas fa-mobile-alt me-2"></i>Mobile App Development</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#wordpress"><i class="fab fa-wordpress me-2"></i>WordPress Development</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>courses#career-counselling"><i class="fas fa-user-tie me-2"></i>Career Counselling (FREE)</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle<?php echo (in_array($currentPage, ['portfolio', 'blog'])) ? ' active' : ''; ?>" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                            Pages
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>portfolio"><i class="fas fa-briefcase me-2"></i>Portfolio</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>blog"><i class="fas fa-blog me-2"></i>Blog</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>about#team"><i class="fas fa-users me-2"></i>Our Team</a></li>
                            <li><a class="dropdown-item" href="<?php echo $basePath; ?>about#careers"><i class="fas fa-user-tie me-2"></i>Careers</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link<?php echo ($currentPage == 'contact') ? ' active' : ''; ?>" href="<?php echo $basePath; ?>contact">Contact</a>
                    </li>
                </ul>
                <a href="tel:+91-7015969967" class="btn-cta">
                    <i class="fas fa-phone-alt"></i>
                    <span>Call us: +91-7015969967</span>
                </a>
            </div>
        </div>
    </nav>
</header>

<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
