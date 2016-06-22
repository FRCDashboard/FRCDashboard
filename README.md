# FRC Dashboard
FRC Dashboard is a fully customizable dashboard for [FIRST Robotics Competition (FRC)](http://firstinspires.org/robotics/frc) which is based on web languages (JavaScript/CSS/HTML). It's completely legal for competition, and can be used to give your secondary (or primary) operator significantly richer control of your robot.

This system is designed to be 100% accessible, tweakable, and expandable. To help in this aim, the code is rigorously documented with thousands of inline comments and [a set of training exercises](https://github.com/FRCDashboard/training). In addition, the base system comes with several functioning example widgets and features, and [many addons](https://github.com/FRCDashboard?query=addon-) have been created to speed up the development of your team's dashboard.

__Contributions are VERY welcome! Please feel free to open a pull request or issue!__

![Red theme](screenshots/red.png)

## Using the Dashboard

### Dependencies
* Python 3 (__MUST be 3, not 2!__)
* pynetworktables2js (`pip3 install pynetworktables2js`, or, if you don't have administrator privileges, put `--user` at the end of that command.)

### Setup
* For the camera to work, you must change the source in `style.css` to the IP of your live camera feed.

### Running
1. Connect to your robot's network. (If you're just testing the dashboard and don't currently need to use it with the robot, you can skip this step.)
2. Start dashboard server:

        python3 dashboardServer.py

3. View dashboard at `http://localhost:8888`.
4. It is recommended that you close the top panel of the FRC DriverStation to make room for the dashboard.

## Authors
* [Erik Boesen](https://github.com/ErikBoesen) is the primary
* [FRC Team 1418](https://github.com/frc1418) used earlier versions of this code in 2015 and 2016.
* [Leon Tan](https://github.com/lleontan) led the original 1418 UI team, coded pynetworktables2js, and developed the original web-browser-based UI which was later developed into FRC Dashboard.
* [Dustin Spicuzza](https://github.com/virtuald) mentored team 1418 through much of this technology's genesis and leads the [RobotPy](https://github.com/robotpy) project.

## License
This software is licensed under the `Apache 2.0` license. Basically, do whatever you want, as long as you give credit to the [original source](https://github.com/FRCDashboard/FRCDashboard), and keep the license with it. More information in `LICENSE`.

![Blue theme](screenshots/blue.png)
![Light theme](screenshots/light.png)
![Dark theme](screenshots/dark.png)