# FRC Driver Station

## Introduction

DriverStationJS is an extendable, web-browser-based driverstation for FIRST Robotics Competition.

* Completely legal for competition as it doesn't replace existing DriverStation functionality
* Touchscreen web browser interface provides richer control interface for secondary robot operator
* Lots of code commenting to help you easily understand code and add your robot's functions
* Inbuilt camera streaming system

Technologies used:
* NetworkTables
* [pynetworktables2js](https://github.com/robotpy/pynetworktables2js)

## Background

[FRC Team 1418 Vae Victis](https://github.com/frc1418) used an earlier version of this code in practice and competition throughout 2014, 2015, and 2016.  

This version of the code was created to serve as a boilerplate for other teams' UIs, and to be team-ambiguous.  

If, however, you still wish to view or utilize the team's original code, it can be found [here](/frc1418/2016-UI) (2016 code). Be warned that although it has some useful features which this code doesn't have yet, it is very outdated and poorly coded and is not recommended.

[2015 UI](/frc1418/2015-ui) (NOT Recommended!)  
[2014 code](/frc1418/2014) (All our 2014 robot code, including the UI, lumped together in one confusing repository. Please, please don't use this one.)

## Setting up



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


## Authors

* [Leon Tan](https://github.com/lleontan), UI Lead
* [Erik Boesen](https://github.com/ErikBoesen), design & code
* [Tim Winters](https://github.com/Twinters007), code

Special Thanks to [Dustin Spicuzza](https://github.com/virtuald), mentor and head of the [RobotPy](http://github.com/robotpy) project.
