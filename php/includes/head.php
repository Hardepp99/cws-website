<?php
// Base path variable - set before including this file
if (!isset($basePath)) {
    $basePath = '';
}
if (!isset($pageTitle)) {
    $pageTitle = 'Creative Web Solutions | Best Web Development Company in India';
}
if (!isset($pageDescription)) {
    $pageDescription = 'Creative Web Solutions is a leading IT company in India offering web development, mobile app development, UI/UX design, digital marketing, and professional IT training courses.';
}
if (!isset($pageKeywords)) {
    $pageKeywords = 'web development company india, IT services, mobile app development, php development, react development, digital marketing, IT training, coding courses, software development, Creative Web Solutions';
}
if (!isset($canonicalUrl)) {
    $canonicalUrl = 'https://www.cwsindia.online/';
}
if (!isset($ogUrl)) {
    $ogUrl = $canonicalUrl;
}
if (!isset($ogImage)) {
    $ogImage = $basePath . 'assets/images/og-image.jpg';
}
?>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<!-- SEO Meta Tags -->
<title><?php echo $pageTitle; ?></title>
<meta name="description" content="<?php echo $pageDescription; ?>">
<meta name="keywords" content="<?php echo $pageKeywords; ?>">
<meta name="author" content="Creative Web Solutions">
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="<?php echo $ogUrl; ?>">
<meta property="og:title" content="<?php echo $pageTitle; ?>">
<meta property="og:description" content="<?php echo $pageDescription; ?>">
<meta property="og:image" content="<?php echo $ogImage; ?>">
<meta property="og:locale" content="en_IN">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="<?php echo $ogUrl; ?>">
<meta name="twitter:title" content="<?php echo $pageTitle; ?>">
<meta name="twitter:description" content="<?php echo $pageDescription; ?>">
<meta name="twitter:image" content="<?php echo $ogImage; ?>">

<!-- Canonical URL -->
<link rel="canonical" href="<?php echo $canonicalUrl; ?>">

<!-- Favicon -->
<link rel="icon" type="image/png" href="<?php echo $basePath; ?>assets/images/favicon.png">
<link rel="apple-touch-icon" href="<?php echo $basePath; ?>assets/images/favicon.png">

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Google Fonts - Montserrat (Bold Professional Font) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- Swiper Slider CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css">

<!-- AOS Animation Library -->
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

<?php if (isset($currentPage) && $currentPage === 'portfolio'): ?>
<!-- Lightbox2 for Portfolio Zoom -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css">
<?php endif; ?>

<!-- Custom CSS -->
<?php
$cssFile = __DIR__ . '/../assets/css/style.css';
$cssVersion = file_exists($cssFile) ? filemtime($cssFile) : time();
?>
<link rel="stylesheet" href="<?php echo $basePath; ?>assets/css/style.css?v=<?php echo $cssVersion; ?>">

<!-- Schema.org Structured Data -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Creative Web Solutions",
    "url": "https://www.cwsindia.online",
    "logo": "https://www.cwsindia.online/assets/images/logo.png",
    "description": "Leading IT company in India offering web development, mobile app development, and professional training courses.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "#313, 3rd Floor, D & E Block, VIP Road",
        "addressLocality": "Zirakpur",
        "addressRegion": "Punjab",
        "postalCode": "140603",
        "addressCountry": "IN"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7015969967",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
        "https://www.facebook.com/profile.php?id=61565017048983",
        "https://www.linkedin.com/company/creative-websolutions/",
        "https://www.instagram.com/creativeweb_solutions?igsh=ZHFvZTJlZmIyaHdx"
    ]
}
</script>
