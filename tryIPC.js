let ipc, noElectron = false;
try {
    ipc = require('electron').ipcRenderer;
}
catch (e) {
    noElectron = true;
}
