<?php
header('Content-Type: application/json');

// Get form data
$courseName = isset($_POST['courseName']) ? trim($_POST['courseName']) : '';
$coursePrice = isset($_POST['coursePrice']) ? trim($_POST['coursePrice']) : '';
$fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$whatsapp = isset($_POST['whatsapp']) ? trim($_POST['whatsapp']) : '';
$dob = isset($_POST['dob']) ? trim($_POST['dob']) : '';
$gender = isset($_POST['gender']) ? trim($_POST['gender']) : '';
$address = isset($_POST['address']) ? trim($_POST['address']) : '';
$city = isset($_POST['city']) ? trim($_POST['city']) : '';
$state = isset($_POST['state']) ? trim($_POST['state']) : '';
$pincode = isset($_POST['pincode']) ? trim($_POST['pincode']) : '';
$qualification = isset($_POST['qualification']) ? trim($_POST['qualification']) : '';
$college = isset($_POST['college']) ? trim($_POST['college']) : '';
$experience = isset($_POST['experience']) ? trim($_POST['experience']) : '';
$batchTiming = isset($_POST['batchTiming']) ? trim($_POST['batchTiming']) : '';
$learningMode = isset($_POST['learningMode']) ? trim($_POST['learningMode']) : '';
$startDate = isset($_POST['startDate']) ? trim($_POST['startDate']) : '';
$previousKnowledge = isset($_POST['previousKnowledge']) ? trim($_POST['previousKnowledge']) : '';
$goals = isset($_POST['goals']) ? trim($_POST['goals']) : '';

// Validate required fields
$requiredFields = [
    'courseName', 'fullName', 'email', 'phone', 'dob', 'gender', 
    'address', 'city', 'qualification', 'batchTiming', 'learningMode'
];

foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode([
            'success' => false,
            'message' => 'Please fill all required fields.'
        ]);
        exit;
    }
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address.'
    ]);
    exit;
}

// Generate enrollment ID
$enrollmentId = 'CF' . date('Y') . strtoupper(substr(md5(uniqid()), 0, 6));

// Email configuration
$to = 'hardeppsiingh@gmail.com';
$email_subject = "🎓 New Course Enrollment: " . $courseName;

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
            max-width: 700px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.95;
        }
        .enrollment-id {
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 50px;
            display: inline-block;
            margin-top: 15px;
            font-weight: 600;
            letter-spacing: 1px;
        }
        .content {
            padding: 30px;
        }
        .course-info {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 4px solid #10b981;
        }
        .course-info h2 {
            margin: 0 0 10px;
            color: #10b981;
            font-size: 24px;
        }
        .course-info .price {
            font-size: 28px;
            font-weight: 700;
            color: #059669;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #3b82f6;
            margin: 25px 0 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-item {
            background: #f8f9fa;
            padding: 12px 15px;
            border-radius: 8px;
            border-left: 3px solid #3b82f6;
        }
        .info-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #6b7280;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .info-value {
            color: #1f2937;
            font-size: 15px;
            font-weight: 600;
        }
        .full-width {
            grid-column: span 2;
        }
        .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 30px;
            text-align: center;
            font-size: 13px;
        }
        .footer a {
            color: #10b981;
            text-decoration: none;
        }
        .action-box {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        .action-box p {
            margin: 0;
            color: #92400e;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎓 New Student Enrollment</h1>
            <p>A student has enrolled in " . htmlspecialchars($courseName) . "</p>
            <div class='enrollment-id'>ID: " . $enrollmentId . "</div>
        </div>
        
        <div class='content'>
            <div class='course-info'>
                <h2>" . htmlspecialchars($courseName) . "</h2>
                <div class='price'>" . htmlspecialchars($coursePrice) . "</div>
            </div>
            
            <div class='section-title'>👤 Personal Information</div>
            <div class='info-grid'>
                <div class='info-item'>
                    <div class='info-label'>Full Name</div>
                    <div class='info-value'>" . htmlspecialchars($fullName) . "</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Date of Birth</div>
                    <div class='info-value'>" . htmlspecialchars($dob) . "</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Gender</div>
                    <div class='info-value'>" . htmlspecialchars($gender) . "</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Email</div>
                    <div class='info-value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Phone</div>
                    <div class='info-value'><a href='tel:" . htmlspecialchars($phone) . "'>" . htmlspecialchars($phone) . "</a></div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>WhatsApp</div>
                    <div class='info-value'><a href='https://wa.me/91" . htmlspecialchars($whatsapp) . "'>" . htmlspecialchars($whatsapp) . "</a></div>
                </div>
                <div class='info-item full-width'>
                    <div class='info-label'>Address</div>
                    <div class='info-value'>" . htmlspecialchars($address) . ", " . htmlspecialchars($city) . ", " . htmlspecialchars($state) . " - " . htmlspecialchars($pincode) . "</div>
                </div>
            </div>
            
            <div class='section-title'>🎓 Educational Background</div>
            <div class='info-grid'>
                <div class='info-item'>
                    <div class='info-label'>Qualification</div>
                    <div class='info-value'>" . htmlspecialchars($qualification) . "</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>College/University</div>
                    <div class='info-value'>" . htmlspecialchars($college ? $college : 'Not specified') . "</div>
                </div>
                <div class='info-item full-width'>
                    <div class='info-label'>Experience Level</div>
                    <div class='info-value'>" . htmlspecialchars($experience) . "</div>
                </div>
            </div>
            
            <div class='section-title'>📚 Course Preferences</div>
            <div class='info-grid'>
                <div class='info-item'>
                    <div class='info-label'>Batch Timing</div>
                    <div class='info-value'>" . htmlspecialchars($batchTiming) . "</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Learning Mode</div>
                    <div class='info-value'>" . htmlspecialchars($learningMode) . "</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Preferred Start Date</div>
                    <div class='info-value'>" . htmlspecialchars($startDate ? $startDate : 'ASAP') . "</div>
                </div>
                <div class='info-item'>
                    <div class='info-label'>Previous Knowledge</div>
                    <div class='info-value'>" . htmlspecialchars($previousKnowledge) . "</div>
                </div>
            </div>
            
            " . (!empty($goals) ? "
            <div class='section-title'>🎯 Learning Goals</div>
            <div style='background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 3px solid #3b82f6;'>
                " . nl2br(htmlspecialchars($goals)) . "
            </div>
            " : "") . "
            
            <div class='action-box'>
                <p>⚡ Action Required: Contact the student within 24 hours to confirm enrollment and schedule</p>
            </div>
            
            <div style='margin-top: 30px; padding: 20px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1)); border-radius: 8px; text-align: center;'>
                <p style='margin: 0; color: #059669; font-weight: 600;'>📅 Enrollment Date: " . date('d M Y, h:i A') . "</p>
            </div>
        </div>
        
        <div class='footer'>
            <p><strong>Creative Web Solutions - Student Enrollment System</strong></p>
            <p>This is an automated notification from the LMS enrollment system</p>
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
    'From: Creative Web Solutions LMS <lms@cwsindia.online>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
);

// Send email to admin
$mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Send confirmation email to student
    $student_subject = "Welcome to Creative Web Solutions - Enrollment Confirmed!";
    $student_body = "
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
                max-width: 650px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 50px 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0 0 10px;
                font-size: 32px;
                font-weight: 700;
            }
            .header p {
                margin: 0;
                font-size: 18px;
                opacity: 0.95;
            }
            .enrollment-badge {
                background: rgba(255,255,255,0.25);
                padding: 15px 30px;
                border-radius: 50px;
                display: inline-block;
                margin-top: 20px;
            }
            .enrollment-badge .label {
                font-size: 12px;
                opacity: 0.9;
            }
            .enrollment-badge .id {
                font-size: 20px;
                font-weight: 700;
                letter-spacing: 2px;
            }
            .content {
                padding: 40px 30px;
            }
            .course-box {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 30px;
                text-align: center;
                border: 2px solid #10b981;
            }
            .course-box h2 {
                margin: 0 0 15px;
                color: #10b981;
                font-size: 26px;
            }
            .course-box .price {
                font-size: 32px;
                font-weight: 700;
                color: #059669;
            }
            .next-steps {
                background: #f0f9ff;
                border-left: 4px solid #3b82f6;
                padding: 25px;
                border-radius: 8px;
                margin: 30px 0;
            }
            .next-steps h3 {
                margin: 0 0 15px;
                color: #3b82f6;
                font-size: 20px;
            }
            .next-steps ol {
                margin: 0;
                padding-left: 20px;
            }
            .next-steps li {
                margin: 10px 0;
                color: #1f2937;
            }
            .info-row {
                background: #f8f9fa;
                padding: 15px 20px;
                border-radius: 8px;
                margin: 15px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .info-row .label {
                color: #6b7280;
                font-weight: 600;
            }
            .info-row .value {
                color: #1f2937;
                font-weight: 700;
            }
            .cta-button {
                display: inline-block;
                padding: 18px 40px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 700;
                font-size: 16px;
                margin: 25px 0;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            }
            .footer {
                background: #1f2937;
                color: #9ca3af;
                padding: 30px;
                text-align: center;
                font-size: 13px;
            }
            .footer a {
                color: #10b981;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🎉 Welcome to Creative Web Solutions!</h1>
                <p>Your enrollment is confirmed</p>
                <div class='enrollment-badge'>
                    <div class='label'>Enrollment ID</div>
                    <div class='id'>" . $enrollmentId . "</div>
                </div>
            </div>
            
            <div class='content'>
                <p style='font-size: 18px; color: #1f2937;'>Dear <strong>" . htmlspecialchars($fullName) . "</strong>,</p>
                
                <p>Congratulations! 🎊 You have successfully enrolled in our course. We're excited to have you join our learning community at Creative Web Solutions!</p>
                
                <div class='course-box'>
                    <h2>" . htmlspecialchars($courseName) . "</h2>
                    <div class='price'>" . htmlspecialchars($coursePrice) . "</div>
                </div>
                
                <div class='info-row'>
                    <span class='label'>📅 Enrollment Date</span>
                    <span class='value'>" . date('d M Y') . "</span>
                </div>
                <div class='info-row'>
                    <span class='label'>⏰ Batch Timing</span>
                    <span class='value'>" . htmlspecialchars($batchTiming) . "</span>
                </div>
                <div class='info-row'>
                    <span class='label'>💻 Learning Mode</span>
                    <span class='value'>" . htmlspecialchars($learningMode) . "</span>
                </div>
                
                <div class='next-steps'>
                    <h3>📋 Next Steps:</h3>
                    <ol>
                        <li>Our team will contact you within <strong>24 hours</strong> to confirm your batch schedule</li>
                        <li>You will receive course materials and access credentials before the start date</li>
                        <li>Join our WhatsApp group for course updates and announcements</li>
                        <li>Complete the pre-course assessment (if applicable)</li>
                        <li>Prepare any required software/tools as per the course requirements</li>
                    </ol>
                </div>
                
                <div style='text-align: center; margin: 35px 0;'>
                    <a href='https://wa.me/917015969967?text=Hi%2C%20I%20just%20enrolled%20for%20" . urlencode($courseName) . "%20with%20ID%20" . $enrollmentId . "' class='cta-button'>
                        💬 Chat with Us on WhatsApp
                    </a>
                </div>
                
                <div style='background: #fef3c7; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;'>
                    <p style='margin: 0; color: #92400e; font-weight: 600;'>
                        📞 Have questions? Call us at <strong>+91-7015969967</strong>
                    </p>
                </div>
                
                <p style='color: #6b7280; font-size: 14px; margin-top: 30px;'>
                    <strong>Pro Tip:</strong> Save this email for your records. You'll need your Enrollment ID for future correspondence.
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
    
    $student_headers = array(
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: Creative Web Solutions <lms@cwsindia.online>',
        'Reply-To: hardeppsiingh@gmail.com',
        'X-Mailer: PHP/' . phpversion()
    );
    
    mail($email, $student_subject, $student_body, implode("\r\n", $student_headers));
    
    echo json_encode([
        'success' => true,
        'message' => 'Enrollment successful!',
        'enrollmentId' => $enrollmentId
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to process enrollment. Please try again.'
    ]);
}
?>
