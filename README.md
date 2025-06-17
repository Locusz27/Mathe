 🚀 Running Mathe Education Platform with XAMPP

This guide will help you set up and run the Mathe Education Platform on your local machine using XAMPP.

## 📋 Prerequisites

- **XAMPP** (Apache, MySQL, PHP) - Download from [https://www.apachefriends.org/](https://www.apachefriends.org/)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Text Editor** (VS Code, Sublime Text, Notepad++, etc.)

## 🛠️ Step-by-Step Installation

### Step 1: Install XAMPP

1. **Download XAMPP** from the official website
2. **Install XAMPP** with default settings
3. **Start XAMPP Control Panel**

### Step 2: Start Required Services

1. Open **XAMPP Control Panel**
2. Start **Apache** (click "Start" button)
3. Start **MySQL** (click "Start" button)
4. Verify both services show **green "Running"** status

![XAMPP Control Panel](https://via.placeholder.com/600x300?text=XAMPP+Control+Panel)

### Step 3: Download/Clone the Project

#### Option A: Download ZIP
1. Download the project ZIP file
2. Extract to \`C:\\xampp\\htdocs\\mathe-education\`

#### Option B: Git Clone
\`\`\`bash
cd C:\\xampp\\htdocs
git clone https://github.com/yourusername/mathe-education.git
\`\`\`

### Step 4: Set Up the Database

#### 4.1 Access phpMyAdmin
1. Open your browser
2. Go to: \`http://localhost/phpmyadmin\`
3. Login (usually no password required for local XAMPP)

#### 4.2 Create Database
1. Click **"New"** in the left sidebar
2. Enter database name: \`mathe_education\`
3. Click **"Create"**

#### 4.3 Import Database Schema
1. Select the \`mathe_education\` database
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Navigate to your project folder: \`C:\\xampp\\htdocs\\mathe-education\\database\\schema.sql\`
5. Click **"Go"** to import

### Step 5: Configure Database Connection

1. Navigate to: \`C:\\xampp\\htdocs\\mathe-education\\config\\database.php\`
2. Verify the settings match your XAMPP configuration:

\`\`\`php
<?php
$host = 'localhost';
$dbname = 'mathe_education';
$username = 'root';          // Default XAMPP MySQL username
$password = '';              // Default XAMPP MySQL password (empty)
\`\`\`

### Step 6: Set Up File Permissions (Windows)

1. Right-click on the \`pdfs\` folder
2. Select **"Properties"**
3. Go to **"Security"** tab
4. Ensure **"Full Control"** is enabled for your user

### Step 7: Access the Application

1. Open your web browser
2. Go to: \`http://localhost/mathe-education\`
3. You should see the Mathe Education homepage!

## 🎯 Testing the Installation

### Test Database Connection
1. Go to: \`http://localhost/mathe-education/test-connection.php\`
2. You should see: **"Database connection successful!"**

### Test User Registration
1. Click **"Login"** on the homepage
2. Click **"Register"** 
3. Create a test account
4. Verify you can login successfully

### Test File Access
1. Go to **"Learning Materials"** page
2. Try to view a PDF file
3. Verify PDFs open correctly

## 🔧 Common Issues & Solutions

### Issue 1: Apache Won't Start
**Problem**: Port 80 is already in use
**Solution**: 
1. Click **"Config"** next to Apache in XAMPP
2. Select **"Apache (httpd.conf)"**
3. Change \`Listen 80\` to \`Listen 8080\`
4. Access site at: \`http://localhost:8080/mathe-education\`

### Issue 2: MySQL Won't Start
**Problem**: Port 3306 is already in use
**Solution**:
1. Click **"Config"** next to MySQL in XAMPP
2. Select **"my.ini"**
3. Change \`port=3306\` to \`port=3307\`
4. Update \`database.php\` to use port 3307

### Issue 3: Database Connection Failed
**Problem**: Wrong database credentials
**Solution**:
1. Check phpMyAdmin access: \`http://localhost/phpmyadmin\`
2. Verify database name: \`mathe_education\`
3. Check username/password in \`config/database.php\`

### Issue 4: PDFs Not Loading
**Problem**: File path issues
**Solution**:
1. Verify PDF files are in: \`C:\\xampp\\htdocs\\mathe-education\\pdfs\\\`
2. Check file permissions
3. Ensure \`serve-pdf.php\` is working

### Issue 5: 404 Error on Main Page
**Problem**: Wrong URL or folder location
**Solution**:
1. Verify project is in: \`C:\\xampp\\htdocs\\mathe-education\\\`
2. Use correct URL: \`http://localhost/mathe-education\`
3. Check that \`index.html\` exists in the root folder

## 📁 Project Structure in XAMPP

\`\`\`
C:\\xampp\\htdocs\\mathe-education\\
├── api/                    # Backend API files
├── config/                 # Configuration files
│   └── database.php        # Database connection
├── database/               # Database files
│   └── schema.sql          # Database structure
├── images/                 # Images and logos
├── js/                     # JavaScript files
├── pdfs/                   # PDF storage
│   ├── learning-materials/ # Learning material PDFs
│   └── worksheets/         # Worksheet PDFs
├── *.html                  # Frontend pages
├── *.css                   # Stylesheets
├── *.js                    # JavaScript files
└── *.php                   # PHP files
\`\`\`

## 🌐 Accessing Different Pages

- **Homepage**: \`http://localhost/mathe-education/\`
- **Login**: \`http://localhost/mathe-education/login.html\`
- **Dashboard**: \`http://localhost/mathe-education/dashboard.html\`
- **Learning Materials**: \`http://localhost/mathe-education/learning-materials.html\`
- **Worksheets**: \`http://localhost/mathe-education/worksheets.html\`
- **Quiz**: \`http://localhost/mathe-education/quiz.html\`
- **phpMyAdmin**: \`http://localhost/phpmyadmin\`
