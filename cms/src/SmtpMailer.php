<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as PhpMailerException;
use PHPMailer\PHPMailer\PHPMailer;

/**
 * SMTP mailer that delegates to PHPMailer (installed via Composer).
 */
final class SmtpMailer
{
    public function __construct(
        private readonly string $host,
        private readonly int $port,
        private readonly string $encryption,
        private readonly string $username,
        private readonly string $password,
        private readonly string $fromEmail,
        private readonly string $fromName,
    ) {}

    public function send(
        string $toEmail,
        string $subject,
        string $htmlBody,
        ?string $textBody = null,
        ?string $replyTo = null,
        ?string $toName = null
    ): void {
        if (!class_exists(PHPMailer::class)) {
            throw new RuntimeException('PHPMailer is not available. Run `composer install` in the cms directory.');
        }

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = $this->host;
            $mail->Port = $this->port;
            $mail->SMTPAuth = $this->username !== '';
            $enc = strtolower($this->encryption);
            if ($enc === 'ssl') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($enc === 'tls') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            } else {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }

            if ($mail->SMTPAuth) {
                $mail->Username = $this->username;
                $mail->Password = $this->password;
            }

            $mail->CharSet = 'UTF-8';
            $mail->setFrom($this->fromEmail, $this->fromName);
            $mail->addAddress($toEmail, $toName ?? '');

            if ($replyTo) {
                $mail->addReplyTo($replyTo);
            }

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = $textBody
                ?? strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody));

            $mail->send();
        } catch (PhpMailerException $e) {
            throw new RuntimeException('SMTP send failed: ' . $e->getMessage(), 0, $e);
        }
    }
}
