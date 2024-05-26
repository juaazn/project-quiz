const URL = "https://opentdb.com/api.php?amount=20&difficulty=medium&type=multiple";

fetch(URL)
  .then((res) => res.json())
  .then((json) => {
    const { results } = json;
    console.log(results);
  })
  .catch((err) => console.log(err));
