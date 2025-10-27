import { test, expect } from '@playwright/test';

test('Google auth success case', async ({ page, context }) => {
  
  await page.goto('http://localhost:5000/demo-git/login');

  await page.route('**/api/user', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        email: 'mock@test.com',
        name: 'Mock User',
      }),
    });
  });

  page.on('framenavigated', async frame => {
    const url = frame.url();
    if (url.includes('https://accounts.google.com/v3/signin/rejected')) {
      console.log('[MOCK] Detected Google OAuth redirect:', url);
      
      await context.addCookies([
        {
          name: 'connect.sid',
          value: 's%3AfakeSessionId1234567890.abcdefg',
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        },
      ]);

      await page.goto('http://localhost:5000/demo-git/dashboard');
    }
  });

  
  await page.getByRole('button', { name: 'login with google' }).click();
  await page.getByRole('textbox', { name: 'Email or phone' }).click();
  await page.getByRole('textbox', { name: 'Email or phone' }).fill('T@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
  await page.screenshot({ path: 'screenshot.png' });
});