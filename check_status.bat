@echo off
REM MovieEase Diagnostic Script
REM This script checks if both servers are running correctly

echo.
echo ========================================
echo MovieEase Diagnostic Check
echo ========================================
echo.

REM Check if Flask API is accessible
echo Checking Flask API (localhost:5000)...
curl -s http://localhost:5000/ > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Flask API is running
    echo Checking sample movie endpoint...
    curl -s http://localhost:5000/movie/278 > nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] API can fetch movies
    ) else (
        echo [ERROR] API cannot fetch movies - check that Python requirements are installed
    )
) else (
    echo [ERROR] Flask API is NOT running
    echo   Start it with: python api.py (from recommendation folder)
)

echo.
echo Checking React dev server (localhost:3000)...
curl -s http://localhost:3000/ > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] React frontend is running
) else (
    echo [ERROR] React frontend is NOT running
    echo   Start it with: npm start (from frontend folder)
)

echo.
echo ========================================
echo Diagnostic check complete
echo ========================================
echo.
