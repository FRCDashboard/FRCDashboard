@echo off

cd %~dp0
start py -3 pynetworktables2js --dashboard

REM You'll have to tweak the window-size to work with your setup.
start http://localhost:8888/ --window-size=1366,570 --window-position=0,0 --app=http://localhost:8888/
