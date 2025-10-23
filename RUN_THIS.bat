@echo off
echo ========================================
echo Starting FireBet App...
echo ========================================
echo.
echo Backend will start on: http://localhost:5001
echo Frontend will start on: http://localhost:3000
echo.
echo Wait for both to start, then open:
echo http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop
echo ========================================
echo.

cd /d "%~dp0"

echo Starting Backend...
start "FireBet Backend" cmd /k "npm run server"

timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "FireBet Frontend" cmd /k "npm run client"

echo.
echo ========================================
echo FireBet is starting!
echo Check the two new terminal windows.
echo ========================================
echo.
echo Once you see "webpack compiled successfully"
echo Open: http://localhost:3000
echo.
pause
