document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const worksheetsGrid = document.getElementById("worksheets-grid")
  const searchInput = document.getElementById("search-worksheets")
  const subjectFilter = document.getElementById("subject-filter")
  const levelFilter = document.getElementById("level-filter")
  const noResults = document.getElementById("no-results")
  const createWorksheetBtn = document.getElementById("create-worksheet-btn")
  const worksheetModal = document.getElementById("worksheet-modal")
  const closeWorksheetModal = document.getElementById("close-worksheet-modal")
  const worksheetForm = document.getElementById("worksheet-form")
  const teacherActions = document.getElementById("teacher-actions")
  const worksheetActionsMenu = document.getElementById("worksheet-actions-menu")
  const editWorksheetBtn = document.getElementById("edit-worksheet")
  const deleteWorksheetBtn = document.getElementById("delete-worksheet")
  const loading = document.getElementById("loading")

  let allWorksheets = []

  // Check if user is a teacher (for demo purposes)
  const isTeacher = localStorage.getItem("userRole") === "teacher"
  if (isTeacher && teacherActions) {
    teacherActions.classList.remove("hidden")
  }

  // Current worksheet being edited
  let currentWorksheetId = null

  // Load worksheets from database
  async function loadWorksheets() {
    try {
      console.log("Loading worksheets from database...")
      if (loading) loading.classList.remove("hidden")
      worksheetsGrid.innerHTML = ""

      const response = await fetch("api/worksheets.php")
      const result = await response.json()

      if (result.success) {
        allWorksheets = result.data || []
        console.log("Loaded worksheets:", allWorksheets)
        renderWorksheets(allWorksheets)
      } else {
        console.error("Failed to load worksheets:", result.message)
        showError("Failed to load worksheets. Please try again later.")
      }
    } catch (error) {
      console.error("Error loading worksheets:", error)
      showError("Error loading worksheets. Please check your connection.")
    } finally {
      if (loading) loading.classList.add("hidden")
    }
  }

  // Show error message
  function showError(message) {
    worksheetsGrid.innerHTML = `
      <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--destructive);">
        <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
        <h3>Error Loading Worksheets</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn btn-outline" style="margin-top: 1rem;">
          <i data-lucide="refresh-cw"></i> Try Again
        </button>
      </div>
    `

    if (typeof window.lucide !== "undefined") {
      window.lucide.createIcons()
    }
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    if (!text) return ""
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  // Render worksheets
  function renderWorksheets(worksheetsToRender) {
    worksheetsGrid.innerHTML = ""

    if (worksheetsToRender.length === 0) {
      if (noResults) noResults.classList.remove("hidden")
      return
    }

    if (noResults) noResults.classList.add("hidden")

    worksheetsToRender.forEach((worksheet) => {
      const worksheetCard = document.createElement("div")
      worksheetCard.className = "card"
      worksheetCard.dataset.id = worksheet.id

      // Format date
      const createdDate = worksheet.created_at ? new Date(worksheet.created_at).toLocaleDateString() : "Unknown date"

      worksheetCard.innerHTML = `
        <div class="card-header">
          <div class="card-header-content">
            <div class="card-icon-title">
              <i data-lucide="file-text" class="card-icon-small text-primary"></i>
              <h3 class="card-title">${escapeHtml(worksheet.title)}</h3>
            </div>
            ${
              isTeacher
                ? `
              <button class="btn btn-icon btn-ghost worksheet-menu-btn" data-id="${worksheet.id}">
                <i data-lucide="more-vertical"></i>
              </button>
            `
                : ""
            }
          </div>
          <p class="card-description">${escapeHtml(worksheet.description || "No description available")}</p>
          <div class="material-date">Uploaded: ${createdDate}</div>
        </div>
        <div class="card-content">
          <div class="tags">
            <span class="tag tag-primary">${escapeHtml(worksheet.subject)}</span>
            <span class="tag tag-secondary">${escapeHtml(worksheet.level)}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="material-actions">
            <a href="${escapeHtml(worksheet.file_path)}" class="btn btn-primary" target="_blank">
              <i data-lucide="eye" class="btn-icon"></i> View PDF
            </a>
            <a href="${escapeHtml(worksheet.file_path)}" class="btn btn-outline" download="${escapeHtml(worksheet.title)}.pdf">
              <i data-lucide="download" class="btn-icon"></i> Download
            </a>
          </div>
        </div>
      `

      worksheetsGrid.appendChild(worksheetCard)
    })

    // Initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }

    // Add event listeners to menu buttons
    const menuButtons = document.querySelectorAll(".worksheet-menu-btn")
    menuButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation()
        const worksheetId = Number.parseInt(this.dataset.id)
        currentWorksheetId = worksheetId

        // Position the menu
        const rect = this.getBoundingClientRect()
        if (worksheetActionsMenu) {
          worksheetActionsMenu.style.top = `${rect.bottom + window.scrollY}px`
          worksheetActionsMenu.style.left = `${rect.left - 100 + window.scrollX}px`
          worksheetActionsMenu.classList.add("active")
        }

        // Close menu when clicking outside
        document.addEventListener("click", closeMenu)
      })
    })
  }

  // Close the worksheet actions menu
  function closeMenu() {
    worksheetActionsMenu.classList.remove("active")
    document.removeEventListener("click", closeMenu)
  }

  // Filter worksheets
  function filterWorksheets() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""
    const subjectValue = subjectFilter ? subjectFilter.value : "all"
    const levelValue = levelFilter ? levelFilter.value : "all"

    const filteredWorksheets = allWorksheets.filter((worksheet) => {
      // Search term filter
      const matchesSearch =
        !searchTerm ||
        worksheet.title.toLowerCase().includes(searchTerm) ||
        (worksheet.description && worksheet.description.toLowerCase().includes(searchTerm)) ||
        worksheet.subject.toLowerCase().includes(searchTerm)

      // Subject filter
      const matchesSubject = subjectValue === "all" || worksheet.subject.toLowerCase() === subjectValue.toLowerCase()

      // Level filter
      const matchesLevel = levelValue === "all" || worksheet.level.toLowerCase() === levelValue.toLowerCase()

      return matchesSearch && matchesSubject && matchesLevel
    })

    renderWorksheets(filteredWorksheets)
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", filterWorksheets)
  }

  if (subjectFilter) {
    subjectFilter.addEventListener("change", filterWorksheets)
  }

  if (levelFilter) {
    levelFilter.addEventListener("change", filterWorksheets)
  }

  // Create worksheet modal
  if (createWorksheetBtn) {
    createWorksheetBtn.addEventListener("click", () => {
      // Reset form for new worksheet
      worksheetForm.reset()
      currentWorksheetId = null
      document.querySelector(".modal-title").textContent = "Create New Worksheet"
      document.querySelector('button[type="submit"]').textContent = "Create"

      worksheetModal.classList.add("active")
    })
  }

  if (closeWorksheetModal) {
    closeWorksheetModal.addEventListener("click", () => {
      worksheetModal.classList.remove("active")
    })

    // Close modal when clicking outside
    worksheetModal.addEventListener("click", (e) => {
      if (e.target === worksheetModal) {
        worksheetModal.classList.remove("active")
      }
    })
  }

  // Handle form submission
  if (worksheetForm) {
    worksheetForm.addEventListener("submit", (e) => {
      e.preventDefault()

      if (currentWorksheetId) {
        // Edit existing worksheet
        const worksheetIndex = allWorksheets.findIndex((w) => w.id === currentWorksheetId)
        if (worksheetIndex !== -1) {
          allWorksheets[worksheetIndex] = {
            ...allWorksheets[worksheetIndex],
            title: document.getElementById("worksheet-title").value,
            description: document.getElementById("worksheet-description").value,
            subject: document.getElementById("worksheet-subject").value,
            level: document.getElementById("worksheet-level").value,
          }

          // Show success message (in a real app)
          alert("Worksheet updated successfully!")
        }
      } else {
        // Create new worksheet
        const newWorksheet = {
          id: allWorksheets.length + 1,
          title: document.getElementById("worksheet-title").value,
          description: document.getElementById("worksheet-description").value,
          subject: document.getElementById("worksheet-subject").value,
          level: document.getElementById("worksheet-level").value,
        }

        allWorksheets.push(newWorksheet)

        // Show success message (in a real app)
        alert("Worksheet created successfully!")
      }

      worksheetModal.classList.remove("active")
      worksheetForm.reset()

      // Re-render worksheets
      filterWorksheets()
    })
  }

  // Edit worksheet
  if (editWorksheetBtn) {
    editWorksheetBtn.addEventListener("click", () => {
      const worksheet = allWorksheets.find((w) => w.id === currentWorksheetId)
      if (worksheet) {
        document.getElementById("worksheet-title").value = worksheet.title
        document.getElementById("worksheet-description").value = worksheet.description
        document.getElementById("worksheet-subject").value = worksheet.subject
        document.getElementById("worksheet-level").value = worksheet.level

        document.querySelector(".modal-title").textContent = "Edit Worksheet"
        document.querySelector('button[type="submit"]').textContent = "Save Changes"

        worksheetModal.classList.add("active")
      }

      closeMenu()
    })
  }

  // Delete worksheet
  if (deleteWorksheetBtn) {
    deleteWorksheetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this worksheet?")) {
        const worksheetIndex = allWorksheets.findIndex((w) => w.id === currentWorksheetId)
        if (worksheetIndex !== -1) {
          allWorksheets.splice(worksheetIndex, 1)
          filterWorksheets()

          // Show success message (in a real app)
          alert("Worksheet deleted successfully!")
        }
      }

      closeMenu()
    })
  }

  // Add CSS for worksheets page
  const style = document.createElement("style")
  style.textContent = `
    .page-header {
      display: flex;
      flex-direction: column;
      margin-bottom: 2rem;
    }
    
    .page-title {
      font-size: 1.875rem;
      margin-bottom: 0.5rem;
    }
    
    .page-description {
      color: var(--muted-foreground);
    }
    
    .search-container {
      margin-bottom: 2rem;
    }
    
    .search-input-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }
    
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-foreground);
    }
    
    .search-input {
      width: 100%;
      height: 2.5rem;
      padding: 0 0.75rem 0 2.5rem;
      border-radius: var(--radius);
      border: 1px solid var(--input);
      background-color: var(--background);
      font-size: 0.875rem;
    }
    
    .filter-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .filter-label {
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .filter-select {
      height: 2.25rem;
      padding: 0 0.5rem;
      border-radius: var(--radius);
      border: 1px solid var(--input);
      background-color: var(--background);
      font-size: 0.875rem;
    }
    
    .worksheets-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .card-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    
    .card-icon-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .card-icon-small {
      width: 1.25rem;
      height: 1.25rem;
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .tag {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .tag-primary {
      background-color: rgba(59, 130, 246, 0.1);
      color: var(--primary);
    }
    
    .tag-secondary {
      background-color: var(--muted);
      color: var(--muted-foreground);
    }
    
    .no-results {
      text-align: center;
      padding: 2rem;
      color: var(--muted-foreground);
    }
    
    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    textarea {
      width: 100%;
      padding: 0.75rem;
      border-radius: var(--radius);
      border: 1px solid var(--input);
      background-color: var(--background);
      font-size: 0.875rem;
      font-family: inherit;
      resize: vertical;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    
    .btn-icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }
    
    .dropdown-menu {
      position: absolute;
      z-index: 50;
      display: none;
      min-width: 8rem;
      padding: 0.5rem;
      background-color: var(--background);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .dropdown-menu.active {
      display: block;
    }
    
    .dropdown-list {
      list-style: none;
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      border-radius: var(--radius);
    }
    
    .dropdown-item:hover {
      background-color: var(--muted);
    }
    
    .dropdown-item-destructive {
      color: var(--destructive);
    }
    
    .dropdown-icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }
    
    @media (min-width: 640px) {
      .worksheets-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .form-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 768px) {
      .page-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
    
    @media (min-width: 1024px) {
      .worksheets-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `

  document.head.appendChild(style)

  // Add CSS for about page
  const aboutStyle = document.createElement("style")
  aboutStyle.textContent = `
    .about-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .about-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .about-description {
      font-size: 1.125rem;
      color: var(--muted-foreground);
      max-width: 32rem;
      margin: 0 auto;
    }
    
    .about-section {
      margin-bottom: 4rem;
    }
    
    .about-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .section-title-left {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .about-text {
      color: var(--muted-foreground);
      margin-bottom: 1rem;
    }
    
    .about-card {
      background-color: var(--muted);
      border-radius: var(--radius);
      padding: 2rem;
    }
    
    .about-card-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .about-card-text {
      margin-bottom: 1.5rem;
    }
    
    .about-list {
      list-style: none;
    }
    
    .about-list-item {
      display: flex;
      margin-bottom: 0.75rem;
    }
    
    .about-list-bullet {
      color: var(--primary);
      margin-right: 0.5rem;
    }
    
    .features-section {
      margin-bottom: 4rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .feature-title {
      font-size: 1.25rem;
      text-align: center;
      margin: 0.5rem 0;
    }
    
    .feature-description {
      text-align: center;
      color: var(--muted-foreground);
    }
    
    .join-section {
      background-color: rgba(59, 130, 246, 0.05);
      border-radius: var(--radius);
      padding: 2rem;
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .join-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .join-description {
      color: var(--muted-foreground);
      max-width: 32rem;
      margin: 0 auto 1.5rem;
    }
    
    @media (min-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `

  document.head.appendChild(aboutStyle)

  // Initial load from database
  loadWorksheets()
})
