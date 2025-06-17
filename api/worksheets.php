<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        getWorksheets($pdo);
        break;
    case 'POST':
        createWorksheet($pdo, $input);
        break;
    case 'PUT':
        updateWorksheet($pdo, $input);
        break;
    case 'DELETE':
        deleteWorksheet($pdo, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function getWorksheets($pdo) {
    try {
        // First, let's update the database with correct file paths if they're wrong
        $updateStmt = $pdo->prepare("UPDATE worksheets SET file_path = ? WHERE title = ?");
        
        $worksheets_mapping = [
            'Algebra Basics Worksheet' => 'pdfs/worksheets/Algebra Basics Worksheets.pdf',
            'Geometry Angles Worksheet' => 'pdfs/worksheets/Geometry Angles Worksheets.pdf',
            'Fractions Practice Worksheet' => 'pdfs/worksheets/Fractions Practice Worksheets.pdf',
            'Quadratic Equations Worksheet' => 'pdfs/worksheets/Quadratic Equations Worksheets.pdf',
            'Trigonometric Functions Worksheet' => 'pdfs/worksheets/Trigonometric Functions Worksheets.pdf'
        ];
        
        foreach ($worksheets_mapping as $title => $path) {
            $updateStmt->execute([$path, $title]);
        }
        
        $stmt = $pdo->query("SELECT * FROM worksheets ORDER BY created_at DESC");
        $worksheets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $worksheets]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch worksheets: ' . $e->getMessage()]);
    }
}

function createWorksheet($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO worksheets (title, description, subject, level, created_by) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['title'], $data['description'], $data['subject'], $data['level'], $_SESSION['user_id']]);
        
        echo json_encode(['success' => true, 'message' => 'Worksheet created successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to create worksheet: ' . $e->getMessage()]);
    }
}

function updateWorksheet($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE worksheets SET title = ?, description = ?, subject = ?, level = ? WHERE id = ?");
        $stmt->execute([$data['title'], $data['description'], $data['subject'], $data['level'], $data['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Worksheet updated successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update worksheet: ' . $e->getMessage()]);
    }
}

function deleteWorksheet($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM worksheets WHERE id = ?");
        $stmt->execute([$data['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Worksheet deleted successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to delete worksheet: ' . $e->getMessage()]);
    }
}
?>
