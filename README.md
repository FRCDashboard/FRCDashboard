# FRC Dashboard
FRC Dashboard is a fully customizable dashboard for [FIRST Robotics Competition (FRC)](http://firstinspires.org/robotics/frc) which is based on web languages (JavaScript/CSS/HTML). It's completely legal for competition, and can be used to give your whole drive team significantly richer control of your robot.

The dashboard's code is designed to be 100% accessible, tweakable, and expandable. To help in this aim, the code is rigorously commented and [a set of training exercises](https://github.com/FRCDashboard/training) have been prepared to orient new users. In addition, the base system comes with several functioning example widgets and features, and we've build [several helpful addons](https://github.com/FRCDashboard?query=addon-) to speed up the development of your team's dashboard.

**Contributions are VERY welcome! Please feel free to open a pull request or issue!**

**As of Late March 2017 pynetworktables2js has been replaced by [FTC-NT-Client](https://github.com/rakusan2/FRC-NT-Client) in Electron thereby removing the Python dependency.** This is not the case if this application is used through a browser.


![Screenshot slideshow](images/screenshots.gif)

<details>
   <summary>Click to view some example implementations of FRC Dashboard</summary>
   
![1132's 2017 Dashboard](images/example-1132.jpg)
![6325's 2017 Dashboard](https://i.redd.it/w9jt1gmbecpy.png)
![1418's 2017 Dashboard](https://raw.githubusercontent.com/frc1418/2017-dashboard/master/images/screenshot.png)
![1418's 2016 Dashboard](https://raw.githubusercontent.com/frc1418/FRCDashboard/2016/screenshot.png)
</details>

## Setup
### Dependencies
* [`nodejs`](https://nodejs.org) & [`npm`](https://npmjs.com)
    * If you don't have permission to install these, see [this gist](https://gist.github.com/isaacs/579814) for a workaround.
* Node dependencies (to install, `cd` into dashboard directory and run `npm install`)
* Python 3
    * If you are installing `mjpg-streamer` or are using this application through the browser

### Configuration
* In `ui.js`, there are a bunch of key handler functions which controls the updating of control elements in the dashboard. Example NetworkTables key names are used, but you'll need to change them to match those used in your team's robot code for them to affect anything on your robot.


#### Configuring Camera feed
In order to run the camera, you must start an `mjpg-streamer` server on the RoboRIO. To install `mjpg-streamer`:

1. Download [this installer script](https://raw.githubusercontent.com/robotpy/robotpy-installer/master/robotpy_installer/installer.py) from GitHub. This script is for downloading and installing packages to the RoboRIO.
2. While in the directory where you downloaded the installer script, run:

    Windows:

        py -3 installer.py download-opkg mjpg-streamer
        py -3 installer.py install-opkg mjpg-streamer

    Mac/Linux (using bash):

        python3 installer.py download-opkg mjpg-streamer
        python3 installer.py install-opkg mjpg-streamer

3. Update `style.css` to use the IP of your live camera feed. Usually this is something like `roborio-XXXX-frc.local:5800/?action=stream`, where `XXXX` is your team's number. The port may vary.


## Building
This enables the user to turn this entire application into a single .exe or .app file witch then can be run from any computer
 
1. Get `npm`
2. Run `npm i` to install all of the dependencies
3. Run `npm run dist` to pack the entire application into a single folder or `npm run distAll` to create an application for all x64 platforms
4. Then copy the folder to where ever you want to run it from and run the `FRCDashboard` executible inside

## Running
1. Connect to your robot's network if you haven't already. (If you're just testing the dashboard and don't currently need to use it with your robot, you can skip this step.)
2. If you are able to use node/npm, use the section below labeled "Using dashboard as Application." If not, use the section titled "Using dashboard through web browser."

### Using dashboard as Application
The preferred method of using the dashboard is to run it using the [Electron](http://electron.atom.io) framework. Your dashboard will be its own application, and will be easy to manipulate.

While in the dashboard directory, run:

    npm start

This will open the dashboard application. Note that you don't have to close and reopen the application every time you make a change, you can just press `Ctrl+R` (`Cmd+R` or `⌘+R` on Mac) to refresh the application as long as you do not change main.js or tryIPC.js

### Using dashboard through web browser
The less desirable, but perfectly functional method of viewing your dashboard is to use it like a webpage. This method will work even if you don't have the privileges to install `node.js` and `npm`. The standard toolbars from your browser will still be shown and will take up space on the screen, and the experience will be a bit less fluid, but it will work.

1. Start the Python server independently:

    Windows:

        py -3 -m pynetworktables2js

    Mac/Linux (using bash):

        python3 -m pynetworktables2js

2. To view the dashboard, use your browser to navigate to `http://localhost:8888`.


It is recommended that while using the dashboard on your driver station, you close the top panel of the FRC DriverStation to make room for the dashboard.

## Authors
* [Erik Boesen](https://github.com/ErikBoesen) is the primary developer of FRC Dashboard.
* [Team 1418](https://github.com/frc1418) used earlier versions of this code in 2015 and 2016.
* [Leon Tan](https://github.com/lleontan) led the original 1418 UI team, coded pynetworktables2js, and developed a browser-based UI which was years later reworked to create FRC Dashboard.
* [Dustin Spicuzza](https://github.com/virtuald) leads the [RobotPy](https://github.com/robotpy) project mentored team 1418 through much of FRC Dashboard's genesis.
* [Tomas Rakusan](https://github.com/rakusan2) Developed Node based [NetworkTables client](https://github.com/rakusan2/FRC-NT-Client) and its interface in this project

## Modifying
FRC Dashboard is designed to be modified for your team's purposes, so you're allowed to do whatever you think is best for you. However, it would be good if you could fork this repository or copy it to another. This will allow you to easily pull updates when they occur, and if you fork it helps us tell who's using it.

This software is licensed under the MIT license. Basically, you can modify as much as you like, as long as you give credit where it's due and you don't hold us accountable for anything. More information in `LICENSE`.