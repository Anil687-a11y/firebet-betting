@echo off
echo ========================================
echo FireBet Installation Script
echo ========================================
echo.

echo [1/3] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed!
echo.

echo [2/3] Installing frontend dependencies...
call npm --prefix client install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed!
echo.

echo [3/3] Checking uploads folder...
if not exist "uploads" (
    mkdir uploads
    echo Uploads folder created!
) else (
    echo Uploads folder already exists!
)
echo.

echo ========================================
echo Installation Complete! 
echo ========================================
echo.
echo To start the app, run:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
pause
