<?php
$basePath = '';
$currentPage = 'courses';
$pageTitle = 'IT Courses & Training | Creative Web Solutions - PHP, React, Python, Digital Marketing, UI/UX, WordPress';
$pageDescription = 'Learn web development, mobile app development, digital marketing, UI/UX design, and WordPress with Creative Web Solutions\'s professional IT training courses. Get hands-on projects and job-ready skills.';
$pageKeywords = 'IT training courses, PHP course, Laravel training, React.js course, Node.js training, Python course, Django training, full stack development, digital marketing course, UI/UX design course, WordPress development, mobile app development, career counselling, web development training india';
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
                <h1>Courses & <span class="gradient-text">Training</span></h1>
                <nav class="breadcrumb-nav">
                    <a href="index">Home</a>
                    <i class="fas fa-chevron-right"></i>
                    <span>Courses</span>
                </nav>
            </div>
        </div>
    </section>

    <!-- Courses Overview -->
    <section class="courses-section">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center" data-aos="fade-up" data-aos-duration="1000">
                    <span class="section-badge">
                        <span class="dot"></span> OUR COURSES <span class="dot"></span>
                    </span>
                    <h2 class="section-title">
                        Professional <span class="gradient-text">IT Training</span>
                    </h2>
                    <p class="section-subtitle">
                        Learn from industry experts with hands-on projects and real-world experience. Choose from 10+ comprehensive courses designed to make you job-ready.
                    </p>
                </div>
            </div>
            <div class="row g-4 mt-4">
                <!-- PHP Development Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                    <div class="course-card">
                        <div class="course-badge">Popular</div>
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fab fa-php"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 3 Months</span>
                                <span><i class="fas fa-signal"></i> Beginner to Advanced</span>
                            </div>
                        </div>
                        <h3>PHP & Laravel Development</h3>
                        <p>Master PHP programming and Laravel framework to build powerful web applications. Includes MySQL, REST APIs, and deployment.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> Core PHP Programming</li>
                            <li><i class="fas fa-check"></i> Laravel Framework</li>
                            <li><i class="fas fa-check"></i> MySQL Database</li>
                            <li><i class="fas fa-check"></i> 5+ Real Projects</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹25,000</span>
                                <span class="current-price">â‚¹15,000</span>
                            </div>
                            <a href="php-laravel-course" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- React & Node.js Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-card">
                        <div class="course-badge trending">Trending</div>
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fab fa-react"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 4 Months</span>
                                <span><i class="fas fa-signal"></i> Intermediate</span>
                            </div>
                        </div>
                        <h3>React.js & Node.js</h3>
                        <p>Build modern full-stack applications with React.js frontend and Node.js backend. Learn Express, MongoDB, and Redux.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> React.js & Redux</li>
                            <li><i class="fas fa-check"></i> Node.js & Express</li>
                            <li><i class="fas fa-check"></i> MongoDB</li>
                            <li><i class="fas fa-check"></i> 6+ Real Projects</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹35,000</span>
                                <span class="current-price">â‚¹22,000</span>
                            </div>
                            <a href="react-nodejs-course" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- Python & Django Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                    <div class="course-card">
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fab fa-python"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 4 Months</span>
                                <span><i class="fas fa-signal"></i> Beginner to Advanced</span>
                            </div>
                        </div>
                        <h3>Python & Django</h3>
                        <p>Learn Python programming and Django framework for web development. Includes data analysis basics and machine learning introduction.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> Python Programming</li>
                            <li><i class="fas fa-check"></i> Django Framework</li>
                            <li><i class="fas fa-check"></i> REST APIs</li>
                            <li><i class="fas fa-check"></i> 5+ Real Projects</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹30,000</span>
                                <span class="current-price">â‚¹18,000</span>
                            </div>
                            <a href="python-django-course" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- Full Stack Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                    <div class="course-card">
                        <div class="course-badge premium">Premium</div>
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fas fa-layer-group"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 6 Months</span>
                                <span><i class="fas fa-signal"></i> Comprehensive</span>
                            </div>
                        </div>
                        <h3>Full Stack Development</h3>
                        <p>Complete full-stack development program covering frontend, backend, databases, and DevOps. Become a complete web developer.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> HTML, CSS, JavaScript</li>
                            <li><i class="fas fa-check"></i> React.js / Vue.js</li>
                            <li><i class="fas fa-check"></i> Node.js / PHP</li>
                            <li><i class="fas fa-check"></i> 10+ Real Projects</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹50,000</span>
                                <span class="current-price">â‚¹35,000</span>
                            </div>
                            <a href="full-stack-course" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- Digital Marketing Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                    <div class="course-card">
                        <div class="course-badge">New</div>
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fas fa-bullhorn"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 3 Months</span>
                                <span><i class="fas fa-signal"></i> Beginner to Advanced</span>
                            </div>
                        </div>
                        <h3>Digital Marketing</h3>
                        <p>Master SEO, SEM, Social Media Marketing, Email Marketing, and Analytics. Learn to create and execute successful digital campaigns.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> SEO & SEM</li>
                            <li><i class="fas fa-check"></i> Social Media Marketing</li>
                            <li><i class="fas fa-check"></i> Google Analytics</li>
                            <li><i class="fas fa-check"></i> Campaign Management</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹20,000</span>
                                <span class="current-price">â‚¹12,000</span>
                            </div>
                            <a href="#digital-marketing" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- Website Designing Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-card">
                        <div class="course-badge">Popular</div>
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fas fa-palette"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 2 Months</span>
                                <span><i class="fas fa-signal"></i> Beginner</span>
                            </div>
                        </div>
                        <h3>Website Designing</h3>
                        <p>Learn HTML, CSS, JavaScript, Bootstrap, and responsive design. Create beautiful, modern websites from scratch.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> HTML5 & CSS3</li>
                            <li><i class="fas fa-check"></i> JavaScript & jQuery</li>
                            <li><i class="fas fa-check"></i> Bootstrap & Responsive Design</li>
                            <li><i class="fas fa-check"></i> 4+ Website Projects</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹18,000</span>
                                <span class="current-price">â‚¹10,000</span>
                            </div>
                            <a href="#web-design" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- UI/UX Design Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                    <div class="course-card">
                        <div class="course-badge trending">Trending</div>
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fas fa-pencil-ruler"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 3 Months</span>
                                <span><i class="fas fa-signal"></i> Intermediate</span>
                            </div>
                        </div>
                        <h3>UI/UX Design</h3>
                        <p>Master user interface and user experience design with Figma, Adobe XD. Learn design principles, prototyping, and user research.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> Figma & Adobe XD</li>
                            <li><i class="fas fa-check"></i> Design Principles</li>
                            <li><i class="fas fa-check"></i> Wireframing & Prototyping</li>
                            <li><i class="fas fa-check"></i> User Research & Testing</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹25,000</span>
                                <span class="current-price">â‚¹16,000</span>
                            </div>
                            <a href="#uiux" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- Mobile App Development Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                    <div class="course-card">
                        <div class="course-badge premium">Premium</div>
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 5 Months</span>
                                <span><i class="fas fa-signal"></i> Advanced</span>
                            </div>
                        </div>
                        <h3>Mobile App Development</h3>
                        <p>Build native Android apps with Kotlin or cross-platform apps with React Native. Learn to publish apps on Play Store and App Store.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> React Native / Flutter</li>
                            <li><i class="fas fa-check"></i> Android Development</li>
                            <li><i class="fas fa-check"></i> Firebase & APIs</li>
                            <li><i class="fas fa-check"></i> App Store Publishing</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹40,000</span>
                                <span class="current-price">â‚¹28,000</span>
                            </div>
                            <a href="#app-development" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- WordPress Development Course -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                    <div class="course-card">
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fab fa-wordpress"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 2 Months</span>
                                <span><i class="fas fa-signal"></i> Beginner</span>
                            </div>
                        </div>
                        <h3>WordPress Development</h3>
                        <p>Learn WordPress CMS, theme customization, plugin development, and WooCommerce. Build professional websites and e-commerce stores.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> WordPress Setup & Basics</li>
                            <li><i class="fas fa-check"></i> Theme Development</li>
                            <li><i class="fas fa-check"></i> Plugin Development</li>
                            <li><i class="fas fa-check"></i> WooCommerce</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="old-price">â‚¹15,000</span>
                                <span class="current-price">â‚¹9,000</span>
                            </div>
                            <a href="#wordpress" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>

                <!-- Career Counselling -->
                <div class="col-lg-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-card">
                        <div class="course-badge">Free</div>
                        <div class="course-header">
                            <div class="course-icon">
                                <i class="fas fa-user-tie"></i>
                            </div>
                            <div class="course-meta">
                                <span><i class="fas fa-clock"></i> 1 Session</span>
                                <span><i class="fas fa-signal"></i> All Levels</span>
                            </div>
                        </div>
                        <h3>Career Counselling</h3>
                        <p>Get personalized career guidance from industry experts. Understand career paths, skill requirements, and job market trends in IT.</p>
                        <ul class="course-features">
                            <li><i class="fas fa-check"></i> One-on-One Session</li>
                            <li><i class="fas fa-check"></i> Career Path Analysis</li>
                            <li><i class="fas fa-check"></i> Skill Assessment</li>
                            <li><i class="fas fa-check"></i> Resume Review</li>
                        </ul>
                        <div class="course-footer">
                            <div class="course-price">
                                <span class="current-price free">FREE</span>
                            </div>
                            <a href="#career-counselling" class="btn btn-primary">Book Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PHP Course Details -->
    <section class="course-detail" id="php" style="background: var(--light-color);">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600" alt="PHP development course for website developers in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge">
                            <i class="fas fa-clock"></i>
                            <span>3 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> PHP DEVELOPMENT <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            PHP & <span class="gradient-text">Laravel Mastery</span>
                        </h2>
                        <p>Our comprehensive PHP development course takes you from beginner to expert. Learn to build robust web applications with PHP and the powerful Laravel framework.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Week 1-2</span>
                                <span class="topic">PHP Fundamentals - Variables, Arrays, Functions, OOP</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 3-4</span>
                                <span class="topic">MySQL Database - CRUD Operations, Joins, Indexes</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 5-6</span>
                                <span class="topic">Laravel Basics - Routing, Controllers, Views, Blade</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 7-8</span>
                                <span class="topic">Laravel Advanced - Eloquent ORM, Authentication, APIs</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 9-12</span>
                                <span class="topic">Real-World Projects - E-commerce, CMS, REST APIs</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>Job Assistance</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="PHP & Laravel Development" data-price="â‚¹15,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- React Course Details -->
    <section class="course-detail" id="react">
        <div class="container">
            <div class="row align-items-center flex-lg-row-reverse">
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600" alt="React JS course for frontend developers in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge">
                            <i class="fas fa-clock"></i>
                            <span>4 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> MERN STACK <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            React.js & <span class="gradient-text">Node.js</span>
                        </h2>
                        <p>Master the MERN stack and build modern, scalable web applications. Learn React.js for frontend and Node.js with Express for backend development.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Week 1-2</span>
                                <span class="topic">JavaScript ES6+ - Modern JS, Async/Await, Modules</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 3-5</span>
                                <span class="topic">React.js - Components, Hooks, State, Context API</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 6-8</span>
                                <span class="topic">Node.js & Express - APIs, Middleware, Authentication</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 9-11</span>
                                <span class="topic">MongoDB - CRUD, Aggregation, Mongoose ODM</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 12-16</span>
                                <span class="topic">Full Stack Projects - Social Media, E-commerce App</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>Job Assistance</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="React.js & Node.js Full Stack" data-price="â‚¹22,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Python Course Details -->
    <section class="course-detail" id="python" style="background: var(--light-color);">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600" alt="Python Django course for web application developers in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge">
                            <i class="fas fa-clock"></i>
                            <span>4 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> PYTHON <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            Python & <span class="gradient-text">Django</span>
                        </h2>
                        <p>Learn Python programming from scratch and master Django for web development. This course also includes basics of data analysis and automation.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Week 1-3</span>
                                <span class="topic">Python Basics - Syntax, Data Types, OOP, File Handling</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 4-5</span>
                                <span class="topic">Data Analysis - NumPy, Pandas, Matplotlib</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 6-8</span>
                                <span class="topic">Django Basics - MVT, Templates, Forms, Admin</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 9-12</span>
                                <span class="topic">Django Advanced - REST Framework, Authentication</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 13-16</span>
                                <span class="topic">Projects - Blog, API, Automation Scripts</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>Job Assistance</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="Python & Django Development" data-price="â‚¹18,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Full Stack Course Details -->
    <section class="course-detail" id="fullstack">
        <div class="container">
            <div class="row align-items-center flex-lg-row-reverse">
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600" alt="Full stack development course in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge premium">
                            <i class="fas fa-crown"></i>
                            <span>6 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> FULL STACK <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            Complete <span class="gradient-text">Full Stack Development</span>
                        </h2>
                        <p>Our flagship program covers everything you need to become a complete full-stack developer. From HTML to deployment, master the entire web development stack.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Month 1</span>
                                <span class="topic">Frontend Basics - HTML5, CSS3, JavaScript, Bootstrap</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Month 2</span>
                                <span class="topic">Frontend Advanced - React.js / Vue.js, State Management</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Month 3</span>
                                <span class="topic">Backend - Node.js + Express OR PHP + Laravel</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Month 4</span>
                                <span class="topic">Database - MySQL, MongoDB, PostgreSQL</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Month 5</span>
                                <span class="topic">DevOps - Git, Docker, CI/CD, AWS/Azure</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Month 6</span>
                                <span class="topic">Capstone Projects - Build & Deploy Complete Apps</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>100% Job Placement</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="Full Stack Development" data-price="â‚¹35,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Learn With Us -->
    <section class="why-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <span class="section-badge light">
                        <span class="dot"></span> WHY CHOOSE US <span class="dot"></span>
                    </span>
                    <h2 class="section-title text-white">
                        Why Learn With <span class="gradient-text">Creative Web Solutions</span>
                    </h2>
                    <div class="why-features">
                        <div class="why-item">
                            <div class="why-icon">
                                <i class="fas fa-chalkboard-teacher"></i>
                            </div>
                            <div class="why-content">
                                <h4>Expert Instructors</h4>
                                <p>Learn from industry professionals with 10+ years experience</p>
                            </div>
                        </div>
                        <div class="why-item">
                            <div class="why-icon">
                                <i class="fas fa-laptop-code"></i>
                            </div>
                            <div class="why-content">
                                <h4>Hands-on Projects</h4>
                                <p>Build real-world projects to strengthen your portfolio</p>
                            </div>
                        </div>
                        <div class="why-item">
                            <div class="why-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="why-content">
                                <h4>Small Batch Size</h4>
                                <p>Maximum 15 students per batch for personalized attention</p>
                            </div>
                        </div>
                        <div class="why-item">
                            <div class="why-icon">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <div class="why-content">
                                <h4>Placement Support</h4>
                                <p>Interview preparation and job placement assistance</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="why-image">
                        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" alt="IT training classroom for future website developers in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Digital Marketing Course Details -->
    <section class="course-detail" id="digital-marketing" style="background: var(--light-color);">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600" alt="Digital marketing course in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge">
                            <i class="fas fa-clock"></i>
                            <span>3 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> DIGITAL MARKETING <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            Master <span class="gradient-text">Digital Marketing</span>
                        </h2>
                        <p>Learn to create and execute successful digital marketing campaigns. Master SEO, social media, paid advertising, and analytics to grow businesses online.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Week 1-2</span>
                                <span class="topic">SEO - On-page, Off-page, Technical SEO, Keywords</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 3-4</span>
                                <span class="topic">SEM & PPC - Google Ads, Campaign Setup, Optimization</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 5-7</span>
                                <span class="topic">Social Media Marketing - Facebook, Instagram, LinkedIn Ads</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 8-9</span>
                                <span class="topic">Email Marketing & Content Marketing Strategies</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 10-12</span>
                                <span class="topic">Google Analytics, Campaign Projects & Certifications</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Google Certification</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>Job Assistance</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="Digital Marketing" data-price="â‚¹12,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Website Designing Course Details -->
    <section class="course-detail" id="web-design">
        <div class="container">
            <div class="row align-items-center flex-lg-row-reverse">
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600" alt="Web design course for website creators in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge">
                            <i class="fas fa-clock"></i>
                            <span>2 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> WEB DESIGN <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            Website <span class="gradient-text">Designing</span>
                        </h2>
                        <p>Create stunning, responsive websites from scratch. Learn HTML, CSS, JavaScript, and modern frameworks to build beautiful web interfaces.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Week 1-2</span>
                                <span class="topic">HTML5 - Semantic Tags, Forms, Media Elements</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 3-4</span>
                                <span class="topic">CSS3 - Flexbox, Grid, Animations, Transitions</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 5-6</span>
                                <span class="topic">JavaScript & jQuery - DOM, Events, AJAX</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 7</span>
                                <span class="topic">Bootstrap 5 - Responsive Design, Components</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 8</span>
                                <span class="topic">Real Website Projects - Portfolio, Business Sites</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>Freelance Projects</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="Website Designing" data-price="â‚¹10,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- UI/UX Design Course Details -->
    <section class="course-detail" id="uiux" style="background: var(--light-color);">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600" alt="UI UX design course in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge">
                            <i class="fas fa-clock"></i>
                            <span>3 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> UI/UX DESIGN <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            UI/UX <span class="gradient-text">Design Mastery</span>
                        </h2>
                        <p>Design beautiful user interfaces and create exceptional user experiences. Master Figma, Adobe XD, and industry-standard design principles.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Week 1-2</span>
                                <span class="topic">Design Principles - Typography, Color Theory, Layout</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 3-4</span>
                                <span class="topic">User Research - Personas, User Journeys, Surveys</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 5-7</span>
                                <span class="topic">Figma & Adobe XD - Wireframing, Prototyping</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 8-10</span>
                                <span class="topic">Mobile & Web Design - iOS, Android, Responsive</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 11-12</span>
                                <span class="topic">Portfolio Projects - App Design, Website Redesign</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>Portfolio Review</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="UI/UX Design" data-price="â‚¹16,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- App Development Course Details -->
    <section class="course-detail" id="app-development">
        <div class="container">
            <div class="row align-items-center flex-lg-row-reverse">
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600" alt="App development course in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge">
                            <i class="fas fa-clock"></i>
                            <span>5 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> MOBILE APPS <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            Mobile App <span class="gradient-text">Development</span>
                        </h2>
                        <p>Build professional mobile applications for Android and iOS. Learn React Native or Flutter for cross-platform development.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Week 1-3</span>
                                <span class="topic">React Native/Flutter Basics - Components, State, Navigation</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 4-6</span>
                                <span class="topic">UI Development - Layouts, Styling, Animations</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 7-10</span>
                                <span class="topic">Firebase - Authentication, Database, Storage, Push Notifications</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 11-15</span>
                                <span class="topic">REST APIs, State Management, Maps Integration</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 16-20</span>
                                <span class="topic">Real Apps - E-commerce, Social Media, Publishing</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>App Publishing</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="Mobile App Development" data-price="â‚¹28,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- WordPress Course Details -->
    <section class="course-detail" id="wordpress" style="background: var(--light-color);">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=600" alt="WordPress website development course in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge">
                            <i class="fas fa-clock"></i>
                            <span>2 Months</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> WORDPRESS <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            WordPress <span class="gradient-text">Development</span>
                        </h2>
                        <p>Master the world's most popular CMS. Learn to build websites, e-commerce stores, and custom themes and plugins.</p>
                        
                        <div class="curriculum-list">
                            <h4>Course Curriculum:</h4>
                            <div class="curriculum-item">
                                <span class="week">Week 1-2</span>
                                <span class="topic">WordPress Basics - Installation, Dashboard, Customization</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 3-4</span>
                                <span class="topic">Theme Development - Template Hierarchy, Custom Themes</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 5-6</span>
                                <span class="topic">Plugin Development - Custom Functionality, Hooks, Actions</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 7</span>
                                <span class="topic">WooCommerce - E-commerce Setup, Payment Gateways</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week">Week 8</span>
                                <span class="topic">SEO, Security & Real Projects</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Live Sessions</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-briefcase"></i>
                                <span>Freelance Ready</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="WordPress Development" data-price="â‚¹9,000">
                            <i class="fas fa-user-plus"></i> Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Career Counselling Details -->
    <section class="course-detail" id="career-counselling">
        <div class="container">
            <div class="row align-items-center flex-lg-row-reverse">
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                    <div class="course-detail-image">
                        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600" alt="Career counselling for developers in Chandigarh, Zirakpur, India" decoding="async" loading="lazy">
                        <div class="course-duration-badge free">
                            <i class="fas fa-gift"></i>
                            <span>FREE</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
                    <div class="course-detail-content">
                        <span class="section-badge">
                            <span class="dot"></span> CAREER GUIDANCE <span class="dot"></span>
                        </span>
                        <h2 class="section-title">
                            Career <span class="gradient-text">Counselling</span>
                        </h2>
                        <p>Get expert guidance for your IT career. Our experienced counsellors will help you choose the right path and achieve your goals.</p>
                        
                        <div class="curriculum-list">
                            <h4>What You Get:</h4>
                            <div class="curriculum-item">
                                <span class="week"><i class="fas fa-check-circle" style="color: #10b981;"></i></span>
                                <span class="topic">One-on-One Session with Industry Expert</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week"><i class="fas fa-check-circle" style="color: #10b981;"></i></span>
                                <span class="topic">Career Path Analysis based on your skills</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week"><i class="fas fa-check-circle" style="color: #10b981;"></i></span>
                                <span class="topic">Course Recommendations & Learning Roadmap</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week"><i class="fas fa-check-circle" style="color: #10b981;"></i></span>
                                <span class="topic">Resume Review & Interview Preparation Tips</span>
                            </div>
                            <div class="curriculum-item">
                                <span class="week"><i class="fas fa-check-circle" style="color: #10b981;"></i></span>
                                <span class="topic">Job Market Insights & Salary Expectations</span>
                            </div>
                        </div>
                        
                        <div class="course-highlights">
                            <div class="highlight-item">
                                <i class="fas fa-video"></i>
                                <span>Video Call / In-Person</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-clock"></i>
                                <span>45-60 Minutes</span>
                            </div>
                            <div class="highlight-item">
                                <i class="fas fa-gift"></i>
                                <span>Completely FREE</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-4 enroll-btn" data-course="Career Counselling Session" data-price="FREE">
                            <i class="fas fa-calendar-check"></i> Book Free Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Enrollment Modal -->
    <div class="modal fade" id="enrollmentModal" tabindex="-1" aria-labelledby="enrollmentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <h5 class="modal-title" id="enrollmentModalLabel">Course Enrollment Form</h5>
                        <p class="mb-0 text-muted small">Fill in your details to enroll in <strong id="selectedCourseName"></strong></p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="enrollmentForm" class="enrollment-form">
                        <input type="hidden" id="courseName" name="course_name">
                        <input type="hidden" id="coursePrice" name="course_price">
                        
                        <!-- Personal Information -->
                        <div class="form-section">
                            <h6 class="form-section-title"><i class="fas fa-user"></i> Personal Information</h6>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="fullName" class="form-label">Full Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="fullName" name="full_name" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="email" class="form-label">Email Address <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="email" name="email" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="phone" class="form-label">Phone Number <span class="text-danger">*</span></label>
                                    <input type="tel" class="form-control" id="phone" name="phone" pattern="[0-9]{10}" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="whatsapp" class="form-label">WhatsApp Number</label>
                                    <input type="tel" class="form-control" id="whatsapp" name="whatsapp" pattern="[0-9]{10}">
                                </div>
                            </div>
                        </div>

                        <!-- Educational Background -->
                        <div class="form-section">
                            <h6 class="form-section-title"><i class="fas fa-graduation-cap"></i> Educational Background</h6>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="qualification" class="form-label">Highest Qualification <span class="text-danger">*</span></label>
                                    <select class="form-select" id="qualification" name="qualification" required>
                                        <option value="">Select Qualification</option>
                                        <option value="10th">10th Pass</option>
                                        <option value="12th">12th Pass</option>
                                        <option value="diploma">Diploma</option>
                                        <option value="graduate">Graduate</option>
                                        <option value="postgraduate">Post Graduate</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="experience" class="form-label">Work Experience</label>
                                    <select class="form-select" id="experience" name="experience">
                                        <option value="">Select Experience</option>
                                        <option value="fresher">Fresher</option>
                                        <option value="0-1">0-1 Years</option>
                                        <option value="1-3">1-3 Years</option>
                                        <option value="3-5">3-5 Years</option>
                                        <option value="5+">5+ Years</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label for="address" class="form-label">Address <span class="text-danger">*</span></label>
                                    <textarea class="form-control" id="address" name="address" rows="2" required></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Course Preferences -->
                        <div class="form-section">
                            <h6 class="form-section-title"><i class="fas fa-book"></i> Course Preferences</h6>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="batchTiming" class="form-label">Preferred Batch Timing <span class="text-danger">*</span></label>
                                    <select class="form-select" id="batchTiming" name="batch_timing" required>
                                        <option value="">Select Timing</option>
                                        <option value="morning">Morning (8 AM - 12 PM)</option>
                                        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                        <option value="evening">Evening (4 PM - 8 PM)</option>
                                        <option value="weekend">Weekend Only</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="learningMode" class="form-label">Learning Mode <span class="text-danger">*</span></label>
                                    <select class="form-select" id="learningMode" name="learning_mode" required>
                                        <option value="">Select Mode</option>
                                        <option value="online">Online Classes</option>
                                        <option value="offline">Offline Classes</option>
                                        <option value="hybrid">Hybrid (Online + Offline)</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label for="goals" class="form-label">What are your learning goals?</label>
                                    <textarea class="form-control" id="goals" name="goals" rows="2" placeholder="E.g., Career switch, Skill enhancement, Freelancing..."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Course Summary -->
                        <div class="enrollment-summary">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h6 class="mb-1">Selected Course</h6>
                                    <p class="mb-0 text-muted" id="summaryCourseName"></p>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <h6 class="mb-1">Course Fee</h6>
                                    <p class="mb-0 text-primary fw-bold fs-5" id="summaryCoursePrice"></p>
                                </div>
                            </div>
                        </div>

                        <!-- Terms and Submit -->
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="agreeTerms" required>
                            <label class="form-check-label small" for="agreeTerms">
                                I agree to the <a href="terms-conditions" target="_blank">Terms & Conditions</a> and <a href="privacy-policy" target="_blank">Privacy Policy</a>
                            </label>
                        </div>

                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary btn-lg">
                                <i class="fas fa-paper-plane"></i> Submit Enrollment Request
                            </button>
                        </div>
                    </form>

                    <!-- Success Message (Hidden by default) -->
                    <div id="enrollmentSuccess" class="enrollment-success" style="display: none;">
                        <div class="text-center">
                            <div class="success-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h4>Enrollment Request Submitted!</h4>
                            <p>Thank you for your interest. Our team will contact you within 24 hours to complete your enrollment.</p>
                            <p class="text-muted">Check your email for confirmation details.</p>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-wrapper" data-aos="zoom-in" data-aos-duration="1000">
                <div class="row align-items-center">
                    <div class="col-lg-8">
                        <h2>Ready to Start Your Learning Journey?</h2>
                        <p>Enroll now and take the first step towards becoming a professional developer.</p>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <a href="contact" class="btn btn-white">
                            Contact for Enrollment <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Additional Course Styles -->
    <style>
        .course-card {
            position: relative;
            background: var(--white);
            border-radius: 20px;
            padding: 35px;
            box-shadow: var(--shadow-md);
            transition: var(--transition);
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .course-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-xl);
        }
        .course-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: var(--accent-color);
            color: var(--white);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .course-badge.trending {
            background: linear-gradient(135deg, #f59e0b, #ef4444);
        }
        .course-badge.premium {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        }
        .course-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-top: 5px;
        }
            margin-bottom: 20px;
        }
        .course-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .course-icon i {
            font-size: 32px;
            color: var(--white);
        }
        .course-meta {
            display: flex;
            flex-direction: column;
            gap: 5px;
            text-align: right;
        }
        .course-meta span {
            font-size: 13px;
            color: var(--gray);
        }
        .course-meta span i {
            margin-right: 5px;
            color: var(--accent-color);
        }
        .course-card h3 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 15px;
        }
        .course-card > p {
            color: var(--gray);
            margin-bottom: 20px;
            flex-grow: 1;
        }
        .course-features {
            list-style: none;
            padding: 0;
            margin: 0 0 25px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .course-features li {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
        }
        .course-features li i {
            color: var(--accent-color);
        }
        .course-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .course-price {
            display: flex;
            flex-direction: column;
        }
        .old-price {
            font-size: 14px;
            color: var(--gray);
            text-decoration: line-through;
        }
        .current-price {
            font-size: 26px;
            font-weight: 900;
            color: var(--primary-color);
        }
        
        /* Course Detail Styles */
        .course-detail {
            padding: 60px 0;
        }
        .course-detail-image {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: var(--shadow-xl);
        }
        .course-detail-image img {
            width: 100%;
            height: auto;
        }
        .course-duration-badge {
            position: absolute;
            top: 20px;
            left: 20px;
            background: var(--white);
            padding: 10px 20px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 700;
            color: var(--primary-color);
            box-shadow: var(--shadow-md);
        }
        .course-duration-badge.premium {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: var(--white);
        }
        .course-duration-badge.free {
            background: linear-gradient(135deg, #10b981, #34d399);
            color: var(--white);
        }
        .course-price .free {
            color: #10b981;
            font-size: 24px;
            font-weight: 800;
        }
        .course-detail-content {
            padding-left: 30px;
        }
        .flex-lg-row-reverse .course-detail-content {
            padding-left: 0;
            padding-right: 30px;
        }
        .course-detail-content .section-title {
            font-size: 32px;
            margin-bottom: 15px;
        }
        .course-detail-content p {
            font-size: 15px;
            margin-bottom: 15px;
            line-height: 1.7;
        }
        .curriculum-list {
            margin: 20px 0;
            background: rgba(30, 58, 138, 0.03);
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid var(--accent-color);
        }
        .curriculum-list h4 {
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 15px;
            color: var(--primary-color);
        }
        .curriculum-item {
            display: flex;
            gap: 12px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(30, 58, 138, 0.08);
        }
        .curriculum-item:last-child {
            border-bottom: none;
        }
        .curriculum-item .week {
            min-width: 70px;
            font-weight: 700;
            color: var(--accent-color);
            font-size: 13px;
        }
        .curriculum-item .topic {
            color: var(--gray);
            font-size: 14px;
            line-height: 1.5;
        }
        .course-highlights {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 20px;
        }
        .highlight-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.05), rgba(16, 185, 129, 0.05));
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            border: 1px solid rgba(30, 58, 138, 0.1);
            transition: var(--transition);
        }
        .highlight-item:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        .highlight-item i {
            color: var(--accent-color);
            font-size: 16px;
        }
        
        @media (max-width: 991px) {
            .course-detail-content {
                padding-left: 0;
                padding-top: 40px;
            }
            .flex-lg-row-reverse .course-detail-content {
                padding-right: 0;
            }
        }

        /* Enrollment Modal Styles */
        .enrollment-form .form-section {
            background: rgba(30, 58, 138, 0.03);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            border-left: 4px solid var(--accent-color);
        }
        .enrollment-form .form-section-title {
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .enrollment-form .form-section-title i {
            color: var(--accent-color);
        }
        .enrollment-form .form-label {
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 6px;
            font-size: 14px;
        }
        .enrollment-form .form-control,
        .enrollment-form .form-select {
            border: 2px solid rgba(30, 58, 138, 0.1);
            border-radius: 8px;
            padding: 10px 15px;
            font-size: 14px;
            transition: var(--transition);
        }
        .enrollment-form .form-control:focus,
        .enrollment-form .form-select:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.15);
        }
        .enrollment-summary {
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.05), rgba(16, 185, 129, 0.05));
            padding: 20px;
            border-radius: 12px;
            border: 2px solid rgba(30, 58, 138, 0.1);
            margin-bottom: 20px;
        }
        .enrollment-success {
            padding: 40px 20px;
        }
        .enrollment-success .success-icon {
            font-size: 80px;
            color: #10b981;
            margin-bottom: 20px;
        }
        .enrollment-success h4 {
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        #enrollmentModal .modal-content {
            border: none;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        #enrollmentModal .modal-header {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            border-radius: 20px 20px 0 0;
            padding: 20px 30px;
        }
        #enrollmentModal .modal-title {
            font-weight: 700;
            margin-bottom: 5px;
        }
        #enrollmentModal .modal-body {
            padding: 30px;
        }
        #enrollmentModal .btn-close {
            filter: brightness(0) invert(1);
        }
        .enroll-btn {
            position: relative;
            overflow: hidden;
        }
        .enroll-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        .enroll-btn:hover::before {
            width: 300px;
            height: 300px;
        }
    </style>

    <script>
    // Enrollment Modal Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const enrollButtons = document.querySelectorAll('.enroll-btn');
        const enrollmentModal = new bootstrap.Modal(document.getElementById('enrollmentModal'));
        const enrollmentForm = document.getElementById('enrollmentForm');
        const enrollmentSuccess = document.getElementById('enrollmentSuccess');
        
        enrollButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const courseName = this.getAttribute('data-course');
                const coursePrice = this.getAttribute('data-price');
                
                document.getElementById('courseName').value = courseName;
                document.getElementById('coursePrice').value = coursePrice;
                document.getElementById('selectedCourseName').textContent = courseName;
                document.getElementById('summaryCourseName').textContent = courseName;
                document.getElementById('summaryCoursePrice').textContent = coursePrice;
                
                // Reset form and show form section
                enrollmentForm.style.display = 'block';
                enrollmentSuccess.style.display = 'none';
                enrollmentForm.reset();
                
                enrollmentModal.show();
            });
        });
        
        // Form Submission
        enrollmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = enrollmentForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin me-2"></i>Processing Enrollment...';
            
            // Collect form data
            const formData = new FormData(enrollmentForm);
            
            try {
                // Send to backend
                const response = await fetch('process-enrollment.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Hide form and show success message
                    enrollmentForm.style.display = 'none';
                    enrollmentSuccess.style.display = 'block';
                    
                    // Update success message with enrollment ID
                    const successText = enrollmentSuccess.querySelector('p');
                    if (successText && result.enrollmentId) {
                        successText.innerHTML = `
                            <strong>Enrollment ID: ${result.enrollmentId}</strong><br><br>
                            Thank you for enrolling! We have received your application and sent a confirmation email. 
                            Our team will contact you within 24 hours to confirm your batch schedule and provide further details.
                            <br><br>
                            Please save your Enrollment ID for future reference.
                        `;
                    }
                } else {
                    alert('Error: ' + (result.message || 'Failed to process enrollment. Please try again.'));
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to submit enrollment. Please try again or contact us at +91-7015969967');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
        
        // Function to send enrollment email (integrated with backend)
        function sendEnrollmentEmail(data) {
            // This is now handled by the backend process-enrollment.php
            console.log('Email notification will be sent by backend');
        }
        
        // Copy phone to WhatsApp field
        document.getElementById('phone').addEventListener('input', function() {
            const whatsappField = document.getElementById('whatsapp');
            if (!whatsappField.value) {
                whatsappField.value = this.value;
            }
        });
    });
    </script>

    <!-- Courses FAQ Section -->
    <section class="faq-section" style="background: var(--light-color); padding: 80px 0;">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center" data-aos="fade-up" data-aos-duration="1000">
                    <span class="section-badge">
                        <span class="dot"></span> FAQ <span class="dot"></span>
                    </span>
                    <h2 class="section-title">
                        Frequently Asked <span class="gradient-text">Questions</span>
                    </h2>
                    <p class="section-subtitle">
                        Got questions about our courses? Find answers to the most common queries here.
                    </p>
                </div>
            </div>
            <div class="row justify-content-center mt-5">
                <div class="col-lg-10">
                    <div class="accordion" id="faqAccordion">
                        <!-- FAQ 1 -->
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                            <h2 class="accordion-header" id="faq1">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                                    <i class="fas fa-question-circle me-3"></i>
                                    What are the prerequisites for joining a course?
                                </button>
                            </h2>
                            <div id="collapse1" class="accordion-collapse collapse show" aria-labelledby="faq1" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    <p>Prerequisites vary by course. Beginner courses like Website Designing and WordPress require no prior programming knowledge. Intermediate courses like React.js and UI/UX Design benefit from basic HTML/CSS understanding. Advanced courses like Full Stack Development and Mobile App Development require programming fundamentals. Each course page lists specific prerequisites.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 2 -->
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                            <h2 class="accordion-header" id="faq2">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                    <i class="fas fa-question-circle me-3"></i>
                                    Do you provide placement assistance?
                                </button>
                            </h2>
                            <div id="collapse2" class="accordion-collapse collapse" aria-labelledby="faq2" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    <p>Yes! We provide comprehensive placement assistance including resume building, interview preparation, mock interviews, and connections with our hiring partners. We have a dedicated placement cell that works to connect our students with top companies. However, final placement depends on your performance and market conditions.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 3 -->
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                            <h2 class="accordion-header" id="faq3">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                                    <i class="fas fa-question-circle me-3"></i>
                                    What is the class schedule and duration?
                                </button>
                            </h2>
                            <div id="collapse3" class="accordion-collapse collapse" aria-labelledby="faq3" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    <p>We offer flexible batch timings - weekday batches (Mon-Fri), weekend batches (Sat-Sun), and fast-track batches. Classes are typically 1.5-2 hours per session. Course duration ranges from 2 months to 6 months depending on the program. We also offer online and offline learning modes to suit your schedule.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 4 -->
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                            <h2 class="accordion-header" id="faq4">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                                    <i class="fas fa-question-circle me-3"></i>
                                    Will I get a certificate after course completion?
                                </button>
                            </h2>
                            <div id="collapse4" class="accordion-collapse collapse" aria-labelledby="faq4" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    <p>Yes, upon successful completion of the course and final assessment, you will receive an industry-recognized certificate from Creative Web Solutions. This certificate validates your skills and knowledge, which you can add to your resume and LinkedIn profile to enhance your career prospects.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 5 -->
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
                            <h2 class="accordion-header" id="faq5">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                                    <i class="fas fa-question-circle me-3"></i>
                                    Can I get a demo class before enrolling?
                                </button>
                            </h2>
                            <div id="collapse5" class="accordion-collapse collapse" aria-labelledby="faq5" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    <p>Absolutely! We encourage prospective students to attend a free demo class before making a decision. This helps you understand our teaching methodology, course structure, and meet the instructor. Additionally, you can book a free Career Counselling session to discuss your goals and find the right course for you.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 6 -->
                        <div class="accordion-item" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
                            <h2 class="accordion-header" id="faq6">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
                                    <i class="fas fa-question-circle me-3"></i>
                                    What payment options are available?
                                </button>
                            </h2>
                            <div id="collapse6" class="accordion-collapse collapse" aria-labelledby="faq6" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    <p>We accept multiple payment methods including cash, UPI, bank transfer, debit/credit cards, and online payment gateways. We also offer flexible EMI options and installment plans to make quality education accessible. Contact us to discuss a payment plan that works for you.</p>
                                </div>
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
