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
          <div class="option-group" data-option-index="${optionIndex}">
            <input type="radio" 
                   name="${questionData.id}-correct" 
                   value="${optionIndex}" 
                   class="option-radio" 
                   id="${questionData.id}-radio-${optionIndex}"
                   ${questionData.correct_answer === optionIndex ? "checked" : ""}>
            <input type="text" 
                   class="option-input" 
                   placeholder="Option ${optionIndex + 1}" 
                   value="${option}" 
                   data-question-index="${index}" 
                   data-option-index="${optionIndex}">
            ${questionData.options.length > 2 ? `<button type="button" class="btn btn-outline btn-sm btn-error remove-option-btn" data-option-index="${optionIndex}"><i data-lucide="x"></i></button>` : ""}
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

    // Option inputs - Simplified approach
    const optionInputs = questionCard.querySelectorAll(".option-input")
    optionInputs.forEach((input, optionIndex) => {
      // Clear any existing listeners
      const newInput = input.cloneNode(true)
      input.parentNode.replaceChild(newInput, input)

      // Add event listener to the new input
      newInput.addEventListener("input", (e) => {
        const value = e.target.value
        console.log(`Option ${optionIndex} changed to: "${value}"`)
        if (questions[questionIndex] && questions[questionIndex].options) {
          questions[questionIndex].options[optionIndex] = value
          console.log(`Updated question ${questionIndex} options:`, questions[questionIndex].options)
        }
      })

      // Also handle paste events
      newInput.addEventListener("paste", (e) => {
        setTimeout(() => {
          const value = e.target.value
          if (questions[questionIndex] && questions[questionIndex].options) {
            questions[questionIndex].options[optionIndex] = value
          }
        }, 10)
      })
    })

    // Correct answer radios - Fixed approach
    const correctRadios = questionCard.querySelectorAll(".option-radio")
    correctRadios.forEach((radio, optionIndex) => {
      radio.addEventListener("change", (e) => {
        if (e.target.checked) {
          console.log(`Correct answer set to option ${optionIndex} for question ${questionIndex}`)
          updateQuestion(questionIndex, "correct_answer", optionIndex)

          // Ensure only this radio is checked
          correctRadios.forEach((otherRadio, otherIndex) => {
            if (otherIndex !== optionIndex) {
              otherRadio.checked = false
            }
          })
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

    // Remove option buttons
    const removeOptionBtns = questionCard.querySelectorAll(".remove-option-btn")
    removeOptionBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const optionIndex = Number.parseInt(e.target.closest("button").dataset.optionIndex)
        removeOption(questionIndex, optionIndex)
      })
    })
  }

  function updateQuestion(index, field, value) {
    console.log(`Updating question ${index}, field ${field}:`, value)
    if (questions[index]) {
      questions[index][field] = value
      console.log(`Question ${index} updated:`, questions[index])
    }
  }

  function addOption(questionIndex) {
    if (questions[questionIndex] && questions[questionIndex].options.length < 6) {
      questions[questionIndex].options.push("")
      refreshQuestionCard(questionIndex)
    }
  }

  function removeOption(questionIndex, optionIndex) {
    if (questions[questionIndex] && questions[questionIndex].options.length > 2) {
      questions[questionIndex].options.splice(optionIndex, 1)

      // Adjust correct answer if necessary
      if (questions[questionIndex].correct_answer >= optionIndex) {
        questions[questionIndex].correct_answer = Math.max(0, questions[questionIndex].correct_answer - 1)
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

    // Debug: Log current questions state
    console.log("Current questions before validation:", questions)

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      console.log(`Validating question ${i + 1}:`, question)

      if (!question.question.trim()) {
        alert(`Please enter a question for Question ${i + 1}`)
        return
      }

      // Filter out empty options and count valid ones
      const validOptions = question.options.filter((option) => option && option.trim() !== "")
      console.log(`Question ${i + 1} valid options:`, validOptions)

      if (validOptions.length < 2) {
        alert(
          `Question ${i + 1} must have at least 2 non-empty options. Currently has ${validOptions.length} valid options.`,
        )
        console.log(`Question ${i + 1} all options:`, question.options)
        return
      }

      // Check if the correct answer points to a valid option
      const correctAnswerOption = question.options[question.correct_answer]
      if (!correctAnswerOption || !correctAnswerOption.trim()) {
        alert(`Please select a valid correct answer for Question ${i + 1}. The selected option is empty.`)
        return
      }
    }

    // Prepare quiz data - clean up empty options
    const cleanedQuestions = questions.map((q) => ({
      ...q,
      options: q.options.filter((option) => option && option.trim() !== ""),
    }))

    const quizData = {
      title: title,
      description: description,
      subject: subject,
      level: level,
      background_theme: backgroundTheme,
      points_per_question: pointsPerQuestion,
      time_limit: timeLimit,
      questions: cleanedQuestions,
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

      // Send request
      const method = currentQuizId ? "PUT" : "POST"
      fetch("api/quiz-creator.php", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      })
        .then((response) => response.json())
        .then((data) => {
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
    fetch(`api/quiz-creator.php?id=${quizId}`)
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
