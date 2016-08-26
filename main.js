'use strict';

const electron = require('electron');
var spawn = require('child_process').spawn
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

var py, brunch;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

  if (process.platform == 'win32') {
    py = spawn('py', ['-3', './server.py']);
  } else {
    py = spawn('python3', ['./server.py']);
  }

  brunch = spawn('brunch', ['watch']);

  brunch.on('close', (code) => {
    console.log(`Brunch process exited with code ${code}`);
  });

  py.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 570,
    // 1366x570 is a good standard height, but you may want to change this to fit your DriverStation computer's screen better.
    // It's best if the dashboard takes up as much space as possible without covering the DriverStation application.
    // The window is closed until the python server is ready
    show: false
  });

  // Move window to top (left) of screen.
  mainWindow.setPosition(0, 0);

  var url = `file://${__dirname}/public/index.html`

  // Load the server URL.
  mainWindow.loadURL(url);

  mainWindow.webContents.openDevTools();

  // Once the python server is ready, reload the server
  mainWindow.once('ready-to-show', () => {
    mainWindow.loadURL(url);
    mainWindow.once('ready-to-show', () => {
      // Once it has reloaded, show the window
      mainWindow.show();
    })
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);
app.on('browser-window-created', function(e, window) {
  window.setMenu(null);
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    py.kill();
    brunch.kill();
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
