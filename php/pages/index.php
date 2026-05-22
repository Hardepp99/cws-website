<?php
// Fallback redirect if .htaccess doesn't work
header('HTTP/1.1 301 Moved Permanently');
header('Location: ../services.php');
exit;
