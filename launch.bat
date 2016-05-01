@echo off

cd %~dp0
REM start py -3 driverStationServer.py --host=10.14.18.2
start py -3 driverStationServer.py --dashboard

start http://localhost:8888/ --window-size=1366,570 --window-position=0,0
