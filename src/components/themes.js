// Create an alias for theme-related DOM objects
ui.theme = {
    select: document.getElementById('theme-select'),
    link: document.getElementById('theme-link')
};

// Listen for a theme change
NetworkTables.addKeyListener('/SmartDashboard/theme', (key, value) => {
    ui.theme.select.value = value;
    ui.theme.link.href = 'css/' + value + '.css';
});

// When theme selection is made, turn on that theme
ui.theme.select.onchange = function() {
    NetworkTables.setValue('/SmartDashboard/theme', this.value);
};
