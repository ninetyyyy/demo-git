# 🧪 E2E_Setup_Log.md

## 1. Framework Choice
**Framework:** Playwright  
**Reason for Choice:**  
- ใช้งานง่ายและติดตั้งเร็ว (`npm install` เพียงคำสั่งเดียว)  
- มีโหมด UI สำหรับดูผลรันทันที  
- รองรับการทดสอบข้ามเบราว์เซอร์ (Chromium, Firefox, WebKit)  
- มีระบบ trace / screenshot / video อัตโนมัติเมื่อเทสล้มเหลว  

---

## 2. Installation Commands
```bash
npm i -D @playwright/test
npx playwright install
npx playwright test --ui

## 3. Environment Information
- Project Folder: demo-git-main
- Base URL: http://localhost:3001
- OS: macOS 13 (Apple Silicon)
- Playwright Version: เช็กด้วยคำสั่ง npx playwright test --version
- Browsers Installed: Chromium (default)

## 4. Verification Evidence
- **Screenshot:**  
![Playwright First Run](./playwright-first-test.png)

