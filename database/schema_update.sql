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
