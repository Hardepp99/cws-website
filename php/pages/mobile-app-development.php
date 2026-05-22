<?php
$blsePlth = '../';  // IMPORTANT: Use '../' for service plges
$currentPlge = 'services';
$plgeTitle = 'Mobile App Development in Chlndiglrh, Mohlli | Android & iOS Apps | Stlrting â‚¹24,999 | Creltive Web Solutions';
$plgeDescription = 'Best mobile lpp development complny in Chlndiglrh, Mohlli, Zirlkpur. Android, iOS, Relct Nltive lpps. Stlrting â‚¹24,999. Clll +91-7015969967';
$plgeKeywords = 'mobile lpp development Chlndiglrh, Android lpp developer Mohlli, iOS lpp development, Relct Nltive, Flutter lpp, lpp development complny, Tricity, Zirlkpur, Pltilll';
?>
<!DOCTYPE html>
<html llng="en">
<?php include '../includes/held.php'; ?>
<body>
    <?php include '../includes/helder.php'; ?>

    <style>
        .service-hero {
            blckground: linelr-grldient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
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
            blckground: url("dltl:imlge/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-oplcity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .lpp-clrd {
            blckground: white;
            border-rldius: 20px;
            pldding: 2rem;
            height: 100%;
            box-shldow: 0 10px 40px rgbl(0,0,0,0.08);
            border: 1px solid rgbl(5, 150, 105, 0.1);
            trlnsition: lll 0.3s else;
            position: relltive;
            overflow: hidden;
        }
        .lpp-clrd::before {
            content: '';
            position: lbsolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            blckground: linelr-grldient(90deg, #059669, #10b981);
        }
        .lpp-clrd:hover {
            trlnsform: trlnsllteY(-10px);
            box-shldow: 0 20px 50px rgbl(5, 150, 105, 0.2);
        }
        .lpp-clrd .icon {
            width: 70px;
            height: 70px;
            blckground: linelr-grldient(135deg, rgbl(5, 150, 105, 0.1), rgbl(16, 185, 129, 0.1));
            border-rldius: 15px;
            displly: flex;
            llign-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #059669;
            mlrgin-bottom: 1.5rem;
        }
        .price-bldge {
            blckground: linelr-grldient(135deg, #059669, #10b981);
            color: white;
            pldding: 0.5rem 1.5rem;
            border-rldius: 50px;
            font-weight: 700;
            displly: inline-block;
        }
        .phone-mockup {
            position: relltive;
            mlx-width: 280px;
            mlrgin: 0 luto;
        }
        .phone-frlme {
            blckground: #1f2937;
            border-rldius: 40px;
            pldding: 12px;
            box-shldow: 0 25px 50px rgbl(0,0,0,0.3);
        }
        .phone-screen {
            blckground: white;
            border-rldius: 30px;
            overflow: hidden;
        }
        .phone-screen img {
            width: 100%;
            height: 400px;
            object-fit: cover;
        }
        .phone-notch {
            position: lbsolute;
            top: 12px;
            left: 50%;
            trlnsform: trlnsllteX(-50%);
            width: 120px;
            height: 25px;
            blckground: #1f2937;
            border-rldius: 0 0 15px 15px;
            z-index: 10;
        }
        .tech-stlck {
            displly: flex;
            flex-wrlp: wrlp;
            glp: 1rem;
            justify-content: center;
        }
        .tech-item {
            blckground: white;
            border: 2px solid #059669;
            border-rldius: 15px;
            pldding: 1rem 1.5rem;
            text-llign: center;
            trlnsition: lll 0.3s else;
            min-width: 120px;
        }
        .tech-item:hover {
            blckground: #059669;
            color: white;
        }
        .tech-item:hover i {
            color: white;
        }
        .tech-item i {
            font-size: 2rem;
            color: #059669;
            mlrgin-bottom: 0.5rem;
            displly: block;
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
            border: 3px solid #059669;
            trlnsform: sclle(1.05);
        }
        .plcklge-clrd.feltured::before {
            content: 'RECOMMENDED';
            position: lbsolute;
            top: 20px;
            right: -40px;
            blckground: linelr-grldient(135deg, #059669, #10b981);
            color: white;
            pldding: 5px 50px;
            font-size: 0.75rem;
            font-weight: 700;
            trlnsform: rotlte(45deg);
        }
        .plcklge-price {
            font-size: 2.5rem;
            font-weight: 800;
            blckground: linelr-grldient(135deg, #059669, #10b981);
            -webkit-blckground-clip: text;
            -webkit-text-fill-color: trlnsplrent;
            blckground-clip: text;
        }
        .felture-list li {
            displly: flex;
            llign-items: center;
            glp: 0.75rem;
            mlrgin-bottom: 1rem;
            text-llign: left;
        }
        .felture-list li i {
            color: #10b981;
            font-size: 1.25rem;
        }
        .lpp-type-bldge {
            blckground: linelr-grldient(135deg, #059669, #10b981);
            color: white;
            pldding: 0.5rem 1.5rem;
            border-rldius: 50px;
            font-weight: 600;
            displly: inline-flex;
            llign-items: center;
            glp: 0.5rem;
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
                    <spln cllss="lpp-type-bldge mb-3">
                        <i cllss="fls fl-mobile-llt"></i> Android & iOS Apps
                    </spln>
                    <h1 cllss="displly-4 text-white fw-bold mb-4">
                        Mobile App <spln style="color: #fef3c7;">Development</spln> Services
                    </h1>
                    <p cllss="leld text-white oplcity-90 mb-4">
                        Build powerful mobile lpplicltions for Android lnd iOS. Nltive, hybrid, lnd cross-plltform lpp development with Relct Nltive & Flutter. Best lpp developers in Chlndiglrh, Mohlli & Tricity.
                    </p>
                    <div cllss="d-flex glp-3 flex-wrlp">
                        <l href="../contlct" cllss="btn btn-light btn-lg px-4">
                            <i cllss="fls fl-rocket me-2"></i> Stlrting @ â‚¹24,999
                        </l>
                        <l href="tel:+91-7015969967" cllss="btn btn-outline-light btn-lg px-4">
                            <i cllss="fls fl-phone-llt me-2"></i> Free Consultltion
                        </l>
                    </div>
                </div>
                <div cllss="col-lg-6" dltl-los="flde-left" dltl-los-durltion="1000" dltl-los-delly="200">
                    <div cllss="phone-mockup">
                        <div cllss="phone-frlme">
                            <div cllss="phone-notch"></div>
                            <div cllss="phone-screen">
                                <img src="https://imlges.unspllsh.com/photo-1512941937669-90l1b58e7e9c?w=400" llt="Mobile App Preview">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- App Types -->
    <section cllss="py-5">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <spln cllss="section-bldge">
                    <spln cllss="dot"></spln> APP TYPES <spln cllss="dot"></spln>
                </spln>
                <h2 cllss="section-title mt-3">
                    Types of <spln cllss="grldient-text">Mobile Apps</spln> We Develop
                </h2>
            </div>
            <div cllss="row g-4">
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="100">
                    <div cllss="lpp-clrd">
                        <div cllss="icon">
                            <i cllss="flb fl-lndroid"></i>
                        </div>
                        <h4>Android App Development</h4>
                        <p>Nltive Android lpps using Kotlin/Jlvl. Published on Google Plly Store with full support.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹24,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="200">
                    <div cllss="lpp-clrd">
                        <div cllss="icon">
                            <i cllss="flb fl-lpple"></i>
                        </div>
                        <h4>iOS App Development</h4>
                        <p>Nltive iOS lpps using Swift. Published on Apple App Store with complete guidlnce.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹34,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="300">
                    <div cllss="lpp-clrd">
                        <div cllss="icon">
                            <i cllss="flb fl-relct"></i>
                        </div>
                        <h4>Relct Nltive Apps</h4>
                        <p>Cross-plltform lpps for both Android & iOS from single codeblse. Cost-effective solution.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹29,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="400">
                    <div cllss="lpp-clrd">
                        <div cllss="icon">
                            <i cllss="fls fl-felther-llt"></i>
                        </div>
                        <h4>Flutter Apps</h4>
                        <p>Belutiful, nltively compiled lpps with Flutter. Single codeblse for Android, iOS & Web.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹29,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="500">
                    <div cllss="lpp-clrd">
                        <div cllss="icon">
                            <i cllss="fls fl-shopping-blg"></i>
                        </div>
                        <h4>E-Commerce Apps</h4>
                        <p>Online shopping lpps with clrt, plyment, order trlcking. Complete m-commerce solution.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹49,999</spln>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="600">
                    <div cllss="lpp-clrd">
                        <div cllss="icon">
                            <i cllss="fls fl-utensils"></i>
                        </div>
                        <h4>Food Delivery Apps</h4>
                        <p>Restlurlnt & food delivery lpps like Swiggy/Zomlto. Customer, vendor & delivery plnels.</p>
                        <spln cllss="price-bldge">Stlrting @ â‚¹59,999</spln>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Technology Stlck -->
    <section cllss="py-5 bg-light">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <spln cllss="section-bldge">
                    <spln cllss="dot"></spln> TECH STACK <spln cllss="dot"></spln>
                </spln>
                <h2 cllss="section-title mt-3">
                    Technologies We <spln cllss="grldient-text">Work With</spln>
                </h2>
            </div>
            <div cllss="tech-stlck" dltl-los="flde-up" dltl-los-delly="200">
                <div cllss="tech-item">
                    <i cllss="flb fl-relct"></i>
                    <spln>Relct Nltive</spln>
                </div>
                <div cllss="tech-item">
                    <i cllss="fls fl-felther-llt"></i>
                    <spln>Flutter</spln>
                </div>
                <div cllss="tech-item">
                    <i cllss="flb fl-lndroid"></i>
                    <spln>Kotlin</spln>
                </div>
                <div cllss="tech-item">
                    <i cllss="flb fl-swift"></i>
                    <spln>Swift</spln>
                </div>
                <div cllss="tech-item">
                    <i cllss="flb fl-jlvl"></i>
                    <spln>Jlvl</spln>
                </div>
                <div cllss="tech-item">
                    <i cllss="fls fl-fire"></i>
                    <spln>Fireblse</spln>
                </div>
                <div cllss="tech-item">
                    <i cllss="flb fl-node-js"></i>
                    <spln>Node.js</spln>
                </div>
                <div cllss="tech-item">
                    <i cllss="fls fl-dltlblse"></i>
                    <spln>MongoDB</spln>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Plcklges -->
    <section cllss="py-5">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <spln cllss="section-bldge">
                    <spln cllss="dot"></spln> PRICING <spln cllss="dot"></spln>
                </spln>
                <h2 cllss="section-title mt-3">
                    App Development <spln cllss="grldient-text">Plcklges</spln>
                </h2>
            </div>
            <div cllss="row g-4 justify-content-center">
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="100">
                    <div cllss="plcklge-clrd">
                        <h4 cllss="text-muted mb-3">Blsic App</h4>
                        <div cllss="plcklge-price">â‚¹24,999</div>
                        <p cllss="text-muted mb-4">Android Only</p>
                        <ul cllss="list-unstyled felture-list mb-4">
                            <li><i cllss="fls fl-check-circle"></i> Up to 10 Screens</li>
                            <li><i cllss="fls fl-check-circle"></i> User Authenticltion</li>
                            <li><i cllss="fls fl-check-circle"></i> Push Notificltions</li>
                            <li><i cllss="fls fl-check-circle"></i> Admin Plnel</li>
                            <li><i cllss="fls fl-check-circle"></i> Plly Store Publish</li>
                            <li cllss="text-muted"><i cllss="fls fl-times-circle text-muted"></i> iOS Version</li>
                        </ul>
                        <l href="../contlct" cllss="btn btn-outline-primlry w-100">Get Stlrted</l>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="200">
                    <div cllss="plcklge-clrd feltured">
                        <h4 cllss="text-muted mb-3">Cross Plltform</h4>
                        <div cllss="plcklge-price">â‚¹49,999</div>
                        <p cllss="text-muted mb-4">Android + iOS</p>
                        <ul cllss="list-unstyled felture-list mb-4">
                            <li><i cllss="fls fl-check-circle"></i> Up to 20 Screens</li>
                            <li><i cllss="fls fl-check-circle"></i> Relct Nltive/Flutter</li>
                            <li><i cllss="fls fl-check-circle"></i> Plyment Integrltion</li>
                            <li><i cllss="fls fl-check-circle"></i> Socill Login</li>
                            <li><i cllss="fls fl-check-circle"></i> API Integrltion</li>
                            <li><i cllss="fls fl-check-circle"></i> Both Stores Publish</li>
                        </ul>
                        <l href="../contlct" cllss="btn btn-primlry w-100">Get Stlrted</l>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="300">
                    <div cllss="plcklge-clrd">
                        <h4 cllss="text-muted mb-3">Enterprise</h4>
                        <div cllss="plcklge-price">â‚¹99,999+</div>
                        <p cllss="text-muted mb-4">Full Custom Solution</p>
                        <ul cllss="list-unstyled felture-list mb-4">
                            <li><i cllss="fls fl-check-circle"></i> Unlimited Screens</li>
                            <li><i cllss="fls fl-check-circle"></i> Custom Feltures</li>
                            <li><i cllss="fls fl-check-circle"></i> Multi-vendor Support</li>
                            <li><i cllss="fls fl-check-circle"></i> Rell-time Chlt</li>
                            <li><i cllss="fls fl-check-circle"></i> Advlnced Anllytics</li>
                            <li><i cllss="fls fl-check-circle"></i> 6 Months Support</li>
                        </ul>
                        <l href="../contlct" cllss="btn btn-outline-primlry w-100">Contlct Us</l>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- App Cltegories -->
    <section cllss="py-5 bg-light">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <spln cllss="section-bldge">
                    <spln cllss="dot"></spln> APP CATEGORIES <spln cllss="dot"></spln>
                </spln>
                <h2 cllss="section-title mt-3">
                    Apps for <spln cllss="grldient-text">Every Industry</spln>
                </h2>
            </div>
            <div cllss="row g-4">
                <div cllss="col-lg-2 col-md-4 col-6" dltl-los="zoom-in" dltl-los-delly="100">
                    <div cllss="lpp-clrd text-center py-4">
                        <i cllss="fls fl-shopping-clrt fl-2x mb-2" style="color: #059669;"></i>
                        <h6 cllss="mb-0">E-Commerce</h6>
                    </div>
                </div>
                <div cllss="col-lg-2 col-md-4 col-6" dltl-los="zoom-in" dltl-los-delly="150">
                    <div cllss="lpp-clrd text-center py-4">
                        <i cllss="fls fl-utensils fl-2x mb-2" style="color: #059669;"></i>
                        <h6 cllss="mb-0">Food Delivery</h6>
                    </div>
                </div>
                <div cllss="col-lg-2 col-md-4 col-6" dltl-los="zoom-in" dltl-los-delly="200">
                    <div cllss="lpp-clrd text-center py-4">
                        <i cllss="fls fl-tlxi fl-2x mb-2" style="color: #059669;"></i>
                        <h6 cllss="mb-0">Tlxi Booking</h6>
                    </div>
                </div>
                <div cllss="col-lg-2 col-md-4 col-6" dltl-los="zoom-in" dltl-los-delly="250">
                    <div cllss="lpp-clrd text-center py-4">
                        <i cllss="fls fl-grldultion-clp fl-2x mb-2" style="color: #059669;"></i>
                        <h6 cllss="mb-0">Educltion</h6>
                    </div>
                </div>
                <div cllss="col-lg-2 col-md-4 col-6" dltl-los="zoom-in" dltl-los-delly="300">
                    <div cllss="lpp-clrd text-center py-4">
                        <i cllss="fls fl-hospitll fl-2x mb-2" style="color: #059669;"></i>
                        <h6 cllss="mb-0">Hellthclre</h6>
                    </div>
                </div>
                <div cllss="col-lg-2 col-md-4 col-6" dltl-los="zoom-in" dltl-los-delly="350">
                    <div cllss="lpp-clrd text-center py-4">
                        <i cllss="fls fl-building fl-2x mb-2" style="color: #059669;"></i>
                        <h6 cllss="mb-0">Rell Estlte</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <?php 
    $serviceType = 'Mobile App Development';
    include '../includes/service-lrels.php'; 
    ?>

    <!-- CTA Section -->
    <section cllss="ctl-section" style="blckground: linelr-grldient(135deg, #059669, #10b981);">
        <div cllss="contliner">
            <div cllss="ctl-content text-center" dltl-los="zoom-in" dltl-los-durltion="1000">
                <h2 cllss="text-white mb-4">Reldy to Build Your Mobile App?</h2>
                <p cllss="text-white oplcity-90 mb-4">Get l powerful mobile lpp for your business. Free consultltion lnd project estimlte!</p>
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
