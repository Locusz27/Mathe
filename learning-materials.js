document.addEventListener('DOMContentLoaded', function() {
  // Sample learning materials data
  const materials = [
    {
      id: 1,
      title: "Introduction to Algebra",
      description: "Learn the basics of algebraic expressions and equations.",
      level: "Beginner",
      subject: "Algebra"
    },
    {
      id: 2,
      title: "Geometry Fundamentals",
      description: "Explore shapes, angles, and spatial relationships.",
      level: "Beginner",
      subject: "Geometry"
    },
    {
      id: 3,
      title: "Fractions and Decimals",
      description: "Master working with fractions and decimal numbers.",
      level: "Beginner",
      subject: "Arithmetic"
    },
    {
      id: 4,
      title: "Advanced Equations",
      description: "Solve complex equations and inequalities.",
      level: "Intermediate",
      subject: "Algebra"
    },
    {
      id: 5,
      title: "Trigonometry Basics",
      description: "Introduction to sine, cosine, and tangent functions.",
      level: "Intermediate",
      subject: "Trigonometry"
    },
    {
      id: 6,
      title: "Statistics and Probability",
      description: "Learn to analyze data and calculate probabilities.",
      level: "Intermediate",
      subject: "Statistics"
    }
  ];

  // DOM elements
  const materialsGrid = document.getElementById('materials-grid');
  const searchInput = document.getElementById('search-materials');
  const subjectFilter = document.getElementById('subject-filter');
  const levelFilter = document.getElementById('level-filter');
  const noResults = document.getElementById('no-results');
  const uploadMaterialBtn = document.getElementById('upload-material-btn');
  const uploadModal = document.getElementById('upload-modal');
  const closeUploadModal = document.getElementById('close-upload-modal');
  const uploadForm = document.getElementById('upload-form');
  const teacherActions = document.getElementById('teacher-actions');

  // Check if user is a teacher (for demo purposes)
  const isTeacher = localStorage.getItem('userRole') === 'teacher';
  if (isTeacher) {
    teacherActions.classList.remove('hidden');
  }

  // Render materials
  function renderMaterials(materialsToRender) {
    materialsGrid.innerHTML = '';
    
    if (materialsToRender.length === 0) {
      noResults.classList.remove('hidden');
      return;
    }
    
    noResults.classList.add('hidden');
    
    materialsToRender.forEach(material => {
      const materialCard = document.createElement('div');
      materialCard.className = 'card';
      materialCard.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${material.title}</h3>
          <p class="card-description">${material.description}</p>
        </div>
        <div class="card-content">
          <div class="tags">
            <span class="tag tag-primary">${material.subject}</span>
            <span class="tag tag-secondary">${material.level}</span>
          </div>
        </div>
        <div class="card-footer">
          <a href="#" class="btn btn-primary btn-full">Access Material</a>
        </div>
      `;
      
      materialsGrid.appendChild(materialCard);
    });
  }

  // Filter materials
  function filterMaterials() {
    const searchTerm = searchInput.value.toLowerCase();
    const subjectValue = subjectFilter.value;
    const levelValue = levelFilter.value;
    
    const filteredMaterials = materials.filter(material => {
      // Search term filter
      const matchesSearch = 
        material.title.toLowerCase().includes(searchTerm) ||
        material.description.toLowerCase().includes(searchTerm) ||
        material.subject.toLowerCase().includes(searchTerm);
      
      // Subject filter
      const matchesSubject = 
        subjectValue === 'all' || 
        material.subject.toLowerCase() === subjectValue.toLowerCase();
      
      // Level filter
      const matchesLevel = 
        levelValue === 'all' || 
        material.level.toLowerCase() === levelValue.toLowerCase();
      
      return matchesSearch && matchesSubject && matchesLevel;
    });
    
    renderMaterials(filteredMaterials);
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', filterMaterials);
  }
  
  if (subjectFilter) {
    subjectFilter.addEventListener('change', filterMaterials);
  }
  
  if (levelFilter) {
    levelFilter.addEventListener('change', filterMaterials);
  }
  
  // Upload material modal
  if (uploadMaterialBtn) {
    uploadMaterialBtn.addEventListener('click', function() {
      uploadModal.classList.add('active');
    });
  }
  
  if (closeUploadModal) {
    closeUploadModal.addEventListener('click', function() {
      uploadModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    uploadModal.addEventListener('click', function(e) {
      if (e.target === uploadModal) {
        uploadModal.classList.remove('active');
      }
    });
  }
  
  // Handle form submission
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // In a real app, you would send the form data to a server
      const newMaterial = {
        id: materials.length + 1,
        title: document.getElementById('material-title').value,
        description: document.getElementById('material-description').value,
        subject: document.getElementById('material-subject').value,
        level: document.getElementById('material-level').value
      };
      
      materials.push(newMaterial);
      uploadModal.classList.remove('active');
      uploadForm.reset();
      
      // Re-render materials
      filterMaterials();
      
      // Show success message (in a real app)
      alert('Material uploaded successfully!');
    });
  }

  // Add CSS for materials page
  const style = document.createElement('style');
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
    
    .materials-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
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
    
    @media (min-width: 640px) {
      .materials-grid {
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
      .materials-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `;
  
  document.head.appendChild(style);

  // Initial render
  renderMaterials(materials);
});