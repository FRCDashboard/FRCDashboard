// Create values
var currentSeconds = 135;

// Define UI elements
var ui = {
	robotState: document.getElementById('robotState'),
	gyro: {
		val: 0,
		arm: document.getElementById('gyroArm'),
		label: document.getElementById('gyroLabel')
	},
	encoder: {
		forward: document.getElementById('forwardEncoder'),
		reverse: document.getElementById('reverseEncoder')
	},
	robotDiagram: {
		arm: document.getElementById('robotArm')
	},
	functionButton: getElementsByClassName('functionButton')
};

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);


function onRobotConnection(connected) {
	console.log('Robot connected: ' + connected);
	ui.robotState.text(connected ? 'Robot connected!' : 'Robot disconnected');
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
			if (gyro.val < 0) { // Corrects for negative values
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
			// 0 is all the way back, 1200 is 45 degrees foreward. We don't want it going past that.
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
		case '/SmartDashboard/startTheTimer':
			if (value) {
				document.getElementById('timer').style.color = 'black';
				timerVar = setInterval(function() {
					currentSeconds--;
					var currentMinutes = parseInt(currentSeconds / 60);
					var actualSeconds = (currentSeconds % 60);

					actualSeconds = actualSeconds < 10 ? '0' + actualSeconds : actualSeconds;

					if (currentSeconds < 0) {
						window.clearTimeout(timerVar);
						return;
					} else if (currentSeconds <= 15) {
						document.getElementById('timer').style.color = (currentSeconds % 2 === 0) ? '#FF3030' : 'white';
					} else if (currentSeconds <= 30) {
						document.getElementById('timer').style.color = '#FF3030';
					}
					document.getElementById('timer').innerHTML = currentMinutes + ':' + actualSeconds;
				}, 1000);
			} else {
				document.getElementById('timer').innerHTML = '2:15';
				currentSeconds = 135;
			}
			NetworkTables.setValue('/SmartDashboard/startTheTimer', false);
			break;
		case '/SmartDashboard/Arm | Middle':
			if (value > 1200) {
				value = 1200;
			} else if (value < 0) {
				value = 0;
			}
			$('#encoderSlider').val(value);
			$('#encoderValueDisplay').text('Encoder Val: ' + value);
			break;
	}
	if (isNew) {
		/*iterate through each value in displayInTuning, if the key starts
		 with the current value of displayInTuning display it, if not then do nothing */
		var displayInTuningLength = displayInTuning.length;
		var addToTuning = false;
		for (j = 0; j < displayInTuningLength; j++) {
			var currentString = displayInTuning[j];
			if (key.substring(0, currentString.length) == currentString) {
				addToTuning = true;
				break;
			}
		}
		if (addToTuning) {
			var div = $('<div></div>').attr('propName', propName); //.appendTo($('.settings'));
			var allOfTheDivs = $('.settings').first().children('[type]');
			var allOfTheDivsLength = allOfTheDivs.length;
			if (allOfTheDivsLength === 0) {
				div.appendTo('.settings');
			} //comment
			else {
				//run through all of the crap, if the string is greater than this elements propane, insert it after it, it should keep hitting false until true then break
				var noneFound = true; //if it is the highest in the array append it to .settings
				var processedDivName = propName.toLowerCase();
				var processedDivNameLength = processedDivName.length;
				allOfTheDivs.not(div).each(function() {
					var thisPropname = $(this).attr('propName').toLowerCase();
					for (a = 0; a < processedDivNameLength; a++) {
						if (processedDivName.charCodeAt(a) == thisPropname.charCodeAt(a)) {

						} else if (processedDivName.charCodeAt(a) < thisPropname.charCodeAt(a)) { //if processedDivName is greater, keep going, if not, then insert vefore
							div.insertBefore($(this));
							noneFound = false;
							return false;
						} else {
							break;
						}
					}
				});
				/*for(a=0;a<allOfTheDivsLength;a++){
					var
				}*/
				if (noneFound === true) {
					div.appendTo('.settings');
				}
			}
			$('<p></p>').text(propName).appendTo(div);
			if (value === true || value === false) {
				div.attr('type', 'boolean');
				var boolSlider = $('<div class="bool-slider ' + value +
					'" id="tuning' + hashCode(key) + '" tableValue="' + key + '"></div>');
				var innerInset = $('<div class="inset"></div>');
				innerInset.append('<div class="control"></div>')
					.click(function() {
						if (boolSlider.hasClass('true')) {
							NetworkTables.setValue(key, false);
						} else {
							NetworkTables.setValue(key, true);
						}
					});
				innerInset.appendTo(boolSlider);
				boolSlider.appendTo(div);
			} else if (!isNaN(value)) {
				if (!isNaN(value)) {
					div.attr('type', 'int');

					$('<input type="number">')
						.keypress(function(e) {
							var key = e.which;
							if (key == 13) // the enter key code
							{
								NetworkTables.setValue($(this).attr('tableValue'), parseFloat($(this).val())); //get the key, and set the current value
							}
						})
						.attr('id', 'tuning' + hashCode(key))
						.attr('tableValue', key)
						.attr('value', value)
						.appendTo(div);
				}
			} else {
				div.attr('type', 'string');

				$('<input type="text">')
					.keypress(function(e) {
						var key = e.which;
						if (key == 13) // the enter key code
						{
							NetworkTables.setValue($(this).attr('tableValue'), $(this).val()); //get the key, and set the current value
						}
					})
					.attr('id', 'tuning' + hashCode(key))
					.attr('value', value)
					.attr('tableValue', key)
					.appendTo(div);
			}
		}
	} else {
		var $tuningDiv = $('#tuning' + hashCode(key));

		if (value === true || value === false) {
			if ($tuningDiv.hasClass('true')) {
				$tuningDiv.addClass('false').removeClass('true');
			} else {
				$tuningDiv.addClass('true').removeClass('false');
			}
		} else {
			$tuningDiv.val(value);
		}
	}
}
$('#set').click(function() {
	var childInputs = $('#settingsContainerDiv input');
	childInputs.each(function(a) {
		var thisChild = $(this);
		var s;
		if ($.isNumeric(thisChild.val())) {
			s = parseInt(thisChild.val());
		} else {
			s = thisChild.val();
		}
		NetworkTables.setValue(thisChild.attr('tableValue'), s); //need to change id back into a string
	});
});