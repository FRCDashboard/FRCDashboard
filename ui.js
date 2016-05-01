var currentSeconds = 135,
	timerVar,
	alliedCounter = 0,
	gameStarted = false,
	defenseNames = ['A', 'B', 'C', 'D'],
	realDefenseNames = [
		['portcullis', 'chevalDeFrise'],
		['moat', 'ramparts'],
		['sallyport', 'drawbridge'],
		['roughTerrain', 'rockwall']
	],
	gyroVal = 0,
	gyroDiff = 0,
	visualGyroVal = 0,
    ladderUpVis = false,
	defenseAutoNames = [
		['A0', 'A1'],
		['E0', 'E0'],
		['C1', 'C1'],
		['E0', 'E0']
	],
	attackerNames = ['empty', 'allied', 'us'],
	displayInTuning = ['/SmartDashboard/']; //if it starts with these strings add to tuning page

function hashCode(s) {
	//previous value, current value
	var ret = '';
	var sLength = s.length;
	for (i = 0; i < sLength; i++) {
		ret = ret + s.charCodeAt(i);
	}

	return ret;
}
$(document).ready(function() {
	$('.winch').hide();
	NetworkTables.setValue('/SmartDashboard/LightBulb', false);
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
		document.getElementById('value').value = NetworkTables.getValue(
			document.getElementById('name').value);
	};
	// sets a function that will be called when the websocket connects/disconnects
	NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
	// sets a function that will be called when the robot connects/disconnects
	NetworkTables.addRobotConnectionListener(onRobotConnection, true);
	// sets a function that will be called when any NetworkTables key/value changes
	NetworkTables.addGlobalListener(onValueChanged, true);

	$('.autoButton').click(function() {
		var $thisButton = $(this);
		var activeState = $thisButton.attr('activeState');
		if (activeState === true || activeState == 'true') {
			activeState = false;
		} else if (activeState === false || activeState == 'false') {
			activeState = true;
			//set all of the other values to false
			$('.autoButton').not(document.getElementById($thisButton.attr('id'))).each(function() {
				NetworkTables.setValue('/SmartDashboard/' + $thisButton.attr('id'), false);
			});
		} else {}
		NetworkTables.setValue('/SmartDashboard/' + $thisButton.attr('id'), activeState); //onclick set the things id to true

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
	$('#autonomousOptionSelect').change(function() {
		NetworkTables.setValue('/SmartDashboard/Autonomous Mode/selected', $(this).val());
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
});
// called when the websocket connects/disconnects
function onRobotConnection(connected) {
	//config.frontcam should be set to http://roborio-1418-frc.local:5800/
	console.log('Robot status: ' + connected);
	$('#robotstate').text(connected ? 'Connected!' : 'Disconnected');

}

function onNetworkTablesConnection(connected) {
	if (connected) {
		$('#connectstate').text('Connected!');
		// clear the table
		$('#nt tbody > tr').remove();
	} else {
		$('#connectstate').text('Disconnected!');
	}
	if (connected === false) {
		$('#settingsContainerDiv').empty();
	}
}

function onValueChanged(key, value, isNew) {
	var propName = key.substring(16, key.length);

	switch (key) {
		//raw arm value and is the ball in

		case '/SmartDashboard/ladderUp':
			//is the ladderLift extended?
			if (value === true) {
				$('.winch').show();
			} else {
				$('.winch').hide();
			}
			break;
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
				$('#forwardEncoderSpan').text('Forward Enc:True').css('color', 'green');
			} else {
				$('#forwardEncoderSpan').text('Forward Enc:False').css('color', 'red');
			}
			break;
		case '/SmartDashboard/Arm | Reverse Limit Switch':
			if (value) { //recheck valuetype, this display a bool
				$('#reverseEncoderSpan').css('color', 'green');
			} else {
				$('#reverseEncoderSpan').css('color', 'red');
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
			var autoButtonSelection = $('.autoButton'); //this is a selection of all of the buttons

			if (value === true) {
				//if the thing is true than set its css to purple, set its activestate to true, and make it selectable
				$button.attr('activeState', true);
				$button.css({
					'pointer-events': 'auto',
					'border-color': '#ff5111',
				});
				$button.attr('src', '/img/' + $button.attr('baseSrc') + '.gif');
				$('.autoButton').not(document.getElementById(name)).each(function() {
					var thisButton = $(this);
					thisButton.attr('src', '/img/' + thisButton.attr('baseSrc') + '.png');
					thisButton.css({
						'pointer-events': 'auto',
						'border-color': 'aqua',
					});
					NetworkTables.setValue('/SmartDashboard/' + thisButton.attr('id'), false);
				}); //then set everything else that isn't true and make it red, and set their activeState to false,
			} else if (value === false) {
				$button.attr('activeState', false);
				var buttonValueList = //getting the value of all 3 buttons
					autoButtonSelection.map(function() {
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
					autoButtonSelection.each(function() {
						var thisIsTheButton = $(this);
						var thisActiveState = thisIsTheButton.attr('activeState');
					});
					$button.css({
						'pointer-events': 'none',
						'border-color': 'aqua'
					});

				} else if (isButtonActive === false) { //if they are all false then set the current border to cyan
					$button.attr('src', '/img/' + $button.attr('baseSrc') + '.png');
					$button.css({
						'pointer-events': 'auto',
						'border-color': 'aqua'
					});
				}
				//if the thing is not true, check to see if something else is true, if something else is true, then make it red, else make it cyan
			}
			break;
		case '/SmartDashboard/Drive | backCamera':
			if (value === true) {
				$('.camera img').attr('src', 'http://10.14.18.2:5801/?action=stream');
                $('.camera img').addClass('flipped');
			} else {
				$('.camera img').attr('src', 'http://10.14.18.2:5800/?action=stream');
                $('.camera img').removeClass('flipped');
			}
			break;
        case '/SmartDashboard/Drive/autoAim':
            if (value) {
                $('#driveAngle').show();
            } else {
                $('#driveAngle').hide();
            }
            break;
        case '/components/autoAim/target_angle':
            $('#driveAngle').innerHTML = value + 'º';
            if (Math.abs(value) < 10) {
                $('#driveAngle').css('color', 'green');
            } else if (Math.abs(value < 30)) {
                $('#driveAngle').css('color', 'yellow');
            } else {
                $('#driveAngle').css('color', 'red');
            }
            break;
		case '/SmartDashboard/startTheTimer':
			if (value) {
				document.getElementById('gameTimer').style.color = 'aqua';
				timerVar = setInterval(function() {
					currentSeconds--;
					var currentMinutes = parseInt(currentSeconds / 60);
					var actualSeconds = (currentSeconds % 60);

					actualSeconds = actualSeconds < 10 ? '0' + actualSeconds : actualSeconds;

					if (currentSeconds < 0) {
						window.clearTimeout(timerVar);
						return;
					} else if (currentSeconds <= 15) {
						document.getElementById('gameTimer').style.color = (currentSeconds % 2 === 0) ? '#FF3030' : 'white';
					} else if (currentSeconds <= 30) {
						document.getElementById('gameTimer').style.color = '#FF3030';
					}
					document.getElementById('gameTimer').innerHTML = currentMinutes + ':' + actualSeconds;
				}, 1000);
			} else {
				document.getElementById('gameTimer').innerHTML = '2:15';
				currentSeconds = 135;
			}
			NetworkTables.setValue('/SmartDashboard/startTheTimer', false);
			break;
		case '/SmartDashboard/Arm | Middle':
			if (value > 1200) {
				value = 1200;
			} else if (value < 0) {
				value = 0;
			} else {}
			$('#encoderSlider').val(value);
			$('#encoderValueDisplaySpan').text('Encoder Val: ' + value);
			break;
		case '/SmartDashboard/defenseSelector0':
		case '/SmartDashboard/defenseSelector1':
		case '/SmartDashboard/defenseSelector2':
		case '/SmartDashboard/defenseSelector3':
			var theChangedDiv = $('#' + propName);
			var realDefenseNamesLength = realDefenseNames.length;
			var defenseNum = -1;
			var defenseClass = -1;
			for (j = 0; j < realDefenseNamesLength; j++) {
				//search through the defense classes, check each one for the mode, return the defenseclass=(a) and the defenseNum=(b)
				for (k = 0; k < 2; k++) {
					if (realDefenseNames[j][k] == value) {
						defenseClass = j;
						defenseNum = k;
						break;
					}
				}
			}
			if (defenseClass == -1) {
				break;
			}
			//
			var s = parseInt(key.charAt(key.length - 1)) + 1;
			var thisAttacker = $('#attackerState' + s);
			console.log(thisAttacker);
			if (thisAttacker.attr('state') == 2) { //if it is allied or us, change it
				console.log('state is attacker');
				NetworkTables.setValue('/SmartDashboard/robotPosition', thisAttacker.attr('position'));
				NetworkTables.setValue('/SmartDashboard/robotDefense', defenseAutoNames[defenseClass][defenseNum]);

			}
			theChangedDiv.attr('defenseClass', defenseClass)
				.attr('defenseNumber', defenseNum);
			theChangedDiv.children('.selectionToggleBox')
				.attr('src', 'img/' + defenseNames[defenseClass] + defenseNum + '.png');
			break; //in case we want to add another listener to the swtich afterwards
		case '/SmartDashboard/Autonomous Mode/options':

			//if there is a change in the names of the autonomous modes check the select,clear it and rewrite
			var autonomousOptionSelect = $('#autonomousOptionSelect');
			autonomousOptionSelect.empty();
			var autonomousModeArrayLength = value.length;
			for (n = 0; n < autonomousModeArrayLength; n++) {
				//for each entry, make a option, get the value of currentlySelectedMode if it exists, if not then use the first
				autonomousOptionSelect.append('<option id=' + value[n] + 'AutoMode' + '>' + value[n] + '</option>');
			}
			autonomousOptionSelect.val(NetworkTables.getValue('/SmartDashboard/currentlySelectedMode'));
			break;
		case '/SmartDashboard/Autonomous Mode/default':
			//set the default options thingy to value if it exists.
			try {
				$('#autonomousOptionSelect').val(value);
			} catch (ex) {}
			break;
		case '/SmartDashboard/currentlySelectedMode':
			$('#autonomousOptionSelect').val(value);
			break;
		case '/SmartDashboard/attackerState0':
		case '/SmartDashboard/attackerState1':
		case '/SmartDashboard/attackerState2':
		case '/SmartDashboard/attackerState3':
		case '/SmartDashboard/attackerState4':
			var attackerImage = $('#' + propName);
			if (value == 'allied') {
				alliedCounter = 0;
				$('.attackerState').not(document.getElementById(propName)).each(function() {
					var thisAttacker = $(this);
					if (attackerNames[thisAttacker.attr('state')] == 'allied') {
						alliedCounter++;
						if (alliedCounter > 1) {
							NetworkTables.setValue('/SmartDashboard/' + thisAttacker.attr('id'), 'empty');
						}
					}
				});
			} else if (value == 'us') {
				var attackerIndex = attackerImage.attr('position');
				NetworkTables.setValue('/SmartDashboard/robotPosition', attackerIndex);
				//if value is us then get all of the other things and set anything equal to us to none
				$('.attackerState').not(document.getElementById(propName)).each(function() {
					var thisAttacker = $(this);
					if (attackerNames[thisAttacker.attr('state')] == 'us') {
						NetworkTables.setValue('/SmartDashboard/' + thisAttacker.attr('id'), 'empty');
					}
				});
				if (attackerIndex === 0) {
					NetworkTables.setValue('/SmartDashboard/robotDefense', 'lowbar');
				} else {
					var newPosition = parseInt(attackerIndex) - 1;
					var $defense = $('#defenseSelector' + newPosition);
					//defenseclass and defensenumber
					var defenseValue = defenseAutoNames[$defense.attr('defenseclass')][$defense.attr('defensenumber')];
					NetworkTables.setValue('/SmartDashboard/robotDefense', defenseValue);
				}
			}
			attackerImage.attr('state', attackerNames.indexOf(value)).attr('src', 'img/' + value + '.png');
			break;
		case '/SmartDashboard/LightBulb':
			if (value) {
				$('#bulb').attr('state', 'true');
				$('#bulb svg').attr('class', 'active');
			} else {
				$('#bulb').attr('state', 'false');
				$('#bulb svg').attr('class', '');
			}
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
							break;
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
			/*var settingsContainerDiv=document.getElementById('settingsContainerDiv');
			var UnorderedDivs = $('#settingsContainerDiv > div').children('[tableValue]:first');
			var UnorderedDivsLength=UnorderedDivs.length;
			var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split();
			for(a=0;a<UnorderedDivsLength;a++){
				if()
			}
					return $(a).children('[tableValue]:first').attr('tableValue') > $(b).children('[tableValue]:first').attr('tableValue');
			$(settingsContainerDiv).empty().append(alphabeticallyOrderedDivs);*/
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
	$('#autonomousSelection').hide();
	$(this).addClass('active');
	$('#tuningButton').removeClass('active');
	$('#autonomousButton').removeClass('active');
});
$('#tuningButton').click(function() {
	$('#tuning').show();
	$('#autonomousSelection').hide();
	$('#teleopButton').removeClass('active');
	$(this).addClass('active');
	$('#autonomousButton').removeClass('active');
});
$('#autonomousButton').click(function() {
	$('#tuning').hide();
	$('#autonomousSelection').show();
	$('#teleopButton').removeClass('active');
	$('#tuningButton').removeClass('active');
	$(this).addClass('active');
});

$('#robotDiagram').click(function() {
	if (ladderUpVis) {
        $('#robotDiagram *').css('stroke', 'aqua');
        $('.winch').hide();
        ladderUpVis = false;
	} else {
        $('#robotDiagram *').css('stroke', 'red');
        $('.winch').show();
        ladderUpVis = true;
	}
});
$('.camera').click(function() {
    NetworkTables.setValue('/SmartDashboard/Drive | backCamera', !NetworkTables.getValue('/SmartDashboard/Drive | backCamera'));
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
$('#bulb').click(function() {
    if ($('#bulb').attr('state') == 'true') {
        NetworkTables.setValue('/SmartDashboard/LightBulb', false);
    } else {
        NetworkTables.setValue('/SmartDashboard/LightBulb', true);
    }
});
$('#autoAimButton').mousedown(function() {
    NetworkTables.setValue('/SmartDashboard/Drive/autoAim', true);
    $('#autoAimButton svg').attr('class', 'active');
}).mouseup(function() {
    NetworkTables.setValue('/SmartDashboard/Drive/autoAim', false);
    $('#autoAimButton svg').attr('class', '');
});
