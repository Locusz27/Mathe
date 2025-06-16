// Authentication management
class AuthManager {
  constructor() {
    this.currentUser = null
    this.initialized = false
    this.lucide = window.lucide
  }

  async init() {
    if (this.initialized) return

    console.log("Initializing AuthManager")
    await this.checkSession()
    this.updateUI()
    this.initialized = true

    // Add event listener for page visibility changes to recheck session
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.checkSession().then(() => this.updateUI())
      }
    })
  }

  async checkSession() {
    try {
      console.log("Checking session...")

      // First check localStorage for user data
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser)
          console.log("Found user in localStorage:", this.currentUser)
          return true
        } catch (e) {
          localStorage.removeItem("currentUser")
        }
      }

      // If no stored user, check with server
      const response = await fetch("api/auth.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "check_session" }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("Session check response:", data)

      if (data.success && data.logged_in) {
        this.currentUser = data.user
        localStorage.setItem("currentUser", JSON.stringify(data.user))
        return true
      } else {
        this.currentUser = null
        localStorage.removeItem("currentUser")
        return false
      }
    } catch (error) {
      console.error("Session check failed:", error)
      this.currentUser = null
      localStorage.removeItem("currentUser")
      return false
    }
  }

  async login(email, password) {
    try {
      console.log("Attempting login...")
      const response = await fetch("api/auth.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          email: email,
          password: password,
        }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (data.success) {
        this.currentUser = data.user
        localStorage.setItem("currentUser", JSON.stringify(data.user))
        this.updateUI()

        // Handle post-login redirect
        setTimeout(() => {
          this.handlePostLoginRedirect()
        }, 1000)

        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Login failed:", error)
      return { success: false, message: "Login failed. Please try again." }
    }
  }

  async register(username, email, password, role) {
    try {
      console.log("Attempting registration...")
      const response = await fetch("api/auth.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          username: username,
          email: email,
          password: password,
          role: role,
        }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (data.success) {
        // Auto-login after successful registration
        return await this.login(email, password)
      }

      return { success: data.success, message: data.message }
    } catch (error) {
      console.error("Registration failed:", error)
      return { success: false, message: "Registration failed. Please try again." }
    }
  }

  async logout() {
    try {
      const response = await fetch("api/auth.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "logout" }),
        credentials: "include",
      })

      const data = await response.json()
      this.currentUser = null
      localStorage.removeItem("currentUser")
      this.updateUI()
      window.location.href = "index.html"
      return { success: true, message: "Logged out successfully" }
    } catch (error) {
      console.error("Logout failed:", error)
      this.currentUser = null
      localStorage.removeItem("currentUser")
      this.updateUI()
      window.location.href = "index.html"
      return { success: false, message: "Logout failed. Please try again." }
    }
  }

  isLoggedIn() {
    return this.currentUser !== null
  }

  isTeacher() {
    return this.currentUser && this.currentUser.role === "teacher"
  }

  isStudent() {
    return this.currentUser && this.currentUser.role === "student"
  }

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = "login.html"
      return false
    }
    return true
  }

  requireTeacher() {
    if (!this.isLoggedIn() || !this.isTeacher()) {
      alert("Access denied. Teacher privileges required.")
      return false
    }
    return true
  }

  updateUI() {
    console.log("Updating UI based on auth state:", this.currentUser)
    const navbarActions = document.querySelector(".navbar-actions")
    const mobileActions = document.querySelector(".mobile-actions")

    if (this.isLoggedIn()) {
      // Update navbar for logged in users
      if (navbarActions) {
        navbarActions.innerHTML = `
          <div class="user-menu">
            <span class="user-greeting">Hello, ${this.currentUser.username}</span>
            <div class="user-dropdown">
              <button class="btn btn-ghost user-menu-btn">
                <i data-lucide="user"></i>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="dropdown-menu user-dropdown-menu">
                <ul class="dropdown-list">
                  <li><a href="dashboard.html" class="dropdown-item">
                    <i data-lucide="layout-dashboard" class="dropdown-icon"></i>
                    Dashboard
                  </a></li>
                  <li><a href="#" class="dropdown-item" id="user-settings-btn">
                    <i data-lucide="settings" class="dropdown-icon"></i>
                    Settings
                  </a></li>
                  <li><a href="#" class="dropdown-item" id="logout-btn">
                    <i data-lucide="log-out" class="dropdown-icon"></i>
                    Logout
                  </a></li>
                </ul>
              </div>
            </div>
          </div>
        `
      }

      // Update mobile menu for logged in users
      if (mobileActions) {
        mobileActions.innerHTML = `
          <a href="dashboard.html" class="btn btn-primary btn-full">Dashboard</a>
          <a href="#" class="btn btn-outline btn-full" id="mobile-logout-btn">Logout</a>
        `
      }

      // Show teacher role switcher if user is a teacher
      if (this.isTeacher()) {
        const teacherRoleSwitcher = document.getElementById("teacher-role-switcher")
        if (teacherRoleSwitcher) {
          teacherRoleSwitcher.style.display = "block"
        }
      }

      // Add event listeners
      this.addUserMenuListeners()
    } else {
      // Update navbar for guests
      if (navbarActions) {
        navbarActions.innerHTML = `
          <a href="login.html" class="btn btn-ghost">Login</a>
          <a href="login.html?tab=register" class="btn btn-primary">Register</a>
        `
      }

      // Update mobile menu for guests
      if (mobileActions) {
        mobileActions.innerHTML = `
          <a href="login.html" class="btn btn-outline btn-full">Login</a>
          <a href="login.html?tab=register" class="btn btn-primary btn-full">Register</a>
        `
      }
    }

    // Reinitialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  addUserMenuListeners() {
    // User menu dropdown
    const userMenuBtn = document.querySelector(".user-menu-btn")
    const userDropdownMenu = document.querySelector(".user-dropdown-menu")

    if (userMenuBtn && userDropdownMenu) {
      userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        userDropdownMenu.classList.toggle("active")
      })

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        userDropdownMenu.classList.remove("active")
      })
    }

    // Logout buttons
    const logoutBtn = document.getElementById("logout-btn")
    const mobileLogoutBtn = document.getElementById("mobile-logout-btn")

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.logout()
      })
    }

    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.logout()
      })
    }

    // Settings button
    const settingsBtn = document.getElementById("user-settings-btn")
    if (settingsBtn) {
      settingsBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.showUserSettings()
      })
    }
  }

  showUserSettings() {
    // Create and show user settings modal
    const modal = document.createElement("div")
    modal.className = "modal active"
    modal.id = "user-settings-modal"
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Account Settings</h3>
          <button class="modal-close" id="close-settings-modal">×</button>
        </div>
        <div class="modal-body">
          <form id="settings-form" class="form">
            <div class="form-group">
              <label for="settings-username">Username</label>
              <input type="text" id="settings-username" value="${this.currentUser.username}" required>
            </div>
            <div class="form-group">
              <label for="settings-email">Email</label>
              <input type="email" id="settings-email" value="${this.currentUser.email}" required>
            </div>
            <div class="form-group">
              <label for="settings-password">New Password (leave blank to keep current)</label>
              <div class="password-input-wrapper">
                <input type="password" id="settings-password" placeholder="Enter new password">
                <button type="button" class="password-toggle" data-target="settings-password">
                  <i data-lucide="eye"></i>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label for="settings-confirm-password">Confirm New Password</label>
              <div class="password-input-wrapper">
                <input type="password" id="settings-confirm-password" placeholder="Confirm new password">
                <button type="button" class="password-toggle" data-target="settings-confirm-password">
                  <i data-lucide="eye"></i>
                </button>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" id="cancel-settings">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners
    const closeBtn = document.getElementById("close-settings-modal")
    const cancelBtn = document.getElementById("cancel-settings")
    const settingsForm = document.getElementById("settings-form")

    const closeModal = () => {
      modal.remove()
    }

    closeBtn.addEventListener("click", closeModal)
    cancelBtn.addEventListener("click", closeModal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal()
    })

    // Password toggle functionality
    const passwordToggles = modal.querySelectorAll(".password-toggle")
    passwordToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const targetId = toggle.getAttribute("data-target")
        const targetInput = document.getElementById(targetId)
        const icon = toggle.querySelector("i")

        if (targetInput.type === "password") {
          targetInput.type = "text"
          icon.setAttribute("data-lucide", "eye-off")
        } else {
          targetInput.type = "password"
          icon.setAttribute("data-lucide", "eye")
        }

        if (window.lucide) {
          window.lucide.createIcons()
        }
      })
    })

    // Form submission
    settingsForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const username = document.getElementById("settings-username").value
      const email = document.getElementById("settings-email").value
      const password = document.getElementById("settings-password").value
      const confirmPassword = document.getElementById("settings-confirm-password").value

      // Validate passwords match if provided
      if (password && password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }

      try {
        const updateData = {
          action: "update_user",
          username,
          email,
        }

        if (password) {
          updateData.password = password
        }

        const response = await fetch("api/user.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
          credentials: "include",
        })

        const data = await response.json()
        if (data.success) {
          // Update current user data
          this.currentUser.username = username
          this.currentUser.email = email
          localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
          this.updateUI()
          alert("Settings updated successfully")
          closeModal()
        } else {
          alert(data.message || "Failed to update settings")
        }
      } catch (error) {
        console.error("Settings update failed:", error)
        alert("Failed to update settings. Please try again.")
      }
    })

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  requireLogin(redirectMessage = "Please log in to access this feature.") {
    if (!this.isLoggedIn()) {
      // Store the current page to redirect back after login
      localStorage.setItem("redirectAfterLogin", window.location.href)

      // Show notification
      alert(redirectMessage)

      // Redirect to login page
      window.location.href = "login.html"
      return false
    }
    return true
  }

  // Add method to handle redirect after login
  handlePostLoginRedirect() {
    const redirectUrl = localStorage.getItem("redirectAfterLogin")
    if (redirectUrl && redirectUrl !== window.location.href) {
      localStorage.removeItem("redirectAfterLogin")
      // Only redirect if it's not the login page itself
      if (!redirectUrl.includes("login.html")) {
        window.location.href = redirectUrl
        return
      }
    }
    // Default redirect to dashboard
    window.location.href = "dashboard.html"
  }
}

// Initialize auth manager
console.log("Creating AuthManager instance")
window.authManager = new AuthManager()

// Initialize immediately when script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Auth.js DOM loaded, initializing AuthManager")
    window.authManager.init()
  })
} else {
  console.log("DOM already loaded, initializing AuthManager immediately")
  window.authManager.init()
}
