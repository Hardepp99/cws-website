<?php

declare(strict_types=1);

/**
 * Minimal SMTP client (AUTH LOGIN, STARTTLS or SSL).
 */
final class SmtpMailer
{
    private $socket;

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
        $this->connect();
        $this->expect(220);
        $this->cmd('EHLO localhost');
        $this->expect(250);

        if ($this->encryption === 'tls' && $this->port !== 465) {
            $this->cmd('STARTTLS');
            $this->expect(220);
            if (!stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('STARTTLS failed');
            }
            $this->cmd('EHLO localhost');
            $this->expect(250);
        }

        if ($this->username !== '') {
            $this->cmd('AUTH LOGIN');
            $this->expect(334);
            $this->cmd(base64_encode($this->username));
            $this->expect(334);
            $this->cmd(base64_encode($this->password));
            $this->expect(235);
        }

        $from = $this->fromEmail;
        $this->cmd('MAIL FROM:<' . $from . '>');
        $this->expect(250);
        $this->cmd('RCPT TO:<' . $toEmail . '>');
        $this->expect(250);
        $this->cmd('DATA');
        $this->expect(354);

        $text = $textBody ?? strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody));
        $boundary = 'cws_' . bin2hex(random_bytes(8));
        $toHeader = $toName ? $this->encodeAddress($toName, $toEmail) : $toEmail;
        $fromHeader = $this->encodeAddress($this->fromName, $this->fromEmail);

        $headers = [
            'From: ' . $fromHeader,
            'To: ' . $toHeader,
            'Subject: ' . $this->encodeHeader($subject),
            'MIME-Version: 1.0',
            'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
            'Date: ' . date('r'),
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@cws.local>',
        ];
        if ($replyTo) {
            $headers[] = 'Reply-To: ' . $replyTo;
        }

        $body = implode("\r\n", $headers) . "\r\n\r\n";
        $body .= '--' . $boundary . "\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
        $body .= $this->normalizeLines($text) . "\r\n";
        $body .= '--' . $boundary . "\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
        $body .= $this->normalizeLines($htmlBody) . "\r\n";
        $body .= '--' . $boundary . "--\r\n";
        $body = $this->dotStuff($body);

        fwrite($this->socket, $body . "\r\n.\r\n");
        $this->expect(250);
        $this->cmd('QUIT');
        fclose($this->socket);
    }

    private function connect(): void
    {
        $remote = $this->encryption === 'ssl'
            ? 'ssl://' . $this->host . ':' . $this->port
            : $this->host . ':' . $this->port;
        $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
        $this->socket = @stream_socket_client(
            $remote,
            $errno,
            $errstr,
            20,
            STREAM_CLIENT_CONNECT,
            $ctx
        );
        if (!$this->socket) {
            throw new RuntimeException('SMTP connect failed: ' . $errstr . ' (' . $errno . ')');
        }
        stream_set_timeout($this->socket, 20);
    }

    private function cmd(string $line): void
    {
        fwrite($this->socket, $line . "\r\n");
    }

    private function expect(int $code): void
    {
        $response = '';
        while ($line = fgets($this->socket, 515)) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        $got = (int) substr($response, 0, 3);
        if ($got !== $code) {
            throw new RuntimeException('SMTP error ' . $got . ': ' . trim($response));
        }
    }

    private function encodeAddress(string $name, string $email): string
    {
        $safeName = str_replace(['"', '\\'], '', $name);
        return '"' . $safeName . '" <' . $email . '>';
    }

    private function encodeHeader(string $value): string
    {
        if (preg_match('/[^\x20-\x7E]/', $value)) {
            return '=?UTF-8?B?' . base64_encode($value) . '?=';
        }
        return $value;
    }

    private function normalizeLines(string $text): string
    {
        return preg_replace('/\r\n|\r|\n/', "\r\n", $text) ?? $text;
    }

    private function dotStuff(string $body): string
    {
        return preg_replace('/^\./m', '..', $body) ?? $body;
    }
}
