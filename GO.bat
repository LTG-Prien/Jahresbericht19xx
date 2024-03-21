@echo off
if "%os%"=="Windows_NT" goto nt
start index.htm
exit
:nt
cmd /c index.htm
exit
