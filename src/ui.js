// Reload on capital R
window.addEventListener("keypress", function(ev) {
    console.log(ev);
    if (ev.key === "R")
        location.reload(true);
});

/*
 * Define UI Elements
 */
let ui = {
    misc: {
        pdp: {
            batteryVoltageChart: document.getElementById('batteryVoltageChart'),
            batteryVoltage: document.getElementById('batteryVoltage')
        },
        timer: document.getElementById('timer'),
        robotState: document.getElementById('robotState').firstChild,
        autoSelect: document.getElementById('autoSelect')
    },
    drive: {
        voltages: {
            voltageChart: document.getElementById('drivetrainVoltageChart'),
            leftVoltage: document.getElementById('leftDrivetrainVoltage'),
            rightVoltage: document.getElementById('rightDrivetrainVoltage')
        },
        currents: {
            currentChart: document.getElementById('drivetrainCurrentChart'),
            leftCurrent: document.getElementById('leftDrivetrainCurrent'),
            rightCurrent: document.getElementById('rightDrivetrainCurrent')
        },
        encoders: {
            leftEncoder: document.getElementById('leftDrivetrainEncoder'),
            rightEncoder: document.getElementById('rightDrivetrainEncoder')
        },
        gyro: {
            container: document.getElementById('gyro'),
            val: 0,
            offset: 0,
            visualVal: 0,
            gyroDial: document.getElementById('gyroDial'),
            gyroNumber: document.getElementById('gyroNumber')
        }
    },
    elevator: {
        currentChart: document.getElementById('elevatorCurrentChart'),
        current: document.getElementById('elevatorCurrent')
    },
    claw: {
    },
    hanger: {}
};

/**
 * Drivetrain Listeners
 */

// Gyro rotation
const updateGyro = (key, value) => {
  ui.drive.gyro.val = value;
  ui.drive.gyro.visualVal = Math.floor(ui.drive.gyro.val - ui.drive.gyro.offset);
  if (ui.drive.gyro.visualVal < 0) {
    ui.drive.gyro.visualVal += 360;
  }
  ui.drive.gyro.gyroDial.style.transform = `rotate(${ui.drive.gyro.visualVal}deg)`;
  ui.drive.gyro.gyroNumber.innerHTML = `${ui.drive.gyro.visualVal}º`;
};
NetworkTables.addKeyListener('/SmartDashboard/drive/gyro/angle', updateGyro);

// Drivetrain Voltage
const drivetrainVoltageChart = new SmoothieChart({
  tooltip: true,
  maxValue: 14,
  minValue: -14,
});
drivetrainVoltageChart.streamTo(ui.drive.voltages.voltageChart, 0);
const leftVoltageLine = new TimeSeries();
const rightVoltageLine = new TimeSeries();
drivetrainVoltageChart.addTimeSeries(leftVoltageLine, {
  strokeStyle: 'blue',
  lineWidth: 3,
});
drivetrainVoltageChart.addTimeSeries(rightVoltageLine, {
  strokeStyle: 'red',
  lineWidth: 3,
});
NetworkTables.addKeyListener('/SmartDashboard/drive/voltages/leftvoltage', (key, value) => {
  leftVoltageLine.append(new Date().getTime(), value);
  ui.drive.voltages.leftVoltage.innerHTML = `${value.toFixed(2)} v`;
});
NetworkTables.addKeyListener('/SmartDashboard/drive/voltages/rightvoltage', (key, value) => {
  rightVoltageLine.append(new Date().getTime(), value);
  ui.drive.voltages.rightVoltage.innerHTML = `${value.toFixed(2)} v`;
});

// Drivetrain Current
const drivetrainCurrentChart = new SmoothieChart({
  tooltip: true,
  maxValue: 40,
  minValue: 0,
});
drivetrainCurrentChart.streamTo(ui.drive.currents.currentChart, 0);
const leftCurrentLine = new TimeSeries();
const rightCurrentLine = new TimeSeries();
drivetrainCurrentChart.addTimeSeries(leftCurrentLine, {
  strokeStyle: 'blue',
  lineWidth: 3,
});
drivetrainCurrentChart.addTimeSeries(rightCurrentLine, {
  strokeStyle: 'red',
  lineWidth: 3,
});
NetworkTables.addKeyListener('/SmartDashboard/drive/currents/leftcurrent', (key, value) => {
  leftCurrentLine.append(new Date().getTime(), value),
  ui.drive.currents.leftCurrent.innerHTML = `${value.toFixed(2)} a`;
});
NetworkTables.addKeyListener('/SmartDashboard/drive/currents/rightcurrent', (key, value) => {
  rightCurrentLine.append(new Date().getTime(), value),
  ui.drive.currents.rightCurrent.innerHTML = `${value.toFixed(2)} a`;
});

// Drivetrain Encoders
NetworkTables.addKeyListener('/SmartDashboard/drive/encoders/leftencoder', (key, value) => {
  console.log(value);
  ui.drive.encoders.leftEncoder.innerHTML = `${value}`;
});
NetworkTables.addKeyListener('/SmartDashboard/drive/encoders/rightencoder', (key, value) => {
  console.log(value);
  ui.drive.encoders.rightEncoder.innerHTML = `${value}`;
});


/**
 * Elevator Listeners
 */

// Elevator Current
const elevatorCurrentChart = new SmoothieChart({
  tooltip: true,
  maxValue: 15,
  minValue: 0,
});
elevatorCurrentChart.streamTo(ui.elevator.currentChart, 0);
const elevatorCurrentLine = new TimeSeries();
elevatorCurrentChart.addTimeSeries(elevatorCurrentLine, {
  strokeStyle: 'green',
  lineWidth: 3,
});
NetworkTables.addKeyListener('/SmartDashboard/elevator/current', (key, value) => {
  elevatorCurrentLine.append(new Date().getTime(), value);
  ui.elevator.current.innerHTML = `${value.toFixed(2)} a`;
});


/**
 * Misc Listeners
 */

// Battery Voltage
const batteryVoltageChart = new SmoothieChart({
  tooltip: true,
  maxValue: 14,
  minValue: 0,
});
batteryVoltageChart.streamTo(ui.misc.pdp.batteryVoltageChart, 0);
const batteryVoltageLine = new TimeSeries();
batteryVoltageChart.addTimeSeries(batteryVoltageLine, {
  strokeStyle: 'green',
  lineWidth: 3,
});
NetworkTables.addKeyListener('/SmartDashboard/misc/pdp/batteryvoltage', (key, value) => {
  batteryVoltageLine.append(new Date().getTime(), value);
  ui.misc.pdp.batteryVoltage.innerHTML = `${value.toFixed(2)} v`;
});


NetworkTables.addKeyListener('/robot/time', (key, value) => {
  // This is an example of how a dashboard could display the remaining time in a match.
  // We assume here that value is an integer representing the number of seconds left.
  ui.misc.timer.innerHTML = value < 0 ? '0:00' : `${Math.floor(value / 60)}:${value % 60 < 10 ? '0' : ''}${value % 60}`;
});

// Reset gyro value to 0 on click
ui.drive.gyro.container.addEventListener('click', () => {
  // Store previous gyro val, will now be subtracted from val for callibration
  ui.drive.gyro.offset = ui.drive.gyro.val;
  // Trigger the gyro to recalculate value.
  updateGyro('/SmartDashboard/drive/gyro/angle', ui.drive.gyro.val);
});
