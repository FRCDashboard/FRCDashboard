# FRC Dashboard
FRC Dashboard is a fully customizable dashboard for [FIRST Robotics Competition (FRC)](http://firstinspires.org/robotics/frc) which is based on web languages (JavaScript/CSS/HTML). It's completely legal for competition, and can be used to give your whole drive team significantly richer control of your robot.

The dashboard's code is designed to be 100% accessible, tweakable, and expandable. To help in this aim, the code is rigorously documented with thousands of inline comments and [a set of training exercises](https://github.com/FRCDashboard/training). In addition, the base system comes with several functioning example widgets and features, and [many addons](https://github.com/FRCDashboard?query=addon-) have been created to speed up the development of your team's dashboard.

**Contributions are VERY welcome! Please feel free to open a pull request or issue!**

![Screenshot slideshow](screenshots.gif)

## Setup
### Dependencies
* Python 3 **(MUST be 3, not 2!)**
* `pynetworktables2js`

        pip3 install pynetworktables2js

    If you don't have administrator privileges, put `--user` at the end of that command.)

If you're going to be using the preferred method of using the dashboard (as an application), you'll also need:
* [`nodejs`](https://nodejs.com) & [`npm`](https://npmjs.com)
    * If you don't have permission to install these, see [this gist](https://gist.github.com/isaacs/579814) for a workaround.
* Electron (to install, `cd` into dashboard directory and run `npm install`)

### Configuration
* In `ui.js`, there's a large `switch` statement in the `onValueChanged()` function which controls the updating of control elements in the dashboard. Example NetworkTables key names are used, but you'll need to change them to match those used in your team's robot code for them to affect anything on your robot.
* For the camera to work, you must change the source in `style.css` to the IP of your live camera feed.

## Running
1. Connect to your robot's network. (If you're just testing the dashboard and don't currently need to use it with the robot, you can skip this step.)
2. Start dashboard server.

    Windows:

        start py -3 server.py

    Mac/Linux (using bash):

        python3 server.py

3. If you are able to use node/npm, use the section below labeled "Running dashboard as Application." If not, use the section titled "Running dashboard through web browser."

### Running dashboard as Application
The preferred method of using the dashboard is to run it using the [Electron](http://electron.atom.io) framework. Your dashboard will be its own application, and will be easy to manipulate.

While in the dashboard directory, run:

    npm start

This will start the application. Note that you don't have to close and reopen the application every time you make a change, you can just press `Ctrl+R` (`Cmd+R` on Mac) to refresh the application.

### Running dashboard through web browser
The less desirable, but perfectly functional method of viewing your dashboard is to use it like a webpage. This method will work even if you don't have the privileges to install `node.js` and `npm`. The standard toolbars from your browser will still be shown and will take up space on the screen, and the experience will be less fluid, but it will work.

To view the dashboard, use your browser to navigate to `http://localhost:8888`.



It is recommended that while using the dashboard on your driver station, you close the top panel of the FRC DriverStation to make room for the dashboard.

## Authors
* [Erik Boesen](https://github.com/ErikBoesen) is the primary developer of FRC Dashboard.
* [Team 1418](https://github.com/frc1418) used earlier versions of this code in 2015 and 2016.
* [Leon Tan](https://github.com/lleontan) led the original 1418 UI team, coded pynetworktables2js, and developed a web-browser-based UI which was years later reworked to create FRC Dashboard.
* [Dustin Spicuzza](https://github.com/virtuald) leads the [RobotPy](https://github.com/robotpy) project mentored team 1418 through much of FRC Dashboard's genesis.

## License
This software is licensed under the `Apache 2.0` license. Basically, do whatever you want, as long as you give credit to the [original source](https://github.com/FRCDashboard/FRCDashboard), and keep the license with it. More information in `LICENSE`.
