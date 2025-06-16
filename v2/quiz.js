document.addEventListener('DOMContentLoaded', function() {
  // Quiz data
  const quizData = {
    title: "Basic Algebra Quiz",
    description: "Test your knowledge of basic algebraic concepts",
    questions: [
      {
        id: 1,
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: "x = 4",
        hint: "Subtract 5 from both sides, then divide by 2."
      },
      {
        id: 2,
        question: "If y = 3x - 7, what is the value of y when x = 5?",
        options: ["y = 8", "y = 10", "y = 12", "y = 15"],
        correctAnswer: "y = 8",
        hint: "Substitute x = 5 into the equation y = 3x - 7."
      },
      {
        id: 3,
        question: "Simplify: 3(2x - 4) + 5",
        options: ["6x - 12 + 5", "6x - 7", "6x - 12", "6x - 17"],
        correctAnswer: "6x - 7",
        hint: "First distribute the 3, then combine like terms."
      },
      {
        id: 4,
        question: "Solve for x: 4(x - 2) = 20",
        options: ["x = 5", "x = 6", "x = 7", "x = 8"],
        correctAnswer: "x = 7",
        hint: "First divide both sides by 4, then add 2 to both sides."
      },
      {
        id: 5,
        question: "If 2x + 3y = 12 and y = 2, what is the value of x?",
        options: ["x = 2", "x = 3", "x = 4", "x = 5"],
        correctAnswer: "x = 3",
        hint: "Substitute y = 2 into the equation 2x + 3y = 12, then solve for x."
      }
    ]
  };

  // Quiz elements
  const questionNumber = document.getElementById('question-number');
  const questionText = document.getElementById('question-text');
  const quizOptions = document.getElementById('quiz-options');
  const submitButton = document.getElementById('submit-button');
  const nextButton = document.getElementById('next-button');
  const resultMessage = document.getElementById('result-message');
  const quizProgress = document.getElementById('quiz-progress');
  const quizCard = document.getElementById('quiz-card');
  const quizResults = document.getElementById('quiz-results');
  const scoreText = document.getElementById('score-text');
  const scorePercentage = document.getElementById('score-percentage');
  const scoreProgress = document.getElementById('score-progress');
  const scoreMessage = document.getElementById('score-message');
  const restartButton = document.getElementById('restart-button');
  const hintButton = document.getElementById('hint-button');
  const hintModal = document.getElementById('hint-modal');
  const closeHint = document.getElementById('close-hint');
  const hintText = document.getElementById('hint-text');

  // Quiz state
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedAnswer = null;

  // Initialize quiz
  function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    showQuestion(currentQuestionIndex);
    quizCard.classList.remove('hidden');
    quizResults.classList.add('hidden');
  }

  // Show question
  function showQuestion(index) {
    const question = quizData.questions[index];
    questionNumber.textContent = `Question ${index + 1} of ${quizData.questions.length}`;
    questionText.textContent = question.question;
    hintText.textContent = question.hint;
    
    // Update progress bar
    const progress = ((index + 1) / quizData.questions.length) * 100;
    quizProgress.style.width = `${progress}%`;
    
    // Clear previous options
    quizOptions.innerHTML = '';
    
    // Add options
    question.options.forEach((option, i) => {
      const radioItem = document.createElement('div');
      radioItem.className = 'radio-item';
      
      const input = document.createElement('input');
      input.type = 'radio';
      input.id = `option-${i}`;
      input.name = 'quiz-answer';
      input.value = option;
      
      const label = document.createElement('label');
      label.htmlFor = `option-${i}`;
      label.textContent = option;
      
      radioItem.appendChild(input);
      radioItem.appendChild(label);
      quizOptions.appendChild(radioItem);
      
      input.addEventListener('change', function() {
        selectedAnswer = this.value;
      });
    });
    
    // Reset UI state
    submitButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    resultMessage.classList.add('hidden');
    
    // Enable all radio buttons
    const radioButtons = document.querySelectorAll('input[name="quiz-answer"]');
    radioButtons.forEach(radio => {
      radio.disabled = false;
      radio.checked = false;
    });
    
    selectedAnswer = null;
  }

  // Submit answer
  function submitAnswer() {
    if (!selectedAnswer) return;
    
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      score++;
      resultMessage.innerHTML = '<i data-lucide="check-circle"></i><span>Correct! Well done.</span>';
      resultMessage.className = 'result-message correct';
    } else {
      resultMessage.innerHTML = `<i data-lucide="x-circle"></i><span>Incorrect. The correct answer is: ${currentQuestion.correctAnswer}</span>`;
      resultMessage.className = 'result-message incorrect';
    }
    
    resultMessage.classList.remove('hidden');
    
    // Disable radio buttons
    const radioButtons = document.querySelectorAll('input[name="quiz-answer"]');
    radioButtons.forEach(radio => {
      radio.disabled = true;
    });
    
    // Show next button
    submitButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
    
    // Initialize Lucide icons for the result message
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        icons: {
          'check-circle': true,
          'x-circle': true
        },
        attrs: {
          class: 'h-5 w-5'
        }
      });
    }
  }

  // Next question
  function nextQuestion() {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
    } else {
      showResults();
    }
  }

  // Show results
  function showResults() {
    quizCard.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    const percentage = Math.round((score / quizData.questions.length) * 100);
    
    scoreText.textContent = `You scored ${score} out of ${quizData.questions.length}`;
    scorePercentage.textContent = `${percentage}%`;
    scoreProgress.style.width = `${percentage}%`;
    
    if (score === quizData.questions.length) {
      scoreMessage.innerHTML = '<i data-lucide="check-circle"></i><span>Perfect score! Excellent work!</span>';
      scoreMessage.style.color = 'rgb(22, 163, 74)';
    } else if (score >= quizData.questions.length / 2) {
      scoreMessage.innerHTML = '<i data-lucide="alert-circle"></i><span>Good job! Keep practicing to improve.</span>';
      scoreMessage.style.color = 'rgb(217, 119, 6)';
    } else {
      scoreMessage.innerHTML = '<i data-lucide="alert-circle"></i><span>You might need more practice. Try again!</span>';
      scoreMessage.style.color = 'rgb(220, 38, 38)';
    }
    
    // Initialize Lucide icons for the score message
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        icons: {
          'check-circle': true,
          'alert-circle': true
        },
        attrs: {
          class: 'h-5 w-5'
        }
      });
    }
  }

  // Event listeners
  if (submitButton) {
    submitButton.addEventListener('click', submitAnswer);
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', nextQuestion);
  }
  
  if (restartButton) {
    restartButton.addEventListener('click', initQuiz);
  }
  
  if (hintButton && hintModal && closeHint) {
    hintButton.addEventListener('click', function() {
      hintModal.classList.add('active');
    });
    
    closeHint.addEventListener('click', function() {
      hintModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    hintModal.addEventListener('click', function(e) {
      if (e.target === hintModal) {
        hintModal.classList.remove('active');
      }
    });
  }
  
  // Initialize quiz if on quiz page
  if (questionText) {
    initQuiz();
  }
});