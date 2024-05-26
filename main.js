const btStartQuestions = document.querySelector("#bt_start");
const printQustions = document.querySelector(".questions");

const URL = "https://opentdb.com/api.php?amount=20&difficulty=medium&type=multiple";

const API = fetch(URL);

function checkApi() {
  btStartQuestions.parentElement.style.display = "none";

  API.then((res) => res.json())
    .then((json) => {
      const { results } = json;

      results.forEach((items) => {
        printQustions.innerHTML += `
          <p>${items.question}</p>
        `;
      });
    })
    .catch((err) => console.log(err));
}

btStartQuestions.addEventListener("click", checkApi);
