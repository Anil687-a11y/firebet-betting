@echo off
echo ========================================
echo Starting FireBet...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

start cmd /k "npm run server"
timeout /t 3 /nobreak >nul
start cmd /k "npm run client"

echo.
echo FireBet is starting...
echo Check the new terminal windows!
echo.
pause
