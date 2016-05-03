# FRC Dashboard

FRC Dashboard is an extendable, web-browser-based dashboard for FIRST Robotics Competition (FRC).

* Completely legal for competition as it works alongside standard DriverStation
* Touchscreen web browser interface provides richer control interface for secondary robot operator
  * While it's designed for touchscreens, can work without
* Lots of code commenting to help you easily understand code and add your robot's functions
* Inbuilt camera streaming system, gyroscope, encoder control, and example buttons

Technologies used:
* NetworkTables
* [pynetworktables2js](/robotpy/pynetworktables2js)

## Background

[FRC Team 1418 Vae Victis](/frc1418) used an earlier version of this code in practice and competition throughout 2014, 2015, and 2016.

## Setting up

* For the camera to work, you must change the source in `index.html` to the IP of your live camera feed. This may take some tweaking.
* It is recommended that you close the top panel of the FRC DriverStation to make room for a sized-down Chrome window.

## Running the code

### Requirements

python 3 must be installed!

Make sure you have pynetworktables2 installed:

    pip3 install pynetworktables2js

### Start the dashboard server

Run this command:

    python3 dashboardServer.py

### Open dashboard

Open Chrome and go to:

    http://localhost:8888

## Addons

There are several prebuilt addons for FRC Dashboard:
* [Gyro](/FRCDashboard/FRCDashboard-Gyro)
* [Camera Tuner](/FRCDashboard/FRCDashboard-CameraTuner)
* [Tuning](/FRCDashboard/FRCDashboard-Tuning)
* More coming soon!

## Authors

* [Erik Boesen](/ErikBoesen)

### Other authors
* [Leon Tan](/lleontan), lead of original 1418 UI team, coder of first iteration of UI and pynetworktables2js
* [Dustin Spicuzza](/virtuald), 1418 mentor and head of the [RobotPy](/robotpy) project.

## License

© 2016 [Erik Boesen](/ErikBoesen), [Leon Tan](/lleontan), [Dustin Spicuzza](/virtuald).  
This software is licensed under the Apache 2.0 license. Basically, you can do whatever you want, as long as you give credit to the original source, and keep the license with it.