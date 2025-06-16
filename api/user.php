<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        getUserProfile($pdo);
        break;
    case 'PUT':
        updateUserProfile($pdo, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function getUserProfile($pdo) {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, username, email, role, created_at FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'User not found']);
            return;
        }
        
        echo json_encode(['success' => true, 'data' => $user]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch user profile: ' . $e->getMessage()]);
    }
}

function updateUserProfile($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $updates = [];
        $params = [];
        
        if (isset($data['username'])) {
            $updates[] = "username = ?";
            $params[] = $data['username'];
        }
        
        if (isset($data['email'])) {
            $updates[] = "email = ?";
            $params[] = $data['email'];
        }
        
        if (isset($data['password']) && !empty($data['password'])) {
            $updates[] = "password = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        if (empty($updates)) {
            echo json_encode(['success' => false, 'message' => 'No updates provided']);
            return;
        }
        
        $params[] = $_SESSION['user_id'];
        
        $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Update session data
        if (isset($data['username'])) {
            $_SESSION['username'] = $data['username'];
        }
        if (isset($data['email'])) {
            $_SESSION['email'] = $data['email'];
        }
        
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update profile: ' . $e->getMessage()]);
    }
}
?>
