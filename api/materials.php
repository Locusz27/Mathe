<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        getMaterials($pdo);
        break;
    case 'POST':
        createMaterial($pdo, $input);
        break;
    case 'PUT':
        updateMaterial($pdo, $input);
        break;
    case 'DELETE':
        deleteMaterial($pdo, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function getMaterials($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM learning_materials ORDER BY created_at DESC");
        $materials = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $materials]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch materials: ' . $e->getMessage()]);
    }
}

function createMaterial($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO learning_materials (title, description, subject, level, created_by) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['title'], $data['description'], $data['subject'], $data['level'], $_SESSION['user_id']]);
        
        echo json_encode(['success' => true, 'message' => 'Material created successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to create material: ' . $e->getMessage()]);
    }
}

function updateMaterial($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE learning_materials SET title = ?, description = ?, subject = ?, level = ? WHERE id = ?");
        $stmt->execute([$data['title'], $data['description'], $data['subject'], $data['level'], $data['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Material updated successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update material: ' . $e->getMessage()]);
    }
}

function deleteMaterial($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM learning_materials WHERE id = ?");
        $stmt->execute([$data['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Material deleted successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to delete material: ' . $e->getMessage()]);
    }
}
?>
