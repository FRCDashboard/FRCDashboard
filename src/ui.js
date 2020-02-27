var currentTime = 0;
var targetShooterSpeed = 0;
var rpmError = 300;

NetworkTables.addKeyListener("/SmartDashboard/robot/time", (key, value) => {
  // This is an example of how a dashboard could display the remaining time in a match.
  // We assume here that value is an integer representing the number of seconds left.
  var timer = document.getElementById("timer");
  currentTime = value;
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

const frontEndUpdate = (key, id) => {
  console.log(
    `Setting up NT Key: %c${key}%c to bind on element ID: %c${id}`,
    "color: blue; font-weight: bold;",
    "color: inherit; font-weight: normal;",
    "color: red; font-weight: bold"
  );
  NetworkTables.addKeyListener(key, (k, val) => {
    console.log(k, val);
    document.getElementById(id).textContent = "" + val;
  });
};
NetworkTables.addKeyListener("/FMSInfo/MatchType", (key, value) => {
  const match_types = {
    0: "Non-Field Match : ",
    1: "Practice : ",
    2: "Qualification : ",
    3: "Elimination : "
  };
  var el = document.getElementById("match-type");
  el.textContent = match_types[value];
});

NetworkTables.addKeyListener(
  "/SmartDashboard/shooterMotorSpeed",
  (key, value) => {
    document.getElementById("shooter-speed").textContent = value;
    var bar = document.getElementById("shooter-speed-bar");
    bar.value = value;
    bar.classList.toggle(
      "is-danger",
      Math.abs(value + rpmError) < Math.abs(targetShooterSpeed)
    );
  }
);

NetworkTables.addKeyListener(
  "/SmartDashboard/shooterSpeedTarget",
  (key, value) => {
    targetShooterSpeed = value;
    var bar = document.getElementById("shooter-target-speed-bar");
    bar.value = value;
    document.getElementById("shooter-target-speed").textContent = value;
  }
);

NetworkTables.addKeyListener("/components/shooter/rpm_error", (key, value) => {
  rpmError = value;
});

NetworkTables.addKeyListener("/limelight/tv", (key, value) => {
  var tag = document.getElementById("ll-targets-found");
  tag.classList.toggle("is-black", value == 0);
  tag.classList.toggle("is-success", value == 1);
});

frontEndUpdate("/FMSInfo/EventName", "event-name");
frontEndUpdate("/FMSInfo/MatchNumber", "match-number");
frontEndUpdate("/FMSInfo/GameSpecificData", "game-data");
frontEndUpdate("/limelight/tx", "ll-x-offset");
frontEndUpdate("/limelight/ty", "ll-y-offset");
