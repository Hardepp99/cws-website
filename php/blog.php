<?php
$basePath = '';
$currentPage = 'blog';
$pageTitle = 'Blog | Tech News, Tips & Tutorials | Creative Web Solutions';
$pageDescription = 'Read our latest blog posts about web development, mobile apps, blockchain, digital marketing, and technology trends. Tips, tutorials, and industry insights.';
$pageKeywords = 'tech blog, web development blog, programming tutorials, technology news, digital marketing tips, blockchain articles, coding tips';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include 'includes/head.php'; ?>
    <style>
        .blog-card-full {
            background: var(--white);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: var(--transition);
            height: 100%;
        }
        .blog-card-full:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-xl);
        }
        .blog-card-full .blog-image {
            height: 220px;
            overflow: hidden;
        }
        .blog-card-full .blog-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: var(--transition-slow);
        }
        .blog-card-full:hover .blog-image img {
            transform: scale(1.1);
        }
        .blog-card-full .blog-content {
            padding: 25px;
        }
        .blog-featured {
            height: 100%;
        }
        .blog-featured .blog-image {
            height: 300px;
        }
        .blog-sidebar {
            background: var(--light-color);
            border-radius: 20px;
            padding: 30px;
        }
        .sidebar-widget {
            margin-bottom: 30px;
        }
        .sidebar-widget:last-child {
            margin-bottom: 0;
        }
        .sidebar-title {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--primary-color);
        }
        .category-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .category-list li {
            padding: 10px 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .category-list li a {
            display: flex;
            justify-content: space-between;
            color: var(--dark-color);
            font-weight: 600;
        }
        .category-list li a:hover {
            color: var(--primary-color);
        }
        .recent-post {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
        }
        .recent-post img {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 10px;
        }
        .recent-post-content h6 {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 5px;
            line-height: 1.4;
        }
        .recent-post-content span {
            font-size: 12px;
            color: var(--gray-color);
        }
        .tag-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .tag-cloud a {
            background: var(--white);
            color: var(--dark-color);
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            transition: var(--transition);
        }
        .tag-cloud a:hover {
            background: var(--primary-color);
            color: var(--white);
        }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <!-- Page Header -->
    <section class="page-header" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%); padding: 140px 0 80px;">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center text-white">
                    <h1 class="display-4 fw-bold mb-3">Our Blog</h1>
                    <p class="lead opacity-90">Latest news, tips, tutorials, and insights from the world of technology</p>
                    <nav aria-label="breadcrumb" class="mt-4">
                        <ol class="breadcrumb justify-content-center" style="background: transparent;">
                            <li class="breadcrumb-item"><a href="index" class="text-white">Home</a></li>
                            <li class="breadcrumb-item active text-white-50">Blog</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    </section>

    <!-- Blog Section -->
    <section class="py-5">
        <div class="container">
            <div class="row g-4">
                <!-- Blog Posts -->
                <div class="col-lg-8">
                    <div class="row g-4">
                        <!-- Featured Post -->
                        <div class="col-12" data-aos="fade-up">
                            <article class="blog-card-full blog-featured">
                                <div class="blog-image position-relative">
                                    <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" alt="React vs Vue guide by website developers in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                                    <span class="blog-category position-absolute" style="top: 15px; left: 15px; background: var(--accent-color); color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700;">Featured</span>
                                </div>
                                <div class="blog-content">
                                    <div class="blog-meta d-flex gap-3 mb-3">
                                        <span><i class="far fa-calendar-alt me-2 text-primary"></i> Jan 20, 2026</span>
                                        <span><i class="far fa-user me-2 text-primary"></i> Admin</span>
                                        <span><i class="far fa-comments me-2 text-primary"></i> 15 Comments</span>
                                    </div>
                                    <h3 class="fw-bold mb-3"><a href="blog" class="text-dark">React vs Vue in 2026: The Ultimate Comparison Guide</a></h3>
                                    <p class="text-muted">A comprehensive analysis of React and Vue.js, comparing their performance, ecosystem, learning curve, and best use cases. Find out which framework suits your next project...</p>
                                    <a href="blog" class="btn btn-primary">
                                        Read More <i class="fas fa-arrow-right ms-2"></i>
                                    </a>
                                </div>
                            </article>
                        </div>

                        <!-- Post 2 -->
                        <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
                            <article class="blog-card-full">
                                <div class="blog-image">
                                    <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600" alt="Blockchain development insights from Chandigarh and Zirakpur, India" decoding="async" loading="lazy">
                                </div>
                                <div class="blog-content">
                                    <span class="d-inline-block bg-primary text-white px-3 py-1 rounded-pill mb-2" style="font-size: 11px;">Blockchain</span>
                                    <h5 class="fw-bold mb-2"><a href="contact" class="text-dark">How Blockchain is Transforming Business</a></h5>
                                    <p class="text-muted small">Discover how blockchain technology is revolutionizing industries...</p>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <span class="small text-muted"><i class="far fa-calendar-alt me-1"></i> Jan 10, 2026</span>
                                        <a href="contact" class="text-primary fw-bold small">Read More â†’</a>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <!-- Post 3 -->
                        <div class="col-md-6" data-aos="fade-up" data-aos-delay="200">
                            <article class="blog-card-full">
                                <div class="blog-image">
                                    <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600" alt="AI development trends for software teams in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                                </div>
                                <div class="blog-content">
                                    <span class="d-inline-block bg-success text-white px-3 py-1 rounded-pill mb-2" style="font-size: 11px;">Technology</span>
                                    <h5 class="fw-bold mb-2"><a href="contact" class="text-dark">The Role of AI in Software Development</a></h5>
                                    <p class="text-muted small">Explore how AI is changing the way we build software...</p>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <span class="small text-muted"><i class="far fa-calendar-alt me-1"></i> Jan 5, 2026</span>
                                        <a href="contact" class="text-primary fw-bold small">Read More â†’</a>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <!-- Post 4 -->
                        <div class="col-md-6" data-aos="fade-up" data-aos-delay="300">
                            <article class="blog-card-full">
                                <div class="blog-image">
                                    <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600" alt="UI UX design trends for websites in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                                </div>
                                <div class="blog-content">
                                    <span class="d-inline-block bg-warning text-dark px-3 py-1 rounded-pill mb-2" style="font-size: 11px;">Design</span>
                                    <h5 class="fw-bold mb-2"><a href="contact" class="text-dark">UI/UX Design Trends to Watch in 2026</a></h5>
                                    <p class="text-muted small">Stay ahead with the latest design trends shaping user experiences...</p>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <span class="small text-muted"><i class="far fa-calendar-alt me-1"></i> Dec 28, 2025</span>
                                        <a href="contact" class="text-primary fw-bold small">Read More â†’</a>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <!-- Post 5 -->
                        <div class="col-md-6" data-aos="fade-up" data-aos-delay="400">
                            <article class="blog-card-full">
                                <div class="blog-image">
                                    <img src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600" alt="Digital marketing strategy for businesses in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                                </div>
                                <div class="blog-content">
                                    <span class="d-inline-block bg-danger text-white px-3 py-1 rounded-pill mb-2" style="font-size: 11px;">Marketing</span>
                                    <h5 class="fw-bold mb-2"><a href="contact" class="text-dark">Digital Marketing Strategies That Work</a></h5>
                                    <p class="text-muted small">Proven strategies to boost your online presence and conversions...</p>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <span class="small text-muted"><i class="far fa-calendar-alt me-1"></i> Dec 20, 2025</span>
                                        <a href="contact" class="text-primary fw-bold small">Read More â†’</a>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <!-- Post 6 -->
                        <div class="col-md-6" data-aos="fade-up" data-aos-delay="500">
                            <article class="blog-card-full">
                                <div class="blog-image">
                                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600" alt="Website speed optimization tips from Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                                </div>
                                <div class="blog-content">
                                    <span class="d-inline-block bg-info text-white px-3 py-1 rounded-pill mb-2" style="font-size: 11px;">Development</span>
                                    <h5 class="fw-bold mb-2"><a href="contact" class="text-dark">Optimizing Website Performance</a></h5>
                                    <p class="text-muted small">Tips to make your website lightning fast and improve SEO...</p>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <span class="small text-muted"><i class="far fa-calendar-alt me-1"></i> Dec 15, 2025</span>
                                        <a href="contact" class="text-primary fw-bold small">Read More â†’</a>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <!-- Post 7 -->
                        <div class="col-md-6" data-aos="fade-up" data-aos-delay="600">
                            <article class="blog-card-full">
                                <div class="blog-image">
                                    <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600" alt="Mobile app development insights in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                                </div>
                                <div class="blog-content">
                                    <span class="d-inline-block bg-purple text-white px-3 py-1 rounded-pill mb-2" style="font-size: 11px; background: #8b5cf6;">Mobile</span>
                                    <h5 class="fw-bold mb-2"><a href="contact" class="text-dark">Flutter vs React Native: 2026 Edition</a></h5>
                                    <p class="text-muted small">Compare the two most popular cross-platform frameworks...</p>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <span class="small text-muted"><i class="far fa-calendar-alt me-1"></i> Dec 10, 2025</span>
                                        <a href="contact" class="text-primary fw-bold small">Read More â†’</a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <nav class="mt-5" data-aos="fade-up">
                        <ul class="pagination justify-content-center">
                            <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#">Next</a></li>
                        </ul>
                    </nav>
                </div>

                <!-- Sidebar -->
                <div class="col-lg-4">
                    <div class="blog-sidebar" data-aos="fade-up" data-aos-delay="200">
                        <!-- Search -->
                        <div class="sidebar-widget">
                            <h5 class="sidebar-title">Search</h5>
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Search...">
                                <button class="btn btn-primary"><i class="fas fa-search"></i></button>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div class="sidebar-widget">
                            <h5 class="sidebar-title">Categories</h5>
                            <ul class="category-list">
                                <li><a href="#">Web Development <span>15</span></a></li>
                                <li><a href="#">Mobile Apps <span>12</span></a></li>
                                <li><a href="#">Blockchain <span>8</span></a></li>
                                <li><a href="#">UI/UX Design <span>10</span></a></li>
                                <li><a href="#">Digital Marketing <span>7</span></a></li>
                                <li><a href="#">Technology <span>20</span></a></li>
                            </ul>
                        </div>

                        <!-- Recent Posts -->
                        <div class="sidebar-widget">
                            <h5 class="sidebar-title">Recent Posts</h5>
                            <div class="recent-post">
                                <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100" alt="Recent web development article from Chandigarh, Zirakpur, India" decoding="async">
                                <div class="recent-post-content">
                                    <h6><a href="#" class="text-dark">React vs Vue in 2026</a></h6>
                                    <span><i class="far fa-calendar-alt me-1"></i> Jan 20, 2026</span>
                                </div>
                            </div>
                            <div class="recent-post">
                                <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100" alt="Recent web development article from Chandigarh, Zirakpur, India" decoding="async">
                                <div class="recent-post-content">
                                    <h6><a href="#" class="text-dark">Blockchain for Business</a></h6>
                                    <span><i class="far fa-calendar-alt me-1"></i> Jan 10, 2026</span>
                                </div>
                            </div>
                            <div class="recent-post">
                                <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=100" alt="Recent web development article from Chandigarh, Zirakpur, India" decoding="async">
                                <div class="recent-post-content">
                                    <h6><a href="#" class="text-dark">AI in Development</a></h6>
                                    <span><i class="far fa-calendar-alt me-1"></i> Jan 5, 2026</span>
                                </div>
                            </div>
                        </div>

                        <!-- Tags -->
                        <div class="sidebar-widget">
                            <h5 class="sidebar-title">Popular Tags</h5>
                            <div class="tag-cloud">
                                <a href="#">React</a>
                                <a href="#">JavaScript</a>
                                <a href="#">PHP</a>
                                <a href="#">Laravel</a>
                                <a href="#">Blockchain</a>
                                <a href="#">NFT</a>
                                <a href="#">UI/UX</a>
                                <a href="#">SEO</a>
                                <a href="#">Node.js</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
