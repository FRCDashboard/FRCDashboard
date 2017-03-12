let ipc:Electron.IpcRenderer,
    noElectron = false
try{
    ipc = require('electron').ipcRenderer
}catch(e){
    noElectron = true
}