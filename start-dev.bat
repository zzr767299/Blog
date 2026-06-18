@echo off
cd /d "%~dp0"
set PWD=%cd%
set INIT_CWD=%cd%
set NODE_OPTIONS=--max-old-space-size=4096
yarn dev
pause
