var currentSeconds = 135,
	timerVar,
	alliedCounter = 0,
	gameStarted = false,
	gyroVal = 0,
	gyroDiff = 0,
	visualGyroVal = 0,
	displayInTuning = ['/SmartDashboard/']; //if it starts with this strings add to tuning page

function hashCode(s) { // Gives a number for a string. Complicated.
	var ret = '';
	var sLength = s.length;
	for (i = 0; i < sLength; i++) {
		ret = ret + s.charCodeAt(i);
	}

	return ret;
}
document.getElementById('setButton').onclick = function() {
	var setValue = document.getElementById('value').value;
	if (setValue == 'true') { // ¯\_(ツ)_/¯
		NetworkTables.setValue(document.getElementById('name').value, true);
	} else if (setValue == 'false') {
		NetworkTables.setValue(document.getElementById('name').value, false);
	} else {
		NetworkTables.setValue(document.getElementById('name').value,
			document.getElementById('value').value);
	}
};
document.getElementById('get').onclick = function() {
	document.getElementById('value').value = NetworkTables.getValue(document.getElementById('name').value);
};

// sets a function that will be called when the websocket connects/disconnects
NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// sets a function that will be called when the robot connects/disconnects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// sets a function that will be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

$('.functionButton').click(function() {
	var $thisButton = $(this);
	var activeState = $thisButton.attr('activeState');
	if (activeState === true || activeState == 'true') {
		activeState = false;
	} else if (activeState === false || activeState == 'false') {
		activeState = true;
		//set all of the other values to false
		$('.functionButton').not(document.getElementById($thisButton.attr('id'))).each(function() {
			NetworkTables.setValue('/SmartDashboard/' + $thisButton.attr('id'), false);
		});
	}
	NetworkTables.setValue('/SmartDashboard/' + $thisButton.attr('id'), activeState); //onclick set the things id to true

});
var encoderSlider = $('#encoderSlider'),
	dataList = $('#stepList'),
	tickDistance = 50,
	numberOfTicks = (parseInt(encoderSlider.attr('max')) - parseInt(encoderSlider.attr('min'))) / tickDistance,
	newVal = parseInt(encoderSlider.attr('min'));
for (i = 0; i < numberOfTicks; i++) {
	dataList.append('<option>' + newVal + '</option>');
	newVal += tickDistance;
}
$('#encoder').hide().show(0); //element refresh
$('#encoderSlider').change(function() {
	var encoderValDisplay = $('#encoderSlider').val();
	$('#encoderValDisplay').text('Arm Encoder Value:' + encoderValDisplay);
	NetworkTables.setValue('/SmartDashboard/Arm | Middle', parseInt(encoderValDisplay));
});

//for every of the 5 attacking positions give the image the attacking toggleswitchcyclethroughimagesthing
//thing onclick and make it update networktables

var everyOffensiveToggleImage = $('.attackerState');
everyOffensiveToggleImage.each(function(a) {
	//set a default value, add the onclick listener, update networktables
	//
	var thisImage = $(this);
	thisImage.attr('id', 'attackerState' + a).attr('state', 0).attr('position', a).attr('src', 'img/defaultImg.png');
	//if(NetworkTables.isRobotConnected()){}
	thisImage.click(function() {
		var theImage = $(this);
		var currentState = theImage.attr('state');
		if (currentState == 2) {
			currentState = 0;
		} else {
			currentState++;
		}
		theImage.attr('state', currentState);
		NetworkTables.setValue('/SmartDashboard/' + theImage.attr('id'), attackerNames[currentState]);
	});
});

//for every selection Div, make the stuff, add a listener to each arrow, the toggleBox,
//set the value from networkTables or if no networkTables, get the default value
var everydefenseSelector = $('.defenseSelector'); //get every defenseSelector(the div that contains the stuff)
everydefenseSelector.each(function(a) {
	//for every defenseSelector add the triangles, set the id, 'a' is the index in the list of divs
	var thisDiv = $(this);
	thisDiv.attr('defenseClass', a);
	thisDiv.attr('id', 'defenseSelector' + a);
	var defenseNumber = 0;
	thisDiv.attr('defenseNumber', defenseNumber);
	thisDiv.append($('<div class="arrow-up"></div>')
		.click(function() {
			//onclick take the value of the current defense from this div, ex'defenseName=(3,0)', ++1
			var currentDefenseClass = thisDiv.attr('defenseClass');

			if (currentDefenseClass >= 3) {
				currentDefenseClass = 0;
			} else {
				currentDefenseClass++;
			}
			thisDiv.attr('defenseclass', currentDefenseClass);
			thisDiv.children('.selectionToggleBox')
				.attr('src', 'img/' + defenseNames[currentDefenseClass] + defenseNumber + '.png');
			NetworkTables.setValue('/SmartDashboard/' + thisDiv.attr('id'), realDefenseNames[currentDefenseClass][defenseNumber]);
		}));
	thisDiv.append($('<img>')
		.addClass('selectionToggleBox')
		.attr('src', 'img/defaultImg.png')
		.click(function() {
			var currentDefenseNumber = thisDiv.attr('defensenumber');

			if (currentDefenseNumber >= 1) {
				currentDefenseNumber = 0;
			} else {
				currentDefenseNumber++;
			}
			thisDiv.attr('defensenumber', currentDefenseNumber);
			thisDiv.children('.selectionToggleBox');

			NetworkTables.setValue('/SmartDashboard/' + thisDiv.attr('id'), realDefenseNames[thisDiv.attr('defenseClass')][currentDefenseNumber]);
		})
	);
	thisDiv.append($('<div class="arrow-down"></div>')
		.click(function(i, b) { //right now both are being clicked
			//onclick take the value of the current defense from this div, ex'defenseName=(3,0)', ++1
			var currentDefenseClass = parseInt(thisDiv.attr('defenseclass'));

			if (currentDefenseClass <= 0) {
				currentDefenseClass = 3;
			} else {
				currentDefenseClass--;
			}
			thisDiv.attr('defenseclass', currentDefenseClass);
			thisDiv.children('.selectionToggleBox') //.find('.selectionToggleBox')
				.attr('src', 'img/' + defenseNames[currentDefenseClass] + defenseNumber + '.png');
			NetworkTables.setValue('/SmartDashboard/' + thisDiv.attr('id'), realDefenseNames[currentDefenseClass][defenseNumber]);
		}));
	if (defenseNumber === 0) {
		defenseNumber = 1;
	} else {
		defenseNumber = 0;
	}
});

function onRobotConnection(connected) {
	console.log('Robot status: ' + connected);
	$('#robotstate').text(connected ? 'Connected!' : 'Disconnected');
}

function onValueChanged(key, value, isNew) {
	var propName = key.substring(16, key.length);

	switch (key) {
		case '/SmartDashboard/ballIn': //not the actual networktablesValue
			if (value === true) {
				$('#ball').attr('visibility', 'visible');
			} else {
				$('#ball').attr('visibility', 'hidden');
			}
			break;
		case '/SmartDashboard/NavX | Yaw':
			gyroVal = value;

			visualGyroVal = Math.floor(gyroVal - gyroDiff);

			if (visualGyroVal < 0) {
				visualGyroVal += 360;
			}

			$('#gyroArm').css('transform', 'rotate(' + visualGyroVal + 'deg)');
			$('#gyroLabel').text(visualGyroVal + 'º');
			break;
		case '/SmartDashboard/Arm | Forward Limit Switch': //checkspelling
			if (value === true || value == 'true') { //recheck valuetype, this display a bool
				$('#forwardEncoder').text('Forward Enc:True').css('color', 'green');
			} else {
				$('#forwardEncoder').text('Forward Enc:False').css('color', 'red');
			}
			break;
		case '/SmartDashboard/Arm | Reverse Limit Switch':
			if (value) { //recheck valuetype, this display a bool
				$('#reverseEncoder').css('color', 'green');
			} else {
				$('#reverseEncoder').css('color', 'red');
			}
			break;
		case '/SmartDashboard/Arm | Encoder':
			if (value > 1140) {
				value = 1140;
			} else if (value < 0) {
				value = 0;
			} //0 is back,
			var $robotArm = $('#robotArm');
			var rotationValue = 180 - value * 225 / 1200;
			// 0 is direct back, 1200 is 45 degrees foreward
			var rotationPointx = parseInt($robotArm.attr('width')) + parseInt($robotArm.attr('x'));
			$robotArm.attr('transform', 'rotate(' + rotationValue + ' ' + rotationPointx + ' ' + $robotArm.attr('y') + ')');
			break;
		case '/SmartDashboard/chevyButton':
		case '/SmartDashboard/gateButton':
		case '/SmartDashboard/ladderButton':
			//set the images border to orange if it equals true
			//do acheck to see if all 3 are false, if so, then make them white border and selectable
			var name = key.substring(16, key.length);
			var $button = $('#' + name);
			var functionButtonSelection = $('.functionButton'); //this is a selection of all of the buttons

			if (value === true) {
				//if the thing is true than set its css to purple, set its activestate to true, and make it selectable
				$button.attr('activeState', true);
				$button.css({
					'pointer-events': 'auto',
					'border-color': '#ff5111',
				});
				$button.attr('src', '/img/' + $button.attr('name') + '.gif');
				$('.functionButton').not(document.getElementById(name)).each(function() {
					var thisButton = $(this);
					thisButton.attr('src', '/img/' + thisButton.attr('name') + '.png');
					thisButton.css({
						'pointer-events': 'auto',
						'border-color': 'black',
					});
					NetworkTables.setValue('/SmartDashboard/' + thisButton.attr('id'), false);
				}); //then set everything else that isn't true and make it red, and set their activeState to false,
			} else if (value === false) {
				$button.attr('activeState', false);
				var buttonValueList = //getting the value of all 3 buttons
					functionButtonSelection.map(function() {
						return $(this).attr('activeState');
					}).get();
				var isButtonActive = false;
				var buttonValueListLength = buttonValueList.length;
				for (a = 0; a < buttonValueListLength; a++) {
					if (buttonValueList[a] === true) {
						isButtonActive = true;
					}
				}
				if (isButtonActive === true) { //if one of the buttons is active get every not active button and set their css
					functionButtonSelection.each(function() {
						var thisIsTheButton = $(this);
						var thisActiveState = thisIsTheButton.attr('activeState');
					});
					$button.css({
						'pointer-events': 'none',
						'border-color': 'black'
					});

				} else if (isButtonActive === false) { //if they are all false then set the current border to cyan
					$button.attr('src', '/img/' + $button.attr('name') + '.png');
					$button.css({
						'pointer-events': 'auto',
						'border-color': 'black'
					});
				}
				//if the thing is not true, check to see if something else is true, if something else is true, then make it red, else make it cyan
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
			$('#encoderValDisplay').text('Encoder Val: ' + value);
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
			//s = thisChild.val();

		} else {
			s = thisChild.val();
		}
		NetworkTables.setValue(thisChild.attr('tableValue'), s); //need to change id back into a string
	});
});

$('#teleopButton').click(function() {
	$('#tuning').hide();
	$(this).addClass('active');
	$('#tuningButton').removeClass('active');
});
$('#tuningButton').click(function() {
	$('#tuning').show();
	$('#teleopButton').removeClass('active');
	$(this).addClass('active');
});
$('#gyroButton').click(function() {
	gyroDiff = gyroVal;

	// Duplicate code! Needs revising.
	visualGyroVal = Math.floor(gyroVal - gyroDiff);

	if (visualGyroVal < 0) {
		visualGyroVal += 360;
	}

	$('#gyroArm').css('transform', 'rotate(' + visualGyroVal + 'deg)');
	$('#gyroLabel').text(visualGyroVal + 'º');
});