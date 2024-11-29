const { test, expect } = require('@playwright/test');

// ตั้งค่า timeout ให้ยาวขึ้น
test.setTimeout(160000); // ตั้งเวลาเป็น 60 วินาที (60000ms)

test('should post a new message', async ({ page }) => {
  await page.goto('https://react-final-nwh9.onrender.com/create');  // URL ของหน้าที่มีฟอร์ม

  // รอให้ฟอร์มพร้อมใช้งาน
  await page.waitForSelector('input[name="Title"]', { timeout: 160000 });  // เพิ่ม timeout ให้มากขึ้น
  await page.waitForSelector('textarea[name="Content"]', { timeout: 160000 });  // เพิ่ม timeout ให้มากขึ้น

  // กรอกข้อมูลในฟอร์ม
  await page.fill('input[name="Title"]', 'Test Post Title'); // กรอกชื่อโพสต์
  await page.fill('textarea[name="Content"]', 'This is a test post content'); // กรอกเนื้อหาของโพสต์

  // คลิกปุ่ม "Add Post"
  await page.click('button[type="submit"]');  // คลิกปุ่มส่งโพสต์

  // รอให้หน้าแสดงข้อความสำเร็จ
  await page.waitForSelector('text=Post added successfully!', { timeout: 60000 }); // รอข้อความสำเร็จ 5 วินาที

  // ตรวจสอบว่าโพสต์ถูกเพิ่มสำเร็จ
  const successMessage = await page.locator('text=Post added successfully!');
  await expect(successMessage).toBeVisible();  // ตรวจสอบว่าโพสต์ถูกเพิ่มสำเร็จ

  // ไปที่หน้าโพสต์หลังจากเพิ่มโพสต์
  await page.goto('https://react-final-nwh9.onrender.com/posts');  // ไปที่หน้าโพสต์ที่แสดงรายการโพสต์

  // ตรวจสอบว่าโพสต์ใหม่ปรากฏในรายการโพสต์
  const postTitle = await page.locator('text=Test Post Title');
  await expect(postTitle).toBeVisible();  // ตรวจสอบว่าโพสต์ใหม่ปรากฏในรายการ

  // ตรวจสอบว่าเนื้อหาของโพสต์ตรงกัน
  const postContent = await page.locator('text=This is a test post content');
  await expect(postContent).toBeVisible();  // ตรวจสอบว่าเนื้อหาของโพสต์ถูกเพิ่ม
});
