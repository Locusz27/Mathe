// Login page specific JavaScript
document.addEventListener("DOMContentLoaded", () => {
  console.log("Login page JavaScript loaded")

  // Tab switching
  const tabTriggers = document.querySelectorAll(".tab-trigger")
  const tabContents = document.querySelectorAll(".tab-content")

  // Check URL parameters for tab
  const urlParams = new URLSearchParams(window.location.search)
  const activeTab = urlParams.get("tab") || "login"

  // Set active tab based on URL
  tabTriggers.forEach((trigger) => {
    trigger.classList.remove("active")
    if (trigger.dataset.tab === activeTab) {
      trigger.classList.add("active")
    }
  })

  tabContents.forEach((content) => {
    content.classList.remove("active")
    if (content.id === activeTab + "-tab") {
      content.classList.add("active")
    }
  })

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetTab = trigger.dataset.tab

      // Update active states
      tabTriggers.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      trigger.classList.add("active")
      document.getElementById(targetTab + "-tab").classList.add("active")

      // Update URL
      const newUrl = new URL(window.location)
      newUrl.searchParams.set("tab", targetTab)
      window.history.pushState({}, "", newUrl)
    })
  })

  // Password toggle functionality
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      console.log("Password toggle clicked")
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
      if (window.lucide) {
        window.lucide.createIcons()
      }
    })
  })

  // Login form handler
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault()
      console.log("Login form submitted")

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      if (!email || !password) {
        alert("Please fill in all fields")
        return
      }

      // Disable submit button
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.disabled = true
      submitBtn.textContent = "Logging in..."

      try {
        // Check if authManager exists
        if (typeof window.authManager === "undefined") {
          console.error("AuthManager not found")
          alert("Authentication system not loaded. Please refresh the page.")
          return
        }

        const result = await window.authManager.login(email, password)

        if (result.success) {
          alert("Login successful!")
          window.location.href = "dashboard.html"
        } else {
          alert(result.message || "Login failed")
        }
      } catch (error) {
        console.error("Login error:", error)
        alert("Login failed. Please try again.")
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = originalText
      }
    })
  }

  // Registration form handler
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    console.log("Register form found, adding event listener")

    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault()
      console.log("Registration form submitted")

      const username = document.getElementById("register-username").value
      const email = document.getElementById("register-email").value
      const password = document.getElementById("register-password").value
      const confirmPassword = document.getElementById("register-confirm-password").value
      const roleElement = document.querySelector('input[name="role"]:checked')

      console.log("Form values:", {
        username,
        email,
        password: "***",
        confirmPassword: "***",
        role: roleElement?.value,
      })

      // Validation
      if (!username || !email || !password || !confirmPassword) {
        alert("Please fill in all fields")
        return
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long")
        return
      }

      if (!roleElement) {
        alert("Please select a role")
        return
      }

      const role = roleElement.value

      // Disable submit button
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.disabled = true
      submitBtn.textContent = "Registering..."

      try {
        console.log("Attempting registration...")

        // Direct API call since authManager might not be loaded
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
        })

        console.log("API response status:", response.status)

        const result = await response.json()
        console.log("API response data:", result)

        if (result.success) {
          alert("Registration successful! You can now login.")
          // Switch to login tab
          const loginTab = document.querySelector('[data-tab="login"]')
          if (loginTab) {
            loginTab.click()
          }
          // Clear form
          this.reset()
        } else {
          alert(result.message || "Registration failed")
        }
      } catch (error) {
        console.error("Registration error:", error)
        alert("Registration failed. Please try again.")
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = originalText
      }
    })
  } else {
    console.error("Register form not found")
  }
})
