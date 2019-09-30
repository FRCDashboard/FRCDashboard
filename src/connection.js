let address = document.getElementById('connect-address'),
  connect = document.getElementById('connect'),
  buttonConnect = document.getElementById('connect-button');

let loginShown = true;

// Set function to be called on NetworkTables connect. Not implemented.
//NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

// Set function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);

// Sets function to be called when any NetworkTables key/value changes
//NetworkTables.addGlobalListener(onValueChanged, true);

// Function for hiding the connect box
onkeydown = key => {
  if (key.key === 'Escape') {
    document.body.classList.toggle('login', false);
    loginShown = false;
  }
};

buttonConnect.onclick = () => {
  document.body.classList.toggle('login', true);
  loginShown = true;
  
  setLogin();
};

/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection(connected) {
  var state = connected ? 'Robot connected!' : 'Robot disconnected.';
  console.log(state);
  ui.robotState.textContent = state;
  
  if (connected) {
    // On connect hide the connect popup
    document.body.classList.toggle('login', false);
    loginShown = false;
  } else if (loginShown) {
    setLogin();
  }
}
function setLogin() {
  // Add Enter key handler
  // Enable the input and the button
  address.disabled = connect.disabled = false;
  connect.textContent = 'Connect';
  // Add the default address and select xxxx
  address.value = 'roborio-xxxx-frc.local';
  address.focus();
  address.setSelectionRange(8, 12);
}
// On click try to connect and disable the input and the button
connect.onclick = () => {
  ipc.send('connect', address.value);
  address.disabled = connect.disabled = true;
  connect.textContent = 'Connecting...';
};
address.onkeydown = ev => {
  if (ev.key === 'Enter') {
    connect.click();
    ev.preventDefault();
    ev.stopPropagation();
  }
};

// Show login when starting
document.body.classList.toggle('login', true);
setLogin();
