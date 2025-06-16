document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    console.warn('Lucide icons not found. Make sure Lucide is properly imported.');
  }
  
  // Set current year in footer
  document.querySelectorAll('#current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });
  }
  
  // Tabs functionality
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      const tabContents = document.querySelectorAll('.tab-content');
      const tabTriggers = document.querySelectorAll('.tab-trigger');
      
      // Remove active class from all triggers and contents
      tabTriggers.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked trigger and corresponding content
      this.classList.add('active');
      const activeContent = document.getElementById(`${tabName}-tab`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
      
      // Handle role switching in dashboard
      if (this.hasAttribute('data-role')) {
        const role = this.getAttribute('data-role');
        const studentDashboard = document.getElementById('student-dashboard');
        const teacherDashboard = document.getElementById('teacher-dashboard');
        const roleDescription = document.getElementById('role-description');
        const activityMessage = document.getElementById('activity-message');
        
        if (role === 'student') {
          studentDashboard?.classList.remove('hidden');
          teacherDashboard?.classList.add('hidden');
          if (roleDescription) {
            roleDescription.textContent = 'Access your learning materials and track your progress.';
          }
          if (activityMessage) {
            activityMessage.textContent = 'You haven\'t completed any activities yet. Start learning!';
          }
        } else if (role === 'teacher') {
          studentDashboard?.classList.add('hidden');
          teacherDashboard?.classList.remove('hidden');
          if (roleDescription) {
            roleDescription.textContent = 'Manage your educational content and monitor student progress.';
          }
          if (activityMessage) {
            activityMessage.textContent = 'No recent activities to display. Start creating content!';
          }
        }
      }
    });
  });
  
  // Check URL for tab parameter
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  
  if (tabParam) {
    const tabTrigger = document.querySelector(`.tab-trigger[data-tab="${tabParam}"]`);
    if (tabTrigger) {
      tabTrigger.click();
    }
  }
  
  // Handle login and register form submissions
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // In a real app, you would authenticate the user here
      window.location.href = 'dashboard.html';
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // In a real app, you would register the user here
      const loginTab = document.querySelector('.tab-trigger[data-tab="login"]');
      if (loginTab) {
        loginTab.click();
      }
    });
  }
});