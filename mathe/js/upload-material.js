// Learning Material Upload functionality
class MaterialUploader {
  constructor() {
    this.selectedFile = null
    this.isUploading = false
  }

  init() {
    console.log("Initializing Material Uploader")

    // Set up file upload area
    this.setupFileUpload()

    // Set up form submission
    this.setupFormSubmission()
  }

  setupFileUpload() {
    const fileUploadArea = document.getElementById("file-upload-area")
    const fileInput = document.getElementById("file-input")
    const filePreview = document.getElementById("file-preview")
    const removeFileBtn = document.getElementById("remove-file")

    // Click to upload
    fileUploadArea.addEventListener("click", () => {
      if (!this.isUploading) {
        fileInput.click()
      }
    })

    // File input change
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        this.handleFileSelect(file)
      }
    })

    // Drag and drop
    fileUploadArea.addEventListener("dragover", (e) => {
      e.preventDefault()
      fileUploadArea.classList.add("dragover")
    })

    fileUploadArea.addEventListener("dragleave", () => {
      fileUploadArea.classList.remove("dragover")
    })

    fileUploadArea.addEventListener("drop", (e) => {
      e.preventDefault()
      fileUploadArea.classList.remove("dragover")

      const files = e.dataTransfer.files
      if (files.length > 0) {
        this.handleFileSelect(files[0])
      }
    })

    // Remove file
    removeFileBtn.addEventListener("click", () => {
      this.removeFile()
    })
  }

  handleFileSelect(file) {
    // Validate file type
    if (file.type !== "application/pdf") {
      this.showError("Please select a PDF file.")
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      this.showError("File size must be less than 10MB.")
      return
    }

    this.selectedFile = file
    this.showFilePreview(file)
  }

  showFilePreview(file) {
    const filePreview = document.getElementById("file-preview")
    const fileName = document.getElementById("file-name")
    const fileSize = document.getElementById("file-size")

    fileName.textContent = file.name
    fileSize.textContent = this.formatFileSize(file.size)

    filePreview.classList.add("show")

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  removeFile() {
    this.selectedFile = null
    const fileInput = document.getElementById("file-input")
    const filePreview = document.getElementById("file-preview")

    fileInput.value = ""
    filePreview.classList.remove("show")
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  setupFormSubmission() {
    const form = document.getElementById("upload-form")

    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      await this.submitForm()
    })
  }

  async submitForm() {
    if (this.isUploading) return

    // Validate form
    const title = document.getElementById("title").value.trim()
    const subject = document.getElementById("subject").value
    const level = document.getElementById("level").value

    if (!title) {
      this.showError("Please enter a title.")
      return
    }

    if (!subject) {
      this.showError("Please select a subject.")
      return
    }

    if (!level) {
      this.showError("Please select a difficulty level.")
      return
    }

    if (!this.selectedFile) {
      this.showError("Please select a PDF file to upload.")
      return
    }

    this.isUploading = true
    this.showProgress()

    try {
      const formData = new FormData()
      formData.append("action", "upload_material")
      formData.append("title", title)
      formData.append("subject", subject)
      formData.append("level", level)
      formData.append("description", document.getElementById("description").value.trim())
      formData.append("file", this.selectedFile)

      const response = await fetch("api/upload.php", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        this.showSuccess("Learning material uploaded successfully!")
        this.resetForm()
      } else {
        this.showError(data.message || "Failed to upload learning material.")
      }
    } catch (error) {
      console.error("Upload error:", error)
      this.showError("An error occurred while uploading the learning material.")
    } finally {
      this.isUploading = false
      this.hideProgress()
    }
  }

  showProgress() {
    const progressContainer = document.getElementById("progress-container")
    const submitBtn = document.getElementById("submit-btn")

    progressContainer.classList.add("show")
    submitBtn.disabled = true
    submitBtn.innerHTML = '<i data-lucide="loader-2"></i> Uploading...'

    // Simulate progress (in a real app, you'd track actual upload progress)
    let progress = 0
    const progressFill = document.getElementById("progress-fill")
    const progressText = document.getElementById("progress-text")

    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress > 90) progress = 90

      progressFill.style.width = progress + "%"
      progressText.textContent = `Uploading... ${Math.round(progress)}%`
    }, 200)

    // Store interval to clear it later
    this.progressInterval = interval
  }

  hideProgress() {
    const progressContainer = document.getElementById("progress-container")
    const submitBtn = document.getElementById("submit-btn")
    const progressFill = document.getElementById("progress-fill")
    const progressText = document.getElementById("progress-text")

    if (this.progressInterval) {
      clearInterval(this.progressInterval)
    }

    progressFill.style.width = "100%"
    progressText.textContent = "Upload complete!"

    setTimeout(() => {
      progressContainer.classList.remove("show")
      progressFill.style.width = "0%"
      progressText.textContent = "Uploading... 0%"
    }, 1000)

    submitBtn.disabled = false
    submitBtn.innerHTML = '<i data-lucide="upload"></i> Upload Material'

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  showSuccess(message) {
    const successMessage = document.getElementById("success-message")
    successMessage.classList.add("show")

    setTimeout(() => {
      successMessage.classList.remove("show")
    }, 5000)

    // Scroll to top to show message
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  showError(message) {
    const errorMessage = document.getElementById("error-message")
    const errorText = document.getElementById("error-text")

    errorText.textContent = message
    errorMessage.classList.add("show")

    setTimeout(() => {
      errorMessage.classList.remove("show")
    }, 5000)

    // Scroll to top to show message
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  resetForm() {
    const form = document.getElementById("upload-form")
    form.reset()
    this.removeFile()
  }
}

// Initialize uploader when page loads
let materialUploader

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in and is a teacher
  if (!window.authManager || !window.authManager.isTeacher()) {
    return
  }

  materialUploader = new MaterialUploader()
  materialUploader.init()
})
