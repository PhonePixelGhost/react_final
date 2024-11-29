// login.test.js

const { test, expect } = require('@playwright/test');

test('should login successfully and navigate to post list', async ({ page }) => {
  // ไปที่หน้า login
  await page.goto('https://react-final-nwh9.onrender.com/');

  // กรอกข้อมูลในฟอร์ม
  await page.fill('input[name="email"]', 'test@email.com');
  await page.fill('input[name="password"]', 'test1234');

  // คลิกปุ่ม Sign In
  await page.click('button[type="submit"]');

  // รอให้หน้าเปลี่ยนไปยังหน้าโพสต์
  await page.waitForNavigation();

  // ตรวจสอบว่า URL เปลี่ยนไปที่หน้าโพสต์
  expect(page.url()).toBe('https://react-final-nwh9.onrender.com/posts');

  // ตรวจสอบว่าเรามองเห็นปุ่ม "Create Post" (หมายความว่าผู้ใช้ล็อกอินสำเร็จ)
  const createPostButton = await page.isVisible('.create-post-btn');
  expect(createPostButton).toBe(true);
});
