@echo off

cd %~dp0
start py -3 pynetworktables2js --dashboard

start http://localhost:8888/ --window-size=1366,570 --window-position=0,0
