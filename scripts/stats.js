const dataScore = JSON.parse(localStorage.getItem("scoreData")) || [];

const options = {
  series: [
    {
      name: "Scores",
      data: dataScore.map((element) => element.score),
    },
  ],
  chart: {
    height: 350,
    type: "line",
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  title: {
    text: "Your Stats",
    align: "left",
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: dataScore.map((element) => element.date),
  },
};

const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
