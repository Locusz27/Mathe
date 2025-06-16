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

-- Insert default quizzes for testing
INSERT INTO quizzes (title, description, subject, level, background_theme, points_per_question, time_limit) VALUES
('Basic Algebra Adventure', 'Solve algebraic puzzles to unlock the secrets of the ancient temple', 'Algebra', 'beginner', 'temple', 10, 60),
('Geometry Quest', 'Navigate through the enchanted forest by solving geometry problems', 'Geometry', 'intermediate', 'forest', 15, 45),
('Arithmetic Kingdom', 'Help the kingdom solve arithmetic challenges to defeat the dragon', 'Arithmetic', 'beginner', 'kingdom', 10, 30);

-- Insert sample quiz questions
INSERT INTO quiz_questions (quiz_id, story_context, question, options, correct_answer, hint, question_order) VALUES
(1, 'As you approach the temple entrance, you notice ancient symbols carved into the stone.', 'To unlock the first door, you must solve for x: 2x + 5 = 13', '["x = 3", "x = 4", "x = 5", "x = 6"]', 'x = 4', 'Subtract 5 from both sides, then divide by 2.', 1),
(1, 'Inside the temple, you find a series of levers.', 'Find the value of y in the equation: 3y - 7 = 14', '["y = 5", "y = 6", "y = 7", "y = 8"]', 'y = 7', 'Add 7 to both sides, then divide by 3.', 2),
(1, 'You have reached the inner chamber.', 'Solve for z: 4z + 8 = 2z - 4', '["z = -6", "z = -5", "z = -4", "z = -3"]', 'z = -6', 'Subtract 2z from both sides, then subtract 8 from both sides.', 3);
