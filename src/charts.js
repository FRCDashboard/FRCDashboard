var chart = new Chart(document.getElementById("armpos-chart"), {
  type: "scatter",
  data: {
    datasets: [
      {
        label: "Target Position",
        data: []
      },
      {
        label: "Current Position",
        data: []
      }
    ]
  }
});

chart.canvas.parentNode.style.width = "33vw";

NetworkTables.addKeyListener("/SmartDashboard/armPosition", (key, value) => {
  let time = new Date().getTime();
  console.log(time + ": " + value);
  chart.data.datasets[1].data.push({ x: time, y: value });
  chart.update();
});

NetworkTables.addKeyListener("/SmartDashboard/target", (key, value) => {
  let time = new Date().getTime();
  console.log(time + ": " + value);
  chart.data.datasets[1].data.push({ x: time, y: value });
  chart.update();
});
