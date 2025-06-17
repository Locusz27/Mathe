<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/database.php';

// Start session
session_start();

$method = $_SERVER['REQUEST_METHOD'];

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

// Log the received data for debugging
error_log('Received data: ' . print_r($input, true));

switch($method) {
    case 'POST':
        if (isset($input['action'])) {
            switch($input['action']) {
                case 'register':
                    register($pdo, $input);
                    break;
                case 'login':
                    login($pdo, $input);
                    break;
                case 'logout':
                    logout();
                    break;
                case 'check_session':
                    checkSession();
                    break;
                default:
                    echo json_encode(['success' => false, 'message' => 'Invalid action: ' . $input['action']]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'No action specified']);
        }
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed: ' . $method]);
}

function register($pdo, $data) {
    try {
        error_log('Registration attempt for: ' . $data['email']);
        
        // Validate input
        if (empty($data['username']) || empty($data['email']) || empty($data['password']) || empty($data['role'])) {
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            return;
        }

        // Check if user already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$data['username'], $data['email']]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
            return;
        }

        // Hash password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        // Insert user
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())");
        $result = $stmt->execute([$data['username'], $data['email'], $hashedPassword, $data['role']]);
        
        if ($result) {
            error_log('User registered successfully: ' . $data['email']);
            echo json_encode(['success' => true, 'message' => 'Registration successful']);
        } else {
            error_log('Failed to insert user: ' . $data['email']);
            echo json_encode(['success' => false, 'message' => 'Failed to create user']);
        }
    } catch(PDOException $e) {
        error_log('Registration error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
    }
}

function login($pdo, $data) {
    try {
        error_log('Login attempt for: ' . $data['email']);
        
        // Validate input
        if (empty($data['email']) || empty($data['password'])) {
            echo json_encode(['success' => false, 'message' => 'Email and password are required']);
            return;
        }

        // Get user
        $stmt = $pdo->prepare("SELECT id, username, email, password, role FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($data['password'], $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            return;
        }

        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];

        error_log('User logged in successfully: ' . $data['email']);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } catch(PDOException $e) {
        error_log('Login error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Login failed: ' . $e->getMessage()]);
    }
}

function logout() {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logout successful']);
}

function checkSession() {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'success' => true,
            'logged_in' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'email' => $_SESSION['email'],
                'role' => $_SESSION['role']
            ]
        ]);
    } else {
        echo json_encode(['success' => true, 'logged_in' => false]);
    }
}
?>
