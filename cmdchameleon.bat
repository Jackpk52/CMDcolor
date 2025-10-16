@echo off
echo [CMDChameleon] Loading...

set CHAMELEON_DIR=%~dp0

if "%1"=="wizard" (
    echo Starting interactive wizard...
    cd /d "%CHAMELEON_DIR%js"
    call npm install
    node interactive.js
    exit /b
)

if "%1"=="build" (
    echo Building C components...
    cd /d "%CHAMELEON_DIR%"
    make
    exit /b
)

if "%1"=="" (
    echo.
    echo CMDChameleon - Command Line Customizer
    echo.
    echo Usage:
    echo   cmdchameleon wizard    - Interactive setup
    echo   cmdchameleon build     - Build C components
    echo   cmdchameleon theme NAME - Apply theme
    echo.
    echo Example: cmdchameleon theme hacker
    exit /b
)

if "%1"=="theme" (
    if "%2"=="" (
        echo Please specify a theme name
        exit /b 1
    )
    echo Applying theme: %2
    python "%CHAMELEON_DIR%py/main.py" --theme %2
    exit /b
)

echo Unknown command: %1