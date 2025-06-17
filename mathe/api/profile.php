<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'badges') {
            getUserBadges($pdo);
        } else {
            getUserProfile($pdo);
        }
        break;
    case 'POST':
        if (isset($input['action']) && $input['action'] === 'update_stats') {
            updateUserStats($pdo, $input);
        }
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
        // Get user basic info
        $stmt = $pdo->prepare("SELECT id, username, email, role, created_at FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'User not found']);
            return;
        }
        
        // Get user quiz stats
        $stmt = $pdo->prepare("SELECT * FROM user_quiz_stats WHERE user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // If no stats exist, create default stats
        if (!$stats) {
            $stmt = $pdo->prepare("
                INSERT INTO user_quiz_stats (user_id, total_quizzes, total_points, perfect_scores, current_streak, longest_streak, average_score, level, points_to_next_level) 
                VALUES (?, 0, 0, 0, 0, 0, 0, 1, 100)
            ");
            $stmt->execute([$_SESSION['user_id']]);
            
            $stats = [
                'total_quizzes' => 0,
                'total_points' => 0,
                'perfect_scores' => 0,
                'current_streak' => 0,
                'longest_streak' => 0,
                'average_score' => 0,
                'level' => 1,
                'points_to_next_level' => 100,
                'last_quiz_date' => null
            ];
        }
        
        // Update user level
        $stmt = $pdo->prepare("CALL UpdateUserLevel(?)");
        $stmt->execute([$_SESSION['user_id']]);
        
        // Check and award badges
        $stmt = $pdo->prepare("CALL CheckAndAwardBadges(?)");
        $stmt->execute([$_SESSION['user_id']]);
        
        // Get updated stats after level calculation
        $stmt = $pdo->prepare("SELECT * FROM user_quiz_stats WHERE user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Get recent quiz attempts
        $stmt = $pdo->prepare("
            SELECT 
                ua.*, 
                q.title as quiz_title,
                q.subject,
                q.level
            FROM user_quiz_attempts ua 
            JOIN quizzes q ON ua.quiz_id = q.id 
            WHERE ua.user_id = ? 
            ORDER BY ua.completed_at DESC
            LIMIT 10
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $recentAttempts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get user badges
        $stmt = $pdo->prepare("
            SELECT b.*, ub.earned_at
            FROM user_badges ub
            JOIN badges b ON ub.badge_id = b.id
            WHERE ub.user_id = ?
            ORDER BY ub.earned_at DESC
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $badges = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $profile = [
            'user' => $user,
            'stats' => $stats,
            'recentAttempts' => $recentAttempts,
            'badges' => $badges
        ];
        
        echo json_encode(['success' => true, 'data' => $profile]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch profile: ' . $e->getMessage()]);
    }
}

function getUserBadges($pdo) {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        // Get all available badges with user's earned status
        $stmt = $pdo->prepare("
            SELECT 
                b.*,
                CASE WHEN ub.user_id IS NOT NULL THEN 1 ELSE 0 END as earned,
                ub.earned_at
            FROM badges b
            LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = ?
            ORDER BY b.requirement_value ASC
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $badges = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'data' => $badges]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch badges: ' . $e->getMessage()]);
    }
}

function updateUserStats($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $pdo->beginTransaction();
        
        // Update user level
        $stmt = $pdo->prepare("CALL UpdateUserLevel(?)");
        $stmt->execute([$_SESSION['user_id']]);
        
        // Check and award badges
        $stmt = $pdo->prepare("CALL CheckAndAwardBadges(?)");
        $stmt->execute([$_SESSION['user_id']]);
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Stats updated successfully']);
    } catch(PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Failed to update stats: ' . $e->getMessage()]);
    }
}
?>
