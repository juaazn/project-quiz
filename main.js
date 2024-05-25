const URL = "https://opentdb.com/api.php?amount=20&difficulty=medium&type=multiple";

const options = {
  method: "GET",
  mode: "cors",
  cache: "no-cache",
  headers: {
    "Content-Type": "application/json",
  },
};

fetch(URL, options)
  .then((res) => res.json())
  .then((json) => {
    const { results } = json;
    console.log(results);
  })
  .catch((err) => console.log(err));
