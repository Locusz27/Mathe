// Quiz data - REVERTED back to include static quizzes
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
      },
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
      },
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
        question:
          "If the dragon flies at 45 mph and the castle is 135 miles away, how many hours will it take the dragon to reach the castle?",
        options: ["2 hours", "3 hours", "4 hours", "5 hours"],
        correctAnswer: "3 hours",
        hint: "Use the formula: time = distance ÷ speed.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        storyContext:
          "The royal armory needs to distribute shields to the knights. Each knight needs exactly 2 shields.",
        question:
          "If there are 85 knights and the armory has 200 shields, how many shields will be left after distribution?",
        options: ["15 shields", "20 shields", "25 shields", "30 shields"],
        correctAnswer: "30 shields",
        hint: "Calculate 85 × 2 = 170, then subtract from 200.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        storyContext: "The royal treasurer needs to calculate the cost of the feast to celebrate the dragon's defeat.",
        question: "If each guest consumes food worth $25 and there are 120 guests, what is the total cost of food?",
        options: ["$2,500", "$3,000", "$3,500", "$4,000"],
        correctAnswer: "$3,000",
        hint: "Multiply the cost per guest by the number of guests.",
        image: "/placeholder.svg?height=200&width=300",
      },
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
        question:
          "From a point 100 meters from the base of a mountain, the angle of elevation to the peak is 30°. How tall is the mountain?",
        options: ["50 meters", "57.7 meters", "100 meters", "173.2 meters"],
        correctAnswer: "57.7 meters",
        hint: "Use the tangent function: tan(30°) = height/100.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        storyContext: "Halfway up the mountain, you encounter a trigonometric puzzle carved into the rock face.",
        question: "What is the value of sin(45°)?",
        options: ["0.5", "0.707", "0.866", "1"],
        correctAnswer: "0.707",
        hint: "sin(45°) = 1/√2 ≈ 0.707.",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        storyContext: "Near the summit, a final challenge awaits. A mysterious triangle is drawn in the snow.",
        question:
          "In a right triangle, if one angle is 60° and the hypotenuse is 10 units, what is the length of the side opposite to the 60° angle?",
        options: ["5 units", "8.66 units", "7.5 units", "10 units"],
        correctAnswer: "8.66 units",
        hint: "Use the sine function: sin(60°) = opposite/hypotenuse.",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
    pointsPerQuestion: 20,
    timeLimit: 60,
    totalPoints: 60,
  },
]

// Remove the fake leaderboard data and replace with empty array
const leaderboardData = []

// Badge definitions
const badges = [
  {
    id: "first_quiz",
    name: "First Steps",
    description: "Completed your first quiz",
    icon: "award",
    requirement: (stats) => stats.quizzesCompleted >= 1,
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Achieved a perfect score on any quiz",
    icon: "target",
    requirement: (stats) => stats.perfectScores >= 1,
  },
  {
    id: "streak_3",
    name: "On Fire",
    description: "Maintained a 3-day streak",
    icon: "flame",
    requirement: (stats) => stats.currentStreak >= 3,
  },
  {
    id: "level_5",
    name: "Rising Star",
    description: "Reached level 5",
    icon: "star",
    requirement: (stats) => stats.level >= 5,
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Completed 10 quizzes",
    icon: "trophy",
    requirement: (stats) => stats.quizzesCompleted >= 10,
  },
]

// User data (stored in localStorage)
let userData = {
  points: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastQuizDate: null,
  quizzesCompleted: 0,
  perfectScores: 0,
  earnedBadges: [],
}

// Constants
const POINTS_PER_LEVEL = 100

// DOM Elements
const dashboardContainer = document.getElementById("dashboard-container")
const quizContainer = document.getElementById("quiz-container")
const quizzesGrid = document.getElementById("quizzes-grid")
const searchInput = document.getElementById("search-quizzes")
const tabItems = document.querySelectorAll(".tab-item")
const tabContents = document.querySelectorAll(".tab-content")
const leaderboardContent = document.getElementById("leaderboard-content")
const leaderboardTabs = document.querySelectorAll(".leaderboard-tab")
const mobileMenuToggle = document.querySelector(".menu-toggle")
const mobileMenu = document.querySelector(".mobile-menu")
const customDropdowns = document.querySelectorAll(".custom-dropdown-container")

// Lucide icons library
const lucide = {
  createIcons: () => {
    // Placeholder for Lucide icon creation logic
    console.log("Lucide icons created")
  },
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  lucide.createIcons()

  // Load user data from localStorage
  loadUserData()

  // Update UI with user data
  updateUserStatsDisplay()

  // Load quizzes from database instead of static data
  loadQuizzesFromDatabase()

  // Set up event listeners
  setupEventListeners()

  // Update current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()
})

// Load quizzes from database - FIXED to handle ID conflicts
async function loadQuizzesFromDatabase() {
  try {
    console.log("Loading quizzes from database...")
    const response = await fetch("api/quizzes.php")
    const result = await response.json()

    console.log("Quiz API response:", result)

    let allQuizzes = [...quizzes] // Start with static quizzes

    if (result.success && result.data) {
      // Convert database format to expected format and add prefix to avoid ID conflicts
      const databaseQuizzes = result.data.map((quiz) => ({
        id: `db_${quiz.id}`, // Add prefix to database quiz IDs
        originalId: quiz.id, // Keep original ID for database operations
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        level: quiz.level,
        backgroundTheme: quiz.background_theme || "default",
        questions: quiz.questions || [],
        pointsPerQuestion: quiz.points_per_question || 10,
        timeLimit: quiz.time_limit || 60,
        totalPoints: (quiz.questions || []).length * (quiz.points_per_question || 10),
        isDatabase: true, // Flag to identify database quizzes
      }))

      console.log("Processed database quizzes:", databaseQuizzes)

      // Add database quizzes to the list
      allQuizzes = [...allQuizzes, ...databaseQuizzes]
    } else {
      console.log("No database quizzes found or error:", result.message)
    }

    // Store the complete quiz list globally for use in startQuiz
    window.allQuizzes = allQuizzes

    // Render all quizzes
    renderQuizzes(allQuizzes)
  } catch (error) {
    console.error("Error loading quizzes from database:", error)
    // Fallback to static quizzes
    window.allQuizzes = quizzes
    renderQuizzes(quizzes)
  }
}

// Load user data from localStorage
function loadUserData() {
  const storedData = localStorage.getItem("mathQuizUserData")
  if (storedData) {
    userData = JSON.parse(storedData)
  }
}

// Save user data to localStorage
function saveUserData() {
  localStorage.setItem("mathQuizUserData", JSON.stringify(userData))
}

// Fetch user profile data
async function fetchUserProfile() {
  if (!window.authManager || !window.authManager.isLoggedIn()) {
    return null
  }

  try {
    const response = await fetch("api/user.php", {
      method: "GET",
      credentials: "include",
    })
    const result = await response.json()

    if (result.success) {
      return result.data
    } else {
      console.error("Failed to fetch user profile:", result.message)
      return null
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

// Update user stats display - UPDATED to fetch from database
async function updateUserStatsDisplay() {
  // Fetch real user profile data from database
  const profileData = await fetchUserProfileData()

  if (profileData) {
    // Update userData with database values
    userData = {
      points: profileData.total_points || 0,
      level: Math.floor((profileData.total_points || 0) / POINTS_PER_LEVEL) + 1,
      currentStreak: profileData.current_streak || 0,
      longestStreak: profileData.longest_streak || 0,
      lastQuizDate: profileData.last_quiz_date,
      quizzesCompleted: profileData.total_quizzes || 0,
      perfectScores: profileData.perfect_scores || 0,
      earnedBadges: profileData.badges || [],
      averageScore: profileData.average_score || 0,
    }
  }

  // Get username from user profile
  const userProfile = await fetchUserProfile()
  const username = userProfile ? userProfile.username : "MathExplorer"

  // Update dashboard header stats
  const userLevelEl = document.getElementById("user-level")
  const userPointsEl = document.getElementById("user-points")
  const userStreakEl = document.getElementById("user-streak")

  if (userLevelEl) userLevelEl.textContent = `Level ${userData.level}`
  if (userPointsEl) userPointsEl.textContent = `${userData.points} Points`
  if (userStreakEl) userStreakEl.textContent = `${userData.currentStreak} Day Streak`

  // Update profile tab stats
  const profileLevelEl = document.getElementById("profile-level")
  const levelNumberEl = document.getElementById("level-number")
  const totalPointsEl = document.getElementById("total-points")
  const profileUsernameEl = document.getElementById("profile-username")

  if (profileLevelEl) profileLevelEl.textContent = userData.level
  if (levelNumberEl) levelNumberEl.textContent = userData.level
  if (totalPointsEl) totalPointsEl.textContent = userData.points
  if (profileUsernameEl) profileUsernameEl.textContent = username

  const pointsToNextLevel = POINTS_PER_LEVEL - (userData.points % POINTS_PER_LEVEL)
  const pointsToNextLevelEl = document.getElementById("points-to-next-level")
  if (pointsToNextLevelEl) pointsToNextLevelEl.textContent = pointsToNextLevel

  const progressPercentage = ((userData.points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL) * 100
  const levelProgressEl = document.getElementById("level-progress")
  if (levelProgressEl) levelProgressEl.style.width = `${progressPercentage}%`

  const currentStreakEl = document.getElementById("current-streak")
  const longestStreakEl = document.getElementById("longest-streak")
  const lastQuizDateEl = document.getElementById("last-quiz-date")
  const quizzesCompletedEl = document.getElementById("quizzes-completed")
  const perfectScoresEl = document.getElementById("perfect-scores")
  const achievementTotalPointsEl = document.getElementById("achievement-total-points")

  if (currentStreakEl) currentStreakEl.textContent = userData.currentStreak
  if (longestStreakEl) longestStreakEl.textContent = `${userData.longestStreak} days`
  if (lastQuizDateEl) {
    lastQuizDateEl.textContent = userData.lastQuizDate ? new Date(userData.lastQuizDate).toLocaleDateString() : "Never"
  }
  if (quizzesCompletedEl) quizzesCompletedEl.textContent = userData.quizzesCompleted
  if (perfectScoresEl) perfectScoresEl.textContent = userData.perfectScores
  if (achievementTotalPointsEl) achievementTotalPointsEl.textContent = userData.points

  // Update badges
  updateBadgesDisplay()
}

// Fetch user profile data from database
async function fetchUserProfileData() {
  if (!window.authManager || !window.authManager.isLoggedIn()) {
    // Return localStorage data for guests
    return userData
  }

  try {
    const response = await fetch("api/quizzes.php?action=user_progress", {
      method: "GET",
      credentials: "include",
    })
    const result = await response.json()

    if (result.success && result.data) {
      return result.data
    } else {
      console.error("Failed to fetch user profile data:", result.message)
      return userData // Fallback to localStorage
    }
  } catch (error) {
    console.error("Error fetching user profile data:", error)
    return userData // Fallback to localStorage
  }
}

// Update badges display - UPDATED to use database badges
function updateBadgesDisplay() {
  const noBadgesContainer = document.getElementById("no-badges-container")
  const badgesGrid = document.getElementById("badges-grid")

  // Check for newly earned badges based on current stats
  checkForNewBadges()

  if (userData.earnedBadges.length === 0) {
    noBadgesContainer.style.display = "flex"
    badgesGrid.style.display = "none"
  } else {
    noBadgesContainer.style.display = "none"
    badgesGrid.style.display = "grid"

    // Clear existing badges
    badgesGrid.innerHTML = ""

    // Add earned badges
    userData.earnedBadges.forEach((badgeData) => {
      // Handle both old format (just ID) and new format (object with details)
      let badge, earnedDate
      if (typeof badgeData === "string") {
        badge = badges.find((b) => b.id === badgeData)
        earnedDate = null
      } else {
        badge = badges.find((b) => b.id === badgeData.badge_id) || badgeData
        earnedDate = badgeData.earned_at
      }

      if (badge) {
        const badgeElement = document.createElement("div")
        badgeElement.className = "badge-item"
        badgeElement.innerHTML = `
          <div class="badge-icon">
            <i data-lucide="${badge.icon || "award"}"></i>
          </div>
          <div class="badge-info">
            <div class="badge-name">${badge.name || badge.badge_name}</div>
            <div class="badge-description">${badge.description || badge.badge_description}</div>
            ${earnedDate ? `<div class="badge-date">Earned: ${new Date(earnedDate).toLocaleDateString()}</div>` : ""}
          </div>
        `
        badgesGrid.appendChild(badgeElement)
      }
    })

    // Initialize Lucide icons for new badges
    lucide.createIcons()
  }
}

// Check for new badges
function checkForNewBadges() {
  badges.forEach((badge) => {
    if (!userData.earnedBadges.includes(badge.id) && badge.requirement(userData)) {
      userData.earnedBadges.push(badge.id)
      saveUserData()
    }
  })
}

// Render quizzes
function renderQuizzes(quizzesToRender) {
  quizzesGrid.innerHTML = ""

  if (quizzesToRender.length === 0) {
    quizzesGrid.innerHTML = `
      <div class="no-results">
        <i data-lucide="search-x" style="width: 3rem; height: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
        <p>No quizzes found matching your search criteria.</p>
      </div>
    `
    lucide.createIcons()
    return
  }

  quizzesToRender.forEach((quiz) => {
    const quizCard = document.createElement("div")
    quizCard.className = "card"
    quizCard.innerHTML = `
      <div class="card-header">
        <div class="tags">
          <div class="tag">${quiz.subject}</div>
          <div class="tag">${quiz.level}</div>
          ${quiz.isDatabase ? '<div class="tag tag-custom">Custom</div>' : ""}
        </div>
        <h3 class="card-title">${quiz.title}</h3>
        <p class="card-description">${quiz.description}</p>
      </div>
      <div class="card-content">
        <div class="quiz-info">
          <span>${quiz.questions.length} Questions</span>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary btn-full start-quiz-btn" data-quiz-id="${quiz.id}">Start Quiz</button>
      </div>
    `
    quizzesGrid.appendChild(quizCard)

    // Add event listener to the start quiz button - pass the complete quiz list
    quizCard.querySelector(".start-quiz-btn").addEventListener("click", function () {
      const quizId = this.getAttribute("data-quiz-id")
      startQuiz(quizId, window.allQuizzes || quizzesToRender)
    })
  })
}

// Filter quizzes
function filterQuizzes() {
  const searchTerm = searchInput.value.toLowerCase()
  const subjectFilter = document.querySelector("#subject-filter-container .custom-dropdown-selected span").textContent
  const levelFilter = document.querySelector("#level-filter-container .custom-dropdown-selected span").textContent

  // Get current quiz list (need to store this globally)
  loadQuizzesFromDatabase().then(() => {
    // This will re-render with filters applied
  })
}

// Add a new function `resetQuizState` to properly clean up between quiz attempts:
function resetQuizState() {
  // Clear any existing quiz data to prevent stacking
  if (window.currentQuizState) {
    if (window.currentQuizState.timerInterval) {
      clearInterval(window.currentQuizState.timerInterval)
    }
    window.currentQuizState = null
  }
}

// Start a quiz - FIXED to handle prefixed IDs
function startQuiz(quizId, allQuizzes = null) {
  let quiz = null

  console.log("Looking for quiz with ID:", quizId)

  // First try to find in allQuizzes (which includes database quizzes)
  if (allQuizzes) {
    quiz = allQuizzes.find((q) => q.id === quizId)
  }

  // If not found in allQuizzes, try static quizzes as fallback
  if (!quiz) {
    quiz = quizzes.find((q) => q.id === quizId)
  }

  if (!quiz) {
    console.error("Quiz not found:", quizId)
    console.log("Available quizzes:", allQuizzes || quizzes)
    return
  }

  console.log("Starting quiz:", quiz)

  // Add a call to `resetQuizState()` at the beginning to ensure clean state.
  resetQuizState()

  // Hide dashboard, show quiz container
  dashboardContainer.style.display = "none"
  quizContainer.style.display = "block"
  quizContainer.classList.add("active")

  // Set background theme
  quizContainer.className = "quiz-container active"
  quizContainer.classList.add(`quiz-background`)
  quizContainer.classList.add(`${quiz.backgroundTheme}`)

  // Initialize quiz state as global to prevent stacking
  window.currentQuizState = {
    quiz: quiz,
    currentQuestionIndex: 0,
    score: 0,
    hintsUsed: 0,
    timeRemaining: quiz.timeLimit,
    timerInterval: null,
    answers: [],
  }

  // Render intro story
  renderIntroStory(window.currentQuizState)
}

// Rest of the functions remain the same...
// [All other functions from the original quiz.js file remain unchanged]

// Render intro story
function renderIntroStory(quizState) {
  const quiz = quizState.quiz

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
            <span class="intro-story-detail-label">Points per Question:</span>
            <span>${quiz.pointsPerQuestion}</span>
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
  `

  quizContainer.querySelector(".container").innerHTML = introStoryHTML

  // Add event listeners
  document.getElementById("begin-quiz-btn").addEventListener("click", () => {
    renderQuestion(quizState)
  })

  document.getElementById("return-dashboard-btn").addEventListener("click", () => {
    returnToDashboard()
  })
}

// Render a question
function renderQuestion(quizState) {
  const quiz = quizState.quiz
  const questionIndex = quizState.currentQuestionIndex
  const question = quiz.questions[questionIndex]

  // Clear any existing timer
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval)
  }

  // Reset time remaining for this question
  quizState.timeRemaining = quiz.timeLimit

  // Reset hints used for this question
  quizState.hintsUsedThisQuestion = false

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
            <p class="story-content">${question.storyContext || question.story_context || ""}</p>
          </div>
          
          ${
            question.image
              ? `
          <div class="question-image">
            <img src="${question.image}" alt="Question illustration" class="question-illustration">
          </div>
          `
              : ""
          }
          
          <div class="question-text">${question.question}</div>
          
          <div class="radio-group" id="answer-options">
            ${question.options
              .map(
                (option, index) => `
              <div class="radio-item">
                <input type="radio" id="option-${index}" name="answer" value="${option}">
                <label for="option-${index}">${option}</label>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div id="result-message" style="display: none;"></div>
          
          <div class="card-actions" style="display: flex; justify-content: space-between;">
            <button class="btn btn-outline" id="hint-btn" ${quizState.hintsUsed >= 2 ? "disabled" : ""}>
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
  `

  quizContainer.querySelector(".container").innerHTML = questionHTML

  // Initialize Lucide icons
  lucide.createIcons()

  // Add event listeners
  const answerOptions = document.querySelectorAll('input[name="answer"]')
  const submitButton = document.getElementById("submit-answer-btn")
  const hintButton = document.getElementById("hint-btn")

  answerOptions.forEach((option) => {
    option.addEventListener("change", () => {
      submitButton.disabled = false
    })
  })

  submitButton.addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="answer"]:checked')
    if (selectedOption) {
      checkAnswer(quizState, selectedOption.value)
    }
  })

  hintButton.addEventListener("click", () => {
    console.log("Hint button clicked, hints used:", quizState.hintsUsed)
    if (quizState.hintsUsed < 2) {
      showHintConfirmModal(quizState)
    }
  })

  // Start the timer
  const timerElement = document.getElementById("quiz-timer")
  quizState.timerInterval = setInterval(() => {
    quizState.timeRemaining--

    if (quizState.timeRemaining <= 0) {
      clearInterval(quizState.timerInterval)
      timeUp(quizState)
    } else {
      document.querySelector(".timer-text").textContent = quizState.timeRemaining

      // Add warning class when time is running low
      if (quizState.timeRemaining <= 10) {
        timerElement.classList.add("time-low")
      }
    }
  }, 1000)
}

// Check the answer - FIXED LOGIC
function checkAnswer(quizState, selectedAnswer) {
  clearInterval(quizState.timerInterval)

  const quiz = quizState.quiz
  const questionIndex = quizState.currentQuestionIndex
  const question = quiz.questions[questionIndex]
  const isCorrect = selectedAnswer === (question.correctAnswer || question.correct_answer)

  // Calculate points for this question - only award points if correct
  let pointsEarned = 0
  if (isCorrect) {
    pointsEarned = quiz.pointsPerQuestion
    // Add points to total score immediately
    quizState.score += pointsEarned
  }

  // Store the answer
  const existingAnswerIndex = quizState.answers.findIndex((answer) => answer.questionIndex === questionIndex)

  if (existingAnswerIndex === -1) {
    quizState.answers.push({
      questionIndex,
      selectedAnswer,
      isCorrect,
      pointsEarned,
      timeRemaining: quizState.timeRemaining,
      hintsUsed: quizState.hintsUsedThisQuestion || false,
    })
  } else {
    // If question already answered, update the existing answer
    const previousPoints = quizState.answers[existingAnswerIndex].pointsEarned
    quizState.score = quizState.score - previousPoints + pointsEarned

    quizState.answers[existingAnswerIndex] = {
      questionIndex,
      selectedAnswer,
      isCorrect,
      pointsEarned,
      timeRemaining: quizState.timeRemaining,
      hintsUsed: quizState.hintsUsedThisQuestion || false,
    }
  }

  // Reset hints used for this question
  quizState.hintsUsedThisQuestion = false

  // Show result message
  const resultMessage = document.getElementById("result-message")
  resultMessage.className = `result-message ${isCorrect ? "correct" : "incorrect"}`
  resultMessage.innerHTML = isCorrect
    ? `<i data-lucide="check-circle"></i> Correct! You earned ${pointsEarned} points.`
    : `<i data-lucide="x-circle"></i> Incorrect. The correct answer is ${question.correctAnswer || question.correct_answer}.`
  resultMessage.style.display = "flex"

  // Initialize Lucide icons for the result message
  lucide.createIcons()

  // Disable all inputs
  document.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.disabled = true
  })

  // Change submit button to continue button
  const submitButton = document.getElementById("submit-answer-btn")
  submitButton.textContent = questionIndex < quiz.questions.length - 1 ? "Continue" : "See Results"

  // Remove existing event listeners and add new one
  const newSubmitButton = submitButton.cloneNode(true)
  submitButton.parentNode.replaceChild(newSubmitButton, submitButton)

  newSubmitButton.addEventListener("click", () => {
    if (questionIndex < quiz.questions.length - 1) {
      quizState.currentQuestionIndex++
      renderQuestion(quizState)
    } else {
      showQuizResults(quizState)
    }
  })

  // Highlight correct and incorrect answers
  document.querySelectorAll(".radio-item").forEach((item) => {
    const input = item.querySelector("input")
    if (input.value === (question.correctAnswer || question.correct_answer)) {
      item.style.borderColor = "var(--success-color)"
      item.style.backgroundColor = "rgba(34, 197, 94, 0.1)"
    } else if (input.value === selectedAnswer && !isCorrect) {
      item.style.borderColor = "var(--error-color)"
      item.style.backgroundColor = "rgba(239, 68, 68, 0.1)"
    }
  })

  // Disable hint button
  document.getElementById("hint-btn").disabled = true
}

// Time up handler
function timeUp(quizState) {
  const quiz = quizState.quiz
  const questionIndex = quizState.currentQuestionIndex
  const question = quiz.questions[questionIndex]

  // Update quiz state
  quizState.answers.push({
    questionIndex,
    selectedAnswer: null,
    isCorrect: false,
    pointsEarned: 0,
  })

  // Show result message
  const resultMessage = document.getElementById("result-message")
  resultMessage.className = "result-message incorrect"
  resultMessage.innerHTML = `<i data-lucide="clock"></i> Time's up! The correct answer is ${question.correctAnswer || question.correct_answer}.`
  resultMessage.style.display = "flex"

  // Initialize Lucide icons for the result message
  lucide.createIcons()

  // Disable all inputs
  document.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.disabled = true
  })

  // Change submit button to continue button
  const submitButton = document.getElementById("submit-answer-btn")
  submitButton.disabled = false
  submitButton.textContent = questionIndex < quiz.questions.length - 1 ? "Continue" : "See Results"
  submitButton.removeEventListener("click", null)
  submitButton.addEventListener("click", () => {
    if (questionIndex < quiz.questions.length - 1) {
      quizState.currentQuestionIndex++
      renderQuestion(quizState)
    } else {
      showQuizResults(quizState)
    }
  })

  // Highlight correct answer
  document.querySelectorAll(".radio-item").forEach((item) => {
    const input = item.querySelector("input")
    if (input.value === (question.correctAnswer || question.correct_answer)) {
      item.style.borderColor = "var(--success-color)"
      item.style.backgroundColor = "rgba(34, 197, 94, 0.1)"
    }
  })

  // Disable hint button
  document.getElementById("hint-btn").disabled = true
}

// Show hint confirm modal - FIXED
function showHintConfirmModal(quizState) {
  console.log("Showing hint confirm modal")

  const modal = document.getElementById("hint-confirm-modal")
  if (!modal) {
    console.error("Hint confirm modal not found in DOM")
    return
  }

  const hintsRemaining = document.getElementById("hints-remaining")
  if (hintsRemaining) {
    hintsRemaining.textContent = 2 - quizState.hintsUsed
  }

  // Show the modal
  modal.style.display = "flex"
  modal.classList.add("active")

  console.log("Modal should now be visible")

  // Get modal buttons
  const cancelButton = document.getElementById("cancel-hint-button")
  const cancelAction = document.getElementById("cancel-hint-action")
  const confirmButton = document.getElementById("confirm-hint-button")

  // Function to close modal
  const closeModal = () => {
    modal.style.display = "none"
    modal.classList.remove("active")
  }

  // Function to confirm hint usage
  const confirmHint = () => {
    closeModal()
    showHint(quizState)
  }

  // Remove existing event listeners and add new ones
  if (cancelButton) {
    const newCancelButton = cancelButton.cloneNode(true)
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton)
    newCancelButton.addEventListener("click", closeModal)
  }

  if (cancelAction) {
    const newCancelAction = cancelAction.cloneNode(true)
    cancelAction.parentNode.replaceChild(newCancelAction, cancelAction)
    newCancelAction.addEventListener("click", closeModal)
  }

  if (confirmButton) {
    const newConfirmButton = confirmButton.cloneNode(true)
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton)
    newConfirmButton.addEventListener("click", confirmHint)
  }

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })
}

// Show hint - FIXED
function showHint(quizState) {
  console.log("Showing hint")

  const quiz = quizState.quiz
  const questionIndex = quizState.currentQuestionIndex
  const question = quiz.questions[questionIndex]

  // Update quiz state
  quizState.hintsUsed++
  quizState.hintsUsedThisQuestion = true

  console.log("Hints used:", quizState.hintsUsed)

  // Update hints display
  const hintsDisplay = document.querySelector(".quiz-hints span")
  if (hintsDisplay) {
    hintsDisplay.textContent = `${2 - quizState.hintsUsed} hints`
  }

  // Disable hint button if all hints used
  const hintButton = document.getElementById("hint-btn")
  if (quizState.hintsUsed >= 2 && hintButton) {
    hintButton.disabled = true
  }

  // Show hint modal
  const hintModal = document.getElementById("hint-modal")
  const hintText = document.getElementById("hint-text")

  if (!hintModal || !hintText) {
    console.error("Hint modal or hint text element not found")
    return
  }

  // Get hint from question object - handle both static and database quiz formats
  const hint = question.hint || "No hint available for this question."
  console.log("Hint text:", hint)

  hintText.textContent = hint
  hintModal.style.display = "flex"
  hintModal.classList.add("active")

  // Function to close hint modal
  const closeHintModal = () => {
    hintModal.style.display = "none"
    hintModal.classList.remove("active")
  }

  // Add event listener to close button
  const closeHintBtn = document.getElementById("close-hint")
  if (closeHintBtn) {
    // Remove existing listeners and add new one
    const newCloseBtn = closeHintBtn.cloneNode(true)
    closeHintBtn.parentNode.replaceChild(newCloseBtn, closeHintBtn)
    newCloseBtn.addEventListener("click", closeHintModal)
  }

  // Close modal when clicking outside
  hintModal.addEventListener("click", (e) => {
    if (e.target === hintModal) {
      closeHintModal()
    }
  })
}

// Show quiz results - FIXED PERCENTAGE CALCULATION
function showQuizResults(quizState) {
  const quiz = quizState.quiz

  // Calculate statistics - FIXED
  // Ensure it only counts unique questions
  const uniqueQuestionIndices = new Set(quizState.answers.map((answer) => answer.questionIndex))
  const correctAnswers = quizState.answers.filter((answer) => answer.isCorrect).length
  const totalQuestions = quiz.questions.length
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

  // Determine if perfect score
  const isPerfectScore = correctAnswers === totalQuestions

  // Update user data
  updateUserStats(quizState, isPerfectScore, scorePercentage, correctAnswers, totalQuestions)

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
              ${
                isPerfectScore
                  ? `<i data-lucide="trophy" style="color: var(--accent-color);"></i> Perfect Score! Congratulations!`
                  : scorePercentage >= 70
                    ? `<i data-lucide="check-circle" style="color: var(--success-color);"></i> Well done!`
                    : `<i data-lucide="info" style="color: var(--primary-color);"></i> Keep practicing!`
              }
            </div>
            
            <div class="rewards-section">
              <h3>Quiz Summary</h3>
              
              <div class="reward-item">
                <span class="reward-label">Points Earned:</span>
                <span class="reward-value">${quizState.score}</span>
              </div>
              
              <div class="reward-item">
                <span class="reward-label">Correct Answers:</span>
                <span class="reward-value">${correctAnswers} of ${totalQuestions}</span>
              </div>
              
              <div class="reward-item">
                <span class="reward-label">Accuracy:</span>
                <span class="reward-value">${scorePercentage}%</span>
              </div>
              
              <div class="reward-item">
                <span class="reward-label">Hints Used:</span>
                <span class="reward-value">${quizState.hintsUsed} of 2</span>
              </div>
              
              ${
                isPerfectScore
                  ? `
              <div class="reward-item">
                <span class="reward-label">Perfect Score Bonus:</span>
                <span class="reward-value">+10 points</span>
              </div>
              `
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="card-footer" style="text-align: center;">
          <button class="btn btn-primary" id="return-to-dashboard-btn">Return to Dashboard</button>
        </div>
      </div>
    </div>
  `

  quizContainer.querySelector(".container").innerHTML = resultsHTML

  // Initialize Lucide icons
  lucide.createIcons()

  // Add event listener
  document.getElementById("return-to-dashboard-btn").addEventListener("click", () => {
    returnToDashboard()
  })

  // Show streak animation if streak is at least 3
  if (userData.currentStreak >= 3) {
    showStreakAnimation(userData.currentStreak)
  }
}

// Update user stats - UPDATED to save to database with correct ID
function updateUserStats(quizState, isPerfectScore, scorePercentage, correctAnswers, totalQuestions) {
  // Add points
  userData.points += quizState.score

  // Add perfect score bonus
  if (isPerfectScore) {
    userData.points += 10
    userData.perfectScores += 1
  }

  // Update quizzes completed
  if (!window.quizCompleted) {
    userData.quizzesCompleted += 1
    window.quizCompleted = true
  }

  // Update streak
  const today = new Date().toDateString()
  const lastQuizDate = userData.lastQuizDate ? new Date(userData.lastQuizDate).toDateString() : null

  if (lastQuizDate !== today) {
    if (lastQuizDate === new Date(Date.now() - 86400000).toDateString()) {
      userData.currentStreak += 1
    } else {
      userData.currentStreak = 1
    }

    userData.lastQuizDate = new Date().toISOString()

    if (userData.currentStreak > userData.longestStreak) {
      userData.longestStreak = userData.currentStreak
    }
  }

  // Calculate level
  userData.level = Math.floor(userData.points / POINTS_PER_LEVEL) + 1

  // Save user data to localStorage (for guests)
  saveUserData()

  // Save quiz progress to database if logged in
  if (window.authManager && window.authManager.isLoggedIn()) {
    // Use original ID for database operations
    const quizIdForDatabase = quizState.quiz.originalId || quizState.quiz.id
    saveQuizProgressToDatabase(
      quizState,
      correctAnswers,
      totalQuestions,
      scorePercentage,
      isPerfectScore,
      quizIdForDatabase,
    )
  }

  // Update UI
  updateUserStatsDisplay()

  // Reset quiz state properly after completion
  resetQuizState()
  window.quizCompleted = false
}

// Save quiz progress to database - UPDATED to use correct quiz ID
async function saveQuizProgressToDatabase(
  quizState,
  correctAnswers,
  totalQuestions,
  scorePercentage,
  isPerfectScore,
  quizIdForDatabase,
) {
  try {
    const response = await fetch("api/quizzes.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "submit_attempt",
        quiz_id: quizIdForDatabase, // Use the correct ID for database operations
        score: quizState.score + (isPerfectScore ? 10 : 0), // Include perfect score bonus
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        percentage_score: scorePercentage,
        time_taken: 0, // Could be calculated if needed
        hints_used: quizState.hintsUsed,
      }),
    })

    const result = await response.json()

    if (result.success) {
      console.log("Quiz progress saved to database successfully")
    } else {
      console.error("Failed to save quiz progress:", result.message)
    }
  } catch (error) {
    console.error("Error saving quiz progress:", error)
  }
}

// Show streak animation
function showStreakAnimation(streak) {
  const streakAnimation = document.getElementById("streak-animation")
  const streakCount = document.getElementById("streak-count")

  streakCount.textContent = `${streak} Day Streak!`
  streakAnimation.style.display = "flex"

  // Hide after 3 seconds
  setTimeout(() => {
    streakAnimation.style.display = "none"
  }, 3000)
}

// Return to dashboard
function returnToDashboard() {
  // Hide quiz container, show dashboard
  quizContainer.style.display = "none"
  dashboardContainer.style.display = "block"

  // Clear quiz container
  quizContainer.querySelector(".container").innerHTML = ""

  // Update leaderboard with fresh data
  setTimeout(() => {
    renderLeaderboard("points")
  }, 500)
}

// Update renderLeaderboard function to fetch real data
function renderLeaderboard(type = "points") {
  // Clear leaderboard content
  leaderboardContent.innerHTML = ""

  // Fetch real leaderboard data
  fetchLeaderboardData(type).then((data) => {
    if (data.length === 0) {
      leaderboardContent.innerHTML = `
        <div class="no-results">
          <i data-lucide="trophy" style="width: 3rem; height: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
          <p>No quiz data available yet.</p>
          <p>Complete some quizzes to see the leaderboard!</p>
        </div>
      `
      lucide.createIcons()
      return
    }

    // Add leaderboard items
    data.forEach((user, index) => {
      const leaderboardItem = document.createElement("div")
      leaderboardItem.className = `leaderboard-item ${user.isCurrentUser ? "current-user" : ""} ${getRankClass(index)}`

      let rankDisplay = ""
      if (index === 0) {
        rankDisplay = `<i data-lucide="trophy" class="rank-icon gold"></i>`
      } else if (index === 1) {
        rankDisplay = `<i data-lucide="trophy" class="rank-icon silver"></i>`
      } else if (index === 2) {
        rankDisplay = `<i data-lucide="trophy" class="rank-icon bronze"></i>`
      } else {
        rankDisplay = `<span class="rank-number">${index + 1}</span>`
      }

      let scoreDisplay = ""
      if (type === "points") {
        scoreDisplay = `${user.total_points || 0} pts`
      } else if (type === "level") {
        scoreDisplay = `${user.average_score || 0}% avg`
      } else if (type === "perfect") {
        scoreDisplay = `${user.perfect_scores || 0} <i data-lucide="target" class="perfect-icon"></i>`
      }

      leaderboardItem.innerHTML = `
        <div class="leaderboard-rank">
          ${rankDisplay}
        </div>
        <div class="leaderboard-user">
          <div class="user-name">
            ${user.username}
            ${user.isCurrentUser ? '<span class="user-you">(You)</span>' : ""}
          </div>
        </div>
        <div class="leaderboard-score">
          ${scoreDisplay}
        </div>
      `

      leaderboardContent.appendChild(leaderboardItem)
    })

    // Initialize Lucide icons
    lucide.createIcons()
  })
}

// Add function to fetch leaderboard data
async function fetchLeaderboardData(type) {
  try {
    const response = await fetch(`api/quizzes.php?action=leaderboard&type=${type}`)
    const result = await response.json()

    if (result.success) {
      return result.data || []
    } else {
      console.error("Failed to fetch leaderboard:", result.message)
      return []
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return []
  }
}

// Get rank class
function getRankClass(index) {
  if (index === 0) return "rank-first"
  if (index === 1) return "rank-second"
  if (index === 2) return "rank-third"
  return ""
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  tabItems.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Remove active class from all tabs and contents
      tabItems.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab and corresponding content
      this.classList.add("active")
      document.getElementById(`${tabId}-tab`).classList.add("active")

      // If leaderboard tab, render leaderboard
      if (tabId === "leaderboard") {
        renderLeaderboard("points")
      }
    })
  })

  // Leaderboard tab switching
  leaderboardTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const leaderboardType = this.getAttribute("data-leaderboard-type")

      // Remove active class from all tabs
      leaderboardTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Render leaderboard with selected type
      renderLeaderboard(leaderboardType)
    })
  })

  // Search input
  searchInput.addEventListener("input", filterQuizzes)

  // Mobile menu toggle
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active")
  })

  // Custom dropdowns
  customDropdowns.forEach((dropdown) => {
    const selected = dropdown.querySelector(".custom-dropdown-selected")
    const options = dropdown.querySelector(".custom-dropdown-options")
    const arrow = dropdown.querySelector(".dropdown-arrow")

    selected.addEventListener("click", () => {
      options.style.display = options.style.display === "none" ? "block" : "none"
      arrow.classList.toggle("open")
      dropdown.classList.toggle("open")
    })

    const optionItems = dropdown.querySelectorAll(".custom-dropdown-option")
    optionItems.forEach((option) => {
      option.addEventListener("click", function () {
        const value = this.getAttribute("data-value")
        const text = this.textContent

        // Update selected text
        selected.querySelector("span").textContent = text

        // Update selected option
        optionItems.forEach((o) => o.classList.remove("selected"))
        this.classList.add("selected")

        // Close dropdown
        options.style.display = "none"
        arrow.classList.remove("open")
        dropdown.classList.remove("open")

        // Add animation class
        selected.classList.add("filter-animate")
        setTimeout(() => {
          selected.classList.remove("filter-animate")
        }, 500)

        // Filter quizzes
        filterQuizzes()
      })
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        options.style.display = "none"
        arrow.classList.remove("open")
        dropdown.classList.remove("open")
      }
    })
  })
}
