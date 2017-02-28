// Define UI elements
var ui = {
	timer: document.getElementById('timer'),
	robotState: document.getElementById('robot-state'),
	gyro: {
		container: document.getElementById('gyro'),
		val: 0,
		offset: 0,
		visualVal: 0,
		arm: document.getElementById('gyro-arm'),
		number: document.getElementById('gyro-number')
	},
	robotDiagram: {
		arm: document.getElementById('robot-arm')
	},
	example: {
		button: document.getElementById('example-button'),
		readout: document.getElementById('example-readout')
	},
	tuning: {
		list: document.getElementById('tuning'),
		button: document.getElementById('tuning-button'),
		name: document.getElementById('name'),
		value: document.getElementById('value'),
		set: document.getElementById('set'),
		get: document.getElementById('get')
	},
	autoSelect: document.getElementById('auto-select'),
    armPosition: document.getElementById('arm-position')
};

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);


function onRobotConnection(connected) {
	var state = connected ? 'Robot connected!' : 'Robot disconnected.';
	console.log(state);
	ui.robotState.innerHTML = state;
}

function onValueChanged(key, value, isNew) {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// This switch statement chooses which UI element to update when a NetworkTables variable changes.
	switch (key) {
		case '/SmartDashboard/drive/navx/yaw': // Gyro rotation
			ui.gyro.val = value;
			ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
			if (ui.gyro.visualVal < 0) { // Corrects for negative values
				ui.gyro.visualVal += 360;
			}
			ui.gyro.arm.style.transform = ('rotate(' + ui.gyro.visualVal + 'deg)');
			ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
			break;
			// The following case is an example, for a robot with an arm at the front.
			// Info on the actual robot that this works with can be seen at thebluealliance.com/team/1418/2016.
		case '/SmartDashboard/arm/encoder':
			// 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
			if (value > 1140) {
				value = 1140;
			} else if (value < 0) {
				value = 0;
			}
			// Calculate visual rotation of arm
			var armAngle = value * 3 / 20 - 45;

			// Rotate the arm in diagram to match real arm
			ui.robotDiagram.arm.style.transform = 'rotate(' + armAngle + 'deg)';
			break;
			// This button is just an example of triggering an event on the robot by clicking a button.
		case '/SmartDashboard/example_variable':
			if (value) { // If function is active:
				// Add active class to button.
				ui.example.button.className = 'active';
				ui.example.readout.innerHTML = 'Value is true';
			} else { // Otherwise
				// Take it off
				ui.example.button.className = '';
				ui.example.readout.innerHTML = 'Value is false';
			}
			break;
		case '/SmartDashboard/time_running':
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
						clearTimeout(countdown);
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
		case '/SmartDashboard/autonomous/options': // Load list of prewritten autonomous modes
			// Clear previous list
			while (ui.autoSelect.firstChild) {
				ui.autoSelect.removeChild(ui.autoSelect.firstChild);
			}
			// Make an option for each autonomous mode and put it in the selector
			for (i = 0; i < value.length; i++) {
				var option = document.createElement('option');
				option.innerHTML = value[i];
				ui.autoSelect.appendChild(option);
			}
			// Set value to the already-selected mode. If there is none, nothing will happen.
			ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
			break;
		case '/SmartDashboard/autonomous/selected':
			ui.autoSelect.value = value;
			break;
	}

	// The following code manages tuning section of the interface.
	// This section displays a list of all NetworkTables variables and allows you to directly manipulate them.

	// Check if value is new and doesn't have a spot on the list yet
	if (isNew && !document.getElementsByName(key)[0]) {
		// Make a new div for this value
		var div = document.createElement('div'); // Make div
		ui.tuning.list.appendChild(div); // Add the div to the page

		var p = document.createElement('p'); // Make a <p> to display the name of the property
		p.innerHTML = key; // Make content of <p> have the name of the NetworkTables value
		div.appendChild(p); // Put <p> in div

		var input = document.createElement('input'); // Create input
		input.name = key; // Make its name property be the name of the NetworkTables value
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
		// Create listener for value of input being modified
		input.onchange = function() {
			switch (input.type) { // Figure out how to pass data based on input type
				case 'checkbox':
					// For booleans, send bool of whether or not checkbox is checked
					NetworkTables.setValue(key, input.checked);
					break;
				case 'number':
					// For number values, send value of input as an int.
					NetworkTables.setValue(key, parseInt(input.value));
					break;
				case 'text':
					// For normal text values, just send the value.
					NetworkTables.setValue(key, input.value);
					break;
			}
		};
		// Put the input into the div.
		div.appendChild(input);
	} else { // If the value is not new
		// Find already-existing input for changing this variable
		var oldInput = document.getElementsByName(key)[0];
		if (oldInput) { // If there is one (there should be, unless something is wrong)
			if (oldInput.type === 'checkbox') { // Figure out what data type it is and update it in the list
				oldInput.checked = value;
			} else {
				oldInput.value = value;
			}
		} else {
			console.log('Error: Non-new variable ' + key + ' not present in tuning list!');
		}
	}
}

// The rest of the doc is listeners for UI elements being clicked on
ui.example.button.onclick = function() {
	// Set NetworkTables values to the opposite of whether button has active class.
	NetworkTables.setValue('/SmartDashboard/example_variable', this.className != 'active');
};

// Reset gyro value to 0 on click
ui.gyro.container.onclick = function() {
	// Store previous gyro val, will now be subtracted from val for callibration
	ui.gyro.offset = ui.gyro.val;
	// Trigger the gyro to recalculate value.
	onValueChanged('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
};

// Open tuning section when button is clicked
ui.tuning.button.onclick = function() {
	if (ui.tuning.list.style.display === 'none') {
		ui.tuning.list.style.display = 'block';
	} else {
		ui.tuning.list.style.display = 'none';
	}
};

// Manages get and set buttons at the top of the tuning pane
ui.tuning.set.onclick = function() {
	// Make sure the inputs have content, if they do update the NT value
	if (ui.tuning.name.value && ui.tuning.value.value) {
		NetworkTables.setValue('/SmartDashboard/' + ui.tuning.name.value, ui.tuning.value.value);
	}
};
ui.tuning.get.onclick = function() {
	ui.tuning.value.value = NetworkTables.getValue(ui.tuning.name.value);
};

// Update NetworkTables when autonomous selector is changed
ui.autoSelect.onchange = function() {
	NetworkTables.setValue('/SmartDashboard/autonomous/selected', this.value);
};

// Get value of arm height slider when it's adjusted
ui.armPosition.oninput = function() {
	NetworkTables.setValue('/SmartDashboard/arm/encoder', parseInt(this.value));
};
