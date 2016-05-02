// Define UI elements
var ui = {
	timer: document.getElementById('timer'),
	robotState: document.getElementById('robotState'),
	gyro: {
		val: 0,
		arm: document.getElementById('gyroArm'),
		label: document.getElementById('gyroLabel')
	},
	encoder: {
		valDisplay: document.getElementById('encoderValDisplay'),
		slider: document.getElementById('encoderSlider'),
		forward: document.getElementById('forwardEncoder'),
		reverse: document.getElementById('reverseEncoder')
	},
	robotDiagram: {
		arm: document.getElementById('robotArm')
	},
	functionButtons: document.getElementsByClassName('functionButton'),
};

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);


function onRobotConnection(connected) {
	console.log('Robot connected: ' + connected);
	ui.robotState.innerHTML = connected ? 'Robot connected!' : 'Robot disconnected';
}

function onValueChanged(key, value, isNew) {
	// Removes "/SmartDashboard/" from start of property name
	var propName = key.substring(16, key.length);

	// Sometimes, NetworkTables will pass strings instead of bools. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// This switch statement updates the UI for modified NetworkTables variables.
	switch (key) {
		case '/SmartDashboard/NavX | Yaw': // Gyro rotation
			ui.gyro.val = value;
			if (ui.gyro.val < 0) { // Corrects for negative values
				ui.gyro.val += 360;
			}
			ui.gyro.arm.style.transform = 'rotate(' + ui.gyro.val + 'deg)';
			ui.gyro.label.text(ui.gyro.val + 'º');
			break;
		case '/SmartDashboard/Arm | Forward Limit Switch':
			ui.encoder.forward.text('Forward Encoder:' + value);
			ui.encoder.forward.style.color = value ? 'green' : 'red';
			break;
		case '/SmartDashboard/Arm | Reverse Limit Switch':
			ui.encoder.forward.text('Reverse Encoder:' + value);
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
			// These buttons are examples of a button to perform a function on the robot.
			// You'll need to write your own robot code to do these functions or any others.
			// These are just placeholders which we used in 2016.
		case '/SmartDashboard/chevyButton':
		case '/SmartDashboard/gateButton':
		case '/SmartDashboard/ladderButton':
			// Figure out which of the above buttons should be active
			var button = document.getElementById(propName);

			if (value) { // If function is active:
				// Add active class to button.
				button.classList.add('active');
			} else {
				button.classList.remove('active');
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
	}
}

// The rest of the doc is listeners for UI elements being clicked on
functionButtons.addEventListener('click', function() {
	console.log(this.active);
	isActive = this.active == 'true' ? true : false;
	for (i = 0; i < functionButtons.length; i++) {
		functionButtons[i].className = '';
	}
	NetworkTables.setValue('/SmartDashboard/' + this.id, isActive);
});

var encoderSlider = $('#encoderSlider'),
	min = encoderSlider.attr('min'),
	max = encoderSlider.attr('max'),
	dataList = $('#stepList'),
	tickDistance = 50,
	numberOfTicks = (parseInt(max) - parseInt(min)) / tickDistance,
	newVal = parseInt(min);
for (i = 0; i < numberOfTicks; i++) {
	dataList.append('<option>' + newVal + '</option>');
	newVal += tickDistance;
}
$('#encoder').hide().show(0); //element refresh
$('#encoderSlider').change(function() {
	var encoderVal = $('#encoderSlider').val();
	$('#encoderValueDisplaySpan').text('Arm Encoder Value:' + encoderVal);
	NetworkTables.setValue('/SmartDashboard/Arm | Middle', parseInt(encoderVal));

});