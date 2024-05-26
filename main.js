const btStartQuestions = document.querySelector("#bt_start");
btStartQuestions.addEventListener("click", checkApi);

const printQuestions = document.querySelector(".questions");

const URL = "https://opentdb.com/api.php?amount=20&difficulty=medium&type=multiple";

function checkApi(event) {
  event.preventDefault()
  btStartQuestions.parentElement.style.display = "none";
  
  fetch(URL)
  .then((res) => res.json())
  .then((json) => {
    const { results } = json;

    results.forEach((item) => {
      //recoger en array allAnswers las respuestas correctas e incorrectas
      const allAnswers = [...item.incorrect_answers, item.correct_answer];
      //randomiza posición
      allAnswers.sort(() => Math.random() - 0.5);

      //creo la carta para agregar la pregunta
      const cardElement = document.createElement('div');
      cardElement.classList.add('card, text-center mb-3');
      cardElement.classList.add('text-center');
      cardElement.classList.add('mb-3');
      cardElement.style.width = '18rem';
  
      cardElement.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Category: ${item.category}</h5>
          <p class="card-text">${item.question}</p>`

      //recorro array de respuestas y creo un botón por cada una de ellas
      allAnswers.forEach(answer => {
        cardElement.innerHTML += `<a href="#" class="btn btn-primary">${answer}</a>`;
      });

      //añado el boton siguiente
      cardElement.innerHTML += `<a href="#" class="btn btn-secondary" id="btnNext">Siguiente</a>
        </div>`;
      
      //se agrega la carta           
      printQuestions.appendChild(cardElement);
  
      //recogemos el boton siguiente de la carta y le añadimos evento.
      //cuando se clique se eliminará la carta
      const btnNext = cardElement.querySelector('#btnNext');
      btnNext.addEventListener('click',onNext);
      function onNext(event) {
        event.preventDefault()
        printQuestions.removeChild(cardElement);
        //comprobar respuesta y pasar a siguiente pregunta
      }
    });
  })
  .catch((err) => console.log(err));
}