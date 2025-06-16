<?php
session_start();
require_once '../config/database.php';

// Check if user is logged in and is a teacher
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

$response = ['success' => false, 'message' => 'Unknown error'];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'upload_material':
            $response = handleMaterialUpload($pdo);
            break;
        case 'upload_worksheet':
            $response = handleWorksheetUpload($pdo);
            break;
        default:
            throw new Exception('Invalid upload type');
    }
    
} catch (Exception $e) {
    $response = ['success' => false, 'message' => $e->getMessage()];
}

echo json_encode($response);

function handleMaterialUpload($pdo) {
    return handleFileUpload($pdo, 'learning_materials', 'learning-materials');
}

function handleWorksheetUpload($pdo) {
    return handleFileUpload($pdo, 'worksheets', 'worksheets');
}

function handleFileUpload($pdo, $table, $folder) {
    try {
        // Validate required fields
        $title = trim($_POST['title'] ?? '');
        $subject = $_POST['subject'] ?? '';
        $level = $_POST['level'] ?? '';
        $description = trim($_POST['description'] ?? '');
        
        if (empty($title)) {
            throw new Exception('Title is required');
        }
        
        if (empty($subject)) {
            throw new Exception('Subject is required');
        }
        
        if (empty($level)) {
            throw new Exception('Level is required');
        }
        
        // Validate file upload
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload failed');
        }
        
        $file = $_FILES['file'];
        
        // Validate file type
        if ($file['type'] !== 'application/pdf') {
            throw new Exception('Only PDF files are allowed');
        }
        
        // Validate file size (10MB max)
        $maxSize = 10 * 1024 * 1024; // 10MB
        if ($file['size'] > $maxSize) {
            throw new Exception('File size exceeds 10MB limit');
        }
        
        // Create upload directory if it doesn't exist
        $uploadDir = "../pdfs/$folder/";
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        // Generate unique filename
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = $title . '_' . time() . '.' . $fileExtension;
        $fileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
        $filePath = $uploadDir . $fileName;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            throw new Exception('Failed to save uploaded file');
        }
        
        // Save to database (removed 'grade' column)
        $stmt = $pdo->prepare("INSERT INTO $table (title, description, subject, level, file_path, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $title,
            $description,
            $subject,
            $level,
            "pdfs/$folder/$fileName",
            $_SESSION['user_id']
        ]);
        
        return [
            'success' => true,
            'message' => ucfirst(str_replace('_', ' ', $table)) . ' uploaded successfully',
            'file_id' => $pdo->lastInsertId()
        ];
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}
?>
