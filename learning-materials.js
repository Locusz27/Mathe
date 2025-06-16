document.addEventListener("DOMContentLoaded", () => {
  console.log("Learning materials page loaded")

  // DOM elements
  const materialsGrid = document.getElementById("materials-grid")
  const searchInput = document.getElementById("search-materials")
  const subjectFilter = document.getElementById("subject-filter")
  const levelFilter = document.getElementById("level-filter")
  const noResults = document.getElementById("no-results")
  const loading = document.getElementById("loading")

  let allMaterials = []

  // Load materials from database
  async function loadMaterials() {
    try {
      console.log("Loading materials from database...")
      loading.classList.remove("hidden")
      materialsGrid.innerHTML = ""

      const response = await fetch("api/materials.php")
      const result = await response.json()

      if (result.success) {
        allMaterials = result.data || []
        console.log("Loaded materials:", allMaterials)
        renderMaterials(allMaterials)
      } else {
        console.error("Failed to load materials:", result.message)
        showError("Failed to load learning materials. Please try again later.")
      }
    } catch (error) {
      console.error("Error loading materials:", error)
      showError("Error loading learning materials. Please check your connection.")
    } finally {
      loading.classList.add("hidden")
    }
  }

  // Render materials
  function renderMaterials(materialsToRender) {
    materialsGrid.innerHTML = ""

    if (materialsToRender.length === 0) {
      noResults.classList.remove("hidden")
      return
    }

    noResults.classList.add("hidden")

    materialsToRender.forEach((material) => {
      const materialCard = document.createElement("div")
      materialCard.className = "material-card"

      // Format date
      const createdDate = material.created_at ? new Date(material.created_at).toLocaleDateString() : "Unknown date"

      materialCard.innerHTML = `
        <div class="material-header">
          <h2 class="material-title">
            <i data-lucide="book-open" class="material-icon"></i>
            ${escapeHtml(material.title)}
          </h2>
          <p class="material-description">${escapeHtml(material.description || "No description available")}</p>
          <div class="material-date">Uploaded: ${createdDate}</div>
        </div>
        <div class="material-content">
          <div class="material-meta">
            <span class="material-tag">${escapeHtml(material.subject)}</span>
            <span class="material-tag">${escapeHtml(material.level)}</span>
          </div>
          
          <div class="material-actions">
            <a href="${escapeHtml(material.file_path)}" class="btn btn-primary" target="_blank">
              <i data-lucide="file-text" class="btn-icon"></i> View PDF
            </a>
            <a href="${escapeHtml(material.file_path)}" class="btn btn-outline" download>
              <i data-lucide="download" class="btn-icon"></i> Download
            </a>
          </div>
        </div>
      `

      materialsGrid.appendChild(materialCard)
    })

    // Reinitialize Lucide icons
    if (typeof window.lucide !== "undefined") {
      window.lucide.createIcons()
    }
  }

  // Filter materials
  function filterMaterials() {
    const searchTerm = searchInput.value.toLowerCase()
    const subjectValue = subjectFilter.value
    const levelValue = levelFilter.value

    console.log(`Filtering materials: search=${searchTerm}, subject=${subjectValue}, level=${levelValue}`)

    const filteredMaterials = allMaterials.filter((material) => {
      // Search term filter
      const matchesSearch =
        !searchTerm ||
        material.title.toLowerCase().includes(searchTerm) ||
        (material.description && material.description.toLowerCase().includes(searchTerm)) ||
        material.subject.toLowerCase().includes(searchTerm)

      // Subject filter
      const matchesSubject = subjectValue === "all" || material.subject.toLowerCase() === subjectValue.toLowerCase()

      // Level filter
      const matchesLevel = levelValue === "all" || material.level.toLowerCase() === levelValue.toLowerCase()

      return matchesSearch && matchesSubject && matchesLevel
    })

    renderMaterials(filteredMaterials)
  }

  // Show error message
  function showError(message) {
    materialsGrid.innerHTML = `
      <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--destructive);">
        <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
        <h3>Error Loading Materials</h3>
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

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", filterMaterials)
  }

  if (subjectFilter) {
    subjectFilter.addEventListener("change", filterMaterials)
  }

  if (levelFilter) {
    levelFilter.addEventListener("change", filterMaterials)
  }

  // Initial load
  loadMaterials()
})
