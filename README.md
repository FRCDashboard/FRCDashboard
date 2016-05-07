# FRC Dashboard

FRC Dashboard is an extendable, fully customizable, web-based dashboard for FIRST Robotics Competition (FRC).

__Contributions are VERY welcome! Please feel free to open a pull request or issue with improvements or a new feature.__

* Completely legal for competition as it works alongside standard DriverStation
* Web browser interface provides richer control interface for secondary robot operator
  * Works with or without touchscreen
* Lots of code commenting to help you easily understand code and add your robot's functions
* Inbuilt camera streaming system, SVG gyroscope, encoder control, and example buttons
* Lots of addons to easily create new dashboard widgets for your own use!

Technologies used:
* NetworkTables
* [pynetworktables2js](https://github.com/robotpy/pynetworktables2js)

## Background

[FRC Team 1418 Vae Victis](https://github.com/frc1418) used an earlier version of this code in practice and competition throughout 2014, 2015, and 2016.

## Setting up

* For the camera to work, you must change the source in `index.html` to the IP of your live camera feed. This may take some tweaking depending on how your camera stream works. We use and recommend [MJPG Streamer](https://github.com/jacksonliam/mjpg-streamer).
* It is recommended that you close the top panel of the FRC DriverStation to make room for a sized-down Chrome window.

## Running the code

### Requirements

Python 3 must be installed!

Make sure you have pynetworktables2 installed:

    pip3 install pynetworktables2js

### Start the dashboard server

Run this command:

    python3 dashboardServer.py

### Open dashboard

Open Chrome and go to:

    http://localhost:8888

If you're on Windows, you can open `launch.bat`, which will start the server and open Chrome.

## Addons

There are several prebuilt addons for FRC Dashboard:
* [MultiCamera](https://github.com/FRCDashboard/addon-MultiCamera) - Toggle between multiple camera views, great if your robot has multiple cameras.
* [Tuning](https://github.com/FRCDashboard/addon-Tuning) - Easily modify NetworkTables variables directly. _Included by default_
* [Gyro](https://github.com/FRCDashboard/addon-Gyro) - gyroscope widget to help orient your robot. _Included by default._
* [Encoder Slider](https://github.com/FRCDashboard/addon-EncoderSlider) - Slider to change encoder value. Can be easily repurposed to modify any NetworkTables value. _Included by default._
* More coming soon!

## Authors

* [Erik Boesen](https://github.com/ErikBoesen)

### Other authors
* [Leon Tan](https://github.com/lleontan), lead of original 1418 UI team, coder of first iteration of UI and pynetworktables2js
* [Dustin Spicuzza](https://github.com/virtuald), 1418 mentor and head of the [RobotPy](https://github.com/robotpy) project.

## License

This software is licensed under the Apache 2.0 license. Basically, you can do whatever you want, as long as you give credit to the original source, and keep the license with it.