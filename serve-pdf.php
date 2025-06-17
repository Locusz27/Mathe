<?php
// Security: Only allow PDF files from specific directories
$allowedDirectories = ['pdfs/learning-materials/', 'pdfs/worksheets/'];
$file = $_GET['file'] ?? '';

// Validate file parameter
if (empty($file)) {
    http_response_code(400);
    die('No file specified');
}

// Security check: ensure file is in allowed directory
$isAllowed = false;
foreach ($allowedDirectories as $dir) {
    if (strpos($file, $dir) === 0) {
        $isAllowed = true;
        break;
    }
}

if (!$isAllowed) {
    http_response_code(403);
    die('Access denied');
}

// Security check: prevent directory traversal
if (strpos($file, '..') !== false || strpos($file, './') !== false) {
    http_response_code(403);
    die('Invalid file path');
}

// Check if file exists
if (!file_exists($file)) {
    http_response_code(404);
    die('File not found');
}

// Verify it's actually a PDF
$fileInfo = pathinfo($file);
if (strtolower($fileInfo['extension']) !== 'pdf') {
    http_response_code(403);
    die('Only PDF files are allowed');
}

// Set appropriate headers for PDF
header('Content-Type: application/pdf');
header('Content-Length: ' . filesize($file));
header('Content-Disposition: inline; filename="' . basename($file) . '"');
header('Cache-Control: private, max-age=0, must-revalidate');
header('Pragma: public');

// Output the file
readfile($file);
exit;
?>
