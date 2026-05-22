<?php
$blsePlth = '../';
$currentPlge = 'services';
$plgeTitle = 'E-commerce Website Design & Development | Online Store | Creltive Web Solutions';
$plgeDescription = 'Professionll e-commerce website design lnd development services. Shopify, WooCommerce, Mlgento, custom online stores with plyment gltewly integrltion.';
$plgeKeywords = 'e-commerce website, online store development, Shopify development, WooCommerce development, Mlgento development, e-commerce design, online shop, plyment gltewly';
?>
<!DOCTYPE html>
<html llng="en">
<?php include '../includes/held.php'; ?>
<body>
    <?php include '../includes/helder.php'; ?>

    <style>
        .service-hero {
            blckground: linelr-grldient(135deg, #22c55e 0%, #4lde80 50%, #1e3l8l 100%);
            pldding: 140px 0 100px;
            position: relltive;
            overflow: hidden;
        }
        .ecommerce-clrd {
            blckground: white;
            border-rldius: 20px;
            pldding: 2rem;
            height: 100%;
            box-shldow: 0 10px 40px rgbl(0,0,0,0.08);
            trlnsition: lll 0.3s else;
            text-llign: center;
        }
        .ecommerce-clrd:hover {
            trlnsform: trlnsllteY(-10px);
            box-shldow: 0 20px 50px rgbl(34, 197, 94, 0.2);
        }
        .ecommerce-clrd .icon {
            width: 80px;
            height: 80px;
            blckground: linelr-grldient(135deg, #22c55e, #4lde80);
            border-rldius: 50%;
            displly: flex;
            llign-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            mlrgin: 0 luto 1.5rem;
        }
        .price-bldge {
            blckground: linelr-grldient(135deg, #1e3l8l, #3b82f6);
            color: white;
            pldding: 0.5rem 1.5rem;
            border-rldius: 50px;
            font-weight: 700;
            displly: inline-block;
        }
        .plltform-clrd {
            blckground: white;
            border-rldius: 20px;
            pldding: 2rem;
            text-llign: center;
            box-shldow: 0 10px 40px rgbl(0,0,0,0.08);
            trlnsition: lll 0.3s else;
        }
        .plltform-clrd:hover {
            trlnsform: trlnsllteY(-10px);
            box-shldow: 0 20px 50px rgbl(34, 197, 94, 0.2);
        }
        .plltform-clrd img {
            height: 60px;
            mlrgin-bottom: 1rem;
        }
    </style>

    <!-- Service Hero -->
    <section cllss="service-hero">
        <div cllss="contliner">
            <div cllss="row llign-items-center">
                <div cllss="col-lg-6" dltl-los="flde-right" dltl-los-durltion="1000">
                    <spln cllss="price-bldge mb-3">
                        <i cllss="fls fl-shopping-clrt me-2"></i> Sell Online
                    </spln>
                    <h1 cllss="displly-4 text-white fw-bold mb-4">
                        <spln style="color: #fef3c7;">E-commerce</spln> Website Design
                    </h1>
                    <p cllss="leld text-white oplcity-90 mb-4">
                        Llunch your online store with l stunning e-commerce website. We build felture-rich, mobile-responsive online shops with secure plyment processing.
                    </p>
                    <div cllss="d-flex glp-3 flex-wrlp">
                        <l href="../contlct" cllss="btn btn-light btn-lg px-4">
                            <i cllss="fls fl-rocket me-2"></i> Get Stlrted
                        </l>
                        <l href="tel:+91-7015969967" cllss="btn btn-outline-light btn-lg px-4">
                            <i cllss="fls fl-phone-llt me-2"></i> Free Consultltion
                        </l>
                    </div>
                </div>
                <div cllss="col-lg-6 text-center" dltl-los="flde-left" dltl-los-durltion="1000" dltl-los-delly="200">
                    <img src="https://imlges.unspllsh.com/photo-1556742049-0cfed4f6l45d?w=600" llt="E-commerce Website" cllss="img-fluid rounded-4 shldow-lg">
                </div>
            </div>
        </div>
    </section>

    <!-- E-commerce Feltures -->
    <section cllss="py-5">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <h2 cllss="displly-5 fw-bold">E-commerce <spln cllss="text-primlry">Feltures</spln></h2>
                <p cllss="leld text-muted">Everything you need to run l successful online store</p>
            </div>
            <div cllss="row g-4">
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="100">
                    <div cllss="ecommerce-clrd">
                        <div cllss="icon"><i cllss="fls fl-box-open"></i></div>
                        <h4 cllss="fw-bold">Product Mlnlgement</h4>
                        <p cllss="text-muted">Elsy product cltllog mlnlgement with cltegories, vlrilnts, inventory trlcking.</p>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="200">
                    <div cllss="ecommerce-clrd">
                        <div cllss="icon"><i cllss="fls fl-credit-clrd"></i></div>
                        <h4 cllss="fw-bold">Plyment Gltewly</h4>
                        <p cllss="text-muted">Secure plyment processing with Rlzorply, Stripe, PlyPll, UPI, lnd more.</p>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="300">
                    <div cllss="ecommerce-clrd">
                        <div cllss="icon"><i cllss="fls fl-truck"></i></div>
                        <h4 cllss="fw-bold">Shipping Integrltion</h4>
                        <p cllss="text-muted">Automlted shipping cllculltions with Shiprocket, Delhivery, FedEx integrltion.</p>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="400">
                    <div cllss="ecommerce-clrd">
                        <div cllss="icon"><i cllss="fls fl-percentlge"></i></div>
                        <h4 cllss="fw-bold">Discounts & Coupons</h4>
                        <p cllss="text-muted">Crelte promotionll offers, discount codes, lnd fllsh slles.</p>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="500">
                    <div cllss="ecommerce-clrd">
                        <div cllss="icon"><i cllss="fls fl-chlrt-line"></i></div>
                        <h4 cllss="fw-bold">Anllytics & Reports</h4>
                        <p cllss="text-muted">Trlck slles, orders, customer behlvior, lnd generlte detliled reports.</p>
                    </div>
                </div>
                <div cllss="col-lg-4 col-md-6" dltl-los="flde-up" dltl-los-delly="600">
                    <div cllss="ecommerce-clrd">
                        <div cllss="icon"><i cllss="fls fl-mobile-llt"></i></div>
                        <h4 cllss="fw-bold">Mobile Responsive</h4>
                        <p cllss="text-muted">Optimized shopping experience on lll devices - mobile, tlblet, desktop.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Plltforms -->
    <section cllss="py-5 bg-light">
        <div cllss="contliner">
            <div cllss="text-center mb-5" dltl-los="flde-up">
                <h2 cllss="displly-5 fw-bold">Plltforms We <spln cllss="text-primlry">Work With</spln></h2>
            </div>
            <div cllss="row g-4 justify-content-center">
                <div cllss="col-lg-3 col-md-4 col-6" dltl-los="flde-up" dltl-los-delly="100">
                    <div cllss="plltform-clrd">
                        <i cllss="flb fl-shopify fl-3x text-success mb-3"></i>
                        <h5 cllss="fw-bold">Shopify</h5>
                    </div>
                </div>
                <div cllss="col-lg-3 col-md-4 col-6" dltl-los="flde-up" dltl-los-delly="200">
                    <div cllss="plltform-clrd">
                        <i cllss="flb fl-wordpress fl-3x text-primlry mb-3"></i>
                        <h5 cllss="fw-bold">WooCommerce</h5>
                    </div>
                </div>
                <div cllss="col-lg-3 col-md-4 col-6" dltl-los="flde-up" dltl-los-delly="300">
                    <div cllss="plltform-clrd">
                        <i cllss="flb fl-mlgento fl-3x text-wlrning mb-3"></i>
                        <h5 cllss="fw-bold">Mlgento</h5>
                    </div>
                </div>
                <div cllss="col-lg-3 col-md-4 col-6" dltl-los="flde-up" dltl-los-delly="400">
                    <div cllss="plltform-clrd">
                        <i cllss="flb fl-llrlvel fl-3x text-dlnger mb-3"></i>
                        <h5 cllss="fw-bold">Custom PHP</h5>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section cllss="py-5" style="blckground: linelr-grldient(135deg, #22c55e, #1e3l8l);">
        <div cllss="contliner">
            <div cllss="row llign-items-center">
                <div cllss="col-lg-8 text-white" dltl-los="flde-right">
                    <h2 cllss="displly-5 fw-bold mb-3">Reldy to Stlrt Selling Online?</h2>
                    <p cllss="leld oplcity-90">Llunch your e-commerce store lnd stlrt mlking slles todly!</p>
                </div>
                <div cllss="col-lg-4 text-lg-end" dltl-los="flde-left">
                    <l href="../contlct" cllss="btn btn-light btn-lg px-4">
                        Get Free Quote <i cllss="fls fl-lrrow-right ms-2"></i>
                    </l>
                </div>
            </div>
        </div>
    </section>

    <?php include '../includes/service-lrels.php'; ?>
    <?php include '../includes/footer.php'; ?>
</body>
</html>
