# E2E_TestPlan.md

## 1. Overview
**Project:** demo-git-main  
**Framework:** Playwright  
**Base URL:** http://localhost:3001  
**Test Scope:** Authentication (Login / Register)  
**Total Scenarios:** 4 (E2E-AUTH-201, E2E-AUTH-400, E2E-REG-201, E2E-REG-400)  

---

## 2. Scenario 1 – E2E-AUTH-201 (Login สำเร็จ)

**Title:** User login success → redirect to /dashboard and display user info  
**Preconditions:**  
- Backend และ Frontend รันอยู่  
- มี บัญชีผู้ใช้ ที่ active อยู่ใน MongoDB  
- ระบบ ตอบ HTTP 201 เมื่อ login ถูกต้อง  

**Steps:**  
1. เปิด หน้า `/login`  
2. กรอก อีเมล และ รหัสผ่าน ที่ ถูกต้อง  
3. คลิก ปุ่ม `Sign in / Login`  
4. หลัง callback ให้ รอ redirect ไป `/dashboard`  
5. ตรวจสอบ การ เรียก `/api/user` ได้ HTTP 200  

**Expected:**  
- URL เปลี่ยนเป็น `/dashboard`  
- `/api/user` ตอบ 200 พร้อมข้อมูลผู้ใช้  
- แสดง อีเมล หรือ ชื่อผู้ใช้ ตรงกับ บัญชี  

---

## 3. Scenario 2 – E2E-AUTH-400 (Login ล้มเหลว)

**Title:** User login fail → stay on /login and show error  
**Preconditions:**  
- หน้า `/login` โหลด ได้  
- ระบบ ตอบ HTTP 400 เมื่อ credential ผิด  

**Steps:**  
1. เปิด หน้า `/login`  
2. กรอก อีเมล ผิด หรือ รหัส ไม่ ถูกต้อง  
3. คลิก `Sign in / Login`  
4. รอ response จาก `/api/auth/login`  

**Expected:**  
- `/api/auth/login` ตอบ HTTP 400  
- ยังอยู่ หน้า `/login`  
- ขึ้น toast หรือ ข้อความ “Invalid email or password”  
- ไม่ redirect ไป `/dashboard`  

---

## 4. Scenario 3 – E2E-REG-201 (Register สำเร็จ)

**Title:** User register success → 201 Created and redirect / toast success  
**Preconditions:**  
- Backend เปิด endpoint `/api/auth/register`  
- ยัง ไม่มี บัญชี อีเมล นี้ ใน DB  

**Steps:**  
1. เปิด หน้า `/register`  
2. กรอก ชื่อ, อีเมล ใหม่, รหัส ผ่าน ที่ ถูกต้อง  
3. คลิก `Register / Sign up`  
4. รอ response จาก `/api/auth/register`  

**Expected:**  
- `/api/auth/register` ตอบ HTTP 201  
- redirect ไป `/login` หรือ `/dashboard` (แล้วแต่ flow จริง)  
- แสดง ข้อความ สำเร็จ หรือ toast สี เขียว  

---

## 5. Scenario 4 – E2E-REG-400 (Register ล้มเหลว)

**Title:** User register fail (duplicate email / invalid input)  
**Preconditions:**  
- หน้า `/register` เปิด ได้  
- อีเมล ที่ ใช้ สมัคร มี อยู่ แล้ว ใน DB  

**Steps:**  
1. เปิด หน้า `/register`  
2. กรอก ชื่อ, อีเมล ที่ ซ้ำ, รหัส ผ่าน ใด ก็ ได้  
3. คลิก `Register`  
4. รอ response จาก `/api/auth/register`  

**Expected:**  
- `/api/auth/register` ตอบ HTTP 400  
- ไม่ redirect ไป `/dashboard`  
- แสดง toast หรือ ข้อความ error สี แดง “Email already exists”  

---

## 6. Note / Assertion Checklist
- ทุก scenario ใช้ `data-testid` กับ input และ button  
- ตรวจสอบ `response.status()` และ URL พร้อมกัน  
- Negative case ต้องมี assertion `not.toHaveURL(/dashboard/)`  
- ทุก เคส สามารถ รัน ผ่าน UI mode ของ Playwright (`npx playwright test --ui`)  
