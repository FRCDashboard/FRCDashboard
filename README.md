# Phoenix Dashboard

This dashboard is built on pynetworktables2js, forked from https://github.com/FRCDashboard/FRCDashboard.

It has been modified from the nodejs network tables connection which had some issues connecting to the robot.

## Installation

With python and nodejs installed on your computer, run

```
npm install
```

Then connect to the robot and run

```
npm start
```
The server will connect to the robot, and launch a server at http://localhost:8888.

A secondary, camera only screen will launch at http://localhost:8888/camera