// tests/e2e/auth.success.spec.ts
import { test, expect } from '@playwright/test';

const FRONT = 'http://localhost:3001';
const EMAIL = 'e2e.user@example.com';   // ใส่บัญชีที่ถูกต้องของคุณ
const PASS  = 'P@ssw0rd123';

const API_BASES = ['http://localhost:3001', 'http://localhost:3000']; // เผื่อ backend อยู่คนละพอร์ต

async function checkMe(page: any) {
  for (const base of API_BASES) {
    try {
      const r = await page.request.get(`${base}/api/user`);
      if (r.status() === 200) return { ok: true, base, status: 200 };
      if (r.status() !== 404) return { ok: false, base, status: r.status() };
    } catch {}
  }
  return { ok: false, base: '(unknown)', status: 404 };
}

test('AUTH-201: login form → handle click/enter + nav or session', async ({ page }) => {
  // 1) ไปหน้า login UI (ตามที่เห็นในรูปคือ /demo-git/)
  await page.goto(`${FRONT}/demo-git/`, { waitUntil: 'domcontentloaded' });

  // 2) มีช่อง Email/Password จริง
  const emailInput = page.getByPlaceholder(/^email$/i);
  const passInput  = page.getByPlaceholder(/^password$/i);
  await expect(emailInput).toBeVisible();
  await expect(passInput).toBeVisible();

  // หลักฐานก่อนกรอก
  await page.screenshot({ path: 'docs/auth_before.png', fullPage: true });

  // 3) กรอกฟอร์ม
  await emailInput.fill(EMAIL);
  await passInput.fill(PASS);

  const loginBtn = page.getByRole('button', { name: /^log in$/i });

  // 4) รอ “อย่างใดอย่างหนึ่ง” หลังคลิก: (A) redirect, (B) form navigation (document),
  //    (C) มี fetch/xhr เกิดขึ้น (ถ้ามี), หรือ (D) submit ด้วยการกด Enter
  const currentUrl = page.url();

  const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => null);
  const urlPromise = page.waitForURL(/\/(demo-git\/)?dashboard(\/|$)/, { timeout: 8000 }).catch(() => null);
  const anyReq = page.waitForResponse(r => {
    const t = r.request().resourceType(); // 'document'|'xhr'|'fetch'|...
    return (t === 'xhr' || t === 'fetch' || t === 'document');
  }, { timeout: 8000 }).catch(() => null);

  // คลิกปุ่ม (ถ้าเป็น submit แบบ HTML จะเกิด navigation=document)
  await loginBtn.click().catch(() => {});

  // ถ้าไม่เกิดอะไร ลองกด Enter ในช่องพาสเวิร์ด (บางแอปจับ submit จาก keypress)
  const race1 = await Promise.race([navPromise, urlPromise, anyReq]);
  if (!race1) {
    await passInput.press('Enter').catch(() => {});
    await Promise.race([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6000 }).catch(() => null),
      page.waitForURL(/\/(demo-git\/)?dashboard(\/|$)/, { timeout: 6000 }).catch(() => null),
      page.waitForResponse(r => ['xhr','fetch','document'].includes(r.request().resourceType()), { timeout: 6000 }).catch(() => null),
    ]);
  }

  // 5) ถ้าไป /dashboard แล้ว ก็ผ่านเลย
  if (page.url().match(/\/(demo-git\/)?dashboard(\/|$)/)) {
    await expect(page).toHaveURL(/\/(demo-git\/)?dashboard(\/|$)/);
    await page.screenshot({ path: 'docs/auth_success_dashboard.png', fullPage: true });
    return;
  }

  // 6) ถ้า URL เปลี่ยน (form-submit ไปหน้าอื่น) ให้ลองเช็ค session
  const urlChanged = page.url() !== currentUrl;

  // รอเน็ตนิ่งหน่อยแล้วลอง /api/user ที่ 3001/3000
  await page.waitForLoadState('networkidle').catch(() => {});
  const me = await checkMe(page);

  if (me.ok) {
    // session ขึ้นจริง แม้แอปจะไม่ auto-redirect → เราพาไป dashboard เองเพื่อ assert
    await page.goto(`${FRONT}/demo-git/dashboard`).catch(async () => {
      await page.goto(`${FRONT}/dashboard`);
    });
    await expect(page).toHaveURL(/\/(demo-git\/)?dashboard(\/|$)/);
    await page.screenshot({ path: 'docs/auth_success_dashboard.png', fullPage: true });
  } else {
    // ยังไม่เห็นสัญญาณ login เลย → เก็บภาพไว้และรายงานชัด ๆ
    await page.screenshot({ path: 'docs/auth_no_request.png', fullPage: true });
    throw new Error(
      [
        'ยังยืนยัน login ไม่ได้:',
        `- URL เดิม/เปลี่ยน: ${currentUrl} → ${page.url()}`,
        `- ตรวจ /api/user: status=${me.status} (base=${me.base})`,
        '- ไม่มี redirect และไม่พบ fetch/xhr หลังคลิกหรือกด Enter',
        '→ สรุป: ปุ่ม "Log in" อาจยังไม่ผูก handler, หรือแอปยังไม่ต่อ backend (UI mock)',
        'แนะนำ: เปิด DevTools (Cmd+Opt+I) ที่เบราว์เซอร์จริง, แท็บ Network → กรอก/คลิกด้วยมือ แล้วดูว่ามี request อะไรเกิดไหม',
      ].join('\n')
    );
  }
});









