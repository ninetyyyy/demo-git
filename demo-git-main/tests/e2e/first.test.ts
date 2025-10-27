import { test, expect } from '@playwright/test';

test('open home page', async ({ page }) => {
  // ไปที่หน้าเว็บหลักของโปรเจกต์ (พอร์ตอาจต่าง ถ้าใช้ 3000 แทน 5173 ให้แก้)
  await page.goto('http://localhost:3001');
  
  // ตรวจว่าชื่อหน้า (title) มีคำว่า "demo" หรือ "vite" (ขึ้นอยู่กับโปรเจกต์ของเธอ)
  await expect(page).toHaveTitle(/demo|vite|react/i);
});
