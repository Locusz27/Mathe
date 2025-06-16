// Content Management functionality
class ContentManager {
  constructor() {
    this.currentTab = "learning-materials"
    this.materials = []
    this.worksheets = []
    this.quizzes = []
  }

  async init() {
    console.log("Initializing Content Manager")

    // Set up tab switching
    this.setupTabs()

    // Set up filters
    this.setupFilters()

    // Load initial content
    await this.loadAllContent()
  }

  setupTabs() {
    const tabItems = document.querySelectorAll(".tab-item")

    tabItems.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-tab")
        this.switchTab(tabName)
      })
    })
  }

  switchTab(tabName) {
    // Update active tab
    document.querySelectorAll(".tab-item").forEach((tab) => {
      tab.classList.remove("active")
    })
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")

    // Update active content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active")
    })
    document.getElementById(`${tabName}-tab`).classList.add("active")

    this.currentTab = tabName
    this.renderCurrentTab()
  }

  setupFilters() {
    // Materials filters
    const materialsSearch = document.getElementById("materials-search")
    const materialsSubject = document.getElementById("materials-subject")
    const materialsLevel = document.getElementById("materials-level")

    if (materialsSearch) {
      materialsSearch.addEventListener("input", () => this.filterMaterials())
    }
    if (materialsSubject) {
      materialsSubject.addEventListener("change", () => this.filterMaterials())
    }
    if (materialsLevel) {
      materialsLevel.addEventListener("change", () => this.filterMaterials())
    }

    // Worksheets filters
    const worksheetsSearch = document.getElementById("worksheets-search")
    const worksheetsSubject = document.getElementById("worksheets-subject")
    const worksheetsLevel = document.getElementById("worksheets-level")

    if (worksheetsSearch) {
      worksheetsSearch.addEventListener("input", () => this.filterWorksheets())
    }
    if (worksheetsSubject) {
      worksheetsSubject.addEventListener("change", () => this.filterWorksheets())
    }
    if (worksheetsLevel) {
      worksheetsLevel.addEventListener("change", () => this.filterWorksheets())
    }

    // Quizzes filters
    const quizzesSearch = document.getElementById("quizzes-search")
    const quizzesSubject = document.getElementById("quizzes-subject")
    const quizzesStatus = document.getElementById("quizzes-status")

    if (quizzesSearch) {
      quizzesSearch.addEventListener("input", () => this.filterQuizzes())
    }
    if (quizzesSubject) {
      quizzesSubject.addEventListener("change", () => this.filterQuizzes())
    }
    if (quizzesStatus) {
      quizzesStatus.addEventListener("change", () => this.filterQuizzes())
    }
  }

  async loadAllContent() {
    await Promise.all([this.loadMaterials(), this.loadWorksheets(), this.loadQuizzes()])

    this.renderCurrentTab()
  }

  async loadMaterials() {
    try {
      const response = await fetch("api/materials.php?action=get_teacher_materials")
      const data = await response.json()

      if (data.success) {
        this.materials = data.data || []
      } else {
        console.error("Failed to load materials:", data.message)
        this.materials = []
      }
    } catch (error) {
      console.error("Error loading materials:", error)
      this.materials = []
    }
  }

  async loadWorksheets() {
    try {
      const response = await fetch("api/worksheets.php?action=get_teacher_worksheets")
      const data = await response.json()

      if (data.success) {
        this.worksheets = data.data || []
      } else {
        console.error("Failed to load worksheets:", data.message)
        this.worksheets = []
      }
    } catch (error) {
      console.error("Error loading worksheets:", error)
      this.worksheets = []
    }
  }

  async loadQuizzes() {
    try {
      const response = await fetch("api/quiz-creator.php?action=get_teacher_quizzes")
      const data = await response.json()

      if (data.success) {
        this.quizzes = data.data || []
      } else {
        console.error("Failed to load quizzes:", data.message)
        this.quizzes = []
      }
    } catch (error) {
      console.error("Error loading quizzes:", error)
      this.quizzes = []
    }
  }

  renderCurrentTab() {
    switch (this.currentTab) {
      case "learning-materials":
        this.renderMaterials()
        break
      case "worksheets":
        this.renderWorksheets()
        break
      case "quizzes":
        this.renderQuizzes()
        break
    }
  }

  renderMaterials() {
    const grid = document.getElementById("materials-grid")
    if (!grid) return

    if (this.materials.length === 0) {
      grid.innerHTML = this.getEmptyState("learning materials", "upload-material.html", "Upload Material")
      return
    }

    grid.innerHTML = this.materials
      .map(
        (material) => `
      <div class="content-item" data-id="${material.id}">
        <i data-lucide="book-open" class="content-icon"></i>
        <div class="content-info">
          <div class="content-title">${material.title}</div>
          <div class="content-meta">${material.subject} • ${material.level} • ${this.formatDate(material.created_at)}</div>
          <div class="content-description">${material.description}</div>
        </div>
        <div class="content-actions">
          <button class="action-btn view" onclick="contentManager.viewMaterial(${material.id})" title="View">
            <i data-lucide="eye"></i>
          </button>
          <button class="action-btn edit" onclick="contentManager.editMaterial(${material.id})" title="Edit">
            <i data-lucide="edit"></i>
          </button>
          <button class="action-btn delete" onclick="contentManager.deleteMaterial(${material.id})" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  renderWorksheets() {
    const grid = document.getElementById("worksheets-grid")
    if (!grid) return

    if (this.worksheets.length === 0) {
      grid.innerHTML = this.getEmptyState("worksheets", "upload-material.html?tab=worksheets", "Upload Worksheet")
      return
    }

    grid.innerHTML = this.worksheets
      .map(
        (worksheet) => `
      <div class="content-item" data-id="${worksheet.id}">
        <i data-lucide="file-text" class="content-icon"></i>
        <div class="content-info">
          <div class="content-title">${worksheet.title}</div>
          <div class="content-meta">${worksheet.subject} • ${worksheet.level} • ${this.formatDate(worksheet.created_at)}</div>
          <div class="content-description">${worksheet.description}</div>
        </div>
        <div class="content-actions">
          <button class="action-btn view" onclick="contentManager.viewWorksheet(${worksheet.id})" title="View">
            <i data-lucide="eye"></i>
          </button>
          <button class="action-btn edit" onclick="contentManager.editWorksheet(${worksheet.id})" title="Edit">
            <i data-lucide="edit"></i>
          </button>
          <button class="action-btn delete" onclick="contentManager.deleteWorksheet(${worksheet.id})" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  renderQuizzes() {
    const grid = document.getElementById("quizzes-grid")
    if (!grid) return

    if (this.quizzes.length === 0) {
      grid.innerHTML = this.getEmptyState("quizzes", "create-quiz.html", "Create Quiz")
      return
    }

    grid.innerHTML = this.quizzes
      .map(
        (quiz) => `
      <div class="content-item" data-id="${quiz.id}">
        <i data-lucide="brain" class="content-icon"></i>
        <div class="content-info">
          <div class="content-title">${quiz.title}</div>
          <div class="content-meta">${quiz.subject} • ${quiz.level} • ${quiz.status} • ${this.formatDate(quiz.created_at)}</div>
          <div class="content-description">${quiz.description}</div>
        </div>
        <div class="content-actions">
          <button class="action-btn view" onclick="contentManager.previewQuiz(${quiz.id})" title="Preview">
            <i data-lucide="eye"></i>
          </button>
          <button class="action-btn edit" onclick="contentManager.editQuiz(${quiz.id})" title="Edit">
            <i data-lucide="edit"></i>
          </button>
          <button class="action-btn delete" onclick="contentManager.deleteQuiz(${quiz.id})" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  getEmptyState(type, createUrl, createText) {
    return `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i data-lucide="folder-open" class="empty-state-icon" width="48" height="48"></i>
        <h3 class="empty-state-title">No ${type} found</h3>
        <p class="empty-state-description">You haven't created any ${type} yet. Get started by creating your first one!</p>
        <a href="${createUrl}" class="btn btn-primary">
          <i data-lucide="plus"></i>
          ${createText}
        </a>
      </div>
    `
  }

  formatDate(dateString) {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Filter methods
  filterMaterials() {
    const search = document.getElementById("materials-search")?.value.toLowerCase() || ""
    const subject = document.getElementById("materials-subject")?.value || ""
    const level = document.getElementById("materials-level")?.value || ""

    const filtered = this.materials.filter((material) => {
      const matchesSearch =
        material.title.toLowerCase().includes(search) || material.description.toLowerCase().includes(search)
      const matchesSubject = !subject || material.subject === subject
      const matchesLevel = !level || material.level === level

      return matchesSearch && matchesSubject && matchesLevel
    })

    this.renderFilteredMaterials(filtered)
  }

  filterWorksheets() {
    const search = document.getElementById("worksheets-search")?.value.toLowerCase() || ""
    const subject = document.getElementById("worksheets-subject")?.value || ""
    const level = document.getElementById("worksheets-level")?.value || ""

    const filtered = this.worksheets.filter((worksheet) => {
      const matchesSearch =
        worksheet.title.toLowerCase().includes(search) || worksheet.description.toLowerCase().includes(search)
      const matchesSubject = !subject || worksheet.subject === subject
      const matchesLevel = !level || worksheet.level === level

      return matchesSearch && matchesSubject && matchesLevel
    })

    this.renderFilteredWorksheets(filtered)
  }

  filterQuizzes() {
    const search = document.getElementById("quizzes-search")?.value.toLowerCase() || ""
    const subject = document.getElementById("quizzes-subject")?.value || ""
    const status = document.getElementById("quizzes-status")?.value || ""

    const filtered = this.quizzes.filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(search) || quiz.description.toLowerCase().includes(search)
      const matchesSubject = !subject || quiz.subject === subject
      const matchesStatus = !status || quiz.status === status

      return matchesSearch && matchesSubject && matchesStatus
    })

    this.renderFilteredQuizzes(filtered)
  }

  renderFilteredMaterials(materials) {
    const grid = document.getElementById("materials-grid")
    if (!grid) return

    if (materials.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column: 1 / -1;"><p>No materials match your filters.</p></div>'
      return
    }

    grid.innerHTML = materials
      .map(
        (material) => `
      <div class="content-item" data-id="${material.id}">
        <i data-lucide="book-open" class="content-icon"></i>
        <div class="content-info">
          <div class="content-title">${material.title}</div>
          <div class="content-meta">${material.subject} • ${material.level} • ${this.formatDate(material.created_at)}</div>
          <div class="content-description">${material.description}</div>
        </div>
        <div class="content-actions">
          <button class="action-btn view" onclick="contentManager.viewMaterial(${material.id})" title="View">
            <i data-lucide="eye"></i>
          </button>
          <button class="action-btn edit" onclick="contentManager.editMaterial(${material.id})" title="Edit">
            <i data-lucide="edit"></i>
          </button>
          <button class="action-btn delete" onclick="contentManager.deleteMaterial(${material.id})" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")

    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  renderFilteredWorksheets(worksheets) {
    const grid = document.getElementById("worksheets-grid")
    if (!grid) return

    if (worksheets.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column: 1 / -1;"><p>No worksheets match your filters.</p></div>'
      return
    }

    grid.innerHTML = worksheets
      .map(
        (worksheet) => `
      <div class="content-item" data-id="${worksheet.id}">
        <i data-lucide="file-text" class="content-icon"></i>
        <div class="content-info">
          <div class="content-title">${worksheet.title}</div>
          <div class="content-meta">${worksheet.subject} • ${worksheet.level} • ${this.formatDate(worksheet.created_at)}</div>
          <div class="content-description">${worksheet.description}</div>
        </div>
        <div class="content-actions">
          <button class="action-btn view" onclick="contentManager.viewWorksheet(${worksheet.id})" title="View">
            <i data-lucide="eye"></i>
          </button>
          <button class="action-btn edit" onclick="contentManager.editWorksheet(${worksheet.id})" title="Edit">
            <i data-lucide="edit"></i>
          </button>
          <button class="action-btn delete" onclick="contentManager.deleteWorksheet(${worksheet.id})" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")

    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  renderFilteredQuizzes(quizzes) {
    const grid = document.getElementById("quizzes-grid")
    if (!grid) return

    if (quizzes.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column: 1 / -1;"><p>No quizzes match your filters.</p></div>'
      return
    }

    grid.innerHTML = quizzes
      .map(
        (quiz) => `
      <div class="content-item" data-id="${quiz.id}">
        <i data-lucide="brain" class="content-icon"></i>
        <div class="content-info">
          <div class="content-title">${quiz.title}</div>
          <div class="content-meta">${quiz.subject} • ${quiz.level} • ${quiz.status} • ${this.formatDate(quiz.created_at)}</div>
          <div class="content-description">${quiz.description}</div>
        </div>
        <div class="content-actions">
          <button class="action-btn view" onclick="contentManager.previewQuiz(${quiz.id})" title="Preview">
            <i data-lucide="eye"></i>
          </button>
          <button class="action-btn edit" onclick="contentManager.editQuiz(${quiz.id})" title="Edit">
            <i data-lucide="edit"></i>
          </button>
          <button class="action-btn delete" onclick="contentManager.deleteQuiz(${quiz.id})" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `,
      )
      .join("")

    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  // Action methods
  viewMaterial(id) {
    const material = this.materials.find((m) => m.id === id)
    if (material && material.file_path) {
      window.open(material.file_path, "_blank")
    }
  }

  viewWorksheet(id) {
    const worksheet = this.worksheets.find((w) => w.id === id)
    if (worksheet && worksheet.file_path) {
      window.open(worksheet.file_path, "_blank")
    }
  }

  previewQuiz(id) {
    window.open(`quiz.html?preview=${id}`, "_blank")
  }

  editMaterial(id) {
    window.location.href = `upload-material.html?edit=${id}`
  }

  editWorksheet(id) {
    window.location.href = `upload-material.html?tab=worksheets&edit=${id}`
  }

  editQuiz(id) {
    window.location.href = `create-quiz.html?edit=${id}`
  }

  async deleteMaterial(id) {
    if (!confirm("Are you sure you want to delete this learning material?")) {
      return
    }

    try {
      const response = await fetch("api/materials.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_material",
          id: id,
        }),
      })

      const data = await response.json()
      if (data.success) {
        this.materials = this.materials.filter((m) => m.id !== id)
        this.renderMaterials()
        alert("Learning material deleted successfully")
      } else {
        alert("Failed to delete learning material: " + data.message)
      }
    } catch (error) {
      console.error("Error deleting material:", error)
      alert("An error occurred while deleting the material")
    }
  }

  async deleteWorksheet(id) {
    if (!confirm("Are you sure you want to delete this worksheet?")) {
      return
    }

    try {
      const response = await fetch("api/worksheets.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_worksheet",
          id: id,
        }),
      })

      const data = await response.json()
      if (data.success) {
        this.worksheets = this.worksheets.filter((w) => w.id !== id)
        this.renderWorksheets()
        alert("Worksheet deleted successfully")
      } else {
        alert("Failed to delete worksheet: " + data.message)
      }
    } catch (error) {
      console.error("Error deleting worksheet:", error)
      alert("An error occurred while deleting the worksheet")
    }
  }

  async deleteQuiz(id) {
    if (!confirm("Are you sure you want to delete this quiz?")) {
      return
    }

    try {
      const response = await fetch("api/quiz-creator.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_quiz",
          id: id,
        }),
      })

      const data = await response.json()
      if (data.success) {
        this.quizzes = this.quizzes.filter((q) => q.id !== id)
        this.renderQuizzes()
        alert("Quiz deleted successfully")
      } else {
        alert("Failed to delete quiz: " + data.message)
      }
    } catch (error) {
      console.error("Error deleting quiz:", error)
      alert("An error occurred while deleting the quiz")
    }
  }
}

// Initialize content manager when page loads
let contentManager

document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is logged in and is a teacher
  if (!window.authManager || !window.authManager.isTeacher()) {
    return
  }

  contentManager = new ContentManager()
  await contentManager.init()
})
