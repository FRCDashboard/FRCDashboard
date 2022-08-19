const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	sendReady: () => ipcRenderer.send('ready'),
	sendAdd: mesg => ipcRenderer.send('add', mesg),
	sendUpdate: mesg => ipcRenderer.send('update', mesg),
	sendConnect: mesg => ipcRenderer.send('connect', mesg),
	sendWindowError: mesg => ipcRenderer.send('windowError', mesg),
	onConnected: fn => ipcRenderer.on('connected', (ev, con) => fn(ev, con)),
	onAdd: fn => ipcRenderer.on('add', (ev, mesg) => fn(ev, mesg)),
	onDelete: fn => ipcRenderer.on('delete', (ev, mesg) => fn(ev, mesg)),
	onUpdate: fn => ipcRenderer.on('update', (ev, mesg) => fn(ev, mesg)),
	onFlagChange: fn => ipcRenderer.on('flagChange', (ev, mesg) => fn(ev, mesg)),
});