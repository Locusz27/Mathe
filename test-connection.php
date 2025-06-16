<?php
// Test database connection
require_once 'config/database.php';

echo "<h2>Database Connection Test</h2>";

try {
    // Test connection
    $stmt = $pdo->query("SELECT 1");
    echo "<p style='color: green;'>✓ Database connection successful!</p>";
    
    // Test if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Users table exists!</p>";
        
        // Count users
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch();
        echo "<p>Current users in database: " . $result['count'] . "</p>";
    } else {
        echo "<p style='color: red;'>✗ Users table does not exist!</p>";
        echo "<p>Please run the database schema SQL script.</p>";
    }
    
} catch(PDOException $e) {
    echo "<p style='color: red;'>✗ Database error: " . $e->getMessage() . "</p>";
}

echo "<h3>Test Registration API</h3>";
echo "<p>Open browser console and try this JavaScript:</p>";
echo "<pre>
fetch('api/auth.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        action: 'register',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
    })
}).then(r => r.json()).then(console.log);
</pre>";
?>