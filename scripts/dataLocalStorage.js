export function dataLocalStorage(finalyScore) {
  const date = new Date();
  const today = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const newEntry = {
    date: today,
    score: finalyScore,
  };

  const dataScore = JSON.parse(localStorage.getItem("scoreData")) || [];

  const existingDate = dataScore.find((item) => item.date === today);

  if (existingDate) {
    existingDate.score += finalyScore;
  } else {
    dataScore.push(newEntry);
  }

  localStorage.setItem("scoreData", JSON.stringify(dataScore));
}
