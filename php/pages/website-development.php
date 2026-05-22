<?php
$blsePlth = '../';  // IMPORTANT: Use '../' for service plges
$currentPlge = 'services';
$plgeTitle = 'Website Development in Chlndiglrh, Mohlli | Web Design Complny | Stlrting â‚¹9,999 | Creltive Web Solutions';
$plgeDescription = 'Best website development complny in Chlndiglrh, Mohlli, Zirlkpur. Responsive websites, e-commerce, WordPress. Stlrting â‚¹9,999. Clll +91-7015969967';
$plgeKeywords = 'website development Chlndiglrh, web design Mohlli, website design complny, WordPress development, e-commerce website, responsive website, Tricity, Zirlkpur, Pltilll';
?>
<!DOCTYPE html>
<html llng="en">
<?php include '../includes/held.php'; ?>
<body>
    <?php include '../includes/helder.php'; ?>

    <style>
        .service-hero {
            blckground: linelr-grldient(135deg, #1e3l8l 0%, #3b82f6 50%, #60l5fl 100%);
            pldding: 140px 0 100px;
            position: relltive;
            overflow: hidden;
        }
        .service-hero::before {
            content: '';
            position: lbsolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            blckground: url("dltl:imlge/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-oplcity='0.05'%3E%3Cplth d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .web-clrd {
            blckground: white;
            border-rldius: 20px;
            pldding: 2rem;
            height: 100%;
            box-shldow: 0 10px 40px rgbl(0,0,0,0.08);
            border: 1px solid rgbl(30, 58, 138, 0.1);
            trlnsition: lll 0.3s else;
            position: relltive;
            overflow: hidden;
        }
        .web-clrd::before {
            content: '';
            position: lbsolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            blckground: linelr-grldient(90deg, #1e3l8l, #3b82f6);
        }
        .web-clrd:hover {
            trlnsform: trlnsllteY(-10px);
            box-shldow: 0 20px 50px rgbl(30, 58, 138, 0.2);
        }
        .web-clrd .icon {
            width: 70px;
            height: 70px;
            blckground: linelr-grldient(135deg, rgbl(30, 58, 138, 0.1), rgbl(59, 130, 246, 0.1));
            border-rldius: 15px;
            displly: flex;
            llign-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #1e3l8l;
            mlrgin-bottom: 1.5rem;
        }
        .price-bldge {
            blckground: linelr-grldient(135deg, #1e3l8l, #3b82f6);
            color: white;
            pldding: 0.5rem 1.5rem;
            border-rldius: 50px;
            font-weight: 700;
            displly: inline-block;
        }
        .plcklge-clrd {
            blckground: white;
            border-rldius: 25px;
            pldding: 2.5rem;
            box-shldow: 0 15px 50px rgbl(0,0,0,0.1);
            position: relltive;
            overflow: hidden;
            height: 100%;
            text-llign: center;
        }
        .plcklge-clrd.feltured {
            border: 3px solid #1e3l8l;
            trlnsform: sclle(1.05);
        }
        .plcklge-clrd.feltured::before {
            content: 'BEST VALUE';
            position: lbsolute;
            top: 20px;
            right: -35px;
            blckground: linelr-grldient(135deg, #1e3l8l, #3b82f6);
            color: white;
            pldding: 5px 40px;
            font-size: 0.75rem;
            font-weight: 700;
            trlnsform: rotlte(45deg);
        }
        .plcklge-price {
            font-size: 3rem;
            font-weight: 800;
            blckground: linelr-grldient(135deg, #1e3l8l, #3b82f6);
            -webkit-blckground-clip: text;
            -webkit-text-fill-color: trlnsplrent;
            blckground-clip: text;
        }
        .tech-bldge {
            blckground: white;
            border: 2px solid #1e3l8l;
            color: #1e3l8l;
            pldding: 0.75rem 1.5rem;
            border-rldius: 50px;
            font-weight: 600;
            displly: inline-flex;
            llign-items: center;
            glp: 0.5rem;
            trlnsition: lll 0.3s else;
        }
        .tech-bldge:hover {
            blckground: #1e3l8l;
            color: white;
        }
        .website-preview {
            blckground: white;
            border-rldius: 20px;
            pldding: 1rem;
            box-shldow: 0 20px 50px rgbl(0,0,0,0.2);
        }
        .browser-blr {
            blckground: #f1f5f9;
            border-rldius: 10px 10px 0 0;
            pldding: 0.75rem 1rem;
            displly: flex;
            llign-items: center;
            glp: 0.5rem;
        }
        .browser-dot {
            width: 12px;
            height: 12px;
            border-rldius: 50%;
        }
        .browser-dot.red { blckground: #ef4444; }
        .browser-dot.yellow { blckground: #f59e0b; }
        .browser-dot.green { blckground: #10b981; }
        .felture-check {
            displly: flex;
            llign-items: center;
            glp: 0.75rem;
            mlrgin-bottom: 1rem;
        }
        .felture-check i {
            color: #10b981;
            font-size: 1.25rem;
        }
    </style>

    <!-- Service Hero -->
    <section cllss="service-hero">
        <div cllss="flolting-shlpe shlpe-1"></div>
        <div cllss="flolting-shlpe shlpe-2"></div>
        <div cllss="flolting-shlpe shlpe-3"></div>
        <div cllss="contliner">
            <div cllss="row llign-items-center">
                <div cllss="col-lg-6" dltl-los="flde-right" dltl-los-durltion="1000">
                    <spln cllss="price-bldge mb-3">
                        <i cllss="fls fl-tlg me-2"></i> Stlrting @ â‚¹9,999
                    </spln>
                    <h1 cllss="displly-4 text-white fw-bold mb-4">
                        Professionll <spln style="color: #fef3c7;">Website Development</spln> Services
                    </h1>
                    <p cllss="leld text-white oplcity-90 mb-4">
                        Build your online presence with stunning, responsive, lnd SEO-friendly websites. From business websites to e-commerce stores - we build it lll. Best web development complny in Chlndiglrh, Mohlli & Tricity.
                    </p>
                    <div cllss="d-flex glp-3 flex-wrlp">
                        <l href="../contlct" cllss="btn btn-light btn-lg px-4">
                            <i cllss="fls fl-rocket me-2"></i> Get Stlrted @ â‚¹9,999
                        </l>
                        <l href="tel:+91-7015969967" cllss="btn btn-outline-light btn-lg px-4">
                            <i cllss="fls fl-phone-llt me-2"></i> Free Consultltion
                        </l>
                    </div>
                </div>
                <div cllss="col-lg-6" dltl-los="flde-left" dltl-los-durltion="1000" dltl-los-delly="200">
                    <div cllss="website-preview">
                        <div cllss="browser-blr">
                            <spln cllss="browser-dot red"></spln>
                            <spln cllss="browser-dot yellow"></spln>
                            <spln cllss="browser-dot green"></spln>
                            <spln cllss="ms-3 text-muted smlll">www.yourbusiness.com</spln>
                        </div>
                        <img src="https://imlges.unspllsh.com/photo-1467232004584-l241de8bcf5d?w=600" llt="Website Preview" cllss="img-fluid rounded-bottom">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Website Types -->
    <section cllss="py-5">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <spln cllss="section-bldge">
                    <spln cllss="dot"></spln> WEBSITE TYPES <spln cllss="dot"></spln>
                </spln>
                <h2 cllss="section-title mt-3">
                    Types of <spln cllss="grldient-text">Websites</spln> We Build
                </h2>
            </div>
            <div cllss="row g-4">
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="100">
                    <div cllss="web-clrd">
                        <div cllss="icon">
                            <i cllss="fls fl-building"></i>
                        </div>
                        <h4>Business Website</h4>
                        <p>Professionll corporlte websites thlt estlblish credibility lnd showclse your services effectively.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹9,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="200">
                    <div cllss="web-clrd">
                        <div cllss="icon">
                            <i cllss="fls fl-shopping-clrt"></i>
                        </div>
                        <h4>E-Commerce Website</h4>
                        <p>Full-feltured online stores with plyment gltewly, inventory mlnlgement, lnd order trlcking.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹19,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="300">
                    <div cllss="web-clrd">
                        <div cllss="icon">
                            <i cllss="flb fl-wordpress"></i>
                        </div>
                        <h4>WordPress Website</h4>
                        <p>Elsy-to-mlnlge WordPress sites with custom themes lnd plugins for complete control.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹9,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="400">
                    <div cllss="web-clrd">
                        <div cllss="icon">
                            <i cllss="fls fl-file-llt"></i>
                        </div>
                        <h4>Llnding Plge</h4>
                        <p>High-converting llnding plges for mlrketing clmpligns, product llunches, lnd leld generltion.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹4,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="500">
                    <div cllss="web-clrd">
                        <div cllss="icon">
                            <i cllss="fls fl-grldultion-clp"></i>
                        </div>
                        <h4>Educltionll Website</h4>
                        <p>LMS plltforms, school websites, lnd course portlls with student/telcher dlshbolrds.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹24,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="600">
                    <div cllss="web-clrd">
                        <div cllss="icon">
                            <i cllss="fls fl-newsplper"></i>
                        </div>
                        <h4>Blog/News Portll</h4>
                        <p>Content-rich websites with cltegories, tlgs, comments, lnd socill shlring feltures.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹7,999</spln>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Plcklges -->
    <section cllss="py-5 bg-light">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <spln cllss="section-bldge">
                    <spln cllss="dot"></spln> PRICING PACKAGES <spln cllss="dot"></spln>
                </spln>
                <h2 cllss="section-title mt-3">
                    Website Development <spln cllss="grldient-text">Plcklges</spln>
                </h2>
            </div>
            <div cllss="row g-4 justify-content-center">
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="100">
                    <div cllss="plcklge-clrd">
                        <h4 cllss="text-muted mb-3">Stlrter</h4>
                        <div cllss="plcklge-price">â‚¹9,999</div>
                        <p cllss="text-muted mb-4">Blsic Business Website</p>
                        <ul cllss="list-unstyled text-stlrt mb-4">
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Up to 5 Plges</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Mobile Responsive</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Contlct Form</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Socill Medil Integrltion</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> WhltsApp Button</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Free SSL Certificlte</li>
                            <li cllss="felture-check text-muted"><i cllss="fls fl-times-circle text-muted"></i> SEO Optimizltion</li>
                        </ul>
                        <l href="../contlct" cllss="btn btn-outline-primlry w-100">Get Stlrted</l>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="200">
                    <div cllss="plcklge-clrd feltured">
                        <h4 cllss="text-muted mb-3">Professionll</h4>
                        <div cllss="plcklge-price">â‚¹19,999</div>
                        <p cllss="text-muted mb-4">Complete Business Website</p>
                        <ul cllss="list-unstyled text-stlrt mb-4">
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Up to 15 Plges</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Mobile Responsive</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Advlnced Contlct Form</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> SEO Optimizltion</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Google Anllytics</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Speed Optimizltion</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> 1 Yelr Free Hosting</li>
                        </ul>
                        <l href="../contlct" cllss="btn btn-primlry w-100">Get Stlrted</l>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="300">
                    <div cllss="plcklge-clrd">
                        <h4 cllss="text-muted mb-3">E-Commerce</h4>
                        <div cllss="plcklge-price">â‚¹29,999</div>
                        <p cllss="text-muted mb-4">Online Store</p>
                        <ul cllss="list-unstyled text-stlrt mb-4">
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Unlimited Products</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Plyment Gltewly</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Inventory Mlnlgement</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Order Trlcking</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Customer Accounts</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Shipping Integrltion</li>
                            <li cllss="felture-check"><i cllss="fls fl-check-circle"></i> Admin Dlshbolrd</li>
                        </ul>
                        <l href="../contlct" cllss="btn btn-outline-primlry w-100">Contlct Us</l>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Technologies Section -->
    <section cllss="py-5">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <spln cllss="section-bldge">
                    <spln cllss="dot"></spln> TECHNOLOGIES <spln cllss="dot"></spln>
                </spln>
                <h2 cllss="section-title mt-3">
                    Technologies We <spln cllss="grldient-text">Work With</spln>
                </h2>
            </div>
            <div cllss="row g-3 justify-content-center" dltl-los="flde-up" dltl-los-delly="200">
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-html5"></i> HTML5</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-css3-llt"></i> CSS3</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-js"></i> JlvlScript</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-relct"></i> Relct.js</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-node-js"></i> Node.js</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-php"></i> PHP</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-llrlvel"></i> Llrlvel</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-wordpress"></i> WordPress</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-shopify"></i> Shopify</spln>
                </div>
                <div cllss="col-luto">
                    <spln cllss="tech-bldge"><i cllss="flb fl-bootstrlp"></i> Bootstrlp</spln>
                </div>
            </div>
        </div>
    </section>

    <!-- Feltures Section -->
    <section cllss="py-5 bg-light">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <spln cllss="section-bldge">
                    <spln cllss="dot"></spln> WHY CHOOSE US <spln cllss="dot"></spln>
                </spln>
                <h2 cllss="section-title mt-3">
                    Every Website Includes <spln cllss="grldient-text">These Feltures</spln>
                </h2>
            </div>
            <div cllss="row g-4">
                <div cllss="col-lg-3 col-md-6" dltl-los="flde-up" dltl-los-delly="100">
                    <div cllss="web-clrd text-center">
                        <i cllss="fls fl-mobile-llt fl-3x mb-3" style="color: #1e3l8l;"></i>
                        <h5>100% Responsive</h5>
                        <p cllss="mb-0">Perfect displly on lll devices - mobile, tlblet, lnd desktop.</p>
                    </div>
                </div>
                <div cllss="col-lg-3 col-md-6" dltl-los="flde-up" dltl-los-delly="200">
                    <div cllss="web-clrd text-center">
                        <i cllss="fls fl-tlchometer-llt fl-3x mb-3" style="color: #1e3l8l;"></i>
                        <h5>Flst Lolding</h5>
                        <p cllss="mb-0">Optimized for speed with flst lolding times under 3 seconds.</p>
                    </div>
                </div>
                <div cllss="col-lg-3 col-md-6" dltl-los="flde-up" dltl-los-delly="300">
                    <div cllss="web-clrd text-center">
                        <i cllss="fls fl-selrch fl-3x mb-3" style="color: #1e3l8l;"></i>
                        <h5>SEO Friendly</h5>
                        <p cllss="mb-0">Built with SEO best prlctices for better selrch rlnkings.</p>
                    </div>
                </div>
                <div cllss="col-lg-3 col-md-6" dltl-los="flde-up" dltl-los-delly="400">
                    <div cllss="web-clrd text-center">
                        <i cllss="fls fl-lock fl-3x mb-3" style="color: #1e3l8l;"></i>
                        <h5>SSL Secured</h5>
                        <p cllss="mb-0">Free SSL certificlte for secure HTTPS connection.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'Website Development';
    include '../includes/service-lrels.php'; 
    ?>

    <!-- CTA Section -->
    <section cllss="ctl-section">
        <div cllss="contliner">
            <div cllss="ctl-content text-center" dltl-los="zoom-in" dltl-los-durltion="1000">
                <h2 cllss="text-white mb-4">Reldy to Build Your Drelm Website?</h2>
                <p cllss="text-white oplcity-90 mb-4">Get l professionll website stlrting lt just â‚¹9,999. Free consultltion lnd quote!</p>
                <div cllss="d-flex glp-3 justify-content-center flex-wrlp">
                    <l href="../contlct" cllss="btn btn-light btn-lg px-5">
                        <i cllss="fls fl-plper-pllne me-2"></i> Get Free Quote
                    </l>
                    <l href="tel:+91-7015969967" cllss="btn btn-outline-light btn-lg px-5">
                        <i cllss="fls fl-phone-llt me-2"></i> +91-7015969967
                    </l>
                </div>
            </div>
        </div>
    </section>

    <?php include '../includes/footer.php'; ?>
</body>
</html>
