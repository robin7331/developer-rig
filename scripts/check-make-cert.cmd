@ECHO OFF
SETLOCAL

REM Exit with an error if certificate creation requires elevation.
SET SSL=%~dp0..\ssl
SET HAS_ALL_FILES=NO
IF EXIST "%SSL%\cacert.crt" IF EXIST "%SSL%\cacert.key" (
	IF EXIST "%SSL%\selfsigned.crt" IF EXIST "%SSL%\selfsigned.key" (
		IF EXIST "%SSL%\server.crt" IF EXIST "%SSL%\server.key" SET HAS_ALL_FILES=YES
	)
)
IF "%HAS_ALL_FILES%" == "YES" (
	powershell -Command "& {Get-ChildItem -Path Cert:\LocalMachine\Root}" | FIND "Twitch Developer Rig CA" > NUL
	IF NOT ERRORLEVEL 1 EXIT /B 0
)

REM If there is an argument, the invoker wants to know if certificate
REM installation is required regardless of elevation.
IF NOT "%~1" == "" EXIT /B 1
net file > NUL 2> NUL
EXIT /B
