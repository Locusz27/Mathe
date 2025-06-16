// Role Switcher - Standalone script
console.log("Role switcher script loaded")

// Define global test functions
window.testTeacherSwitch = () => {
  console.log("Testing teacher switch...")
  const teacherButton = document.querySelector('[data-role="teacher"]')
  console.log("Teacher button found:", teacherButton)
  if (teacherButton) {
    switchToRole("teacher", teacherButton)
  } else {
    console.error("Teacher button not found!")
  }
}

window.testStudentSwitch = () => {
  console.log("Testing student switch...")
  const studentButton = document.querySelector('[data-role="student"]')
  console.log("Student button found:", studentButton)
  if (studentButton) {
    switchToRole("student", studentButton)
  } else {
    console.error("Student button not found!")
  }
}

window.debugRoleSwitcher = () => {
  console.log("=== Role Switcher Debug ===")
  console.log("Role switcher container:", document.getElementById("teacher-role-switcher"))
  console.log("Student button:", document.querySelector('[data-role="student"]'))
  console.log("Teacher button:", document.querySelector('[data-role="teacher"]'))
  console.log("Student dashboard:", document.getElementById("student-dashboard"))
  console.log("Teacher dashboard:", document.getElementById("teacher-dashboard"))
  console.log("AuthManager:", window.authManager)
  console.log("Is teacher:", window.authManager?.isTeacher())
}

// Function to switch roles
function switchToRole(role, clickedTrigger) {
  console.log(`Switching to ${role} role`)

  try {
    const studentDashboard = document.getElementById("student-dashboard")
    const teacherDashboard = document.getElementById("teacher-dashboard")
    const roleDescription = document.getElementById("role-description")
    const allRoleTriggers = document.querySelectorAll("[data-role]")

    console.log("Elements found:")
    console.log("- Student dashboard:", !!studentDashboard)
    console.log("- Teacher dashboard:", !!teacherDashboard)
    console.log("- Role description:", !!roleDescription)
    console.log("- All role triggers:", allRoleTriggers.length)

    // Remove active class from all role triggers
    allRoleTriggers.forEach((trigger) => trigger.classList.remove("active"))

    // Add active class to clicked trigger
    if (clickedTrigger) {
      clickedTrigger.classList.add("active")
      console.log("Added active class to clicked trigger")
    }

    if (role === "student") {
      if (studentDashboard) {
        studentDashboard.classList.remove("hidden")
        console.log("Showed student dashboard")
      }
      if (teacherDashboard) {
        teacherDashboard.classList.add("hidden")
        console.log("Hid teacher dashboard")
      }
      if (roleDescription) {
        roleDescription.textContent = "Access your learning materials and track your progress."
      }
      console.log("Switched to student view")
    } else if (role === "teacher") {
      if (studentDashboard) {
        studentDashboard.classList.add("hidden")
        console.log("Hid student dashboard")
      }
      if (teacherDashboard) {
        teacherDashboard.classList.remove("hidden")
        console.log("Showed teacher dashboard")
      }
      if (roleDescription) {
        roleDescription.textContent = "Manage your educational content and monitor student progress."
      }
      console.log("Switched to teacher view")
    }
  } catch (error) {
    console.error("Error in switchToRole:", error)
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Role switcher initializing...")

  // Setup role switching buttons
  const studentTrigger = document.querySelector('[data-role="student"]')
  const teacherTrigger = document.querySelector('[data-role="teacher"]')

  console.log("Found student trigger:", !!studentTrigger)
  console.log("Found teacher trigger:", !!teacherTrigger)

  if (studentTrigger) {
    studentTrigger.onclick = function (e) {
      console.log("Student button clicked")
      e.preventDefault()
      e.stopPropagation()
      switchToRole("student", this)
      return false
    }
  }

  if (teacherTrigger) {
    teacherTrigger.onclick = function (e) {
      console.log("Teacher button clicked")
      e.preventDefault()
      e.stopPropagation()
      switchToRole("teacher", this)
      return false
    }
  }

  console.log("Role switcher initialization complete")
})

// Log that script is fully loaded
console.log("Role switcher script fully loaded")
console.log("Test functions available:")
console.log("- testTeacherSwitch:", typeof window.testTeacherSwitch)
console.log("- testStudentSwitch:", typeof window.testStudentSwitch)
console.log("- debugRoleSwitcher:", typeof window.debugRoleSwitcher)
