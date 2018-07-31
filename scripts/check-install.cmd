@ECHO OFF
SETLOCAL

REM Exit with an error if installation requires elevation.
SET REQUIRES_ELEVATION=0
CALL :node
IF ERRORLEVEL 1 SET REQUIRES_ELEVATION=1
IF %REQUIRES_ELEVATION% == 0 git --version > NUL 2> NUL
IF ERRORLEVEL 1 SET REQUIRES_ELEVATION=1
IF %REQUIRES_ELEVATION% == 0 python --version > NUL 2> NUL
IF ERRORLEVEL 1 SET REQUIRES_ELEVATION=1
IF %REQUIRES_ELEVATION% == 0 CALL yarn --version > NUL 2> NUL
IF ERRORLEVEL 1 SET REQUIRES_ELEVATION=1
IF %REQUIRES_ELEVATION% == 1 (
	REM If there is an argument, the invoker wants to know if installation is
	REM required regardless of elevation.
	IF NOT "%~1" == "" EXIT /B 1
	net file > NUL 2> NUL
)
EXIT /B

REM Determine if an appropriate version of node is available.
:node
node -v > NUL 2> NUL
IF ERRORLEVEL 1 EXIT /B 1
FOR /F "delims=" %%I IN ('node -v') DO SET VERSION=%%I
IF "%VERSION:~0,1%" == "v" SET VERSION=%VERSION:~1%
IF "%VERSION:~1,1%" == "." (
	SET VERSION=%VERSION:~0,1%
) ELSE (
	SET VERSION=%VERSION:~0,2%
)
IF "%VERSION%" == "" SET VERSION=0
IF %VERSION% LSS 6 (
	ECHO Your current version of node is less than 6.  Before re-running this script,
	ECHO you must either uninstall the current version or, if you already have a later
	ECHO version installed, ensure it is earlier in your path so this and other
	ECHO Developer Rig scripts will use it.
	PAUSE
	EXIT 1
)
