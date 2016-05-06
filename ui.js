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
	ladderButton: document.getElementById('ladderButton'),
	tuning: {
		list: document.getElementById('tuning'),
		button: document.getElementById('tuningButton')
	}
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
		case '/SmartDashboard/timeRunning':
			// When this NetworkTables variable is true, the timer will start.
			// You shouldn't need to touch this code, but it's documented anyway in case you do.
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
			NetworkTables.setValue(key, false);
			break;
	}

	var propName = key.substring(16, key.length);
	// Check if value is new, starts with /SmartDashboard/, and doesn't have a spot on the list yet
	if (isNew && value && document.getElementsByName(propName).length === 0) {
		if (key.substring(0, 16) === '/SmartDashboard/') {
			// Make a new div for this value
			var div = document.createElement('div'); // Make div
			ui.tuning.list.appendChild(div); // Add the div to the page

			var p = document.createElement('p'); // Make a <p> to display the name of the property
			p.innerHTML = propName; // Make content of <p> have the name of the NetworkTables value
			div.appendChild(p); // Put <p> in div

			var input = document.createElement('input'); // Create input
			input.name = propName; // Make its name property be the name of the NetworkTables value
			input.value = value; // Set
			// The following statement figures out which data type the variable is.
			// If it's a boolean, it will make the input be a checkbox. If it's a number,
			// it will make it a number chooser with up and down arrows in the box. Otherwise, it will make it a textbox.
			if (value === true || value === false) { // Is it a boolean value?
				input.type = 'checkbox';
                input.checked = value; // value property doesn't work on checkboxes, we'll need to use the checked property instead
			} else if (!isNaN(value)) { // Is the value not not a number? Great!
				input.type = 'number';
			} else { // Just use a text if there's no better manipulation method
				input.type = 'text';
			}
			input.onchange = function() {
                switch (input.type) {
                    case 'checkbox':
                        NetworkTables.setValue(key, input.checked);
                        break;
                    case 'number':
                        NetworkTables.setValue(key, parseInt(input.value));
                        break;
                    case 'text':
                        NetworkTables.setValue(key, input.value);
                        break;
                }

                console.log(NetworkTables.getValue(key));
			};
			div.appendChild(input);
		}
	} else {
		var oldInput = document.getElementsByName(propName)[0];
		if (oldInput) {
			if (oldInput.type === 'checkbox') {
				oldInput.checked = value;
			} else {
				oldInput.value = value;
			}
		}
	}
}

// The rest of the doc is listeners for UI elements being clicked on
ui.ladderButton.onclick = function() {
	// Set NetworkTables values to the opposite of whether button has active class.
	NetworkTables.setValue('/SmartDashboard/' + this.id, this.className != 'active');
};

// Get value of encoder slider when it's adjusted
ui.encoder.slider.onclick = function() {
	NetworkTables.setValue('/SmartDashboard/Arm | Middle', parseInt(ui.encoder.slider.value));
};

// Reset gyro value to 0 on click
ui.gyro.container.onclick = function() {
	// Store previous gyro val, will now be subtracted from val for callibration
	ui.gyro.offset = ui.gyro.val;
	// Trigger the gyro to recalculate value.
	onValueChanged('/SmartDashboard/Drive/NavX | Yaw', ui.gyro.val);
};

// Open tuning section when button is clicked
ui.tuning.button.onclick = function() {
	if (ui.tuning.list.style.display === 'none') {
		ui.tuning.list.style.display = 'block';
	} else {
		ui.tuning.list.style.display = 'none';
	}
};