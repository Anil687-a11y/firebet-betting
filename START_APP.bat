@echo off
echo ========================================
echo FireBet - Starting Application
echo ========================================
echo.
echo Checking for running processes...
echo.

REM Kill any existing node processes on our ports
taskkill /F /IM node.exe 2>nul

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Starting Backend on port 3001...
start "FireBet Backend" cmd /k "cd /d %~dp0 && node server/index.js"

timeout /t 5 /nobreak >nul

echo Starting Frontend on port 3000...
start "FireBet Frontend" cmd /k "cd /d %~dp0\client && npm start"

echo.
echo ========================================
echo FireBet is starting!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Wait 30-60 seconds for frontend to compile
echo Then open: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
