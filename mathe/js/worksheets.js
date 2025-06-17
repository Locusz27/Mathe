document.addEventListener("DOMContentLoaded", () => {
  console.log("Worksheets page loaded")

  // DOM elements
  const worksheetsGrid = document.getElementById("worksheets-grid")
  const searchInput = document.getElementById("search-worksheets")
  const subjectFilter = document.getElementById("subject-filter")
  const levelFilter = document.getElementById("level-filter")
  const noResults = document.getElementById("no-results")
  const loadingState = document.getElementById("loading-state")
  const errorState = document.getElementById("error-state")
  const errorMessage = document.getElementById("error-message")

  let allWorksheets = []
  let filteredWorksheets = []

  // Load worksheets from database
  function loadWorksheets() {
    console.log("Loading worksheets from database...")

    // Show loading state
    loadingState.classList.remove("hidden")
    errorState.classList.add("hidden")
    worksheetsGrid.style.display = "none"
    noResults.classList.add("hidden")

    fetch("api/worksheets.php")
      .then((response) => {
        console.log("Response status:", response.status)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log("Worksheets data received:", data)

        if (data.success) {
          allWorksheets = data.data || []
          console.log("Loaded worksheets:", allWorksheets)

          // Hide loading state
          loadingState.classList.add("hidden")
          worksheetsGrid.style.display = "grid"

          // Apply initial filters
          filterWorksheets()
        } else {
          throw new Error(data.message || "Failed to load worksheets")
        }
      })
      .catch((error) => {
        console.error("Error loading worksheets:", error)

        // Hide loading state and show error
        loadingState.classList.add("hidden")
        errorState.classList.remove("hidden")
        errorMessage.textContent = error.message || "Failed to load worksheets. Please try again."
      })
  }

  // Render worksheets
  function renderWorksheets(worksheetsToRender) {
    console.log("Rendering worksheets:", worksheetsToRender)

    worksheetsGrid.innerHTML = ""

    if (worksheetsToRender.length === 0) {
      noResults.classList.remove("hidden")
      return
    }

    noResults.classList.add("hidden")

    worksheetsToRender.forEach((worksheet) => {
      const worksheetCard = document.createElement("div")
      worksheetCard.className = "worksheet-card"
      worksheetCard.dataset.id = worksheet.id

      // Format the upload date
      const uploadDate = new Date(worksheet.created_at).toLocaleDateString()

      // Escape HTML to prevent XSS
      const escapeHtml = (text) => {
        const div = document.createElement("div")
        div.textContent = text
        return div.innerHTML
      }

      worksheetCard.innerHTML = `
        <div class="worksheet-header">
          <h2 class="worksheet-title">
            <i data-lucide="file-text" class="worksheet-icon"></i>
            ${escapeHtml(worksheet.title)}
          </h2>
          <p class="worksheet-description">${escapeHtml(worksheet.description)}</p>
          <div class="upload-date">Uploaded: ${uploadDate}</div>
        </div>
        <div class="worksheet-content">
          <div class="worksheet-meta">
            <span class="worksheet-tag">${escapeHtml(worksheet.subject)}</span>
            <span class="worksheet-tag">${escapeHtml(worksheet.level)}</span>
          </div>
          
          <div class="worksheet-actions">
            <a href="${escapeHtml(worksheet.file_path)}" class="btn btn-primary" target="_blank">
              <i data-lucide="file-text" class="btn-icon"></i> View PDF
            </a>
            <a href="${escapeHtml(worksheet.file_path)}" class="btn btn-outline" download>
              <i data-lucide="download" class="btn-icon"></i> Download
            </a>
          </div>
        </div>
      `

      worksheetsGrid.appendChild(worksheetCard)
    })

    // Initialize Lucide icons
    if (typeof lucide !== "undefined") {
      if (typeof lucide !== "undefined") {
        lucide.createIcons()
      }
    }
  }

  // Filter worksheets
  function filterWorksheets() {
    const searchTerm = searchInput.value.toLowerCase()
    const subjectValue = subjectFilter.value
    const levelValue = levelFilter.value

    filteredWorksheets = allWorksheets.filter((worksheet) => {
      // Search term filter
      const matchesSearch =
        worksheet.title.toLowerCase().includes(searchTerm) ||
        worksheet.description.toLowerCase().includes(searchTerm) ||
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

  // Make loadWorksheets globally available for retry button
  window.loadWorksheets = loadWorksheets

  // Initial load
  loadWorksheets()
})
