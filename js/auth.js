// Authentication management
class AuthManager {
  constructor() {
    this.currentUser = null
    this.initialized = false
    this.lucide = window.lucide
    console.log("Initializing AuthManager")
    this.authToken = localStorage.getItem("authToken") || null
    this.user = this.authToken ? this.decodeToken(this.authToken) : null
    this.isAuthenticated = !!this.authToken // Boolean: true if authToken exists
    this.listeners = [] // Array of callback functions to be called on auth state change

    // Initialize auth state from localStorage
    this.updateAuthState()
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

  /**
   * Registers a listener function to be called whenever the authentication state changes.
   * @param {function} listener - The callback function to be executed.
   * @returns {void}
   */
  registerListener(listener) {
    if (typeof listener === "function") {
      this.listeners.push(listener)
    } else {
      console.error("Invalid listener: Listener must be a function.")
    }
  }

  /**
   * Unregisters a listener function.
   * @param {function} listener - The callback function to be removed.
   * @returns {void}
   */
  unregisterListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  /**
   * Notifies all registered listeners about a change in the authentication state.
   * @returns {void}
   */
  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.isAuthenticated, this.user)
    })
  }

  /**
   * Sets the authentication token and updates the authentication state.
   * @param {string} token - The authentication token.
   * @returns {void}
   */
  setToken(token) {
    this.authToken = token
    localStorage.setItem("authToken", token)
    this.user = this.decodeToken(token)
    this.updateAuthState()
  }

  /**
   * Removes the authentication token and resets the authentication state.
   * @returns {void}
   */
  clearToken() {
    this.authToken = null
    localStorage.removeItem("authToken")
    this.user = null
    this.updateAuthState()
  }

  /**
   * Decodes the authentication token and returns the user information.
   * @param {string} token - The authentication token.
   * @returns {object | null} - The user information, or null if the token is invalid.
   */
  decodeToken(token) {
    try {
      // Basic JWT decoding (without verification)
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  }

  /**
   * Updates the authentication state based on the presence of an authentication token.
   * @returns {void}
   */
  updateAuthState() {
    this.isAuthenticated = !!this.authToken
    this.notifyListeners()
  }

  /**
   * Gets the current authentication token.
   * @returns {string | null} - The authentication token, or null if not authenticated.
   */
  getToken() {
    return this.authToken
  }

  /**
   * Gets the current user object.
   * @returns {object | null} - The user object, or null if not authenticated.
   */
  getUser() {
    return this.user
  }

  /**
   * Checks if the user has a specific role.
   * @param {string} role - The role to check for.
   * @returns {boolean} - True if the user has the role, false otherwise.
   */
  hasRole(role) {
    if (!this.user || !this.user.roles) {
      return false
    }
    return this.user.roles.includes(role)
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
