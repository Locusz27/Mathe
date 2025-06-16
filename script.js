// Global variables
let lucide
let AuthManager

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Script.js loaded")

  // Initialize Lucide icons
  if (typeof window.lucide !== "undefined") {
    window.lucide.createIcons()
  } else {
    console.warn("Lucide icons not found. Make sure Lucide is properly imported.")
  }

  // Set current year in footer
  document.querySelectorAll("#current-year").forEach((el) => {
    el.textContent = new Date().getFullYear()
  })

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
    })
  }

  // Wait for AuthManager to be available and initialized
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  if (currentPage !== "login.html") {
    let attempts = 0
    while ((!window.authManager || !window.authManager.initialized) && attempts < 100) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      attempts++
    }

    if (window.authManager && window.authManager.initialized) {
      console.log("AuthManager is ready")
      // Force UI update to ensure proper state
      window.authManager.updateUI()
    } else {
      console.warn("AuthManager not available or not initialized")
    }

    // Check if user needs to be authenticated for this page
    const protectedPages = ["learning-materials.html", "worksheets.html", "quiz.html", "dashboard.html"]

    if (protectedPages.includes(currentPage)) {
      if (!window.authManager || !window.authManager.isLoggedIn()) {
        console.log("Protected page, redirecting to login")
        window.location.href = "login.html"
        return
      }
    }
  }

  // Initialize page-specific functionality
  if (currentPage === "learning-materials.html") {
    initLearningMaterialsPage()
  } else if (currentPage === "worksheets.html") {
    initWorksheetsPage()
  } else if (currentPage === "quiz.html") {
    initQuizPage()
  } else if (currentPage === "dashboard.html") {
    initDashboardPage()
  }

  // Tabs functionality
  const tabTriggers = document.querySelectorAll(".tab-trigger")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")
      const tabContents = document.querySelectorAll(".tab-content")
      const tabTriggers = document.querySelectorAll(".tab-trigger")

      // Remove active class from all triggers and contents
      tabTriggers.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked trigger and corresponding content
      this.classList.add("active")
      const activeContent = document.getElementById(`${tabName}-tab`)
      if (activeContent) {
        activeContent.classList.add("active")
      }

      // Handle role switching in dashboard
      if (this.hasAttribute("data-role")) {
        const role = this.getAttribute("data-role")
        const studentDashboard = document.getElementById("student-dashboard")
        const teacherDashboard = document.getElementById("teacher-dashboard")
        const roleDescription = document.getElementById("role-description")
        const activityMessage = document.getElementById("activity-message")

        if (role === "student") {
          studentDashboard?.classList.remove("hidden")
          teacherDashboard?.classList.add("hidden")
          if (roleDescription) {
            roleDescription.textContent = "Access your learning materials and track your progress."
          }
          if (activityMessage) {
            activityMessage.textContent = "You haven't completed any activities yet. Start learning!"
          }
        } else if (role === "teacher") {
          studentDashboard?.classList.add("hidden")
          teacherDashboard?.classList.remove("hidden")
          if (roleDescription) {
            roleDescription.textContent = "Manage your educational content and monitor student progress."
          }
          if (activityMessage) {
            activityMessage.textContent = "No recent activities to display. Start creating content!"
          }
        }
      }
    })
  })

  // Check URL for tab parameter
  const urlParams = new URLSearchParams(window.location.search)
  const tabParam = urlParams.get("tab")

  if (tabParam) {
    const tabTrigger = document.querySelector(`.tab-trigger[data-tab="${tabParam}"]`)
    if (tabTrigger) {
      tabTrigger.click()
    }
  }

  // Password toggle functionality
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target")
      const targetInput = document.getElementById(targetId)
      const icon = this.querySelector("i")

      if (targetInput.type === "password") {
        targetInput.type = "text"
        icon.setAttribute("data-lucide", "eye-off")
      } else {
        targetInput.type = "password"
        icon.setAttribute("data-lucide", "eye")
      }

      // Reinitialize Lucide icons
      if (typeof window.lucide !== "undefined") {
        window.lucide.createIcons()
      }
    })
  })
})

// Dashboard Page Initialization
function initDashboardPage() {
  console.log("Initializing dashboard page")

  // Show teacher role switcher if user is a teacher
  if (
    window.authManager &&
    (window.authManager.isTeacher() ||
      (window.authManager.getCurrentUser() && window.authManager.getCurrentUser().role === "teacher"))
  ) {
    const teacherRoleSwitcher = document.getElementById("teacher-role-switcher")
    if (teacherRoleSwitcher) {
      teacherRoleSwitcher.style.display = "block"
    }
  }

  // Add after the teacher role check
  console.log("User role check:", window.authManager ? window.authManager.getCurrentUser() : "No auth manager")

  // Load and display quiz progress
  loadQuizProgress()
}

// Add this new function after initDashboardPage
async function loadQuizProgress() {
  const quizProgress = await getQuizProgress()

  // Update quiz statistics
  await updateDashboardStats()

  // Update recent quiz activity
  updateRecentQuizActivity(quizProgress.history || [])
}

function updateRecentQuizActivity(quizHistory) {
  const activityContainer = document.getElementById("recent-quiz-activity")
  if (!activityContainer) return

  if (!quizHistory || quizHistory.length === 0) {
    activityContainer.innerHTML = '<p class="text-muted">No recent quiz activity</p>'
    return
  }

  // Get the 5 most recent quizzes
  const recentQuizzes = quizHistory.slice(0, 5)

  activityContainer.innerHTML = recentQuizzes
    .map((quiz) => {
      const date = new Date(quiz.completed_at).toLocaleDateString()
      const percentage = Math.round((quiz.correct_answers / quiz.total_questions) * 100)

      return `
      <div class="quiz-activity-item">
        <div>
          <div class="quiz-activity-title">${quiz.quiz_title || `Quiz ${quiz.quiz_id}`}</div>
          <div class="quiz-activity-score">${quiz.correct_answers}/${quiz.total_questions} correct (${percentage}%) - ${quiz.score} points</div>
        </div>
        <div class="quiz-activity-date">${date}</div>
      </div>
    `
    })
    .join("")
}

// Learning Materials Page Initialization
function initLearningMaterialsPage() {
  console.log("Initializing learning materials page")

  const searchInput = document.getElementById("search-materials")
  const subjectFilter = document.getElementById("subject-filter")
  const levelFilter = document.getElementById("level-filter")

  if (searchInput) {
    searchInput.addEventListener("input", filterMaterials)
  }

  if (subjectFilter) {
    subjectFilter.addEventListener("change", filterMaterials)
  }

  if (levelFilter) {
    levelFilter.addEventListener("change", filterMaterials)
  }

  function filterMaterials() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""
    const subjectValue = subjectFilter ? subjectFilter.value.toLowerCase() : "all"
    const levelValue = levelFilter ? levelFilter.value.toLowerCase() : "all"

    console.log(`Filtering materials: search=${searchTerm}, subject=${subjectValue}, level=${levelValue}`)

    const materialCards = document.querySelectorAll(".material-card")
    const noResults = document.getElementById("no-results")
    let visibleCount = 0

    materialCards.forEach((card) => {
      const cardSubject = card.getAttribute("data-subject")
      const cardLevel = card.getAttribute("data-level")
      const cardTitle = card.getAttribute("data-title")
      const cardDescription = card.getAttribute("data-description")

      // Check search term
      const matchesSearch =
        !searchTerm ||
        cardTitle.toLowerCase().includes(searchTerm) ||
        cardDescription.toLowerCase().includes(searchTerm) ||
        cardSubject.toLowerCase().includes(searchTerm)

      // Check subject filter
      const matchesSubject = subjectValue === "all" || cardSubject === subjectValue

      // Check level filter
      const matchesLevel = levelValue === "all" || cardLevel === levelValue

      if (matchesSearch && matchesSubject && matchesLevel) {
        card.style.display = "block"
        visibleCount++
      } else {
        card.style.display = "none"
      }
    })

    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.classList.remove("hidden")
    } else {
      noResults.classList.add("hidden")
    }

    console.log(`Filtered materials: ${visibleCount} visible`)
  }
}

// Worksheets Page Initialization
function initWorksheetsPage() {
  console.log("Initializing worksheets page")

  const searchInput = document.getElementById("search-worksheets")
  const subjectFilter = document.getElementById("subject-filter")
  const levelFilter = document.getElementById("level-filter")

  if (searchInput) {
    searchInput.addEventListener("input", filterWorksheets)
  }

  if (subjectFilter) {
    subjectFilter.addEventListener("change", filterWorksheets)
  }

  if (levelFilter) {
    levelFilter.addEventListener("change", filterWorksheets)
  }

  function filterWorksheets() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""
    const subjectValue = subjectFilter ? subjectFilter.value.toLowerCase() : "all"
    const levelValue = levelFilter ? levelFilter.value.toLowerCase() : "all"

    console.log(`Filtering worksheets: search=${searchTerm}, subject=${subjectValue}, level=${levelValue}`)

    const worksheetCards = document.querySelectorAll(".worksheet-card")
    const noResults = document.getElementById("no-results")
    let visibleCount = 0

    worksheetCards.forEach((card) => {
      const cardSubject = card.getAttribute("data-subject")
      const cardLevel = card.getAttribute("data-level")
      const cardTitle = card.getAttribute("data-title")
      const cardDescription = card.getAttribute("data-description")

      // Check search term
      const matchesSearch =
        !searchTerm ||
        cardTitle.toLowerCase().includes(searchTerm) ||
        cardDescription.toLowerCase().includes(searchTerm) ||
        cardSubject.toLowerCase().includes(searchTerm)

      // Check subject filter
      const matchesSubject = subjectValue === "all" || cardSubject === subjectValue

      // Check level filter
      const matchesLevel = levelValue === "all" || cardLevel === levelValue

      if (matchesSearch && matchesSubject && matchesLevel) {
        card.style.display = "block"
        visibleCount++
      } else {
        card.style.display = "none"
      }
    })

    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.classList.remove("hidden")
    } else {
      noResults.classList.add("hidden")
    }

    console.log(`Filtered worksheets: ${visibleCount} visible`)
  }
}

// Quiz Page Initialization
function initQuizPage() {
  console.log("Initializing quiz page")
  // Quiz functionality is handled by quiz.js
}

// Utility function to show access denied message
function showAccessDenied(message = "You need to be logged in to access this page.") {
  const main = document.querySelector("main")
  if (main) {
    main.innerHTML = `
      <div class="container">
        <div class="access-denied">
          <i data-lucide="lock" class="access-denied-icon"></i>
          <h1 class="access-denied-title">Access Denied</h1>
          <p class="access-denied-description">${message}</p>
          <a href="login.html" class="btn btn-primary">Login to Continue</a>
        </div>
      </div>
    `

    if (typeof window.lucide !== "undefined") {
      window.lucide.createIcons()
    }
  }
}

// Quiz Progress Tracking Functions - Database Integration
async function saveQuizProgress(
  quizId,
  score,
  totalQuestions,
  correctAnswers,
  isPerfectScore,
  timeTaken = 0,
  hintsUsed = 0,
) {
  if (!window.authManager || !window.authManager.isLoggedIn()) {
    console.log("User not logged in, quiz progress not saved")
    return
  }

  try {
    const response = await fetch("api/quizzes.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "submit_attempt",
        quiz_id: quizId,
        score: score,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        time_taken: timeTaken,
        hints_used: hintsUsed,
      }),
      credentials: "include",
    })

    const result = await response.json()

    if (result.success) {
      console.log("Quiz progress saved to database")
      // Update dashboard if on dashboard page
      await updateDashboardStats()
    } else {
      console.error("Failed to save quiz progress:", result.message)
    }
  } catch (error) {
    console.error("Error saving quiz progress:", error)
  }
}

async function getQuizProgress() {
  if (!window.authManager || !window.authManager.isLoggedIn()) {
    return {
      totalQuizzes: 0,
      totalScore: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      perfectScores: 0,
      averageScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastQuizDate: null,
      history: [],
    }
  }

  try {
    const response = await fetch("api/quizzes.php?action=user_progress")
    const result = await response.json()

    if (result.success) {
      return result.data
    } else {
      console.error("Failed to fetch quiz progress:", result.message)
      return {}
    }
  } catch (error) {
    console.error("Error fetching quiz progress:", error)
    return {}
  }
}

async function updateDashboardStats() {
  const quizProgress = await getQuizProgress()

  // Update dashboard elements if they exist
  const totalQuizzesEl = document.getElementById("total-quizzes")
  const averageScoreEl = document.getElementById("average-score")
  const perfectScoresEl = document.getElementById("perfect-scores-count")
  const quizStreakEl = document.getElementById("quiz-streak")

  if (totalQuizzesEl) totalQuizzesEl.textContent = quizProgress.totalQuizzes || 0
  if (averageScoreEl) averageScoreEl.textContent = `${quizProgress.averageScore || 0}%`
  if (perfectScoresEl) perfectScoresEl.textContent = quizProgress.perfectScores || 0
  if (quizStreakEl) quizStreakEl.textContent = `${quizProgress.currentStreak || 0} days`
}

// Make functions available globally for quiz.js
window.saveQuizProgress = saveQuizProgress
window.getQuizProgress = getQuizProgress
window.updateDashboardStats = updateDashboardStats
