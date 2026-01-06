# 🎋 廟宇求籤系統 (Temple Fortune Telling System)

台式廟宇風格的數位求籤抽獎系統，適用於展覽、尾牙、廟會活動等場合。

## 📋 功能特色
- 🎰 精緻的廟宇風格拉霸機動畫
- 🖨️ 自動靜默列印功能（無需手動確認）
- ⚙️ 後台管理介面，可自訂籤詩圖片
- 🎨 完整的繁體中文界面

---

## 🖥️ Windows 安裝指南

### 步驟 1：安裝 Node.js

1. 前往 [Node.js 官網](https://nodejs.org/)
2. 下載 **LTS 版本**（左邊的按鈕）
3. 執行安裝程式，**全部選預設選項**即可
4. 安裝完成後，開啟「命令提示字元」輸入以下指令確認：
   ```
   node -v
   npm -v
   ```
   如果顯示版本號碼，表示安裝成功。

### 步驟 2：下載專案

**方法 A：使用 Git（推薦）**
```bash
git clone https://github.com/YrChen1001/B-PROJECT.git
cd B-PROJECT
```

**方法 B：直接下載**
1. 前往 [GitHub 專案頁面](https://github.com/YrChen1001/B-PROJECT)
2. 點擊綠色的 `Code` 按鈕 → `Download ZIP`
3. 解壓縮到任意資料夾

### 步驟 3：安裝依賴套件

在專案資料夾中開啟命令提示字元，執行：
```bash
npm install
```

### 步驟 4：啟動系統

**方法 A：使用批次檔（最簡單）**
- 雙擊 `啟動系統.bat` 即可一鍵啟動

**方法 B：手動啟動**
需要開啟**兩個**命令提示字元視窗：

視窗 1 - 啟動網站伺服器：
```bash
npm run dev
```

視窗 2 - 啟動列印伺服器：
```bash
npm run server
```

### 步驟 5：開啟網站

啟動後，在瀏覽器中前往：
- **求籤頁面**：http://localhost:5173
- **管理後台**：http://localhost:5173/admin

---

## 🖨️ 設定印表機

1. 確保電腦已連接印表機
2. 將該印表機設為「**預設印表機**」
3. 列印功能即可正常運作

---

## 📁 專案結構

```
B-PROJECT/
├── public/
│   └── slot-images/     # 籤詩圖片存放處
├── src/
│   ├── components/      # React 元件
│   ├── pages/           # 頁面
│   └── store/           # 狀態管理
├── server/
│   └── index.js         # 列印伺服器
├── 啟動系統.bat          # Windows 一鍵啟動腳本
└── README.md
```

---

## ❓ 常見問題

**Q: 列印出現「沒有預設目標」錯誤？**  
A: 請到「設定」→「印表機與掃描器」，右鍵點選您的印表機，選擇「設為預設印表機」。

**Q: 網站打不開？**  
A: 確認兩個伺服器都已啟動（npm run dev 和 npm run server）。

**Q: 如何新增籤詩圖片？**  
A: 將圖片放入 `public/slot-images/` 資料夾，然後修改 `src/lib/images.ts` 新增圖片路徑。

---

## 📜 授權

MIT License
