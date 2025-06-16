<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'user_progress') {
            getUserQuizProgress($pdo);
        } elseif (isset($_GET['action']) && $_GET['action'] === 'leaderboard') {
            getLeaderboard($pdo, $_GET['type'] ?? 'points');
        } elseif (isset($_GET['id'])) {
            getQuiz($pdo, $_GET['id']);
        } else {
            getQuizzes($pdo);
        }
        break;
    case 'POST':
        if (isset($input['action']) && $input['action'] === 'submit_attempt') {
            submitQuizAttempt($pdo, $input);
        } else {
            createQuiz($pdo, $input);
        }
        break;
    case 'PUT':
        updateQuiz($pdo, $input);
        break;
    case 'DELETE':
        deleteQuiz($pdo, $input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function getQuizzes($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM quizzes ORDER BY created_at DESC");
        $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get questions for each quiz
        foreach ($quizzes as &$quiz) {
            $stmt = $pdo->prepare("SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY question_order");
            $stmt->execute([$quiz['id']]);
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Decode JSON options
            foreach ($questions as &$question) {
                $question['options'] = json_decode($question['options'], true);
            }
            
            $quiz['questions'] = $questions;
            $quiz['totalPoints'] = count($questions) * $quiz['points_per_question'];
        }
        
        echo json_encode(['success' => true, 'data' => $quizzes]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch quizzes: ' . $e->getMessage()]);
    }
}

function getQuiz($pdo, $id) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM quizzes WHERE id = ?");
        $stmt->execute([$id]);
        $quiz = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$quiz) {
            echo json_encode(['success' => false, 'message' => 'Quiz not found']);
            return;
        }
        
        // Get questions
        $stmt = $pdo->prepare("SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY question_order");
        $stmt->execute([$id]);
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Decode JSON options
        foreach ($questions as &$question) {
            $question['options'] = json_decode($question['options'], true);
        }
        
        $quiz['questions'] = $questions;
        $quiz['totalPoints'] = count($questions) * $quiz['points_per_question'];
        
        echo json_encode(['success' => true, 'data' => $quiz]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch quiz: ' . $e->getMessage()]);
    }
}

function createQuiz($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $pdo->beginTransaction();
        
        // Insert quiz
        $stmt = $pdo->prepare("INSERT INTO quizzes (title, description, subject, level, background_theme, points_per_question, time_limit, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'], 
            $data['description'], 
            $data['subject'], 
            $data['level'],
            $data['background_theme'] ?? 'default',
            $data['points_per_question'] ?? 10,
            $data['time_limit'] ?? 60,
            $_SESSION['user_id']
        ]);
        
        $quizId = $pdo->lastInsertId();
        
        // Insert questions
        if (isset($data['questions']) && is_array($data['questions'])) {
            $stmt = $pdo->prepare("INSERT INTO quiz_questions (quiz_id, story_context, question, options, correct_answer, hint, question_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
            
            foreach ($data['questions'] as $index => $question) {
                $stmt->execute([
                    $quizId,
                    $question['story_context'] ?? '',
                    $question['question'],
                    json_encode($question['options']),
                    $question['correct_answer'],
                    $question['hint'] ?? '',
                    $index + 1
                ]);
            }
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Quiz created successfully', 'quiz_id' => $quizId]);
    } catch(PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Failed to create quiz: ' . $e->getMessage()]);
    }
}

function submitQuizAttempt($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $pdo->beginTransaction();
        
        // Calculate percentage score
        $percentage_score = ($data['total_questions'] > 0) ? 
            round(($data['correct_answers'] / $data['total_questions']) * 100, 2) : 0;
        
        // Insert quiz attempt
        $stmt = $pdo->prepare("INSERT INTO user_quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, percentage_score, time_taken, hints_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $_SESSION['user_id'],
            $data['quiz_id'],
            $data['score'],
            $data['total_questions'],
            $data['correct_answers'],
            $percentage_score,
            $data['time_taken'] ?? 0,
            $data['hints_used'] ?? 0
        ]);
        
        // Update or insert user quiz statistics
        $perfect_score = ($data['correct_answers'] == $data['total_questions']) ? 1 : 0;
        
        // Check if user stats exist
        $stmt = $pdo->prepare("SELECT * FROM user_quiz_stats WHERE user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $existingStats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existingStats) {
            // Update existing stats
            $newTotalQuizzes = $existingStats['total_quizzes'] + 1;
            $newTotalPoints = $existingStats['total_points'] + $data['score'];
            $newPerfectScores = $existingStats['perfect_scores'] + $perfect_score;
            
            // Calculate new average score
            $stmt = $pdo->prepare("SELECT AVG(percentage_score) as avg_score FROM user_quiz_attempts WHERE user_id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $avgResult = $stmt->fetch(PDO::FETCH_ASSOC);
            $newAverageScore = round($avgResult['avg_score'], 2);
            
            $stmt = $pdo->prepare("
                UPDATE user_quiz_stats 
                SET total_quizzes = ?, total_points = ?, perfect_scores = ?, 
                    last_quiz_date = CURDATE(), average_score = ?
                WHERE user_id = ?
            ");
            $stmt->execute([
                $newTotalQuizzes,
                $newTotalPoints,
                $newPerfectScores,
                $newAverageScore,
                $_SESSION['user_id']
            ]);
        } else {
            // Insert new stats
            $stmt = $pdo->prepare("
                INSERT INTO user_quiz_stats (user_id, total_quizzes, total_points, perfect_scores, last_quiz_date, average_score) 
                VALUES (?, 1, ?, ?, CURDATE(), ?)
            ");
            $stmt->execute([
                $_SESSION['user_id'],
                $data['score'],
                $perfect_score,
                $percentage_score
            ]);
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Quiz attempt recorded successfully']);
    } catch(PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Failed to record quiz attempt: ' . $e->getMessage()]);
    }
}

function updateQuiz($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE quizzes SET title = ?, description = ?, subject = ?, level = ? WHERE id = ?");
        $stmt->execute([$data['title'], $data['description'], $data['subject'], $data['level'], $data['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Quiz updated successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update quiz: ' . $e->getMessage()]);
    }
}

function deleteQuiz($pdo, $data) {
    session_start();
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM quizzes WHERE id = ?");
        $stmt->execute([$data['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Quiz deleted successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to delete quiz: ' . $e->getMessage()]);
    }
}

function getLeaderboard($pdo, $type = 'points') {
    try {
        $orderBy = '';
        switch($type) {
            case 'points':
                $orderBy = 'uqs.total_points DESC';
                break;
            case 'level':
                $orderBy = 'uqs.average_score DESC';
                break;
            case 'perfect':
                $orderBy = 'uqs.perfect_scores DESC';
                break;
            default:
                $orderBy = 'uqs.total_points DESC';
        }
        
        $stmt = $pdo->prepare("
            SELECT 
                u.id,
                u.username,
                uqs.total_points,
                uqs.perfect_scores,
                uqs.average_score,
                uqs.total_quizzes
            FROM users u
            LEFT JOIN user_quiz_stats uqs ON u.id = uqs.user_id
            WHERE uqs.total_quizzes > 0
            ORDER BY $orderBy
            LIMIT 50
        ");
        $stmt->execute();
        $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Mark current user
        session_start();
        if (isset($_SESSION['user_id'])) {
            foreach ($leaderboard as &$user) {
                $user['isCurrentUser'] = ($user['id'] == $_SESSION['user_id']);
            }
        }
        
        echo json_encode(['success' => true, 'data' => $leaderboard]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch leaderboard: ' . $e->getMessage()]);
    }
}

function getUserQuizProgress($pdo) {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }

    try {
        // Get user's quiz statistics
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
        $attempts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Default values if no stats exist
        if (!$stats) {
            $stats = [
                'total_quizzes' => 0,
                'total_points' => 0,
                'perfect_scores' => 0,
                'current_streak' => 0,
                'longest_streak' => 0,
                'average_score' => 0,
                'last_quiz_date' => null
            ];
        }
        
        $progress = [
            'totalQuizzes' => $stats['total_quizzes'],
            'totalScore' => $stats['total_points'],
            'perfectScores' => $stats['perfect_scores'],
            'averageScore' => round($stats['average_score'], 1),
            'currentStreak' => $stats['current_streak'],
            'longestStreak' => $stats['longest_streak'],
            'lastQuizDate' => $stats['last_quiz_date'],
            'history' => $attempts
        ];
        
        echo json_encode(['success' => true, 'data' => $progress]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch quiz progress: ' . $e->getMessage()]);
    }
}

function calculateQuizStreak($attempts) {
    if (empty($attempts)) return 0;
    
    $streak = 0;
    $today = new DateTime();
    $today->setTime(0, 0, 0);
    
    foreach ($attempts as $attempt) {
        $attemptDate = new DateTime($attempt['completed_at']);
        $attemptDate->setTime(0, 0, 0);
        
        $daysDiff = $today->diff($attemptDate)->days;
        
        if ($daysDiff == $streak) {
            $streak++;
        } else {
            break;
        }
    }
    
    return $streak;
}

function calculateLongestStreak($attempts) {
    if (empty($attempts)) return 0;
    
    $longestStreak = 0;
    $currentStreak = 1;
    $prevDate = null;
    
    foreach (array_reverse($attempts) as $attempt) {
        $attemptDate = new DateTime($attempt['completed_at']);
        $attemptDate->setTime(0, 0, 0);
        
        if ($prevDate) {
            $daysDiff = $attemptDate->diff($prevDate)->days;
            if ($daysDiff == 1) {
                $currentStreak++;
            } else {
                $longestStreak = max($longestStreak, $currentStreak);
                $currentStreak = 1;
            }
        }
        
        $prevDate = $attemptDate;
    }
    
    return max($longestStreak, $currentStreak);
}
?>
