// Set a global alias for the camera and related elements.
ui.camera = {
	viewer: document.getElementById('camera'),
	id: 0,
	srcs: [ // Will default to first camera
        'http://raspberrypi-6504.local:1185/?action=stream',
        'http://raspberrypi-6504.local:1187/?action=stream',
        //'INSERT THIRD CAMERA STREAM SOURCE',
        //'INSERT FOURTH CAMERA STREAM SOURCE',
        //'ETC'
    ]
};

// Unlike most addons, this addon doesn't interact with NetworkTables. Therefore, we won't need to add any NT listeners.

// When camera is clicked on, change to the next source.
ui.camera.viewer.onclick = function() {
    ui.camera.id += 1;
	if (ui.camera.id === ui.camera.srcs.length) ui.camera.id = 0;
	ui.camera.viewer.style.backgroundImage = 'url(' + ui.camera.srcs[ui.camera.id] + ')';
};
