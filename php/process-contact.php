<?php
header('Content-Type: application/json');

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$budget = isset($_POST['budget']) ? trim($_POST['budget']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || empty($subject) || empty($budget) || empty($message)) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required.'
    ]);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address.'
    ]);
    exit;
}

// Email configuration
$to = 'hardeppsiingh@gmail.com';
$email_subject = "New Contact Form Submission: " . $subject;

// Create email body
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .info-row {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        }
        .info-label {
            font-weight: 700;
            color: #3b82f6;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .info-value {
            color: #333;
            font-size: 16px;
        }
        .message-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-top: 20px;
        }
        .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
        .badge {
            display: inline-block;
            padding: 5px 12px;
            background: #10b981;
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎯 New Contact Form Submission</h1>
            <p>Someone has reached out to Creative Web Solutions</p>
        </div>
        
        <div class='content'>
            <div class='info-row'>
                <div class='info-label'>👤 Full Name</div>
                <div class='info-value'>" . htmlspecialchars($name) . "</div>
            </div>
            
            <div class='info-row'>
                <div class='info-label'>📧 Email Address</div>
                <div class='info-value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
            </div>
            
            <div class='info-row'>
                <div class='info-label'>📱 Phone Number</div>
                <div class='info-value'><a href='tel:" . htmlspecialchars($phone) . "'>" . htmlspecialchars($phone) . "</a></div>
            </div>
            
            <div class='info-row'>
                <div class='info-label'>📝 Subject</div>
                <div class='info-value'>" . htmlspecialchars($subject) . "</div>
            </div>
            
            <div class='info-row'>
                <div class='info-label'>💰 Budget Range</div>
                <div class='info-value'>" . htmlspecialchars($budget) . "
                    <span class='badge'>Budget Specified</span>
                </div>
            </div>
            
            <div class='info-row' style='border-left-color: #10b981;'>
                <div class='info-label'>💬 Message</div>
                <div class='message-box'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            
            <div style='margin-top: 30px; padding: 20px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1)); border-radius: 8px; text-align: center;'>
                <p style='margin: 0; color: #6366f1; font-weight: 600;'>⚡ Please respond within 24 hours</p>
            </div>
        </div>
        
        <div class='footer'>
            <p>This email was sent from the contact form at <a href='https://cwsindia.online'>Creative Web Solutions</a></p>
            <p>© " . date('Y') . " Creative Web Solutions. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Creative Web Solutions Contact Form <noreply@cwsindia.online>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
);

// Send email
$mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Also send confirmation email to user
    $user_subject = "Thank you for contacting Creative Web Solutions!";
    $user_body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }
            .content {
                padding: 40px 30px;
            }
            .content h2 {
                color: #3b82f6;
                margin-top: 0;
            }
            .content p {
                margin: 15px 0;
                color: #555;
            }
            .highlight-box {
                background: #f0f9ff;
                border-left: 4px solid #3b82f6;
                padding: 20px;
                margin: 25px 0;
                border-radius: 5px;
            }
            .cta-button {
                display: inline-block;
                padding: 15px 30px;
                background: linear-gradient(135deg, #3b82f6, #6366f1);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }
            .footer {
                background: #1f2937;
                color: #9ca3af;
                padding: 30px 20px;
                text-align: center;
                font-size: 12px;
            }
            .footer a {
                color: #3b82f6;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>✅ Message Received!</h1>
            </div>
            
            <div class='content'>
                <h2>Hello " . htmlspecialchars($name) . ",</h2>
                
                <p>Thank you for reaching out to <strong>Creative Web Solutions</strong>! We have successfully received your message.</p>
                
                <div class='highlight-box'>
                    <p style='margin: 0;'><strong>📋 Your Inquiry Details:</strong></p>
                    <p style='margin: 10px 0 0;'><strong>Subject:</strong> " . htmlspecialchars($subject) . "</p>
                    <p style='margin: 5px 0 0;'><strong>Budget:</strong> " . htmlspecialchars($budget) . "</p>
                </div>
                
                <p>Our team will carefully review your requirements and get back to you within <strong>24 hours</strong>.</p>
                
                <p>In the meantime, feel free to:</p>
                <ul>
                    <li>Explore our <a href='' style='color: #3b82f6;'>services</a></li>
                    <li>Check out our <a href='' style='color: #3b82f6;'>portfolio</a></li>
                    <li>Browse our <a href='' style='color: #3b82f6;'>training courses</a></li>
                </ul>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='tel:+91-7015969967' class='cta-button'>📞 Call Us: +91-7015969967</a>
                </div>
                
                <p style='color: #6b7280; font-size: 14px; margin-top: 30px;'>
                    <em>If you need urgent assistance, please call us directly at <strong>+91-7015969967</strong> or WhatsApp us.</em>
                </p>
            </div>
            
            <div class='footer'>
                <p><strong>Creative Web Solutions</strong></p>
                <p>#313, 3rd Floor, D & E Block, VIP Road, Zirakpur, Punjab 140603</p>
                <p>Phone: <a href='tel:+91-7015969967'>+91-7015969967</a> | Email: <a href='mailto:hardeppsiingh@gmail.com'>hardeppsiingh@gmail.com</a></p>
                <p style='margin-top: 20px;'>© " . date('Y') . " Creative Web Solutions. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $user_headers = array(
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: Creative Web Solutions <noreply@cwsindia.online>',
        'Reply-To: hardeppsiingh@gmail.com',
        'X-Mailer: PHP/' . phpversion()
    );
    
    mail($email, $user_subject, $user_body, implode("\r\n", $user_headers));
    
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully!'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please try again or contact us directly.'
    ]);
}
?>
