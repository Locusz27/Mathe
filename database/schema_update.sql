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