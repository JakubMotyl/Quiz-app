import quizData from "./data.js";

const startQuiz = document.getElementById('startQuiz');
const mainDiv = document.querySelector('.main');

// Starting Values

let step = 0;
let score = 0;
const totalSteps = quizData.length;

// Shuffle Array / Random Function

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Random Questions order

shuffleArray(quizData);

// Start Quiz Button

startQuiz.addEventListener('click', () => {
  mainDiv.style.display = 'none';
  startQuizGame();
});

function startQuizGame() {

  // Create Quiz Container

  const quizContainer = document.createElement('div');
  quizContainer.classList.add('quiz-container');
  document.body.appendChild(quizContainer); // dodajemy quizContainer do DOM

  renderQuestion();

  // Render Qustion Function

  function renderQuestion() {
    const quiz = quizData[step];
    const answers = [
      { text: quiz.answer_1, correct: false },
      { text: quiz.answer_2, correct: false },
      { text: quiz.answer_3, correct: false },
      { text: quiz.answer_correct, correct: true }
    ];

    // Random Answers order

    shuffleArray(answers);

    quizContainer.innerHTML = `
      <div class="container padding__30x0">
        <div class="question__container padding__0x25">
          <div class="question__top">
            <div class="question">
              <p>${quiz.question}</p>
            </div>
            <div class="instruction">
              <p>Answer and get points</p>
            </div>
          </div>
          <div class="progress__container">
            <p><span>Step ${step + 1}</span> of ${quizData.length}</p>
          </div>
        </div>
        <div class="progress__line__container">
          <div id="progressLine" class="progress__line"></div>
        </div>
        <div class="app padding__app">
          <div class="answers__container">
            ${answers.map((answer) => 
              `
              <button class="answer__button " data-correct="${answer.correct}">
                ${answer.text}
              </button>
              `
            ).join('')}
          </div>
          <button id="nextBtn" class="submit__button" disabled>Next</button>
        </div>
      </div>
    `;

    updateProgressLine(step, totalSteps);

    // Answer Buttons Function

    const answerButtons = document.querySelectorAll('.answer__button');
    const nextBtn = document.getElementById('nextBtn');

    answerButtons.forEach(button => {
      
      button.addEventListener('click', () => {

        // Check if Answer is correct or incorrect

        const isCorrect = button.dataset.correct === 'true';

        if (isCorrect) {
          button.classList.add('correct');
          score++;
        } else {
          button.classList.add('incorrect');
        }

        // Disable Answer Buttons after giving an answer

        answerButtons.forEach(btn => {
          btn.disabled = true;
        });

        // Enable Next Button

        nextBtn.disabled = false;
      });
    });

    // Next Button

    nextBtn.addEventListener('click', () => {

      // Next Question or End

      step++;

      if (step < quizData.length) {
        renderQuestion();
      } else {
        quizOver();
      }
    });
  };

  // Update Progress Function

  function updateProgressLine(currentStep, totalSteps) {
    const progressLine = document.getElementById('progressLine');
    const showProgress = ((currentStep + 1) / totalSteps) * 100;
    progressLine.style.width = `${showProgress}%`;
  }

  // Quiz Over Function

  function quizOver() {
    quizContainer.style.display = 'none';

    const quizOver = document.createElement('div');
    quizOver.innerHTML = `
      <div class="main__end">
        <div class="main__score">
          <h2>Congratulations!</h2>
          <h3>You have completed the quiz!</h3>
        </div>
        <div class="title__score">
          <p>Your score is: <span class="score__span">${score}</span></p>
        </div>
        <div class="start-again__button">
          <button id="startAgain">Start Again</button>
        </div>
      </div>
    `;

    document.body.appendChild(quizOver);

    // Start Again

    const startAgain = document.getElementById('startAgain');

    startAgain.addEventListener('click', () => {

      // Reset values

      quizOver.remove();
      quizContainer.remove();

      step = 0;
      score = 0;

      mainDiv.style.display = 'block';

    });
  }
}
