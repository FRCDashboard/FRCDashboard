NetworkTables.addKeyListener("/SmartDashboard/robot/time", (key, value) => {
  // This is an example of how a dashboard could display the remaining time in a match.
  // We assume here that value is an integer representing the number of seconds left.
  var timer = document.getElementById("timer");
  timer.innerHTML =
    value < 0
      ? "0:00"
      : Math.floor(value / 60) +
        ":" +
        (value % 60 < 10 ? "0" : "") +
        Math.floor(value % 60);
  timer.classList.toggle("endgame", value <= 30);
});

NetworkTables.addKeyListener("/SmartDashboard/robot/auton", (key, value) => {
  var timer = document.getElementById("timer");
  timer.classList.toggle("auton", value);
});
