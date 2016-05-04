// Define UI elements
var ui = {
	timer: document.getElementById('timer'),
	robotState: document.getElementById('robotState'),
	gyro: {
		container: document.getElementById('gyro'),
		val: 0,
		offset: 0,
		visualVal: 0,
		arm: document.getElementById('gyroArm'),
		number: document.getElementById('gyroNumber'),
		button: document.getElementById('gyroButton')
	},
	encoder: {
		container: document.getElementById('encoder'),
		valDisplay: document.getElementById('encoderValDisplay'),
		slider: document.getElementById('encoderSlider'),
		forward: document.getElementById('forwardEncoder'),
		reverse: document.getElementById('reverseEncoder')
	},
	robotDiagram: {
		arm: document.getElementById('robotArm')
	},
	ladderButton: document.getElementById('ladderButton')
};

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);


function onRobotConnection(connected) {
	state = connected ? 'Robot connected!' : 'Robot disconnected.';
	console.log(state);
	ui.robotState.innerHTML = state;
}

function onValueChanged(key, value, isNew) {
	// Sometimes, NetworkTables will pass strings instead of bools. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// This switch statement chooses which UI element to update when a NetworkTables variable changes.
	switch (key) {
		case '/SmartDashboard/Drive/NavX | Yaw': // Gyro rotation
			ui.gyro.val = value;
			ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
			if (ui.gyro.visualVal < 0) { // Corrects for negative values
				ui.gyro.visualVal += 360;
			}
			ui.gyro.arm.style.transform = ('rotate(' + ui.gyro.visualVal + 'deg)');
			ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
			break;
		case '/SmartDashboard/Arm | Middle':
			// 0 and 1200 are the encoder's min and max values, we don't want it going past that.
			if (value > 1200) {
				value = 1200;
			} else if (value < 0) {
				value = 0;
			}
			// Set slider and number display to new encoder value
			ui.encoder.slider.value = value;
			ui.encoder.valDisplay.innerHTML = 'Encoder Val: ' + value;
			break;
		case '/SmartDashboard/Arm | Forward Limit Switch':
			ui.encoder.forward.innerHTML = 'Forward Encoder:' + value;
			ui.encoder.forward.style.color = value ? 'green' : 'red';
			break;
		case '/SmartDashboard/Arm | Reverse Limit Switch':
			ui.encoder.forward.innerHTML = 'Reverse Encoder:' + value;
			ui.encoder.reverse.style.color = value ? 'green' : 'red';
			break;
			// The following case is an example, for a robot with an arm at the front.
			// Info on the actual robot that this works with can be seen at thebluealliance.com/team/1418/2016.
		case '/SmartDashboard/Arm | Encoder':
			// 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
			if (value > 1140) {
				value = 1140;
			} else if (value < 0) {
				value = 0;
			}
			// Calculate visual rotation of arm
			var armAngle = 180 - value * 225 / 1200;

			// Rotate the arm in diagram to match real arm
			ui.robotDiagram.arm.style.transform = 'rotate(' + armAngle + ')';
			break;
			// This button is just an example of triggering an event on the robot by clicking a button.
		case '/SmartDashboard/ladderButton':
			if (value) { // If function is active:
				// Add active class to button.
				ui.ladderButton.className = 'active';
			} else { // Otherwise
				// Take it off
				ui.ladderButton.className = '';
			}
			break;
			// When this NetworkTables variable is true, the timer will start.
			// You shouldn't need to touch this code, but it's documented anyway in case you do.
		case '/SmartDashboard/timeRunning':
			var s = 135;
			if (value) {
				// Make sure timer is reset to black when it starts
				ui.timer.style.color = 'black';
				// Function below adjusts time left every second
				var countdown = setInterval(function() {
					s--; // Subtract one second
					// Minutes (m) is equal to the total seconds divided by sixty with the decimal removed.
					var m = Math.floor(s / 60);
					// Create seconds number that will actually be displayed after minutes are subtracted
					var visualS = (s % 60);

					// Add leading zero if seconds is one digit long, for proper time formatting.
					visualS = visualS < 10 ? '0' + visualS : visualS;

					if (s < 0) {
						// Stop countdown when timer reaches zero
						window.clearTimeout(countdown);
						return;
					} else if (s <= 15) {
						// Flash timer if less than 15 seconds left
						ui.timer.style.color = (s % 2 === 0) ? '#FF3030' : 'transparent';
					} else if (s <= 30) {
						// Solid red timer when less than 30 seconds left.
						ui.timer.style.color = '#FF3030';
					}
					ui.timer.innerHTML = m + ':' + visualS;
				}, 1000);
			} else {
				s = 135;
			}
			NetworkTables.setValue('/SmartDashboard/timeRunning', false);
			break;
	}
}

// The rest of the doc is listeners for UI elements being clicked on
ui.ladderButton.addEventListener('click', function() {
	// Set NetworkTables values to the opposite of whether button has active class.
	NetworkTables.setValue('/SmartDashboard/' + this.id, this.className != 'active');
});

// Get value of encoder slider when it's adjusted
ui.encoder.slider.addEventListener('click', function() {
	NetworkTables.setValue('/SmartDashboard/Arm | Middle', parseInt(ui.encoder.slider.value));
});

ui.gyro.container.addEventListener('click', function() {
	ui.gyro.offset = ui.gyro.val;
	onValueChanged('/SmartDashboard/Drive/NavX | Yaw', ui.gyro.val);
});