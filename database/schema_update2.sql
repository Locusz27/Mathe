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
