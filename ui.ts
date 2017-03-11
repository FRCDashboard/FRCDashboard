// Define UI elements
var ui = {
	timer: document.getElementById('timer') as HTMLDivElement,
	robotState: document.getElementById('robot-state').firstChild as Text,
	gyro: {
		container: <any>document.getElementById('gyro') as SVGElement,
		val: 0,
		offset: 0,
		visualVal: 0,
		arm: <any>document.getElementById('gyro-arm') as SVGRectElement,
		number: <any>document.getElementById('gyro-number') as SVGTextElement
	},
	robotDiagram: {
		arm: <any>document.getElementById('robot-arm') as SVGRectElement
	},
	example: {
		button: document.getElementById('example-button') as HTMLButtonElement,
		readout: document.getElementById('example-readout').firstChild as Text
	},
	tuning: {
		list: document.getElementById('tuning') as HTMLDivElement,
		button: document.getElementById('tuning-button') as HTMLButtonElement,
		name: document.getElementById('name') as HTMLInputElement,
		value: document.getElementById('value') as HTMLInputElement,
		set: document.getElementById('set') as HTMLButtonElement,
		get: document.getElementById('get') as HTMLButtonElement
	},
	autoSelect: document.getElementById('auto-select') as HTMLSelectElement,
	armPosition: document.getElementById('arm-position') as HTMLInputElement
}
let address = <HTMLInputElement>document.getElementById('connect-address'),
	connect = <HTMLButtonElement>document.getElementById('connect')

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);
// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

if (noElectron) {
	document.body.classList.add('login-close')
}

function onRobotConnection(connected) {
	var state = connected ? 'Robot connected!' : 'Robot disconnected.';
	console.log(state);
	ui.robotState.data = state;

	if (!noElectron) {
		if (connected) {
			// On connect hide the connect popup
			document.body.classList.toggle('login-close', true)
		} else {
			// On disconnect show the connect popup
			document.body.classList.toggle('login-close', false)
			// Add Enter key handler
			address.onkeydown = ev => {
				if (ev.key === "Enter") {
					connect.click()
				}
			}
			// Enable the input and the button
			address.disabled = false;
			connect.disabled = false;
			(<Text>connect.firstChild).data = "Connect"
			// Add the default address and select xxxx
			address.value = "roborio-xxxx.local"
			address.focus()
			address.setSelectionRange(8, 12)
			// On click try to connect and disable the input and the button
			connect.onclick = () => {
				ipc.send('connect', address.value)
				address.disabled = true;
				connect.disabled = true;
				(<Text>connect.firstChild).data = "Connecting"
			}
		}
	}
}

/**** KEY Listeners ****/

// Gyro rotation
let updateGyro = (key, value: number) => {
	ui.gyro.val = value;
	ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
	if (ui.gyro.visualVal < 0) { // Corrects for negative values
		ui.gyro.visualVal += 360;
	}
	ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
	ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
}
NetworkTables.addKeyListener('/SmartDashboard/drive/navx/yaw', updateGyro)

// The following case is an example, for a robot with an arm at the front.
// Info on the actual robot that this works with can be seen at thebluealliance.com/team/1418/2016.
NetworkTables.addKeyListener('/SmartDashboard/arm/encoder', (key, value: number) => {
	// 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
	if (value > 1140) {
		value = 1140;
	} else if (value < 0) {
		value = 0;
	}
	// Calculate visual rotation of arm
	var armAngle = value * 3 / 20 - 45;

	// Rotate the arm in diagram to match real arm
	ui.robotDiagram.arm.style.transform = `rotate(${armAngle}deg)`;
})

// This button is just an example of triggering an event on the robot by clicking a button.
NetworkTables.addKeyListener('/SmartDashboard/example_variable', (key, value: boolean | string) => {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (typeof value === 'string') value = value === "true"
	// Set class active if value is true and unset it if it is false
	ui.example.button.classList.toggle('active', value)
	ui.example.readout.data = 'Value is ' + (value ? 'true' : 'false')
})

NetworkTables.addKeyListener('/SmartDashboard/time_running', (key, value: boolean | string) => {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (typeof value === 'string') value = value === "true"
	// When this NetworkTables variable is true, the timer will start.
	// You shouldn't need to touch this code, but it's documented anyway in case you do.
	var s = 135;
	if (value) {
		// Make sure timer is reset to black when it starts
		ui.timer.style.color = 'black';
		// Function below adjusts time left every second
		var countdown = setInterval(function () {
			s--; // Subtract one second
			// Minutes (m) is equal to the total seconds divided by sixty with the decimal removed.
			var m = Math.floor(s / 60);
			// Create seconds number that will actually be displayed after minutes are subtracted
			var visualS: string | number = (s % 60);

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
			(<Text>ui.timer.firstChild).data = m + ':' + visualS;
		}, 1000);
	} else {
		s = 135;
	}
	NetworkTables.putValue(key, false);
})

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/time_running', (key, value: string[]) => {
	// Clear previous list
	while (ui.autoSelect.firstChild) {
		ui.autoSelect.removeChild(ui.autoSelect.firstChild);
	}
	// Make an option for each autonomous mode and put it in the selector
	for (let i = 0; i < value.length; i++) {
		var option = document.createElement('option');
		option.appendChild(document.createTextNode(value[i]));
		ui.autoSelect.appendChild(option);
	}
	// Set value to the already-selected mode. If there is none, nothing will happen.
	ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
})

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value: string) => {
	ui.autoSelect.value = value;
})

// Global Listener
function onValueChanged(key: string, value: any, isNew?: boolean) {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// The following code manages tuning section of the interface.
	// This section displays a list of all NetworkTables variables (that start with /SmartDashboard/) and allows you to directly manipulate them.
	var propName = key.substring(16, key.length);
	// Check if value is new and doesn't have a spot on the list yet
	if (isNew && !document.getElementsByName(propName)[0]) {
		// Make sure name starts with /SmartDashboard/. Properties that don't are technical and don't need to be shown on the list.
		if (/^\/SmartDashboard\//.test(key)) {
			// Make a new div for this value
			var div = document.createElement('div'); // Make div
			ui.tuning.list.appendChild(div); // Add the div to the page

			var p = document.createElement('p'); // Make a <p> to display the name of the property
			p.appendChild(document.createTextNode(propName)); // Make content of <p> have the name of the NetworkTables value
			div.appendChild(p); // Put <p> in div

			var input = document.createElement('input'); // Create input
			input.name = propName; // Make its name property be the name of the NetworkTables value
			input.value = value; // Set
			// The following statement figures out which data type the variable is.
			// If it's a boolean, it will make the input be a checkbox. If it's a number,
			// it will make it a number chooser with up and down arrows in the box. Otherwise, it will make it a textbox.
			if (typeof value === "boolean") { // Is it a boolean value?
				input.type = 'checkbox';
				input.checked = value; // value property doesn't work on checkboxes, we'll need to use the checked property instead
				input.onchange = function (this: HTMLInputElement) {
					// For booleans, send bool of whether or not checkbox is checked
					NetworkTables.putValue(key, this.checked);
				}
			} else if (!isNaN(value)) { // Is the value not not a number? Great!
				input.type = 'number';
				input.onchange = function (this: HTMLInputElement) {
					// For number values, send value of input as an int.
					NetworkTables.putValue(key, parseInt(this.value));
				}
			} else { // Just use a text if there's no better manipulation method
				input.type = 'text';
				input.onchange = function (this: HTMLInputElement) {
					// For normal text values, just send the value.
					NetworkTables.putValue(key, this.value);
				}
			}
			// Put the input into the div.
			div.appendChild(input);
		}
	} else { // If the value is not new
		// Find already-existing input for changing this variable
		var oldInput = document.getElementsByName(propName)[0] as HTMLInputElement;
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
ui.example.button.onclick = function () {
	// Set NetworkTables values to the opposite of whether button has active class.
	NetworkTables.putValue('/SmartDashboard/example_variable', this.className != 'active');
};

// Reset gyro value to 0 on click
ui.gyro.container.onclick = function () {
	// Store previous gyro val, will now be subtracted from val for callibration
	ui.gyro.offset = ui.gyro.val;
	// Trigger the gyro to recalculate value.
	updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
};

// Open tuning section when button is clicked
ui.tuning.button.onclick = function () {
	if (ui.tuning.list.style.display === 'none') {
		ui.tuning.list.style.display = 'block';
	} else {
		ui.tuning.list.style.display = 'none';
	}
};

// Manages get and set buttons at the top of the tuning pane
ui.tuning.set.onclick = function () {
	// Make sure the inputs have content, if they do update the NT value
	if (ui.tuning.name.value && ui.tuning.value.value) {
		NetworkTables.putValue('/SmartDashboard/' + ui.tuning.name.value, ui.tuning.value.value);
	}
};
ui.tuning.get.onclick = function () {
	ui.tuning.value.value = NetworkTables.getValue(ui.tuning.name.value);
};

// Update NetworkTables when autonomous selector is changed
ui.autoSelect.onchange = function (this: HTMLSelectElement) {
	NetworkTables.putValue('/SmartDashboard/autonomous/selected', this.value);
};

// Get value of arm height slider when it's adjusted
ui.armPosition.oninput = function (this: HTMLSelectElement) {
	NetworkTables.putValue('/SmartDashboard/arm/encoder', parseInt(this.value));
};
