// Quiz creation functionality
const currentQuiz = {
  title: "",
  description: "",
  subject: "",
  level: "",
  backgroundTheme: "default",
  pointsPerQuestion: 10,
  timeLimit: 60,
  questions: [],
}

let currentQuestionIndex = 0

// Initialize the quiz creator
document.addEventListener("DOMContentLoaded", () => {
  console.log("Quiz creator loaded")

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons()
  }

  let questions = []
  let currentQuizId = null

  // Get quiz ID from URL if editing
  const urlParams = new URLSearchParams(window.location.search)
  const editQuizId = urlParams.get("edit")

  if (editQuizId) {
    currentQuizId = editQuizId
    loadQuizForEditing(editQuizId)
  }

  // Add question button
  const addQuestionBtn = document.getElementById("add-question-btn")
  if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", () => {
      console.log("Add question clicked")
      addQuestion()
    })
  } else {
    console.error("Add question button not found")
  }

  // Other event listeners
  const publishQuizBtn = document.getElementById("publish-quiz-btn")
  if (publishQuizBtn) {
    publishQuizBtn.addEventListener("click", () => saveQuiz())
  }

  // Add first question by default if not editing
  if (!editQuizId) {
    setTimeout(() => addQuestion(), 100)
  }

  function addQuestion() {
    console.log("Adding new question")

    const questionsList = document.getElementById("questions-list")
    if (!questionsList) {
      console.error("Questions list container not found")
      return
    }

    const questionIndex = questions.length
    const questionId = `question-${questionIndex}`

    const questionData = {
      id: questionId,
      story_context: "",
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      hint: "",
    }

    questions.push(questionData)

    const questionCard = createQuestionCard(questionData, questionIndex)
    questionsList.appendChild(questionCard)

    // Initialize Lucide icons for the new question
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }

    console.log("Question added successfully", questionData)
  }

  function createQuestionCard(questionData, index) {
    const questionCard = document.createElement("div")
    questionCard.className = "question-card"
    questionCard.setAttribute("data-question-id", questionData.id)
    questionCard.setAttribute("data-question-index", index)

    questionCard.innerHTML = `
      <div class="question-header">
        <span class="question-number">Question ${index + 1}</span>
        <div class="question-actions">
          <button type="button" class="btn btn-outline btn-sm move-up-btn" ${index === 0 ? "disabled" : ""}>
            <i data-lucide="chevron-up"></i>
          </button>
          <button type="button" class="btn btn-outline btn-sm move-down-btn" ${index === questions.length - 1 ? "disabled" : ""}>
            <i data-lucide="chevron-down"></i>
          </button>
          <button type="button" class="btn btn-outline btn-sm btn-error remove-btn">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
      
      <div class="form-group">
        <label for="${questionData.id}-context">Story Context (Optional)</label>
        <textarea id="${questionData.id}-context" class="context-input" placeholder="Add a story or context for this question...">${questionData.story_context}</textarea>
      </div>
      
      <div class="form-group">
        <label for="${questionData.id}-question">Question</label>
        <textarea id="${questionData.id}-question" class="question-input" placeholder="Enter your question here..." required>${questionData.question}</textarea>
      </div>
      
      <div class="form-group">
        <label>Answer Options</label>
        <div class="options-container" id="${questionData.id}-options">
          ${questionData.options
            .map(
              (option, optionIndex) => `
    <div class="simple-option-row" data-option-index="${optionIndex}">
      <label class="option-label">
        <input type="radio" name="${questionData.id}-correct" value="${optionIndex}" ${questionData.correct_answer === optionIndex ? "checked" : ""}>
        <span class="option-number">Option ${optionIndex + 1}:</span>
      </label>
      <input type="text" class="simple-option-input" value="${option}" placeholder="Enter option text" data-option-index="${optionIndex}">
      ${questionData.options.length > 2 ? `<button type="button" class="simple-remove-btn" data-option-index="${optionIndex}">Remove</button>` : ""}
    </div>
  `,
            )
            .join("")}
        </div>
        ${questionData.options.length < 6 ? `<button type="button" class="btn btn-outline btn-sm add-option-btn"><i data-lucide="plus"></i> Add Option</button>` : ""}
      </div>
      
      <div class="form-group">
        <label for="${questionData.id}-hint">Hint (Optional)</label>
        <input type="text" id="${questionData.id}-hint" class="hint-input" placeholder="Provide a helpful hint..." value="${questionData.hint}">
      </div>
    `

    // Add event listeners immediately after creating the card
    setupQuestionEventListeners(questionCard, index)

    return questionCard
  }

  function setupQuestionEventListeners(questionCard, questionIndex) {
    console.log(`Setting up event listeners for question ${questionIndex}`)

    // Context textarea
    const contextInput = questionCard.querySelector(".context-input")
    if (contextInput) {
      contextInput.addEventListener("input", (e) => {
        updateQuestion(questionIndex, "story_context", e.target.value)
      })
    }

    // Question textarea
    const questionInput = questionCard.querySelector(".question-input")
    if (questionInput) {
      questionInput.addEventListener("input", (e) => {
        updateQuestion(questionIndex, "question", e.target.value)
      })
    }

    // Hint input
    const hintInput = questionCard.querySelector(".hint-input")
    if (hintInput) {
      hintInput.addEventListener("input", (e) => {
        updateQuestion(questionIndex, "hint", e.target.value)
      })
    }

    // Simple option inputs - new approach
    const simpleOptionInputs = questionCard.querySelectorAll(".simple-option-input")
    simpleOptionInputs.forEach((input) => {
      const optionIndex = Number.parseInt(input.getAttribute("data-option-index"))
      input.addEventListener("input", (e) => {
        console.log(`Simple option input - Question ${questionIndex}, Option ${optionIndex}:`, e.target.value)
        updateQuestionOption(questionIndex, optionIndex, e.target.value)
      })
    })

    // Correct answer radios
    const correctRadios = questionCard.querySelectorAll("input[type='radio']")
    correctRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        if (e.target.checked) {
          const optionIndex = Number.parseInt(e.target.value)
          console.log(`Radio button changed: option ${optionIndex} selected for question ${questionIndex}`)

          // Get the current text value of the selected option
          const optionInput = questionCard.querySelector(
            `input.simple-option-input[data-option-index="${optionIndex}"]`,
          )
          if (optionInput && optionInput.value.trim()) {
            updateQuestion(questionIndex, "correct_answer", optionInput.value.trim())
            console.log(`Correct answer updated to: "${optionInput.value.trim()}"`)
          } else {
            console.warn(`Option ${optionIndex} is empty or not found`)
          }
        }
      })
    })

    // Move up button
    const moveUpBtn = questionCard.querySelector(".move-up-btn")
    if (moveUpBtn) {
      moveUpBtn.addEventListener("click", () => moveQuestionUp(questionIndex))
    }

    // Move down button
    const moveDownBtn = questionCard.querySelector(".move-down-btn")
    if (moveDownBtn) {
      moveDownBtn.addEventListener("click", () => moveQuestionDown(questionIndex))
    }

    // Remove button
    const removeBtn = questionCard.querySelector(".remove-btn")
    if (removeBtn) {
      removeBtn.addEventListener("click", () => removeQuestion(questionIndex))
    }

    // Add option button
    const addOptionBtn = questionCard.querySelector(".add-option-btn")
    if (addOptionBtn) {
      addOptionBtn.addEventListener("click", () => addOption(questionIndex))
    }

    // Remove option buttons - FIXED
    const removeOptionBtns = questionCard.querySelectorAll(".simple-remove-btn")
    removeOptionBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const optionIndex = Number.parseInt(e.target.getAttribute("data-option-index"))
        console.log(`Removing option ${optionIndex} from question ${questionIndex}`)
        removeOption(questionIndex, optionIndex)
      })
    })
  }

  function updateQuestion(index, field, value) {
    console.log(`Updating question ${index}, field ${field}:`, value)
    if (questions[index]) {
      questions[index][field] = value
    }
  }

  function updateQuestionOption(questionIndex, optionIndex, value) {
    console.log(`Updating question ${questionIndex}, option ${optionIndex}:`, value)
    if (questions[questionIndex] && questions[questionIndex].options[optionIndex] !== undefined) {
      questions[questionIndex].options[optionIndex] = value
      console.log(`Updated! Current options for question ${questionIndex}:`, questions[questionIndex].options)
    } else {
      console.error(`Failed to update - Question ${questionIndex} or option ${optionIndex} not found`)
    }
  }

  function addOption(questionIndex) {
    if (questions[questionIndex] && questions[questionIndex].options.length < 6) {
      questions[questionIndex].options.push("")
      refreshQuestionCard(questionIndex)
    }
  }

  function removeOption(questionIndex, optionIndex) {
    console.log(`removeOption called: questionIndex=${questionIndex}, optionIndex=${optionIndex}`)

    if (questions[questionIndex] && questions[questionIndex].options.length > 2) {
      // Remove the specific option
      questions[questionIndex].options.splice(optionIndex, 1)
      console.log(`Removed option ${optionIndex}. New options:`, questions[questionIndex].options)

      // Adjust correct answer if necessary
      if (questions[questionIndex].correct_answer > optionIndex) {
        questions[questionIndex].correct_answer = questions[questionIndex].correct_answer - 1
      } else if (questions[questionIndex].correct_answer === optionIndex) {
        questions[questionIndex].correct_answer = 0 // Reset to first option if deleted option was correct
      }

      refreshQuestionCard(questionIndex)
    }
  }

  function removeQuestion(index) {
    if (questions.length > 1 && confirm("Are you sure you want to remove this question?")) {
      questions.splice(index, 1)
      refreshAllQuestions()
    } else if (questions.length === 1) {
      alert("You must have at least one question in your quiz.")
    }
  }

  function moveQuestionUp(index) {
    if (index > 0) {
      ;[questions[index], questions[index - 1]] = [questions[index - 1], questions[index]]
      refreshAllQuestions()
    }
  }

  function moveQuestionDown(index) {
    if (index < questions.length - 1) {
      ;[questions[index], questions[index + 1]] = [questions[index + 1], questions[index]]
      refreshAllQuestions()
    }
  }

  function refreshQuestionCard(index) {
    const questionsList = document.getElementById("questions-list")
    if (questionsList.children[index]) {
      const oldCard = questionsList.children[index]
      const newCard = createQuestionCard(questions[index], index)
      questionsList.replaceChild(newCard, oldCard)

      if (typeof lucide !== "undefined") {
        lucide.createIcons()
      }
    }
  }

  function refreshAllQuestions() {
    const questionsList = document.getElementById("questions-list")
    questionsList.innerHTML = ""

    questions.forEach((question, index) => {
      question.id = `question-${index}`
      const questionCard = createQuestionCard(question, index)
      questionsList.appendChild(questionCard)
    })

    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  }

  function saveQuiz() {
    const form = document.getElementById("quiz-form")
    if (!form) {
      alert("Quiz form not found")
      return
    }

    // Get form values directly
    const title = document.getElementById("quiz-title")?.value || ""
    const description = document.getElementById("quiz-description")?.value || ""
    const subject = document.getElementById("quiz-subject")?.value || ""
    const level = document.getElementById("quiz-level")?.value || ""
    const backgroundTheme = document.getElementById("quiz-theme")?.value || "default"
    const pointsPerQuestion = Number.parseInt(document.getElementById("quiz-points")?.value) || 10
    const timeLimit = Number.parseInt(document.getElementById("quiz-time")?.value) || 60

    // Validate basic form fields
    if (!title.trim()) {
      alert("Please enter a quiz title")
      return
    }

    if (!description.trim()) {
      alert("Please enter a quiz description")
      return
    }

    if (!subject) {
      alert("Please select a subject")
      return
    }

    if (!level) {
      alert("Please select a level")
      return
    }

    // Validate questions
    if (questions.length === 0) {
      alert("Please add at least one question")
      return
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (!question.question.trim()) {
        alert(`Please enter a question for Question ${i + 1}`)
        return
      }

      const validOptions = question.options.filter((option) => option.trim() !== "")
      if (validOptions.length < 2) {
        alert(`Question ${i + 1} must have at least 2 options`)
        return
      }

      // Check if correct answer is properly set and exists in options
      if (!question.correct_answer || !question.correct_answer.trim()) {
        alert(`Please select a correct answer for Question ${i + 1}`)
        return
      }

      // Verify the correct answer exists in the options
      const correctAnswerExists = question.options.some((option) => option.trim() === question.correct_answer.trim())

      if (!correctAnswerExists) {
        alert(`The correct answer for Question ${i + 1} doesn't match any of the options. Please check your selection.`)
        return
      }
    }

    // Prepare quiz data - FIXED: Use the correct API endpoint
    const quizData = {
      title: title,
      description: description,
      subject: subject,
      level: level,
      background_theme: backgroundTheme,
      points_per_question: pointsPerQuestion,
      time_limit: timeLimit,
      questions: questions.filter((q) => q.question.trim() !== ""),
      published: true,
    }

    if (currentQuizId) {
      quizData.id = currentQuizId
    }

    console.log("Saving quiz data:", quizData)

    // Show loading state
    const saveBtn = document.getElementById("publish-quiz-btn")
    if (saveBtn) {
      const originalText = saveBtn.textContent
      saveBtn.disabled = true
      saveBtn.textContent = "Publishing..."

      // Hide previous status messages
      const successEl = document.getElementById("save-success")
      const errorEl = document.getElementById("save-error")
      if (successEl) successEl.style.display = "none"
      if (errorEl) errorEl.style.display = "none"

      // Send request - FIXED: Use the correct endpoint
      const method = currentQuizId ? "PUT" : "POST"
      const endpoint = "api/quizzes.php" // Changed from quiz-creator.php to quizzes.php

      fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data)
          if (data.success) {
            // Show success message
            if (successEl) successEl.style.display = "flex"

            if (!currentQuizId && data.quiz_id) {
              currentQuizId = data.quiz_id
            }

            setTimeout(() => {
              window.location.href = "quiz.html"
            }, 2000)
          } else {
            // Show error message
            const errorMessageEl = document.getElementById("save-error-message")
            if (errorMessageEl) {
              errorMessageEl.textContent = data.message || "An error occurred while saving the quiz."
            }
            if (errorEl) errorEl.style.display = "flex"
          }
        })
        .catch((error) => {
          // Show error message
          const errorMessageEl = document.getElementById("save-error-message")
          if (errorMessageEl) {
            errorMessageEl.textContent = "A network error occurred."
          }
          if (errorEl) errorEl.style.display = "flex"
          console.error("Error saving quiz:", error)
        })
        .finally(() => {
          // Restore button state
          saveBtn.disabled = false
          saveBtn.textContent = originalText
        })
    }
  }

  function previewQuiz() {
    // Create a preview of the quiz
    const quizData = {
      title: document.getElementById("quiz-title")?.value || "",
      description: document.getElementById("quiz-description")?.value || "",
      subject: document.getElementById("quiz-subject")?.value || "",
      level: document.getElementById("quiz-level")?.value || "",
      background_theme: document.getElementById("quiz-theme")?.value || "default",
      points_per_question: Number.parseInt(document.getElementById("quiz-points")?.value) || 10,
      time_limit: Number.parseInt(document.getElementById("quiz-time")?.value) || 60,
      questions: questions.filter((q) => q.question.trim() !== ""),
    }

    // Store quiz data in sessionStorage for preview
    sessionStorage.setItem("previewQuiz", JSON.stringify(quizData))

    // Open preview in new tab
    window.open("quiz-preview.html", "_blank")
  }

  function loadQuizForEditing(quizId) {
    fetch(`api/quizzes.php?id=${quizId}`) // Changed endpoint
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const quiz = data.data

          // Fill form fields
          const titleEl = document.getElementById("quiz-title")
          const descEl = document.getElementById("quiz-description")
          const subjectEl = document.getElementById("quiz-subject")
          const levelEl = document.getElementById("quiz-level")
          const themeEl = document.getElementById("quiz-theme")
          const pointsEl = document.getElementById("quiz-points")
          const timeEl = document.getElementById("quiz-time")

          if (titleEl) titleEl.value = quiz.title
          if (descEl) descEl.value = quiz.description
          if (subjectEl) subjectEl.value = quiz.subject
          if (levelEl) levelEl.value = quiz.level
          if (themeEl) themeEl.value = quiz.background_theme
          if (pointsEl) pointsEl.value = quiz.points_per_question
          if (timeEl) timeEl.value = quiz.time_limit

          // Load questions
          questions = quiz.questions.map((q, index) => ({
            id: `question-${index}`,
            story_context: q.story_context || "",
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            hint: q.hint || "",
          }))

          // Clear existing questions and add loaded ones
          document.getElementById("questions-list").innerHTML = ""
          refreshAllQuestions()

          // Update page title
          const pageTitleEl = document.querySelector(".page-title")
          if (pageTitleEl) pageTitleEl.textContent = "Edit Quiz"
        } else {
          alert("Failed to load quiz for editing: " + data.message)
          window.location.href = "quiz.html"
        }
      })
      .catch((error) => {
        console.error("Error loading quiz:", error)
        alert("An error occurred while loading the quiz.")
        window.location.href = "quiz.html"
      })
  }

  function updateQuizStats() {
    // You can add code here to update any relevant statistics
    // based on the form field values. For example:
    const pointsPerQuestion = Number.parseInt(document.getElementById("quiz-points")?.value) || 10
    const timeLimit = Number.parseInt(document.getElementById("quiz-time")?.value) || 60

    // Update any display elements with the new values
    // For example:
    // document.getElementById('total-points').textContent = pointsPerQuestion * questions.length;
  }

  // Update stats when form fields change
  const pointsInput = document.getElementById("quiz-points")
  const timeInput = document.getElementById("quiz-time")

  if (pointsInput) {
    pointsInput.addEventListener("input", updateQuizStats)
  }

  if (timeInput) {
    timeInput.addEventListener("input", updateQuizStats)
  }
})

// Quiz creation functionality

// Initialize the quiz creator
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  updateQuestionCounter()
})

function setupEventListeners() {
  // Basic quiz info form
  const quizForm = document.getElementById("quiz-basic-info")
  if (quizForm) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveBasicInfo()
    })
  }

  // Question form
  const questionForm = document.getElementById("question-form")
  if (questionForm) {
    questionForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveCurrentQuestion()
    })
  }

  // Add option button
  const addOptionBtn = document.getElementById("add-option-btn")
  if (addOptionBtn) {
    addOptionBtn.addEventListener("click", addOption)
  }

  // Navigation buttons
  const prevBtn = document.getElementById("prev-question-btn")
  const nextBtn = document.getElementById("next-question-btn")
  const publishBtn = document.getElementById("publish-quiz-btn")

  if (prevBtn) prevBtn.addEventListener("click", previousQuestion)
  if (nextBtn) nextBtn.addEventListener("click", nextQuestion)
  if (publishBtn) publishBtn.addEventListener("click", publishQuiz)
}

function saveBasicInfo() {
  const form = document.getElementById("quiz-basic-info")
  const formData = new FormData(form)

  currentQuiz.title = formData.get("title")
  currentQuiz.description = formData.get("description")
  currentQuiz.subject = formData.get("subject")
  currentQuiz.level = formData.get("level")
  currentQuiz.backgroundTheme = formData.get("background-theme") || "default"
  currentQuiz.pointsPerQuestion = Number.parseInt(formData.get("points-per-question")) || 10
  currentQuiz.timeLimit = Number.parseInt(formData.get("time-limit")) || 60

  console.log("Basic info saved:", currentQuiz)

  // Show success message
  showNotification("Quiz information saved!", "success")

  // Move to questions section
  showQuestionsSection()
}

function showQuestionsSection() {
  const basicInfoSection = document.getElementById("basic-info-section")
  const questionsSection = document.getElementById("questions-section")

  if (basicInfoSection) basicInfoSection.style.display = "none"
  if (questionsSection) questionsSection.style.display = "block"

  // Initialize first question if none exist
  if (currentQuiz.questions.length === 0) {
    addNewQuestion()
  }

  loadQuestion(currentQuestionIndex)
}

function addNewQuestion() {
  const newQuestion = {
    storyContext: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "", // This will store the actual text, not index
    hint: "",
  }

  currentQuiz.questions.push(newQuestion)
  updateQuestionCounter()
}

function loadQuestion(index) {
  if (index < 0 || index >= currentQuiz.questions.length) return

  const question = currentQuiz.questions[index]

  // Load question data into form
  document.getElementById("story-context").value = question.storyContext || ""
  document.getElementById("question-text").value = question.question || ""
  document.getElementById("hint-text").value = question.hint || ""

  // Load options
  const optionsContainer = document.getElementById("options-container")
  optionsContainer.innerHTML = ""

  question.options.forEach((option, optionIndex) => {
    addOptionToDOM(option, optionIndex, question.correctAnswer === option)
  })

  // Ensure at least 2 options
  while (question.options.length < 2) {
    question.options.push("")
    addOptionToDOM("", question.options.length - 1, false)
  }

  updateQuestionCounter()
  updateNavigationButtons()
}

function addOptionToDOM(optionText = "", optionIndex = 0, isCorrect = false) {
  const optionsContainer = document.getElementById("options-container")

  const optionDiv = document.createElement("div")
  optionDiv.className = "option-row"
  optionDiv.setAttribute("data-option-index", optionIndex)

  optionDiv.innerHTML = `
        <div class="option-input-group">
            <input type="radio" 
                   name="correct-answer" 
                   value="${optionIndex}" 
                   id="correct-${optionIndex}"
                   ${isCorrect ? "checked" : ""}>
            <label for="correct-${optionIndex}" class="radio-label">Correct</label>
            <input type="text" 
                   class="option-text-input" 
                   placeholder="Enter answer option" 
                   value="${optionText}"
                   data-option-index="${optionIndex}">
            <button type="button" class="remove-option-btn" onclick="removeOptionFromDOM(${optionIndex})">
                ✕
            </button>
        </div>
    `

  optionsContainer.appendChild(optionDiv)

  // Add event listeners
  const textInput = optionDiv.querySelector(".option-text-input")
  const radioInput = optionDiv.querySelector('input[type="radio"]')

  textInput.addEventListener("input", function () {
    updateOptionText(optionIndex, this.value)
  })

  radioInput.addEventListener("change", function () {
    if (this.checked) {
      setCorrectAnswer(optionIndex)
    }
  })
}

function updateOptionText(optionIndex, newText) {
  if (currentQuiz.questions[currentQuestionIndex]) {
    const question = currentQuiz.questions[currentQuestionIndex]
    const oldText = question.options[optionIndex]

    // Update the option text
    question.options[optionIndex] = newText

    // If this was the correct answer, update the correct answer text too
    if (question.correctAnswer === oldText) {
      question.correctAnswer = newText
    }

    // Update the radio button value to match the text
    const radioInput = document.querySelector(`input[name="correct-answer"][value="${optionIndex}"]`)
    if (radioInput) {
      radioInput.setAttribute("data-text", newText)
    }
  }
}

function setCorrectAnswer(optionIndex) {
  if (currentQuiz.questions[currentQuestionIndex]) {
    const question = currentQuiz.questions[currentQuestionIndex]
    // Store the actual text as the correct answer, not the index
    question.correctAnswer = question.options[optionIndex]
    console.log(`Correct answer set to: "${question.correctAnswer}" (from option ${optionIndex})`)
  }
}

function addOption() {
  const question = currentQuiz.questions[currentQuestionIndex]
  if (question && question.options.length < 6) {
    const newIndex = question.options.length
    question.options.push("")
    addOptionToDOM("", newIndex, false)
    updateOptionIndices()
  }
}

function removeOptionFromDOM(optionIndex) {
  const question = currentQuiz.questions[currentQuestionIndex]
  if (question && question.options.length > 2) {
    const removedOption = question.options[optionIndex]

    // If we're removing the correct answer, clear it
    if (question.correctAnswer === removedOption) {
      question.correctAnswer = ""
    }

    // Remove the option
    question.options.splice(optionIndex, 1)

    // Reload the options display
    loadQuestion(currentQuestionIndex)
  }
}

function updateOptionIndices() {
  const optionRows = document.querySelectorAll(".option-row")
  optionRows.forEach((row, index) => {
    row.setAttribute("data-option-index", index)

    const radioInput = row.querySelector('input[type="radio"]')
    const textInput = row.querySelector(".option-text-input")
    const removeBtn = row.querySelector(".remove-option-btn")

    if (radioInput) {
      radioInput.value = index
      radioInput.id = `correct-${index}`
    }

    if (textInput) {
      textInput.setAttribute("data-option-index", index)
    }

    if (removeBtn) {
      removeBtn.setAttribute("onclick", `removeOptionFromDOM(${index})`)
    }

    const label = row.querySelector(".radio-label")
    if (label) {
      label.setAttribute("for", `correct-${index}`)
    }
  })
}

function saveCurrentQuestion() {
  const question = currentQuiz.questions[currentQuestionIndex]
  if (!question) return

  // Save form data
  question.storyContext = document.getElementById("story-context").value
  question.question = document.getElementById("question-text").value
  question.hint = document.getElementById("hint-text").value

  // Save options and correct answer
  const optionInputs = document.querySelectorAll(".option-text-input")
  question.options = Array.from(optionInputs).map((input) => input.value)

  // Get the correct answer - find which radio is checked and get the corresponding text
  const checkedRadio = document.querySelector('input[name="correct-answer"]:checked')
  if (checkedRadio) {
    const optionIndex = Number.parseInt(checkedRadio.value)
    question.correctAnswer = question.options[optionIndex]
  }

  console.log("Question saved:", question)
  showNotification("Question saved!", "success")
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    saveCurrentQuestion()
    currentQuestionIndex--
    loadQuestion(currentQuestionIndex)
  }
}

function nextQuestion() {
  saveCurrentQuestion()

  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++
    loadQuestion(currentQuestionIndex)
  } else {
    // Add new question
    addNewQuestion()
    currentQuestionIndex = currentQuiz.questions.length - 1
    loadQuestion(currentQuestionIndex)
  }
}

function updateQuestionCounter() {
  const counter = document.getElementById("question-counter")
  if (counter) {
    counter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`
  }
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prev-question-btn")
  const nextBtn = document.getElementById("next-question-btn")

  if (prevBtn) {
    prevBtn.disabled = currentQuestionIndex === 0
  }

  if (nextBtn) {
    nextBtn.textContent = currentQuestionIndex === currentQuiz.questions.length - 1 ? "Add Question" : "Next Question"
  }
}

async function publishQuiz() {
  // Save current question before publishing
  saveCurrentQuestion()

  // Validate quiz
  if (!validateQuiz()) {
    return
  }

  try {
    console.log("Publishing quiz:", currentQuiz)

    const response = await fetch("api/quizzes.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentQuiz),
    })

    const result = await response.json()
    console.log("Publish response:", result)

    if (result.success) {
      showNotification("Quiz published successfully!", "success")
      // Redirect to quiz list or dashboard
      setTimeout(() => {
        window.location.href = "quiz.html"
      }, 2000)
    } else {
      showNotification("Failed to publish quiz: " + result.message, "error")
    }
  } catch (error) {
    console.error("Error publishing quiz:", error)
    showNotification("Error publishing quiz. Please try again.", "error")
  }
}

function validateQuiz() {
  // Check basic info
  if (!currentQuiz.title || !currentQuiz.description || !currentQuiz.subject || !currentQuiz.level) {
    showNotification("Please fill in all basic quiz information.", "error")
    return false
  }

  // Check questions
  if (currentQuiz.questions.length === 0) {
    showNotification("Please add at least one question.", "error")
    return false
  }

  // Validate each question
  for (let i = 0; i < currentQuiz.questions.length; i++) {
    const question = currentQuiz.questions[i]

    if (!question.question.trim()) {
      showNotification(`Question ${i + 1} is missing question text.`, "error")
      return false
    }

    // Check if there are at least 2 non-empty options
    const validOptions = question.options.filter((opt) => opt.trim() !== "")
    if (validOptions.length < 2) {
      showNotification(`Question ${i + 1} needs at least 2 answer options.`, "error")
      return false
    }

    // Check if correct answer is set and valid
    if (!question.correctAnswer || !question.options.includes(question.correctAnswer)) {
      showNotification(`Question ${i + 1} needs a valid correct answer selected.`, "error")
      return false
    }
  }

  return true
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Add to page
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Hide and remove notification
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}
