<?php
$basePath = '../';
$currentPage = 'services';
$pageTitle = 'Smart Contract Development | Solidity Developer | Ethereum & BSC | Creative Web Solutions';
$pageDescription = 'Expert smart contract development services on Ethereum, Binance Smart Chain, Polygon. Audited, secure, and gas-optimized smart contracts. DeFi, NFT, Token development.';
$pageKeywords = 'smart contract development, Solidity developer, Ethereum smart contract, BSC smart contract, DeFi development, token contract, NFT contract, smart contract audit';
?>
<!DOCTYPE html>
<html lang="en">
<?php include '../includes/head.php'; ?>
<body>
    <?php include '../includes/header.php'; ?>

    <style>
        .service-hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%);
            padding: 140px 0 100px;
            position: relative;
            overflow: hidden;
        }
        .service-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .smart-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            height: 100%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        .smart-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(30, 58, 138, 0.2);
        }
        .smart-card .icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
            margin-bottom: 1.5rem;
        }
        .price-badge {
            background: linear-gradient(135deg, #10b981, #34d399);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-weight: 700;
            display: inline-block;
        }
        .code-block {
            background: #1e293b;
            border-radius: 15px;
            padding: 1.5rem;
            color: #e2e8f0;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }
        .code-block .keyword { color: #f472b6; }
        .code-block .function { color: #60a5fa; }
        .code-block .string { color: #34d399; }
        .code-block .comment { color: #64748b; }
    </style>

    <!-- Service Hero -->
    <section class="service-hero">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                    <span class="price-badge mb-3">
                        <i class="fas fa-file-contract me-2"></i> Secure & Audited
                    </span>
                    <h1 class="display-4 text-white fw-bold mb-4">
                        <span style="color: #34d399;">Smart Contract</span> Development
                    </h1>
                    <p class="lead text-white opacity-90 mb-4">
                        Build secure, gas-optimized, and fully audited smart contracts for your DeFi, NFT, or token projects. Our Solidity experts deliver production-ready contracts.
                    </p>
                    <div class="d-flex gap-3 flex-wrap">
                        <a href="../contact" class="btn btn-light btn-lg px-4">
                            <i class="fas fa-rocket me-2"></i> Get Started
                        </a>
                        <a href="tel:+91-7015969967" class="btn btn-outline-light btn-lg px-4">
                            <i class="fas fa-phone-alt me-2"></i> Free Consultation
                        </a>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                    <div class="code-block">
                        <span class="comment">// SPDX-License-Identifier: MIT</span><br>
                        <span class="keyword">pragma</span> solidity ^0.8.19;<br><br>
                        <span class="keyword">contract</span> <span class="function">YourToken</span> {<br>
                        &nbsp;&nbsp;<span class="keyword">string</span> public name = <span class="string">"Your Token"</span>;<br>
                        &nbsp;&nbsp;<span class="keyword">uint256</span> public totalSupply;<br><br>
                        &nbsp;&nbsp;<span class="keyword">function</span> <span class="function">mint</span>() public {<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">// Your logic here</span><br>
                        &nbsp;&nbsp;}<br>
                        }
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Smart Contract Types -->
    <section class="py-5">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="display-5 fw-bold">Smart Contracts We <span class="text-primary">Develop</span></h2>
                <p class="lead text-muted">Custom smart contracts for every blockchain use case</p>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="smart-card">
                        <div class="icon"><i class="fas fa-coins"></i></div>
                        <h4 class="fw-bold">Token Contracts</h4>
                        <p class="text-muted">ERC20, BEP20, ERC721, ERC1155 token contracts with custom tokenomics, vesting, and distribution.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="smart-card">
                        <div class="icon"><i class="fas fa-chart-line"></i></div>
                        <h4 class="fw-bold">DeFi Protocols</h4>
                        <p class="text-muted">Staking, farming, lending, borrowing, and liquidity pool smart contracts.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                    <div class="smart-card">
                        <div class="icon"><i class="fas fa-images"></i></div>
                        <h4 class="fw-bold">NFT Contracts</h4>
                        <p class="text-muted">NFT minting, marketplace, auction, and royalty distribution contracts.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                    <div class="smart-card">
                        <div class="icon"><i class="fas fa-users"></i></div>
                        <h4 class="fw-bold">DAO Contracts</h4>
                        <p class="text-muted">Governance, voting, treasury management, and proposal contracts for DAOs.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                    <div class="smart-card">
                        <div class="icon"><i class="fas fa-exchange-alt"></i></div>
                        <h4 class="fw-bold">DEX Contracts</h4>
                        <p class="text-muted">AMM, order book, swap, and liquidity provider contracts for exchanges.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                    <div class="smart-card">
                        <div class="icon"><i class="fas fa-gamepad"></i></div>
                        <h4 class="fw-bold">GameFi Contracts</h4>
                        <p class="text-muted">Play-to-earn, in-game assets, rewards, and gaming economy contracts.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Our Process -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="display-5 fw-bold">Our <span class="text-primary">Process</span></h2>
            </div>
            <div class="row g-4">
                <div class="col-md-3" data-aos="fade-up" data-aos-delay="100">
                    <div class="text-center">
                        <div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px; font-size: 2rem;">1</div>
                        <h5 class="fw-bold">Requirements Analysis</h5>
                        <p class="text-muted small">Understand your business logic and contract requirements</p>
                    </div>
                </div>
                <div class="col-md-3" data-aos="fade-up" data-aos-delay="200">
                    <div class="text-center">
                        <div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px; font-size: 2rem;">2</div>
                        <h5 class="fw-bold">Development</h5>
                        <p class="text-muted small">Write secure, optimized Solidity code</p>
                    </div>
                </div>
                <div class="col-md-3" data-aos="fade-up" data-aos-delay="300">
                    <div class="text-center">
                        <div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px; font-size: 2rem;">3</div>
                        <h5 class="fw-bold">Testing & Audit</h5>
                        <p class="text-muted small">Comprehensive testing and security audit</p>
                    </div>
                </div>
                <div class="col-md-3" data-aos="fade-up" data-aos-delay="400">
                    <div class="text-center">
                        <div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px; font-size: 2rem;">4</div>
                        <h5 class="fw-bold">Deployment</h5>
                        <p class="text-muted small">Deploy to testnet and mainnet</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5" style="background: linear-gradient(135deg, #0f172a, #1e3a8a);">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-8 text-white" data-aos="fade-right">
                    <h2 class="display-5 fw-bold mb-3">Need a Custom Smart Contract?</h2>
                    <p class="lead opacity-90">Get secure, audited smart contracts for your project. Contact us today!</p>
                </div>
                <div class="col-lg-4 text-lg-end" data-aos="fade-left">
                    <a href="../contact" class="btn btn-light btn-lg px-4">
                        Get Free Quote <i class="fas fa-arrow-right ms-2"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <?php include '../includes/service-areas.php'; ?>
    <?php include '../includes/footer.php'; ?>
</body>
</html>
