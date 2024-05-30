import { dataLocalStorage } from "./scripts/dataLocalStorage.js";

const btStartQuestions = document.querySelector("#bt_start");
btStartQuestions.addEventListener("click", startQuiz);

//si queremos poder retomar el quizz tenemos que resetear el valor de estas variables
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let questionsData = [];

const printQuestions = document.querySelector(".questions");

const URL = "https://opentdb.com/api.php?amount=20&difficulty=medium&type=multiple";

async function startQuiz() {
  document.querySelector("#home").remove();

  try {
    const response = await fetch(URL);
    const json = await response.json();
    //nº de preguntas que contendrá el cuestionario
    questionsData = json.results.slice(0, 10);
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
  cardElement.setAttribute("class", "card text-center mb-3");
  cardElement.innerHTML = `
      <section>
        <h5 class="card-title">${questionData.category}</h5>
        <p class="card-text">${questionData.question}</p>
        <div class="questions_grid">
          ${allAnswers
            .map(
              (answer) =>
                `<a class="d-flex justify-content-center align-items-center btn btn-success h-100">${answer}</a>`,
            )
            .join("")}
        </div>
        <a class="btn btn-secondary" id="btnNext">Siguiente</a>
      </section>`;

  printQuestions.innerHTML = "";
  printQuestions.appendChild(cardElement);

  validateAnswer(correctAnswer);
}

function validateAnswer(correctAnswer) {
  const buttons = document.querySelectorAll(".btn-success");
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
      const selectedButton = document.querySelector(".btn-success.selected");
      if (selectedButton) {
        if (selectedButton.textContent === correctAnswer) {
          alert("¡Correcto!");
          correctAnswersCount++;
        } else {
          alert("¡Incorrecto!");
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questionsData.length) {
          showQuestion();
        } else {
          endQuiz();
        }
      }
    });
  }
}

function toggleBtnNext() {
  const buttons = document.querySelectorAll(".btn-success");
  const btnNext = document.getElementById("btnNext");
  const isAnyButtonSelected = buttons.forEach((btn) => btn.classList.contains("selected"));
  if (btnNext) {
    btnNext.disabled = !isAnyButtonSelected;
  }
}

function endQuiz() {
  printQuestions.innerHTML = `<p>¡Fin del cuestionario!</p>
    <p>Respuestas correctas: ${correctAnswersCount}</p>`;
  dataLocalStorage(correctAnswersCount);
}
