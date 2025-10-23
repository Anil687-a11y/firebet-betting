@echo off
echo ========================================
echo Pushing FireBet to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Initializing Git...
git init

echo [2/5] Adding all files...
git add .

echo [3/5] Committing...
git commit -m "Initial commit - FireBet app"

echo [4/5] Setting branch to main...
git branch -M main

echo [5/5] Ready to push!
echo.
echo ========================================
echo NEXT STEP:
echo ========================================
echo.
echo Run this command (replace YOUR-USERNAME):
echo.
echo git remote add origin https://github.com/YOUR-USERNAME/firebet-app.git
echo git push -u origin main
echo.
echo ========================================
pause
