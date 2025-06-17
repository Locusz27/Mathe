<?php
require_once '../config/database.php';

// Start session
session_start();

// Check if user is logged in and is a teacher
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Only teachers can create quizzes.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getQuiz($pdo, $_GET['id']);
        } else {
            getTeacherQuizzes($pdo);
        }
        break;
    case 'POST':
        createQuiz($pdo, $input);
        break;
    case 'PUT':
        updateQuiz($pdo, $input);
        break;
    case 'DELETE':
        deleteQuiz($pdo, $_GET['id']);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function getTeacherQuizzes($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM quizzes WHERE created_by = ? ORDER BY created_at DESC");
        $stmt->execute([$_SESSION['user_id']]);
        $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'data' => $quizzes]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch quizzes: ' . $e->getMessage()]);
    }
}

function getQuiz($pdo, $id) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM quizzes WHERE id = ? AND created_by = ?");
        $stmt->execute([$id, $_SESSION['user_id']]);
        $quiz = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$quiz) {
            echo json_encode(['success' => false, 'message' => 'Quiz not found or you do not have permission to access it.']);
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
        
        echo json_encode(['success' => true, 'data' => $quiz]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch quiz: ' . $e->getMessage()]);
    }
}

function createQuiz($pdo, $data) {
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
            $stmt = $pdo->prepare("INSERT INTO quiz_questions (quiz_id, story_context, question, options, correct_answer, hint, image_path, question_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            
            foreach ($data['questions'] as $index => $question) {
                $stmt->execute([
                    $quizId,
                    $question['story_context'] ?? '',
                    $question['question'],
                    json_encode($question['options']),
                    $question['correct_answer'],
                    $question['hint'] ?? '',
                    $question['image_path'] ?? null,
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

function updateQuiz($pdo, $data) {
    try {
        // Check if quiz exists and belongs to the current user
        $stmt = $pdo->prepare("SELECT id FROM quizzes WHERE id = ? AND created_by = ?");
        $stmt->execute([$data['id'], $_SESSION['user_id']]);
        if (!$stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Quiz not found or you do not have permission to edit it.']);
            return;
        }
        
        $pdo->beginTransaction();
        
        // Update quiz
        $stmt = $pdo->prepare("UPDATE quizzes SET title = ?, description = ?, subject = ?, level = ?, background_theme = ?, points_per_question = ?, time_limit = ? WHERE id = ?");
        $stmt->execute([
            $data['title'], 
            $data['description'], 
            $data['subject'], 
            $data['level'],
            $data['background_theme'] ?? 'default',
            $data['points_per_question'] ?? 10,
            $data['time_limit'] ?? 60,
            $data['id']
        ]);
        
        // Delete existing questions
        $stmt = $pdo->prepare("DELETE FROM quiz_questions WHERE quiz_id = ?");
        $stmt->execute([$data['id']]);
        
        // Insert updated questions
        if (isset($data['questions']) && is_array($data['questions'])) {
            $stmt = $pdo->prepare("INSERT INTO quiz_questions (quiz_id, story_context, question, options, correct_answer, hint, image_path, question_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            
            foreach ($data['questions'] as $index => $question) {
                $stmt->execute([
                    $data['id'],
                    $question['story_context'] ?? '',
                    $question['question'],
                    json_encode($question['options']),
                    $question['correct_answer'],
                    $question['hint'] ?? '',
                    $question['image_path'] ?? null,
                    $index + 1
                ]);
            }
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Quiz updated successfully']);
    } catch(PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Failed to update quiz: ' . $e->getMessage()]);
    }
}

function deleteQuiz($pdo, $id) {
    try {
        // Check if quiz exists and belongs to the current user
        $stmt = $pdo->prepare("SELECT id FROM quizzes WHERE id = ? AND created_by = ?");
        $stmt->execute([$id, $_SESSION['user_id']]);
        if (!$stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Quiz not found or you do not have permission to delete it.']);
            return;
        }
        
        $pdo->beginTransaction();
        
        // Delete questions first (due to foreign key constraint)
        $stmt = $pdo->prepare("DELETE FROM quiz_questions WHERE quiz_id = ?");
        $stmt->execute([$id]);
        
        // Delete quiz
        $stmt = $pdo->prepare("DELETE FROM quizzes WHERE id = ?");
        $stmt->execute([$id]);
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Quiz deleted successfully']);
    } catch(PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Failed to delete quiz: ' . $e->getMessage()]);
    }
}
?>
