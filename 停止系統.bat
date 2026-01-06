@echo off
chcp 65001 >nul
title 停止廟宇求籤系統

echo ========================================
echo       正在停止所有伺服器...
echo ========================================
echo.

:: Kill node processes
taskkill /f /im node.exe >nul 2>nul

echo [完成] 所有伺服器已停止
echo.
pause
