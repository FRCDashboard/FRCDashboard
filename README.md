[<img src="images/icon.png" align="right" width="150">](https://github.com/FRCDashboard/FRCDashboard)
# FRC Dashboard
FRC Dashboard is a fully customizable dashboard for [FIRST Robotics Competition (FRC)](http://firstinspires.org/robotics/frc) which is based on web languages (JavaScript/CSS/HTML). It's completely legal for competition, and can be used to give your whole drive team significantly richer control of your robot.

The dashboard's code is designed to be 100% accessible and expandable. To this aim, the code is rigorously commented and [a set of training exercises](https://github.com/FRCDashboard/training) have been prepared to orient new users. In addition, the base system comes with several functioning example widgets and features, and we've build [several helpful addons](https://github.com/FRCDashboard?query=addon-) to speed up the development of your team's dashboard.

**Contributions are VERY welcome! Please feel free to open a pull request or issue!**

![Screenshot slideshow](images/screenshots.gif)

<details>
    <summary>Click to view some example implementations of FRC Dashboard</summary>

![1132's 2017 Dashboard](https://i.imgur.com/iSiTxjY.jpg)  
![6325's 2017 Dashboard](https://i.redd.it/w9jt1gmbecpy.png)  
![1418's 2017 Dashboard](https://raw.githubusercontent.com/frc1418/2017-dashboard/master/images/screenshot.png)  
![1418's 2016 Dashboard](https://raw.githubusercontent.com/frc1418/FRCDashboard/2016/screenshot.png)  

</details>

## Setup
You'll need [`nodejs`](https://nodejs.org) & [`npm`](https://npmjs.com).

Before running your dashboard, you'll need to install the node dependencies by `cd`ing into the dashboard directory and running `npm install`.

### Configuration
* In `ui.js`, there are a bunch of key handler functions which controls the updating of control elements in the dashboard. Example NetworkTables key names are used, but you'll need to change them to match those used in your team's robot code for them to affect anything on your robot.

#### Camera feed
FRC Dashboard supports display of MJPG camera streams. Once you've created a stream (using WPILib's `CameraServer` class, [mjpg-streamer](https://robotpy.github.io/2016/01/14/mjpg-streamer-for-roborio/) (deprecated), or another method), update `style.css` to use the IP of your live camera feed. Usually this is something like `roborio-XXXX-frc.local:5800/?action=stream`, where `XXXX` is your team's number. The port may vary.

## Building
Some users may wish to compile their dashboard applications into standalone `.exe` or `.app` files.

Assuming the necessary setup steps have been performed, users may run `npm run package-[platform]`, where `[platform]` is `linux`, `mac`, or `win` according to the target platform, to pack the entire application into a single executable.

## Running
Connect to your robot's network if you haven't already. (If you're just testing the dashboard and don't currently need to use it with your robot, you can skip this step.)

While in the dashboard directory, run:

    npm start

This will open the dashboard application. Note that you can refresh the page and client-side updates will take effect; reopening the whole application is usually unnecessary.

It is recommended that while using the dashboard on your driver station, you close the top panel of the FRC DriverStation to make room for the dashboard.

## Authors
* [Erik Boesen](https://github.com/ErikBoesen) is the primary developer of FRC Dashboard.
* [Team 1418](https://github.com/frc1418) used earlier versions of this code in 2015 and 2016.
* [Leon Tan](https://github.com/lleontan) led the original 1418 UI team, coded `pynetworktables2js`, and developed a browser-based UI which was years later reworked to create FRC Dashboard.
* [Dustin Spicuzza](https://github.com/virtuald) leads the [RobotPy](https://github.com/robotpy) project, and mentored Team 1418 through much of FRC Dashboard's genesis.
* [Tomas Rakusan](https://github.com/rakusan2) Developed Node based [NetworkTables client](https://github.com/rakusan2/FRC-NT-Client) and its interface in this project.

## Licensing
This software is available under the [MIT License](`LICENSE`).
