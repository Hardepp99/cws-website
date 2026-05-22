<?php
// Service Areas Component
// Usage: include this file in any service page
// Optional: Set $serviceType before including (e.g., $serviceType = 'Website Development')
if (!isset($serviceType)) {
    $serviceType = 'Our Services';
}
if (!isset($basePath)) {
    $basePath = '../';
}
?>
<!-- Service Areas - India & International -->
<section class="service-areas-section py-5">
    <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
            <span class="section-badge">
                <span class="dot"></span> SERVICE AREAS <span class="dot"></span>
            </span>
            <h2 class="section-title mt-3">
                <?php echo $serviceType; ?> <span class="gradient-text">Worldwide</span>
            </h2>
            <p class="text-muted">We serve clients across India and internationally with our professional IT solutions</p>
        </div>
        
        <!-- India - Major Cities -->
        <div class="mb-5" data-aos="fade-up" data-aos-delay="100">
            <h4 class="text-center mb-4"><i class="fas fa-flag text-primary me-2"></i>India - Major Cities</h4>
            <div class="row g-2 justify-content-center">
                <!-- North India -->
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Chandigarh</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Mohali</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Panchkula</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Zirakpur</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Delhi NCR</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Noida</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Gurgaon</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Faridabad</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Ghaziabad</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Ludhiana</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Amritsar</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Jalandhar</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Patiala</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Bathinda</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Ambala</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Karnal</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Panipat</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Hisar</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Rohtak</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Jaipur</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Jodhpur</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Udaipur</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Lucknow</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Kanpur</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Varanasi</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Agra</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Meerut</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Dehradun</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Shimla</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Jammu</span></div>
                <!-- West India -->
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Mumbai</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Pune</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Ahmedabad</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Surat</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Vadodara</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Rajkot</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Nagpur</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Nashik</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Thane</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Navi Mumbai</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Indore</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Bhopal</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Gwalior</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Goa</span></div>
                <!-- South India -->
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Bangalore</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Chennai</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Hyderabad</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Kochi</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Coimbatore</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Thiruvananthapuram</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Mysore</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Visakhapatnam</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Vijayawada</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Madurai</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Tiruchirappalli</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Mangalore</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">Hubli</span></div>
                <!-- East India -->
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">Kolkata</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">Patna</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">Ranchi</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">Bhubaneswar</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">Guwahati</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">Siliguri</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">Jamshedpur</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">Raipur</span></div>
            </div>
        </div>
        
        <!-- International Markets -->
        <div data-aos="fade-up" data-aos-delay="200">
            <h4 class="text-center mb-4"><i class="fas fa-globe text-success me-2"></i>International Markets</h4>
            <div class="row g-2 justify-content-center">
                <!-- USA -->
                <div class="col-auto"><span class="badge bg-dark px-3 py-2">🇺🇸 USA</span></div>
                <div class="col-auto"><span class="badge bg-dark px-3 py-2">New York</span></div>
                <div class="col-auto"><span class="badge bg-dark px-3 py-2">California</span></div>
                <div class="col-auto"><span class="badge bg-dark px-3 py-2">Texas</span></div>
                <div class="col-auto"><span class="badge bg-dark px-3 py-2">Florida</span></div>
                <div class="col-auto"><span class="badge bg-dark px-3 py-2">Illinois</span></div>
                <!-- UK -->
                <div class="col-auto"><span class="badge bg-secondary px-3 py-2">🇬🇧 United Kingdom</span></div>
                <div class="col-auto"><span class="badge bg-secondary px-3 py-2">London</span></div>
                <div class="col-auto"><span class="badge bg-secondary px-3 py-2">Manchester</span></div>
                <div class="col-auto"><span class="badge bg-secondary px-3 py-2">Birmingham</span></div>
                <!-- Canada -->
                <div class="col-auto"><span class="badge bg-danger px-3 py-2">🇨🇦 Canada</span></div>
                <div class="col-auto"><span class="badge bg-danger px-3 py-2">Toronto</span></div>
                <div class="col-auto"><span class="badge bg-danger px-3 py-2">Vancouver</span></div>
                <div class="col-auto"><span class="badge bg-danger px-3 py-2">Montreal</span></div>
                <!-- Australia -->
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">🇦🇺 Australia</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Sydney</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Melbourne</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Brisbane</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">Perth</span></div>
                <!-- UAE -->
                <div class="col-auto"><span class="badge bg-success px-3 py-2">🇦🇪 UAE</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Dubai</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Abu Dhabi</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Sharjah</span></div>
                <!-- Saudi Arabia -->
                <div class="col-auto"><span class="badge bg-success px-3 py-2">🇸🇦 Saudi Arabia</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Riyadh</span></div>
                <div class="col-auto"><span class="badge bg-success px-3 py-2">Jeddah</span></div>
                <!-- Other Gulf -->
                <div class="col-auto"><span class="badge bg-info px-3 py-2">🇶🇦 Qatar</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">🇰🇼 Kuwait</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">🇴🇲 Oman</span></div>
                <div class="col-auto"><span class="badge bg-info px-3 py-2">🇧🇭 Bahrain</span></div>
                <!-- Europe -->
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">🇩🇪 Germany</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">🇫🇷 France</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">🇳🇱 Netherlands</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">🇮🇪 Ireland</span></div>
                <div class="col-auto"><span class="badge bg-primary px-3 py-2">🇨🇭 Switzerland</span></div>
                <!-- Asia Pacific -->
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">🇸🇬 Singapore</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">🇲🇾 Malaysia</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">🇯🇵 Japan</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">🇰🇷 South Korea</span></div>
                <div class="col-auto"><span class="badge bg-warning text-dark px-3 py-2">🇳🇿 New Zealand</span></div>
                <!-- Africa -->
                <div class="col-auto"><span class="badge bg-secondary px-3 py-2">🇿🇦 South Africa</span></div>
                <div class="col-auto"><span class="badge bg-secondary px-3 py-2">🇳🇬 Nigeria</span></div>
                <div class="col-auto"><span class="badge bg-secondary px-3 py-2">🇰🇪 Kenya</span></div>
            </div>
        </div>
        
        <!-- Trust Indicators -->
        <div class="text-center mt-5" data-aos="fade-up" data-aos-delay="300">
            <div class="row g-4 justify-content-center">
                <div class="col-md-3 col-6">
                    <div class="p-3 bg-light rounded">
                        <i class="fas fa-globe fa-2x text-primary mb-2"></i>
                        <h5 class="mb-0">50+</h5>
                        <small class="text-muted">Countries Served</small>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-3 bg-light rounded">
                        <i class="fas fa-city fa-2x text-success mb-2"></i>
                        <h5 class="mb-0">100+</h5>
                        <small class="text-muted">Cities in India</small>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-3 bg-light rounded">
                        <i class="fas fa-users fa-2x text-info mb-2"></i>
                        <h5 class="mb-0">500+</h5>
                        <small class="text-muted">Happy Clients</small>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-3 bg-light rounded">
                        <i class="fas fa-headset fa-2x text-warning mb-2"></i>
                        <h5 class="mb-0">24/7</h5>
                        <small class="text-muted">Support Available</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
