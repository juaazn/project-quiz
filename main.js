import { dataLocalStorage } from "./scripts/dataLocalStorage.js";

const btStartQuestions = document.querySelector("#bt_start");
btStartQuestions.addEventListener("click", startQuiz);

//si queremos poder retomar el quizz tenemos que resetear el valor de estas variables
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let questionsData = [];

const printQuestions = document.querySelector(".questions");

const URL = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";

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
      <section class="d-flex justify-content-center flex-column gap-4">
        <h3 class="fw-bold">${questionData.category}</h3>
        <p class="text-wrap">${questionData.question}</p>
        <div class="questions_grid">
          ${allAnswers
            .map(
              (answer) =>
                `<a class="d-flex justify-content-center align-items-center btn btn-success h-100">${answer}</a>`,
            )
            .join("")}
        </div>
        <a class="btn btn-secondary fw-bold" id="btnNext">Siguiente</a>
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
  printQuestions.innerHTML = `
    <article class="card d-flex flex-row gap-5">
      <section class="results">
        <div class="right_questions">
          <p>${correctAnswersCount}</p>
        </div>
        <div class="results_line"></div>
        <div class="total_questions">
          <p>10</p>
        </div>
      </section>
      <section class="w-50">
        <h3>Aquí van tus resultados!</h3>
        <p>Esto puede ser un texto personalizadode la puntuación</p>
        <button type="button">Jugar otra vez</button>
      </section>
    </article>
    `;
  dataLocalStorage(correctAnswersCount);

  printQuestions.innerHTML = `<p>¡Fin del cuestionario!</p>
    <p>Respuestas correctas: ${correctAnswersCount}</p>`;

  {
    /* <div class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="..." class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div> */
  }
}
