import { dataLocalStorage } from "./scripts/dataLocalStorage.js";

const btStartQuestions = document.querySelector("#bt_start");
btStartQuestions.addEventListener("click", startQuiz);

//si queremos poder retomar el quizz tenemos que resetear el valor de estas variables
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let questionsData = [];

const printQuestions = document.querySelector(".questions");

const URL = "https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple";

async function startQuiz() {
  document.querySelector("#home").remove();

  try {
    const response = await fetch(URL);
    const json = await response.json();
    questionsData = json.results;
    showQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function showQuestion() {
  const questionData = questionsData[currentQuestionIndex];
  const correctAnswer = questionData.correct_answer;
  const allAnswers = [...questionData.incorrect_answers, correctAnswer];
  allAnswers.sort(() => Math.random() - 0.5);

  const cardElement = document.createElement("div");
  cardElement.setAttribute("class", "card text-center p-4");
  cardElement.innerHTML = `
      <section class="d-flex justify-content-center flex-column gap-4 position-relative">
        <h3 class="fw-bold">${questionData.category}</h3>
        <p class="text-wrap">${questionData.question}</p>
        <div class="questions_grid">
          <a class="d-flex justify-content-center align-items-center btn btn-danger h-100 answer">${allAnswers[0]}</a>
          <a class="d-flex justify-content-center align-items-center btn btn-warning h-100 answer">${allAnswers[1]}</a>
          <a class="d-flex justify-content-center align-items-center btn btn-success h-100 answer">${allAnswers[2]}</a>
          <a class="d-flex justify-content-center align-items-center btn btn-info h-100 answer">${allAnswers[3]}</a>         
        </div>
        <a class="btn btn-secondary fw-bold" id="btnNext">Siguiente</a>
      </section>`;

  printQuestions.innerHTML = "";
  printQuestions.appendChild(cardElement);

  validateAnswer(correctAnswer);
}

function validateAnswer(correctAnswer) {
  const buttons = document.querySelectorAll(".answer");
  const btnNext = document.getElementById("btnNext");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      toggleBtnNext();
    });
  });

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      const selectedButton = document.querySelector(".answer.selected");

      if (selectedButton) {
        if (selectedButton.textContent === correctAnswer) {
          printQuestions.innerHTML += `
            <div class="alert alert-success position-absolute" role="alert">
              <p>This is a success alert—check it out!</p>
            </div>`;
          setTimeout(() => {
            nextQuestion();
          }, 2000);
          correctAnswersCount++;
        } else {
          printQuestions.innerHTML += `
            <div class="alert alert-danger position-absolute" role="alert">
              <p>This is a success alert—check it out!</p>
            </div>`;
          setTimeout(() => {
            nextQuestion();
          }, 2000);
        }

        const nextQuestion = () => {
          currentQuestionIndex++;
          if (currentQuestionIndex < questionsData.length) {
            showQuestion();
          } else {
            endQuiz();
          }
        };
      }
    });
  }
}

function toggleBtnNext() {
  const buttons = document.querySelectorAll(".answer");
  const btnNext = document.getElementById("btnNext");
  const isAnyButtonSelected = buttons.forEach((btn) => btn.classList.contains("selected"));
  if (btnNext) {
    btnNext.disabled = !isAnyButtonSelected;
  }
}

function endQuiz() {
  printQuestions.innerHTML = `
    <article class="card d-flex flex-row">
      <section class="results">
        <div class="right_questions">
          <p>${correctAnswersCount}</p>
        </div>
        <div class="results_line"></div>
        <div class="total_questions">
          <p>10</p>
        </div>
      </section>
      <section class="w-50 card-body right">
        <div class="alignLeft">
          <h3>Aquí van tus resultados!</h3>
          <p>Gracias por participar</p>
        </div>
        <div class="alignCenter">
          <a class="btn btn-secondary fw-bold" href="./index.html">Jugar otra vez</a>
        </div>
      </section>
    </article>
    `;
  dataLocalStorage(correctAnswersCount);
}
