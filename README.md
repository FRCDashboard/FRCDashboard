# FRC Driver Station

## Introduction

DriverStationJS is an extendable, web-browser-based driverstation for FIRST Robotics Competition (FRC).

* Completely legal for competition as it works alongside standard DriverStation
* Touchscreen web browser interface provides richer control interface for secondary robot operator
* Lots of code commenting to help you easily understand code and add your robot's functions
* Inbuilt camera streaming system

Technologies used:
* NetworkTables
* [pynetworktables2js](https://github.com/robotpy/pynetworktables2js)

## Background

[FRC Team 1418 Vae Victis](https://github.com/frc1418) used an earlier version of this code in practice and competition throughout 2014, 2015, and 2016.

## Setting up

* For the camera to work, you must change the source in `index.html` to the IP of your live camera feed. This may take some tweaking.
* It is recommended that you close the top panel of the standard FRC DriverStation to make room for a sized-down Chrome window.

## Running the code

### Requirements

python 3 must be installed!

Make sure you have pynetworktables2 installed:

    pip3 install pynetworktables2js

### Connect to a local simulation

Run this command:

    python3 driverStationServer.py

### Connect to the robot

Run this command:

    python3 driverStationClientV1.py --host=roborio-1418-frc.local

### View the output

Open Chrome and go to:

    http://localhost:8888

## Addons

There are several prebuilt addons for DriverStationJS:
* [Gyro](https://github.com/driverstationjs-gyro)
* [Camera Tuner](https://github.com/driverstationjs-cameratuner)
* [Tuning](https://github.com/driverstationjs-tuning)
* More coming soon!

## Authors

* [Erik Boesen](https://github.com/ErikBoesen)

### Other authors
* [Leon Tan](https://github.com/lleontan), lead of original 1418 UI team, coder of first iteration of UI and pynetworktables2js
* [Dustin Spicuzza](https://github.com/virtuald), 1418 mentor and head of the [RobotPy](http://github.com/robotpy) project.
