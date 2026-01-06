@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title 廟宇求籤系統 - 一鍵安裝程式

:: ========================================
:: 廟宇求籤系統 - Windows 一鍵安裝程式
:: ========================================
:: 使用方式：將此檔案放在任意位置，雙擊執行即可
:: 系統會在此檔案所在目錄建立專案資料夾
:: ========================================

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           廟宇求籤系統 - 一鍵安裝程式                      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

set "PROJECT_NAME=Temple-Fortune-System"
set "REPO_URL=https://github.com/YrChen1001/B-PROJECT.git"
set "INSTALL_DIR=%~dp0%PROJECT_NAME%"

echo [資訊] 安裝目錄: %INSTALL_DIR%
echo.

:: ========================================
:: 步驟 1: 檢查並安裝 Git
:: ========================================
echo [1/5] 檢查 Git...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] 未偵測到 Git，正在下載安裝程式...
    echo.
    
    :: Download Git installer using PowerShell
    set "GIT_INSTALLER=%TEMP%\git-installer.exe"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe' -OutFile '%GIT_INSTALLER%'}"
    
    if not exist "%GIT_INSTALLER%" (
        echo [錯誤] 無法下載 Git 安裝程式！
        echo 請手動前往 https://git-scm.com/download/win 下載安裝
        pause
        exit /b 1
    )
    
    echo [資訊] 正在安裝 Git（靜默安裝）...
    "%GIT_INSTALLER%" /VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS /COMPONENTS="icons,ext\reg\shellhere,assoc,assoc_sh"
    
    :: Refresh PATH
    set "PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
    
    :: Verify installation
    where git >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [警告] Git 安裝可能需要重新啟動命令提示字元
        echo 請關閉此視窗後重新執行安裝程式
        pause
        exit /b 1
    )
    
    echo [成功] Git 安裝完成！
) else (
    echo [OK] Git 已安裝
)
echo.

:: ========================================
:: 步驟 2: 檢查並安裝 Node.js
:: ========================================
echo [2/5] 檢查 Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] 未偵測到 Node.js，正在下載安裝程式...
    echo.
    
    :: Download Node.js LTS installer using PowerShell
    set "NODE_INSTALLER=%TEMP%\node-installer.msi"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi' -OutFile '%NODE_INSTALLER%'}"
    
    if not exist "%NODE_INSTALLER%" (
        echo [錯誤] 無法下載 Node.js 安裝程式！
        echo 請手動前往 https://nodejs.org/ 下載安裝
        pause
        exit /b 1
    )
    
    echo [資訊] 正在安裝 Node.js（這可能需要幾分鐘）...
    msiexec /i "%NODE_INSTALLER%" /qn /norestart
    
    :: Refresh PATH - Node.js default install location
    set "PATH=%PATH%;C:\Program Files\nodejs"
    
    :: Wait a moment for installation to complete
    timeout /t 5 /nobreak >nul
    
    :: Verify installation
    where node >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [警告] Node.js 安裝可能需要重新啟動命令提示字元
        echo 請關閉此視窗後重新執行安裝程式
        pause
        exit /b 1
    )
    
    echo [成功] Node.js 安裝完成！
) else (
    echo [OK] Node.js 已安裝
)
echo.

:: ========================================
:: 步驟 3: 克隆專案
:: ========================================
echo [3/5] 下載專案...
if exist "%INSTALL_DIR%" (
    echo [資訊] 專案資料夾已存在，跳過下載
    cd /d "%INSTALL_DIR%"
) else (
    echo [資訊] 正在從 GitHub 下載專案...
    git clone "%REPO_URL%" "%INSTALL_DIR%"
    if %ERRORLEVEL% NEQ 0 (
        echo [錯誤] 專案下載失敗！請檢查網路連線
        pause
        exit /b 1
    )
    cd /d "%INSTALL_DIR%"
    echo [成功] 專案下載完成！
)
echo.

:: ========================================
:: 步驟 4: 安裝依賴套件
:: ========================================
echo [4/5] 安裝依賴套件...
if not exist "node_modules" (
    echo [資訊] 正在安裝依賴套件（首次執行需要較長時間）...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [錯誤] 依賴套件安裝失敗！
        pause
        exit /b 1
    )
    echo [成功] 依賴套件安裝完成！
) else (
    echo [OK] 依賴套件已安裝
)
echo.

:: ========================================
:: 步驟 5: 啟動伺服器
:: ========================================
echo [5/5] 啟動伺服器...
echo.

:: Start print server in new window
echo [啟動] 列印伺服器...
start "列印伺服器 - 請勿關閉" cmd /k "cd /d "%INSTALL_DIR%" && npm run server"

:: Wait for print server to start
timeout /t 3 /nobreak >nul

:: Start web server in new window
echo [啟動] 網站伺服器...
start "網站伺服器 - 請勿關閉" cmd /k "cd /d "%INSTALL_DIR%" && npm run dev"

:: Wait for web server to start
timeout /t 3 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║                  ✓ 安裝並啟動完成！                        ║
echo ║                                                            ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║   求籤頁面：http://localhost:5173                          ║
echo ║   管理後台：http://localhost:5173/admin                    ║
echo ║                                                            ║
echo ║   請在瀏覽器中開啟上述網址開始使用                         ║
echo ║                                                            ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║   專案已安裝於：%INSTALL_DIR%                              ║
echo ║   下次可直接執行該資料夾中的「啟動系統.bat」               ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Open browser
echo [資訊] 3 秒後自動開啟瀏覽器...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo 按任意鍵關閉此視窗（伺服器會繼續運行）...
pause >nul
