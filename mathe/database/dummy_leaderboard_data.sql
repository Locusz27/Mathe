-- Insert dummy users for leaderboard testing
INSERT INTO users (username, email, password, role) VALUES
('MathWizard2024', 'mathwiz@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('AlgebraAce', 'algebra@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('GeometryGuru', 'geometry@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('CalculusKing', 'calculus@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('TrigMaster', 'trig@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('NumberNinja', 'numbers@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('StatsStar', 'stats@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('ProbabilityPro', 'prob@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('FractionFan', 'fractions@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('EquationExpert', 'equations@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('MathMaverick', 'maverick@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('QuizChampion', 'champion@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('StudyBuddy', 'study@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('BrainBooster', 'brain@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('SmartSolver', 'solver@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

-- Insert dummy quiz statistics using the actual user IDs from the users we just created
-- We'll use a subquery to get the correct user IDs based on usernames
INSERT INTO user_quiz_stats (user_id, total_quizzes, total_points, perfect_scores, current_streak, longest_streak, last_quiz_date, average_score) 
SELECT u.id, stats.total_quizzes, stats.total_points, stats.perfect_scores, stats.current_streak, stats.longest_streak, stats.last_quiz_date, stats.average_score
FROM users u
JOIN (
    SELECT 'MathWizard2024' as username, 45 as total_quizzes, 1250 as total_points, 12 as perfect_scores, 7 as current_streak, 15 as longest_streak, '2024-01-15' as last_quiz_date, 87.5 as average_score
    UNION ALL SELECT 'AlgebraAce', 38, 980, 8, 5, 12, '2024-01-14', 82.1
    UNION ALL SELECT 'GeometryGuru', 42, 1150, 10, 6, 18, '2024-01-15', 85.3
    UNION ALL SELECT 'CalculusKing', 52, 1420, 15, 8, 20, '2024-01-15', 91.2
    UNION ALL SELECT 'TrigMaster', 35, 890, 7, 4, 10, '2024-01-13', 79.8
    UNION ALL SELECT 'NumberNinja', 28, 650, 5, 3, 8, '2024-01-12', 75.4
    UNION ALL SELECT 'StatsStar', 25, 580, 4, 2, 6, '2024-01-11', 72.6
    UNION ALL SELECT 'ProbabilityPro', 22, 520, 3, 1, 5, '2024-01-10', 69.8
    UNION ALL SELECT 'FractionFan', 30, 720, 6, 4, 9, '2024-01-14', 78.2
    UNION ALL SELECT 'EquationExpert', 26, 610, 4, 2, 7, '2024-01-12', 74.1
    UNION ALL SELECT 'MathMaverick', 18, 420, 2, 1, 4, '2024-01-09', 65.3
    UNION ALL SELECT 'QuizChampion', 15, 350, 1, 0, 3, '2024-01-08', 62.7
    UNION ALL SELECT 'StudyBuddy', 12, 280, 1, 0, 2, '2024-01-07', 58.9
    UNION ALL SELECT 'BrainBooster', 20, 480, 3, 2, 5, '2024-01-11', 71.5
    UNION ALL SELECT 'SmartSolver', 14, 320, 1, 1, 3, '2024-01-08', 60.4
) stats ON u.username = stats.username;

-- Create some sample quizzes for the dummy quiz attempts (only if they don't exist)
INSERT IGNORE INTO quizzes (id, title, description, subject, level, background_theme, points_per_question, time_limit) VALUES
(1, 'Sample Algebra Quiz', 'Basic algebra questions for testing', 'Algebra', 'beginner', 'temple', 10, 60),
(2, 'Sample Geometry Quiz', 'Basic geometry questions for testing', 'Geometry', 'intermediate', 'forest', 15, 45),
(3, 'Sample Arithmetic Quiz', 'Basic arithmetic questions for testing', 'Arithmetic', 'beginner', 'kingdom', 10, 30),
(4, 'Sample Advanced Quiz', 'Advanced math questions for testing', 'Algebra', 'advanced', 'space', 20, 90);

-- Insert some sample quiz questions for the sample quizzes
INSERT IGNORE INTO quiz_questions (quiz_id, question, options, correct_answer, hint, question_order) VALUES
(1, 'Solve for x: 2x + 5 = 13', '["x = 3", "x = 4", "x = 5", "x = 6"]', 'x = 4', 'Subtract 5 from both sides, then divide by 2.', 1),
(1, 'Find the value of y: 3y - 7 = 14', '["y = 5", "y = 6", "y = 7", "y = 8"]', 'y = 7', 'Add 7 to both sides, then divide by 3.', 2),
(1, 'Solve for z: 4z + 8 = 2z - 4', '["z = -6", "z = -5", "z = -4", "z = -3"]', 'z = -6', 'Subtract 2z from both sides, then subtract 8.', 3),
(2, 'What is the sum of angles in a triangle?', '["90°", "180°", "270°", "360°"]', '180°', 'Remember the basic property of triangles.', 1),
(2, 'What type of angle is 95°?', '["Acute", "Right", "Obtuse", "Straight"]', 'Obtuse', 'An obtuse angle is greater than 90°.', 2),
(2, 'How many sides does a hexagon have?', '["5", "6", "7", "8"]', '6', 'Hex means six.', 3),
(3, 'What is 15 + 27?', '["40", "41", "42", "43"]', '42', 'Add the numbers carefully.', 1),
(3, 'What is 8 × 7?', '["54", "55", "56", "57"]', '56', 'Multiply step by step.', 2),
(3, 'What is 144 ÷ 12?', '["11", "12", "13", "14"]', '12', 'Think about multiplication tables.', 3),
(4, 'Solve for x: log₂(x) = 5', '["x = 10", "x = 25", "x = 32", "x = 64"]', 'x = 32', '2 raised to what power gives 32?', 1),
(4, 'Which of the following represents the inverse of f(x) = 3x - 7?', '["f⁻¹(x) = (x + 7)/3", "f⁻¹(x) = 3x + 7", "f⁻¹(x) = x/3 - 7", "f⁻¹(x) = 3/(x - 7)"]', 'f⁻¹(x) = (x + 7)/3', 'Swap x and y, then solve for y.', 2),
(4, 'What is the solution to the inequality: 2x - 3 > 5?', '["x > 4", "x < 4", "x > 1", "x < 1"]', 'x > 4', 'Add 3 to both sides, then divide by 2.', 3);

-- Insert dummy quiz attempts using the actual user IDs
INSERT INTO user_quiz_attempts (user_id, quiz_id, score, total_questions, correct_answers, percentage_score, time_taken, hints_used, completed_at)
SELECT u.id, attempts.quiz_id, attempts.score, attempts.total_questions, attempts.correct_answers, attempts.percentage_score, attempts.time_taken, attempts.hints_used, attempts.completed_at
FROM users u
JOIN (
    -- MathWizard2024 recent attempts
    SELECT 'MathWizard2024' as username, 1 as quiz_id, 30 as score, 3 as total_questions, 3 as correct_answers, 100.00 as percentage_score, 45 as time_taken, 0 as hints_used, '2024-01-15 14:30:00' as completed_at
    UNION ALL SELECT 'MathWizard2024', 2, 45, 3, 3, 100.00, 38, 0, '2024-01-15 10:15:00'
    UNION ALL SELECT 'MathWizard2024', 3, 30, 3, 3, 100.00, 25, 0, '2024-01-14 16:45:00'
    
    -- CalculusKing recent attempts  
    UNION ALL SELECT 'CalculusKing', 1, 30, 3, 3, 100.00, 42, 0, '2024-01-15 13:20:00'
    UNION ALL SELECT 'CalculusKing', 2, 45, 3, 3, 100.00, 35, 0, '2024-01-15 09:30:00'
    UNION ALL SELECT 'CalculusKing', 4, 60, 3, 3, 100.00, 55, 0, '2024-01-14 15:10:00'
    
    -- GeometryGuru recent attempts
    UNION ALL SELECT 'GeometryGuru', 2, 45, 3, 3, 100.00, 40, 0, '2024-01-15 11:45:00'
    UNION ALL SELECT 'GeometryGuru', 1, 20, 3, 2, 66.67, 50, 1, '2024-01-14 14:20:00'
    UNION ALL SELECT 'GeometryGuru', 3, 30, 3, 3, 100.00, 28, 0, '2024-01-13 17:30:00'
    
    -- Mid-level performer attempts
    UNION ALL SELECT 'NumberNinja', 1, 20, 3, 2, 66.67, 55, 1, '2024-01-12 13:15:00'
    UNION ALL SELECT 'NumberNinja', 3, 20, 3, 2, 66.67, 30, 0, '2024-01-11 16:20:00'
    UNION ALL SELECT 'StatsStar', 2, 30, 3, 2, 66.67, 42, 1, '2024-01-11 12:30:00'
    UNION ALL SELECT 'StatsStar', 1, 10, 3, 1, 33.33, 60, 2, '2024-01-10 15:45:00'
    
    -- Lower-level performer attempts
    UNION ALL SELECT 'QuizChampion', 1, 10, 3, 1, 33.33, 60, 2, '2024-01-08 14:10:00'
    UNION ALL SELECT 'QuizChampion', 3, 20, 3, 2, 66.67, 29, 1, '2024-01-07 16:30:00'
    UNION ALL SELECT 'StudyBuddy', 1, 10, 3, 1, 33.33, 58, 1, '2024-01-07 13:45:00'
    UNION ALL SELECT 'StudyBuddy', 2, 15, 3, 1, 33.33, 44, 2, '2024-01-06 15:20:00'
) attempts ON u.username = attempts.username;

-- Verify the data
SELECT 
    u.username,
    uqs.total_points,
    FLOOR(uqs.total_points / 100) + 1 as user_level,
    uqs.perfect_scores,
    uqs.average_score,
    uqs.total_quizzes,
    uqs.current_streak,
    uqs.last_quiz_date
FROM users u
JOIN user_quiz_stats uqs ON u.id = uqs.user_id
ORDER BY uqs.total_points DESC;
