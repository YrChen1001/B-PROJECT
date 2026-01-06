@echo off
chcp 65001 >nul
title 廟宇求籤系統

echo ========================================
echo       廟宇求籤系統 啟動中...
echo ========================================
echo.

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [錯誤] 未偵測到 Node.js！
    echo.
    echo 請先安裝 Node.js：
    echo 1. 前往 https://nodejs.org/
    echo 2. 下載並安裝 LTS 版本
    echo 3. 安裝完成後重新執行此檔案
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo [資訊] 首次執行，正在安裝依賴套件...
    echo 這可能需要幾分鐘，請耐心等待...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [錯誤] 安裝依賴套件失敗！
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依賴套件安裝完成！
    echo.
)

echo [啟動] 正在啟動列印伺服器...
start "列印伺服器" cmd /k "npm run server"

:: Wait a moment for print server to start
timeout /t 2 /nobreak >nul

echo [啟動] 正在啟動網站伺服器...
start "網站伺服器" cmd /k "npm run dev"

echo.
echo ========================================
echo        系統啟動完成！
echo ========================================
echo.
echo 請在瀏覽器中開啟以下網址：
echo.
echo   求籤頁面：http://localhost:5173
echo   管理後台：http://localhost:5173/admin
echo.
echo 提示：關閉此視窗不會影響伺服器運作
echo       若要停止伺服器，請關閉另外兩個黑色視窗
echo.
pause
