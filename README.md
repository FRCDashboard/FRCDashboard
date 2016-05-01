# FRC Driver Station

## Introduction

HTML5 & Javascript driver station interface. The
UI features:

* Touchscreen web browser interface provides richer control interface for secondary robot operator
* Provides full access to robot functionality
  * Can raise or lower the forklifts to any given position
  * Enable and disable automatic functions of the robot
  * Tune autonomous modes and other robot parameters in the pits
* Select one of multiple autonomous modes
* Live streaming camera views to assist operators when view is blocked

The HTML/JavaScript interface is made possible by using [pynetworktables2js](https://github.com/robotpy/pynetworktables2js) to forward NetworkTables traffic to the webpage. pynetworktables2js was initially prototyped by [Leon Tan](https://github.com/lleontan), our UI lead, but it is now maintained by the [RobotPy](http://github.com/robotpy) project so that other teams can benefit from our work.

Please note that this version of the UI is designed for a 1119x485 resolution. Since it's not designed to be responsive, you may have to play around with the CSS a bit to make it optimally fit your screen.

## Background

[FRC Team 1418 Vae Victis](https://github.com/frc1418) used an earlier version of this code in practice and competition throughout 2014, 2015, and 2016.  

This version of the code was created to serve as a boilerplate for other teams' UIs, and to be team-ambiguous.  

If, however, you still wish to view or utilize the team's original code, it can be found [here](/frc1418/2016-UI) (2016 code).

[2015 code](/frc1418/2015-ui) (NOT Recommended!)  
[2014 code](/frc1418/2014) (All our 2014 robot code lumped together in one confusing repository. Please, please don't use this one.)

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
