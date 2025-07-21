
// === Load Questions from external file (questions.js must be included in HTML) ===
// allQuestions is already loaded globally

let selectedDept = localStorage.getItem('selectedDept');
if (!selectedDept) {
  window.location.href = "index.html"; // fallback to welcome screen
}

let questionsPool = allQuestions[selectedDept.toLowerCase()];
let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Get 20 random questions
function getRandomQuestions(pool, num = 20) {
  const shuffled = shuffleArray([...pool]);
  return shuffled.slice(0, num);
}

function loadQuestions() {
  quizQuestions = getRandomQuestions(questionsPool);
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  showQuestion();
}

function showQuestion() {
  const q = quizQuestions[currentQuestion];
  document.getElementById("question-number").textContent = \`Question \${currentQuestion + 1} of \${quizQuestions.length}\`;
  document.getElementById("question-text").textContent = q.question;

  const optionsHTML = q.options.map((opt, i) => \`
    <button class="btn btn-outline-primary btn-block option" onclick="selectOption(this)">\${opt}</button>
  \`).join("");
  document.getElementById("options").innerHTML = optionsHTML;

  startTimer();
  updateNavButtons();
}

function selectOption(button) {
  const selected = button.textContent;
  const correct = quizQuestions[currentQuestion].answer;
  userAnswers[currentQuestion] = { selected, correct };

  if (selected === correct) {
    score++;
  }

  // Disable all options after selection
  const allOptions = document.querySelectorAll('.option');
  allOptions.forEach(opt => {
    opt.disabled = true;
    if (opt.textContent === correct) opt.classList.add("btn-success");
    else if (opt.textContent === selected) opt.classList.add("btn-danger");
  });
}

function nextQuestion() {
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    showQuestion();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function finishQuiz() {
  localStorage.setItem('score', score);
  localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
  window.location.href = "result.html";
}

function updateNavButtons() {
  document.getElementById("prev-btn").disabled = currentQuestion === 0;
  document.getElementById("next-btn").disabled = currentQuestion === quizQuestions.length - 1;
}

let timer;
let timePerQuestion = 30;
function startTimer() {
  clearInterval(timer);
  let timeLeft = timePerQuestion;
  document.getElementById("timer").textContent = \`\${timeLeft}s\`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = \`\${timeLeft}s\`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

window.onload = loadQuestions;
