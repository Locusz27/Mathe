-- Create database
CREATE DATABASE IF NOT EXISTS mathe_education;
USE mathe_education;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Learning materials table
CREATE TABLE IF NOT EXISTS learning_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    file_path VARCHAR(500),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Worksheets table
CREATE TABLE IF NOT EXISTS worksheets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    file_path VARCHAR(500),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    background_theme VARCHAR(50) DEFAULT 'default',
    points_per_question INT DEFAULT 10,
    time_limit INT DEFAULT 60,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    story_context TEXT,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    hint TEXT,
    image_path VARCHAR(500),
    question_order INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- User quiz attempts table (updated)
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT DEFAULT 0,
    total_questions INT NOT NULL,
    correct_answers INT DEFAULT 0,
    percentage_score DECIMAL(5,2) DEFAULT 0.00,
    time_taken INT DEFAULT 0,
    hints_used INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- User quiz statistics table (new)
CREATE TABLE IF NOT EXISTS user_quiz_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    total_quizzes INT DEFAULT 0,
    total_points INT DEFAULT 0,
    perfect_scores INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_quiz_date DATE,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default learning materials
INSERT INTO learning_materials (title, description, subject, level, file_path) VALUES
('Algebra Basics', 'Learn the fundamental concepts of algebra including variables, expressions, and equations.', 'Algebra', 'beginner', 'Algebra Basics Learning Materials.pdf'),
('Geometry Angles', 'Understand different types of angles, their properties, and how to measure them.', 'Geometry', 'beginner', 'Geometry Angles Learning Materials.pdf'),
('Fractions Practice', 'Learn how to work with fractions, including addition, subtraction, multiplication, and division.', 'Arithmetic', 'beginner', 'Fractions Practice Learning Materials.pdf'),
('Quadratic Equations', 'Master solving quadratic equations using factoring, completing the square, and the quadratic formula.', 'Algebra', 'intermediate', 'Quadratic Equations Learning Materials.pdf'),
('Trigonometric Functions', 'Explore sine, cosine, tangent, and other trigonometric functions and their applications.', 'Trigonometry', 'intermediate', 'Trigonometric Functions Learning Materials.pdf');

-- Insert default worksheets
INSERT INTO worksheets (title, description, subject, level, file_path) VALUES
('Algebra Basics Worksheet', 'Practice exercises on variables, expressions, and basic equations.', 'Algebra', 'beginner', 'Algebra Basics Worksheets.pdf'),
('Geometry Angles Worksheet', 'Practice problems on identifying, measuring, and calculating angles.', 'Geometry', 'beginner', 'Geometry Angles Worksheets.pdf'),
('Fractions Practice Worksheet', 'Practice problems on adding, subtracting, multiplying, and dividing fractions.', 'Arithmetic', 'beginner', 'Fractions Practice Worksheets.pdf'),
('Quadratic Equations Worksheet', 'Practice solving quadratic equations using various methods.', 'Algebra', 'intermediate', 'Quadratic Equations Worksheets.pdf'),
('Trigonometric Functions Worksheet', 'Practice problems on trigonometric functions and their applications.', 'Trigonometry', 'intermediate', 'Trigonometric Functions Worksheets.pdf');

-- REMOVED: Default quiz insertions that were causing duplicates
-- The quizzes will be handled by the JavaScript frontend instead

-- Add additional fields to learning_materials table
ALTER TABLE learning_materials 
ADD COLUMN file_name VARCHAR(255) AFTER file_path,
ADD COLUMN file_size INT AFTER file_name,
ADD COLUMN mime_type VARCHAR(100) AFTER file_size;

-- Add additional fields to worksheets table
ALTER TABLE worksheets 
ADD COLUMN file_name VARCHAR(255) AFTER file_path,
ADD COLUMN file_size INT AFTER file_name,
ADD COLUMN mime_type VARCHAR(100) AFTER file_size;

-- Create uploads directory table to track uploaded files
CREATE TABLE IF NOT EXISTS uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INT,
    upload_type ENUM('learning_material', 'worksheet') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- First, let's see what we're working with
SELECT 
    qq.id,
    qq.quiz_id,
    qq.question,
    qq.options,
    qq.correct_answer,
    q.title as quiz_title
FROM quiz_questions qq
JOIN quizzes q ON qq.quiz_id = q.id
WHERE q.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
ORDER BY qq.id DESC;

-- Now let's fix the correct_answer values more carefully
-- This will handle the conversion properly by checking if correct_answer is numeric
UPDATE quiz_questions 
SET correct_answer = CASE 
    WHEN correct_answer REGEXP '^[0-9]+$' THEN
        CASE 
            WHEN correct_answer = '0' THEN JSON_UNQUOTE(JSON_EXTRACT(options, '$[0]'))
            WHEN correct_answer = '1' THEN JSON_UNQUOTE(JSON_EXTRACT(options, '$[1]'))
            WHEN correct_answer = '2' THEN JSON_UNQUOTE(JSON_EXTRACT(options, '$[2]'))
            WHEN correct_answer = '3' THEN JSON_UNQUOTE(JSON_EXTRACT(options, '$[3]'))
            WHEN correct_answer = '4' THEN JSON_UNQUOTE(JSON_EXTRACT(options, '$[4]'))
            WHEN correct_answer = '5' THEN JSON_UNQUOTE(JSON_EXTRACT(options, '$[5]'))
            ELSE correct_answer
        END
    ELSE correct_answer
END
WHERE correct_answer REGEXP '^[0-9]+$';

-- Verify the changes
SELECT 
    qq.id,
    qq.question,
    qq.options,
    qq.correct_answer,
    q.title as quiz_title
FROM quiz_questions qq
JOIN quizzes q ON qq.quiz_id = q.id
WHERE q.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
ORDER BY qq.id DESC;

-- Update database schema to support user profiles and badges

-- Add badges table
CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    requirement_type ENUM('quizzes_completed', 'perfect_scores', 'current_streak', 'total_points', 'level') NOT NULL,
    requirement_value INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user_badges table to track earned badges
CREATE TABLE IF NOT EXISTS user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id)
);

-- Insert default badges
INSERT IGNORE INTO badges (id, name, description, icon, requirement_type, requirement_value) VALUES
('first_quiz', 'First Steps', 'Completed your first quiz', 'award', 'quizzes_completed', 1),
('perfect_score', 'Perfect Score', 'Achieved a perfect score on any quiz', 'target', 'perfect_scores', 1),
('streak_3', 'On Fire', 'Maintained a 3-day streak', 'flame', 'current_streak', 3),
('streak_7', 'Week Warrior', 'Maintained a 7-day streak', 'zap', 'current_streak', 7),
('quiz_master', 'Quiz Master', 'Completed 10 quizzes', 'trophy', 'quizzes_completed', 10),
('perfectionist', 'Perfectionist', 'Achieved 5 perfect scores', 'star', 'perfect_scores', 5),
('dedicated_learner', 'Dedicated Learner', 'Completed 25 quizzes', 'book-open', 'quizzes_completed', 25),
('point_collector', 'Point Collector', 'Earned 500 total points', 'coins', 'total_points', 500),
('rising_star', 'Rising Star', 'Reached level 5', 'trending-up', 'total_points', 500),
('math_champion', 'Math Champion', 'Reached level 10', 'crown', 'total_points', 1000);

-- Update user_quiz_stats table to ensure all needed fields exist
ALTER TABLE user_quiz_stats 
ADD COLUMN IF NOT EXISTS level INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS points_to_next_level INT DEFAULT 100;

-- Create or update stored procedure to calculate user level
DELIMITER //
CREATE OR REPLACE PROCEDURE UpdateUserLevel(IN userId INT)
BEGIN
    DECLARE userPoints INT DEFAULT 0;
    DECLARE userLevel INT DEFAULT 1;
    DECLARE pointsToNext INT DEFAULT 100;
    
    -- Get user's total points
    SELECT COALESCE(total_points, 0) INTO userPoints 
    FROM user_quiz_stats 
    WHERE user_id = userId;
    
    -- Calculate level (100 points per level)
    SET userLevel = FLOOR(userPoints / 100) + 1;
    SET pointsToNext = 100 - (userPoints % 100);
    
    -- Update user stats
    UPDATE user_quiz_stats 
    SET level = userLevel, points_to_next_level = pointsToNext
    WHERE user_id = userId;
END //
DELIMITER ;

-- Create procedure to check and award badges
DELIMITER //

CREATE OR REPLACE PROCEDURE CheckAndAwardBadges(IN userId INT)
BEGIN
    -- Declare variables first
    DECLARE done INT DEFAULT FALSE;
    DECLARE badgeId VARCHAR(50);
    DECLARE badgeName VARCHAR(100);
    DECLARE requirementType VARCHAR(50);
    DECLARE requirementValue INT;
    DECLARE userValue INT;

    -- Declare user stat variables
    DECLARE userQuizzes INT DEFAULT 0;
    DECLARE userPerfectScores INT DEFAULT 0;
    DECLARE userCurrentStreak INT DEFAULT 0;
    DECLARE userTotalPoints INT DEFAULT 0;

    -- Declare cursor BEFORE handler
    DECLARE badge_cursor CURSOR FOR 
        SELECT id, name, requirement_type, requirement_value 
        FROM badges;

    -- Declare handler AFTER cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Get user stats
    SELECT 
        COALESCE(total_quizzes, 0),
        COALESCE(perfect_scores, 0),
        COALESCE(current_streak, 0),
        COALESCE(total_points, 0)
    INTO userQuizzes, userPerfectScores, userCurrentStreak, userTotalPoints
    FROM user_quiz_stats 
    WHERE user_id = userId;

    -- Start cursor loop
    OPEN badge_cursor;

    read_loop: LOOP
        FETCH badge_cursor INTO badgeId, badgeName, requirementType, requirementValue;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Only check if badge not yet earned
        IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = userId AND badge_id = badgeId) THEN
            SET userValue = 0;

            -- Evaluate based on requirement type
            CASE requirementType
                WHEN 'quizzes_completed' THEN SET userValue = userQuizzes;
                WHEN 'perfect_scores' THEN SET userValue = userPerfectScores;
                WHEN 'current_streak' THEN SET userValue = userCurrentStreak;
                WHEN 'total_points' THEN SET userValue = userTotalPoints;
            END CASE;

            -- Grant badge if criteria met
            IF userValue >= requirementValue THEN
                INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (userId, badgeId);
            END IF;
        END IF;
    END LOOP;

    CLOSE badge_cursor;
END //

DELIMITER ;
