<?php
// Base path variable - set before including this file
if (!isset($basePath)) {
    $basePath = '';
}
if (!isset($currentPage)) {
    $currentPage = '';
}
?>
<!-- Footer -->
<footer class="footer">
    <div class="footer-shape footer-shape-1"></div>
    <div class="footer-shape footer-shape-2"></div>
    <div class="footer-shape footer-shape-3"></div>

    <div class="footer-top">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4 col-md-6">
                    <div class="footer-widget">
                        <a href="<?php echo $basePath; ?>index" class="footer-logo">
                            <img src="<?php echo $basePath; ?>assets/images/logo.png" alt="Creative Web Solutions" class="footer-logo-img">
                        </a>
                        <p class="footer-desc">We are a leading web development company in India, providing innovative digital solutions and professional IT training to businesses worldwide.</p>
                        <div class="footer-address mt-3 mb-3">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>#313, 3rd Floor, D & E Block<br>VIP Road, Zirakpur<br>Punjab 140603, India</span>
                        </div>
                        <div class="footer-social">
                            <a href="https://www.facebook.com/profile.php?id=61565017048983" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://www.linkedin.com/company/creative-websolutions/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                            <a href="https://www.instagram.com/creativeweb_solutions?igsh=ZHFvZTJlZmIyaHdx" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>

                <div class="col-lg-2 col-md-6">
                    <div class="footer-widget">
                        <h4 class="footer-title">Quick Links</h4>
                        <ul class="footer-links">
                            <li><a href="<?php echo $basePath; ?>index">Home</a></li>
                            <li><a href="<?php echo $basePath; ?>about">About Us</a></li>
                            <li><a href="<?php echo $basePath; ?>services">Services</a></li>
                            <li><a href="<?php echo $basePath; ?>portfolio">Portfolio</a></li>
                            <li><a href="<?php echo $basePath; ?>blog">Blog</a></li>
                            <li><a href="<?php echo $basePath; ?>courses">Courses</a></li>
                            <li><a href="<?php echo $basePath; ?>contact">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="footer-widget">
                        <h4 class="footer-title">Our Services</h4>
                        <ul class="footer-links">
                            <li><a href="<?php echo $basePath; ?>website-development-zirakpur">Website Development</a></li>
                            <li><a href="<?php echo $basePath; ?>mobile-app-development-zirakpur">Mobile App Development</a></li>
                            <li><a href="<?php echo $basePath; ?>blockchain-development-zirakpur">Blockchain Development</a></li>
                            <li><a href="<?php echo $basePath; ?>ui-ux-design-zirakpur">UI/UX Design</a></li>
                            <li><a href="<?php echo $basePath; ?>digital-marketing-zirakpur">Digital Marketing</a></li>
                        </ul>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="footer-widget">
                        <h4 class="footer-title">Newsletter</h4>
                        <p class="footer-newsletter-text">Subscribe to get the latest updates, news, and offers.</p>
                        <form class="newsletter-form" action="#" method="POST">
                            <div class="input-group">
                                <input type="email" class="form-control" placeholder="Your email" required aria-label="Email">
                                <button class="btn" type="submit" aria-label="Subscribe">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                        <div class="footer-contact-info mt-4">
                            <a href="tel:+91-7015969967" class="footer-contact-link">
                                <i class="fas fa-phone-alt"></i> +91-7015969967
                            </a>
                            <a href="mailto:info@cwsindia.online" class="footer-contact-link">
                                <i class="fas fa-envelope"></i> info@cwsindia.online
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="footer-copyright">&copy; <?php echo date('Y'); ?> Creative Web Solutions. All Rights Reserved.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <ul class="footer-bottom-links">
                        <li><a href="<?php echo $basePath; ?>privacy-policy">Privacy Policy</a></li>
                        <li><a href="<?php echo $basePath; ?>terms-conditions">Terms & Conditions</a></li>
                        <li><a href="<?php echo $basePath; ?>contact">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</footer>

<!-- Back to Top Button -->
<a href="#" class="back-to-top" id="backToTop" aria-label="Back to top">
    <i class="fas fa-arrow-up"></i>
</a>

<!-- WhatsApp Float Button -->
<a href="https://wa.me/917015969967" class="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
    <i class="fab fa-whatsapp"></i>
</a>

<!-- Video Modal -->
<div class="modal fade" id="videoModal" tabindex="-1" aria-labelledby="videoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="videoModalLabel">About Creative Web Solutions</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="ratio ratio-16x9">
                    <iframe src="about:blank" title="About Creative Web Solutions" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- AI Chatbot -->
<div class="chatbot-container" id="chatbot">
    <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open Chat">
        <i class="fas fa-robot"></i>
        <i class="fas fa-times"></i>
        <span class="chatbot-badge" id="chatBadge" style="display: none;">1</span>
    </button>

    <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
            <div class="chatbot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="chatbot-info">
                <h4>CWS AI Assistant</h4>
                <div class="chatbot-status">Online - Ready to help</div>
            </div>
            <button class="chatbot-close" id="chatbotClose" aria-label="Close Chat">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="chatbot-messages" id="chatMessages">
            <div class="chat-message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        Hello! I'm your AI assistant at Creative Web Solutions. How can I help you today?
                    </div>
                    <span class="message-time">Just now</span>
                    <div class="quick-replies">
                        <button class="quick-reply-btn" data-message="Tell me about your services">Our Services</button>
                        <button class="quick-reply-btn" data-message="What courses do you offer?">Courses</button>
                        <button class="quick-reply-btn" data-message="I want a free consultation">Free Consultation</button>
                        <button class="quick-reply-btn" data-message="Contact information">Contact Us</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="chatbot-input">
            <input type="text" id="chatInput" placeholder="Type your message..." autocomplete="off">
            <button class="chatbot-send" id="chatSend" aria-label="Send Message">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

<!-- AOS Animation Library -->
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

<?php if ($currentPage === 'portfolio'): ?>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js"></script>
<?php endif; ?>

<!-- Custom JS -->
<?php
$jsFile = __DIR__ . '/../assets/js/main.js';
$jsVersion = file_exists($jsFile) ? filemtime($jsFile) : time();
?>
<script src="<?php echo $basePath; ?>assets/js/main.js?v=<?php echo $jsVersion; ?>"></script>
