// Quiz data
const quizzes = [
  {
    id: 1,
    title: "Basic Algebra Adventure",
    description: "Solve algebraic puzzles to unlock the secrets of the ancient temple",
    subject: "Algebra",
    level: "Beginner",
    backgroundTheme: "temple",
    questions: [
      {
        id: 1,
        storyContext:
          "As you approach the temple entrance, you notice ancient symbols carved into the stone. The door is sealed with a magical lock that requires solving an equation.",
        question: "To unlock the first door, you must solve for x: 2x + 5 = 13",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: "x = 4",
        hint: "Subtract 5 from both sides, then divide by 2.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        storyContext:
          "Inside the temple, you find a series of levers. According to the ancient text, you must pull the lever that corresponds to the correct value.",
        question: "Find the value of y in the equation: 3y - 7 = 14",
        options: ["y = 5", "y = 6", "y = 7", "y = 8"],
        correctAnswer: "y = 7",
        hint: "Add 7 to both sides, then divide by 3.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        storyContext:
          "You've reached the inner chamber. A final challenge awaits - a series of symbols that form an equation.",
        question: "Solve for z: 4z + 8 = 2z - 4",
        options: ["z = -6", "z = -5", "z = -4", "z = -3"],
        correctAnswer: "z = -6",
        hint: "Subtract 2z from both sides, then subtract 8 from both sides.",
        image: "/placeholder.svg?height=200&width=300",
      }
    ],
    pointsPerQuestion: 10,
    timeLimit: 60, // seconds per question
    totalPoints: 30,
  },
  {
    id: 2,
    title: "Geometry Quest",
    description: "Navigate through the enchanted forest by solving geometry problems",
    subject: "Geometry",
    level: "Intermediate",
    backgroundTheme: "forest",
    questions: [
      {
        id: 1,
        storyContext:
          "You enter the enchanted forest and come across a peculiar tree with geometric shapes carved into its trunk.",
        question: "What is the area of a circle with radius 5 units?",
        options: ["25π square units", "10π square units", "25 square units", "50 square units"],
        correctAnswer: "25π square units",
        hint: "The area of a circle is πr².",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        storyContext:
          "A magical bridge appears before you, but to cross it safely, you must answer the guardian's question.",
        question: "In a right triangle, if one angle is 30° and another is 60°, what is the third angle?",
        options: ["30°", "60°", "90°", "120°"],
        correctAnswer: "90°",
        hint: "The sum of all angles in a triangle is 180°.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        storyContext:
          "You reach a clearing with a mysterious stone tablet. It shows a rectangle with specific dimensions.",
        question: "What is the perimeter of a rectangle with length 8 units and width 5 units?",
        options: ["13 units", "26 units", "40 units", "30 units"],
        correctAnswer: "26 units",
        hint: "Perimeter = 2(length + width).",
        image: "/placeholder.svg?height=200&width=300",
      }
    ],
    pointsPerQuestion: 15,
    timeLimit: 45,
    totalPoints: 45,
  },
  {
    id: 3,
    title: "Arithmetic Kingdom",
    description: "Help the kingdom solve arithmetic challenges to defeat the dragon",
    subject: "Arithmetic",
    level: "Beginner",
    backgroundTheme: "kingdom",
    questions: [
      {
        id: 1,
        storyContext:
          "The kingdom is under threat from a dragon. The royal mathematician has devised a plan, but you need to solve the first calculation.",
        question: "If the dragon flies at 45 mph and the castle is 135 miles away, how many hours will it take the dragon to reach the castle?",
        options: ["2 hours", "3 hours", "4 hours", "5 hours"],
        correctAnswer: "3 hours",
        hint: "Use the formula: time = distance ÷ speed.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        storyContext:
          "The royal armory needs to distribute shields to the knights. Each knight needs exactly 2 shields.",
        question: "If there are 85 knights and the armory has 200 shields, how many shields will be left after distribution?",
        options: ["15 shields", "20 shields", "25 shields", "30 shields"],
        correctAnswer: "30 shields",
        hint: "Calculate 85 × 2 = 170, then subtract from 200.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        storyContext:
          "The royal treasurer needs to calculate the cost of the feast to celebrate the dragon's defeat.",
        question: "If each guest consumes food worth $25 and there are 120 guests, what is the total cost of food?",
        options: ["$2,500", "$3,000", "$3,500", "$4,000"],
        correctAnswer: "$3,000",
        hint: "Multiply the cost per guest by the number of guests.",
        image: "/placeholder.svg?height=200&width=300",
      }
    ],
    pointsPerQuestion: 10,
    timeLimit: 30,
    totalPoints: 30,
  },
  {
    id: 4,
    title: "Trigonometry Mountain",
    description: "Scale the mountain peaks by mastering trigonometric concepts",
    subject: "Trigonometry",
    level: "Advanced",
    backgroundTheme: "mountain",
    questions: [
      {
        id: 1,
        storyContext:
          "You begin your ascent of the mathematical mountain. The first challenge involves calculating the height of a peak.",
        question: "From a point 100 meters from the base of a mountain, the angle of elevation to the peak is 30°. How tall is the mountain?",
        options: ["50 meters", "57.7 meters", "100 meters", "173.2 meters"],
        correctAnswer: "57.7 meters",
        hint: "Use the tangent function: tan(30°) = height/100.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        storyContext:
          "Halfway up the mountain, you encounter a trigonometric puzzle carved into the rock face.",
        question: "What is the value of sin(45°)?",
        options: ["0.5", "0.707", "0.866", "1"],
        correctAnswer: "0.707",
        hint: "sin(45°) = 1/√2 ≈ 0.707.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        storyContext:
          "Near the summit, a final challenge awaits. A mysterious triangle is drawn in the snow.",
        question: "In a right triangle, if one angle is 60° and the hypotenuse is 10 units, what is the length of the side opposite to the 60° angle?",
        options: ["5 units", "8.66 units", "7.5 units", "10 units"],
        correctAnswer: "8.66 units",
        hint: "Use the sine function: sin(60°) = opposite/hypotenuse.",
        image: "/placeholder.svg?height=200&width=300",
      }
    ],
    pointsPerQuestion: 20,
    timeLimit: 60,
    totalPoints: 60,
  }
];

// Leaderboard data (simulated)
const leaderboardData = [
  { id: 1, name: "MathWizard", points: 450, level: 9, perfectScores: 12 },
  { id: 2, name: "AlgebraPro", points: 380, level: 8, perfectScores: 10 },
  { id: 3, name: "GeometryKing", points: 350, level: 7, perfectScores: 8 },
  { id: 4, name: "NumberNinja", points: 320, level: 7, perfectScores: 7 },
  { id: 5, name: "EquationMaster", points: 290, level: 6, perfectScores: 6 },
  { id: 6, name: "MathExplorer", points: 0, level: 1, perfectScores: 0, isCurrentUser: true },
  { id: 7, name: "FormulaFriend", points: 240, level: 5, perfectScores: 5 },
  { id: 8, name: "CalculusQueen", points: 210, level: 5, perfectScores: 4 },
  { id: 9, name: "TrigonometryTitan", points: 180, level: 4, perfectScores: 3 },
  { id: 10, name: "StatisticsStarlet", points: 150, level: 3, perfectScores: 2 }
];

// Badge definitions
const badges = [
  {
    id: "first_quiz",
    name: "First Steps",
    description: "Completed your first quiz",
    icon: "award",
    requirement: (stats) => stats.quizzesCompleted >= 1
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Achieved a perfect score on any quiz",
    icon: "target",
    requirement: (stats) => stats.perfectScores >= 1
  },
  {
    id: "streak_3",
    name: "On Fire",
    description: "Maintained a 3-day streak",
    icon: "flame",
    requirement: (stats) => stats.currentStreak >= 3
  },
  {
    id: "level_5",
    name: "Rising Star",
    description: "Reached level 5",
    icon: "star",
    requirement: (stats) => stats.level >= 5
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Completed 10 quizzes",
    icon: "trophy",
    requirement: (stats) => stats.quizzesCompleted >= 10
  }
];

// User data (stored in localStorage)
let userData = {
  points: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastQuizDate: null,
  quizzesCompleted: 0,
  perfectScores: 0,
  earnedBadges: []
};

// Constants
const POINTS_PER_LEVEL = 100;

// DOM Elements
const dashboardContainer = document.getElementById("dashboard-container");
const quizContainer = document.getElementById("quiz-container");
const quizzesGrid = document.getElementById("quizzes-grid");
const searchInput = document.getElementById("search-quizzes");
const tabItems = document.querySelectorAll(".tab-item");
const tabContents = document.querySelectorAll(".tab-content");
const leaderboardContent = document.getElementById("leaderboard-content");
const leaderboardTabs = document.querySelectorAll(".leaderboard-tab");
const mobileMenuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const customDropdowns = document.querySelectorAll(".custom-dropdown-container");

// Initialize the app
document.addEventListener("DOMContentLoaded", function() {
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Load user data from localStorage
  loadUserData();
  
  // Update UI with user data
  updateUserStatsDisplay();
  
  // Render quizzes
  renderQuizzes(quizzes);
  
  // Set up event listeners
  setupEventListeners();
  
  // Update current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear();
});

// Load user data from localStorage
function loadUserData() {
  const storedData = localStorage.getItem("mathQuizUserData");
  if (storedData) {
    userData = JSON.parse(storedData);
  }
}

// Save user data to localStorage
function saveUserData() {
  localStorage.setItem("mathQuizUserData", JSON.stringify(userData));
}

// Update user stats display
function updateUserStatsDisplay() {
  // Update dashboard header stats
  document.getElementById("user-level").textContent = `Level ${userData.level}`;
  document.getElementById("user-points").textContent = `${userData.points} Points`;
  document.getElementById("user-streak").textContent = `${userData.currentStreak} Day Streak`;
  
  // Update profile tab stats
  document.getElementById("profile-level").textContent = userData.level;
  document.getElementById("level-number").textContent = userData.level;
  document.getElementById("total-points").textContent = userData.points;
  
  const pointsToNextLevel = POINTS_PER_LEVEL - (userData.points % POINTS_PER_LEVEL);
  document.getElementById("points-to-next-level").textContent = pointsToNextLevel;
  
  const progressPercentage = ((userData.points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL) * 100;
  document.getElementById("level-progress").style.width = `${progressPercentage}%`;
  
  document.getElementById("current-streak").textContent = userData.currentStreak;
  document.getElementById("longest-streak").textContent = `${userData.longestStreak} days`;
  document.getElementById("last-quiz-date").textContent = userData.lastQuizDate ? new Date(userData.lastQuizDate).toLocaleDateString() : "Never";
  
  document.getElementById("quizzes-completed").textContent = userData.quizzesCompleted;
  document.getElementById("perfect-scores").textContent = userData.perfectScores;
  document.getElementById("achievement-total-points").textContent = userData.points;
  
  // Update badges
  updateBadgesDisplay();
}

// Update badges display
function updateBadgesDisplay() {
  const noBadgesContainer = document.getElementById("no-badges-container");
  const badgesGrid = document.getElementById("badges-grid");
  
  // Check for newly earned badges
  checkForNewBadges();
  
  if (userData.earnedBadges.length === 0) {
    noBadgesContainer.style.display = "flex";
    badgesGrid.style.display = "none";
  } else {
    noBadgesContainer.style.display = "none";
    badgesGrid.style.display = "grid";
    
    // Clear existing badges
    badgesGrid.innerHTML = "";
    
    // Add earned badges
    userData.earnedBadges.forEach(badgeId => {
      const badge = badges.find(b => b.id === badgeId);
      if (badge) {
        const badgeElement = document.createElement("div");
        badgeElement.className = "badge-item";
        badgeElement.innerHTML = `
          <div class="badge-icon">
            <i data-lucide="${badge.icon}"></i>
          </div>
          <div class="badge-info">
            <div class="badge-name">${badge.name}</div>
            <div class="badge-description">${badge.description}</div>
          </div>
        `;
        badgesGrid.appendChild(badgeElement);
      }
    });
    
    // Initialize Lucide icons for new badges
    lucide.createIcons();
  }
}

// Check for new badges
function checkForNewBadges() {
  badges.forEach(badge => {
    if (!userData.earnedBadges.includes(badge.id) && badge.requirement(userData)) {
      userData.earnedBadges.push(badge.id);
      saveUserData();
    }
  });
}

// Render quizzes
function renderQuizzes(quizzesToRender) {
  quizzesGrid.innerHTML = "";
  
  if (quizzesToRender.length === 0) {
    quizzesGrid.innerHTML = `
      <div class="no-results">
        <i data-lucide="search-x" style="width: 3rem; height: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
        <p>No quizzes found matching your search criteria.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  quizzesToRender.forEach(quiz => {
    const quizCard = document.createElement("div");
    quizCard.className = "card";
    quizCard.innerHTML = `
      <div class="card-header">
        <div class="tags">
          <div class="tag">${quiz.subject}</div>
          <div class="tag">${quiz.level}</div>
        </div>
        <h3 class="card-title">${quiz.title}</h3>
        <p class="card-description">${quiz.description}</p>
      </div>
      <div class="card-content">
        <div class="quiz-info">
          <span>${quiz.questions.length} Questions</span>
          <span>${quiz.totalPoints} Points</span>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary btn-full start-quiz-btn" data-quiz-id="${quiz.id}">Start Quiz</button>
      </div>
    `;
    quizzesGrid.appendChild(quizCard);
    
    // Add event listener to the start quiz button
    quizCard.querySelector(".start-quiz-btn").addEventListener("click", function() {
      const quizId = parseInt(this.getAttribute("data-quiz-id"));
      startQuiz(quizId);
    });
  });
}


// Filter quizzes
function filterQuizzes() {
  const searchTerm = searchInput.value.toLowerCase();
  const subjectFilter = document.querySelector("#subject-filter-container .custom-dropdown-selected span").textContent;
  const levelFilter = document.querySelector("#level-filter-container .custom-dropdown-selected span").textContent;
  
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm) || 
                          quiz.description.toLowerCase().includes(searchTerm) ||
                          quiz.subject.toLowerCase().includes(searchTerm);
    
    const matchesSubject = subjectFilter === "All Subjects" || quiz.subject === subjectFilter;
    const matchesLevel = levelFilter === "All Levels" || quiz.level === levelFilter;
    
    return matchesSearch && matchesSubject && matchesLevel;
  });
  
  renderQuizzes(filteredQuizzes);
}

// Start a quiz
function startQuiz(quizId) {
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) return;
  
  // Hide dashboard, show quiz container
  dashboardContainer.style.display = "none";
  quizContainer.style.display = "block";
  quizContainer.classList.add("active");
  
  // Set background theme
  quizContainer.className = "quiz-container active";
  quizContainer.classList.add(`quiz-background`);
  quizContainer.classList.add(`${quiz.backgroundTheme}`);
  
  // Initialize quiz state
  const quizState = {
    quiz: quiz,
    currentQuestionIndex: 0,
    score: 0,
    hintsUsed: 0,
    timeRemaining: quiz.timeLimit,
    timerInterval: null,
    answers: []
  };
  
  // Render intro story
  renderIntroStory(quizState);
}

// Render intro story
function renderIntroStory(quizState) {
  const quiz = quizState.quiz;
  
  const introStoryHTML = `
    <div class="quiz-content quiz-enter">
      <div class="intro-story-card">
        <h2 class="intro-story-title">${quiz.title}</h2>
        <p class="intro-story-text">${quiz.description}</p>
        
        <div class="intro-story-details">
          <div class="intro-story-detail">
            <span class="intro-story-detail-label">Subject:</span>
            <span>${quiz.subject}</span>
          </div>
          <div class="intro-story-detail">
            <span class="intro-story-detail-label">Level:</span>
            <span>${quiz.level}</span>
          </div>
          <div class="intro-story-detail">
            <span class="intro-story-detail-label">Questions:</span>
            <span>${quiz.questions.length}</span>
          </div>
          <div class="intro-story-detail">
            <span class="intro-story-detail-label">Points:</span>
            <span>${quiz.totalPoints}</span>
          </div>
          <div class="intro-story-detail">
            <span class="intro-story-detail-label">Time per Question:</span>
            <span>${quiz.timeLimit} seconds</span>
          </div>
        </div>
        
        <div class="intro-story-actions">
          <button class="btn btn-primary btn-lg" id="begin-quiz-btn">Begin Adventure</button>
          <button class="btn btn-outline btn-lg" id="return-dashboard-btn">Return to Dashboard</button>
        </div>
      </div>
    </div>
  `;
  
  quizContainer.querySelector(".container").innerHTML = introStoryHTML;
  
  // Add event listeners
  document.getElementById("begin-quiz-btn").addEventListener("click", function() {
    renderQuestion(quizState);
  });
  
  document.getElementById("return-dashboard-btn").addEventListener("click", function() {
    returnToDashboard();
  });
}

// Render a question
function renderQuestion(quizState) {
  const quiz = quizState.quiz;
  const questionIndex = quizState.currentQuestionIndex;
  const question = quiz.questions[questionIndex];
  
  // Clear any existing timer
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
  }
  
  // Reset time remaining for this question
  quizState.timeRemaining = quiz.timeLimit;
  
  const questionHTML = `
    <div class="quiz-content quiz-enter">
      <div class="quiz-header">
        <div class="quiz-header-top">
          <div>
            <h2 class="quiz-title">${quiz.title}</h2>
            <p class="quiz-description">Question ${questionIndex + 1} of ${quiz.questions.length}</p>
          </div>
          
          <div class="quiz-stats">
            <div class="quiz-stats-row">
              <div class="quiz-timer" id="quiz-timer">
                <i data-lucide="clock"></i>
                <span class="timer-text">${quizState.timeRemaining}</span>
              </div>
            </div>
            <div class="quiz-stats-row">
              <div class="quiz-score">
                <i data-lucide="star"></i>
                <span>${quizState.score} pts</span>
              </div>
              <div class="quiz-hints">
                <i data-lucide="help-circle"></i>
                <span>${2 - quizState.hintsUsed} hints</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar" style="width: ${((questionIndex + 1) / quiz.questions.length) * 100}%"></div>
        </div>
      </div>
      
      <div class="card quiz-card">
        <div class="card-content">
          <div class="story-card">
            <p class="story-content">${question.storyContext}</p>
          </div>
          
          ${question.image ? `
          <div class="question-image">
            <img src="${question.image}" alt="Question illustration" class="question-illustration">
          </div>
          ` : ''}
          
          <div class="question-text">${question.question}</div>
          
          <div class="radio-group" id="answer-options">
            ${question.options.map((option, index) => `
              <div class="radio-item">
                <input type="radio" id="option-${index}" name="answer" value="${option}">
                <label for="option-${index}">${option}</label>
              </div>
            `).join('')}
          </div>
          
          <div id="result-message" style="display: none;"></div>
          
          <div class="card-actions" style="display: flex; justify-content: space-between;">
            <button class="btn btn-outline" id="hint-btn" ${quizState.hintsUsed >= 2 ? 'disabled' : ''}>
              <i data-lucide="help-circle"></i>
              Use Hint
            </button>
            
            <button class="btn btn-primary" id="submit-answer-btn" disabled>
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  quizContainer.querySelector(".container").innerHTML = questionHTML;
  
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Add event listeners
  const answerOptions = document.querySelectorAll('input[name="answer"]');
  const submitButton = document.getElementById("submit-answer-btn");
  const hintButton = document.getElementById("hint-btn");
  
  answerOptions.forEach(option => {
    option.addEventListener("change", function() {
      submitButton.disabled = false;
    });
  });
  
  submitButton.addEventListener("click", function() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
      checkAnswer(quizState, selectedOption.value);
    }
  });
  
  hintButton.addEventListener("click", function() {
    if (quizState.hintsUsed < 2) {
      showHintConfirmModal(quizState);
    }
  });
  
  // Start the timer
  const timerElement = document.getElementById("quiz-timer");
  quizState.timerInterval = setInterval(function() {
    quizState.timeRemaining--;
    
    if (quizState.timeRemaining <= 0) {
      clearInterval(quizState.timerInterval);
      timeUp(quizState);
    } else {
      document.querySelector(".timer-text").textContent = quizState.timeRemaining;
      
      // Add warning class when time is running low
      if (quizState.timeRemaining <= 10) {
        timerElement.classList.add("time-low");
      }
    }
  }, 1000);
}

// Check the answer
function checkAnswer(quizState, selectedAnswer) {
  clearInterval(quizState.timerInterval);
  
  const quiz = quizState.quiz;
  const questionIndex = quizState.currentQuestionIndex;
  const question = quiz.questions[questionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;
  
  // Calculate points for this question
  let pointsEarned = 0;
  if (isCorrect) {
    // Base points
    pointsEarned = quiz.pointsPerQuestion;
    
    // Time bonus (up to 50% extra for answering quickly)
    const timePercentage = quizState.timeRemaining / quiz.timeLimit;
    const timeBonus = Math.round(quiz.pointsPerQuestion * 0.5 * timePercentage);
    pointsEarned += timeBonus;
    
    // Hint penalty (50% reduction if hint was used)
    if (quizState.hintsUsed > 0) {
      pointsEarned = Math.round(pointsEarned * 0.5);
    }
  }
  
  // Update quiz state
  quizState.score += pointsEarned;
  quizState.answers.push({
    questionIndex,
    selectedAnswer,
    isCorrect,
    pointsEarned
  });
  
  // Show result message
  const resultMessage = document.getElementById("result-message");
  resultMessage.className = `result-message ${isCorrect ? 'correct' : 'incorrect'}`;
  resultMessage.innerHTML = isCorrect 
    ? `<i data-lucide="check-circle"></i> Correct! You earned ${pointsEarned} points.`
    : `<i data-lucide="x-circle"></i> Incorrect. The correct answer is ${question.correctAnswer}.`;
  resultMessage.style.display = "flex";
  
  // Initialize Lucide icons for the result message
  lucide.createIcons();
  
  // Disable all inputs
  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.disabled = true;
  });
  
  // Change submit button to continue button
  const submitButton = document.getElementById("submit-answer-btn");
  submitButton.textContent = questionIndex < quiz.questions.length - 1 ? "Continue" : "See Results";
  submitButton.removeEventListener("click", null);
  submitButton.addEventListener("click", function() {
    if (questionIndex < quiz.questions.length - 1) {
      quizState.currentQuestionIndex++;
      renderQuestion(quizState);
    } else {
      showQuizResults(quizState);
    }
  });
  
  // Highlight correct and incorrect answers
  document.querySelectorAll('.radio-item').forEach(item => {
    const input = item.querySelector('input');
    if (input.value === question.correctAnswer) {
      item.style.borderColor = "var(--success-color)";
      item.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
    } else if (input.value === selectedAnswer && !isCorrect) {
      item.style.borderColor = "var(--error-color)";
      item.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
    }
  });
  
  // Disable hint button
  document.getElementById("hint-btn").disabled = true;
}

// Time up handler
function timeUp(quizState) {
  const quiz = quizState.quiz;
  const questionIndex = quizState.currentQuestionIndex;
  const question = quiz.questions[questionIndex];
  
  // Update quiz state
  quizState.answers.push({
    questionIndex,
    selectedAnswer: null,
    isCorrect: false,
    pointsEarned: 0
  });
  
  // Show result message
  const resultMessage = document.getElementById("result-message");
  resultMessage.className = "result-message incorrect";
  resultMessage.innerHTML = `<i data-lucide="clock"></i> Time's up! The correct answer is ${question.correctAnswer}.`;
  resultMessage.style.display = "flex";
  
  // Initialize Lucide icons for the result message
  lucide.createIcons();
  
  // Disable all inputs
  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.disabled = true;
  });
  
  // Change submit button to continue button
  const submitButton = document.getElementById("submit-answer-btn");
  submitButton.disabled = false;
  submitButton.textContent = questionIndex < quiz.questions.length - 1 ? "Continue" : "See Results";
  submitButton.removeEventListener("click", null);
  submitButton.addEventListener("click", function() {
    if (questionIndex < quiz.questions.length - 1) {
      quizState.currentQuestionIndex++;
      renderQuestion(quizState);
    } else {
      showQuizResults(quizState);
    }
  });
  
  // Highlight correct answer
  document.querySelectorAll('.radio-item').forEach(item => {
    const input = item.querySelector('input');
    if (input.value === question.correctAnswer) {
      item.style.borderColor = "var(--success-color)";
      item.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
    }
  });
  
  // Disable hint button
  document.getElementById("hint-btn").disabled = true;
}

// Show hint confirm modal
function showHintConfirmModal(quizState) {
  const modal = document.getElementById("hint-confirm-modal");
  const hintsRemaining = document.getElementById("hints-remaining");
  
  hintsRemaining.textContent = 2 - quizState.hintsUsed;
  
  modal.classList.add("active");
  
  // Add event listeners
  document.getElementById("cancel-hint-button").addEventListener("click", function() {
    modal.classList.remove("active");
  });
  
  document.getElementById("cancel-hint-action").addEventListener("click", function() {
    modal.classList.remove("active");
  });
  
  document.getElementById("confirm-hint-button").addEventListener("click", function() {
    modal.classList.remove("active");
    showHint(quizState);
  });
}

// Show hint
function showHint(quizState) {
  const quiz = quizState.quiz;
  const questionIndex = quizState.currentQuestionIndex;
  const question = quiz.questions[questionIndex];
  
  // Update quiz state
  quizState.hintsUsed++;
  
  // Update hints display
  document.querySelector(".quiz-hints span").textContent = `${2 - quizState.hintsUsed} hints`;
  
  // Disable hint button if all hints used
  if (quizState.hintsUsed >= 2) {
    document.getElementById("hint-btn").disabled = true;
  }
  
  // Show hint modal
  const hintModal = document.getElementById("hint-modal");
  const hintText = document.getElementById("hint-text");
  
  hintText.textContent = question.hint;
  hintModal.classList.add("active");
  
  // Add event listener to close button
  document.getElementById("close-hint").addEventListener("click", function() {
    hintModal.classList.remove("active");
  });
}

// Show quiz results
function showQuizResults(quizState) {
  const quiz = quizState.quiz;
  
  // Calculate percentage score
  const totalPossiblePoints = quiz.totalPoints;
  const scorePercentage = Math.round((quizState.score / totalPossiblePoints) * 100);
  
  // Determine if perfect score
  const isPerfectScore = quizState.answers.every(answer => answer.isCorrect);
  
  // Update user data
  updateUserStats(quizState, isPerfectScore);
  
  const resultsHTML = `
    <div class="quiz-content quiz-enter">
      <div class="card quiz-card">
        <div class="card-header">
          <h2 class="card-title">Quiz Results</h2>
        </div>
        <div class="card-content">
          <div class="quiz-results">
            <div class="score-percentage">${scorePercentage}%</div>
            
            <div class="score-message">
              ${isPerfectScore 
                ? `<i data-lucide="trophy" style="color: var(--accent-color);"></i> Perfect Score! Congratulations!` 
                : scorePercentage >= 70 
                  ? `<i data-lucide="check-circle" style="color: var(--success-color);"></i> Well done!` 
                  : `<i data-lucide="info" style="color: var(--primary-color);"></i> Keep practicing!`}
            </div>
            
            <div class="rewards-section">
              <h3>Rewards Earned</h3>
              
              <div class="reward-item">
                <span class="reward-label">Points Earned:</span>
                <span class="reward-value">${quizState.score}</span>
              </div>
              
              <div class="reward-item">
                <span class="reward-label">Correct Answers:</span>
                <span class="reward-value">${quizState.answers.filter(a => a.isCorrect).length} of ${quiz.questions.length}</span>
              </div>
              
              ${isPerfectScore ? `
              <div class="reward-item">
                <span class="reward-label">Perfect Score Bonus:</span>
                <span class="reward-value">+10 points</span>
              </div>
              ` : ''}
              
              <div class="reward-item">
                <span class="reward-label">Quizzes Completed:</span>
                <span class="reward-value">${userData.quizzesCompleted}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer" style="text-align: center;">
          <button class="btn btn-primary" id="return-to-dashboard-btn">Return to Dashboard</button>
        </div>
      </div>
    </div>
  `;
  
  quizContainer.querySelector(".container").innerHTML = resultsHTML;
  
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Add event listener
  document.getElementById("return-to-dashboard-btn").addEventListener("click", function() {
    returnToDashboard();
  });
  
  // Show streak animation if streak is at least 3
  if (userData.currentStreak >= 3) {
    showStreakAnimation(userData.currentStreak);
  }
}

// Update user stats
function updateUserStats(quizState, isPerfectScore) {
  // Add points
  userData.points += quizState.score;
  
  // Add perfect score bonus
  if (isPerfectScore) {
    userData.points += 10;
    userData.perfectScores += 1;
  }
  
  // Update quizzes completed
  userData.quizzesCompleted += 1;
  
  // Update streak
  const today = new Date().toDateString();
  const lastQuizDate = userData.lastQuizDate ? new Date(userData.lastQuizDate).toDateString() : null;
  
  if (lastQuizDate !== today) {
    if (lastQuizDate === new Date(Date.now() - 86400000).toDateString()) {
      // Last quiz was yesterday, increment streak
      userData.currentStreak += 1;
    } else {
      // Last quiz was not yesterday, reset streak
      userData.currentStreak = 1;
    }
    
    // Update last quiz date
    userData.lastQuizDate = new Date().toISOString();
    
    // Update longest streak
    if (userData.currentStreak > userData.longestStreak) {
      userData.longestStreak = userData.currentStreak;
    }
  }
  
  // Calculate level
  userData.level = Math.floor(userData.points / POINTS_PER_LEVEL) + 1;
  
  // Save user data
  saveUserData();
  
  // Update UI
  updateUserStatsDisplay();
}

// Show streak animation
function showStreakAnimation(streak) {
  const streakAnimation = document.getElementById("streak-animation");
  const streakCount = document.getElementById("streak-count");
  
  streakCount.textContent = `${streak} Day Streak!`;
  streakAnimation.style.display = "flex";
  
  // Hide after 3 seconds
  setTimeout(function() {
    streakAnimation.style.display = "none";
  }, 3000);
}

// Return to dashboard
function returnToDashboard() {
  // Hide quiz container, show dashboard
  quizContainer.style.display = "none";
  dashboardContainer.style.display = "block";
  
  // Clear quiz container
  quizContainer.querySelector(".container").innerHTML = "";
  
  // Update leaderboard
  renderLeaderboard("points");
}

// Render leaderboard
function renderLeaderboard(type = "points") {
  // Sort leaderboard data based on type
  const sortedData = [...leaderboardData].sort((a, b) => {
    if (type === "points") return b.points - a.points;
    if (type === "level") return b.level - a.level;
    if (type === "perfect") return b.perfectScores - a.perfectScores;
    return 0;
  });
  
  // Clear leaderboard content
  leaderboardContent.innerHTML = "";
  
  // Add leaderboard items
  sortedData.forEach((user, index) => {
    const leaderboardItem = document.createElement("div");
    leaderboardItem.className = `leaderboard-item ${user.isCurrentUser ? 'current-user' : ''} ${getRankClass(index)}`;
    
    let rankDisplay = "";
    if (index === 0) {
      rankDisplay = `<i data-lucide="trophy" class="rank-icon gold"></i>`;
    } else if (index === 1) {
      rankDisplay = `<i data-lucide="trophy" class="rank-icon silver"></i>`;
    } else if (index === 2) {
      rankDisplay = `<i data-lucide="trophy" class="rank-icon bronze"></i>`;
    } else {
      rankDisplay = `<span class="rank-number">${index + 1}</span>`;
    }
    
    let scoreDisplay = "";
    if (type === "points") {
      scoreDisplay = `${user.points} pts`;
    } else if (type === "level") {
      scoreDisplay = `Level ${user.level}`;
    } else if (type === "perfect") {
      scoreDisplay = `${user.perfectScores} <i data-lucide="target" class="perfect-icon"></i>`;
    }
    
    leaderboardItem.innerHTML = `
      <div class="leaderboard-rank">
        ${rankDisplay}
      </div>
      <div class="leaderboard-user">
        <div class="user-name">
          ${user.name}
          ${user.isCurrentUser ? '<span class="user-you">(You)</span>' : ''}
        </div>
      </div>
      <div class="leaderboard-score">
        ${scoreDisplay}
      </div>
    `;
    
    leaderboardContent.appendChild(leaderboardItem);
  });
  
  // Initialize Lucide icons
  lucide.createIcons();
}

// Get rank class
function getRankClass(index) {
  if (index === 0) return "rank-first";
  if (index === 1) return "rank-second";
  if (index === 2) return "rank-third";
  return "";
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  tabItems.forEach(tab => {
    tab.addEventListener("click", function() {
      const tabId = this.getAttribute("data-tab");
      
      // Remove active class from all tabs and contents
      tabItems.forEach(t => t.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add("active");
      document.getElementById(`${tabId}-tab`).classList.add("active");
      
      // If leaderboard tab, render leaderboard
      if (tabId === "leaderboard") {
        renderLeaderboard("points");
      }
    });
  });
  
  // Leaderboard tab switching
  leaderboardTabs.forEach(tab => {
    tab.addEventListener("click", function() {
      const leaderboardType = this.getAttribute("data-leaderboard-type");
      
      // Remove active class from all tabs
      leaderboardTabs.forEach(t => t.classList.remove("active"));
      
      // Add active class to clicked tab
      this.classList.add("active");
      
      // Render leaderboard with selected type
      renderLeaderboard(leaderboardType);
    });
  });
  
  // Search input
  searchInput.addEventListener("input", filterQuizzes);
  
  // Mobile menu toggle
  mobileMenuToggle.addEventListener("click", function() {
    mobileMenu.classList.toggle("active");
  });
  
  // Custom dropdowns
  customDropdowns.forEach(dropdown => {
    const selected = dropdown.querySelector(".custom-dropdown-selected");
    const options = dropdown.querySelector(".custom-dropdown-options");
    const arrow = dropdown.querySelector(".dropdown-arrow");
    
    selected.addEventListener("click", function() {
      options.style.display = options.style.display === "none" ? "block" : "none";
      arrow.classList.toggle("open");
      dropdown.classList.toggle("open");
    });
    
    const optionItems = dropdown.querySelectorAll(".custom-dropdown-option");
    optionItems.forEach(option => {
      option.addEventListener("click", function() {
        const value = this.getAttribute("data-value");
        const text = this.textContent;
        
        // Update selected text
        selected.querySelector("span").textContent = text;
        
        // Update selected option
        optionItems.forEach(o => o.classList.remove("selected"));
        this.classList.add("selected");
        
        // Close dropdown
        options.style.display = "none";
        arrow.classList.remove("open");
        dropdown.classList.remove("open");
        
        // Add animation class
        selected.classList.add("filter-animate");
        setTimeout(() => {
          selected.classList.remove("filter-animate");
        }, 500);
        
        // Filter quizzes
        filterQuizzes();
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(event) {
      if (!dropdown.contains(event.target)) {
        options.style.display = "none";
        arrow.classList.remove("open");
        dropdown.classList.remove("open");
      }
    });
  });
}