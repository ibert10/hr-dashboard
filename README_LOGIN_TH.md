# เพิ่มระบบ Admin Login ให้ HR Dashboard

ชุดนี้เป็นส่วนเสริมสำหรับเว็บไซต์ GitHub Pages เดิม `https://ibert10.github.io/hr-dashboard/`

## ไฟล์
- `login.html` หน้าเข้าสู่ระบบอีเมล/รหัสผ่านและขอลิงก์ตั้งรหัสผ่านใหม่
- `admin.html` หน้าพื้นที่ Admin ตัวอย่าง พร้อมปุ่มออกจากระบบ
- `auth.js` ตรวจสอบว่าผู้ใช้มีแถวใน `admin_users`
- `supabase-config.js` ใส่ Project URL และ Publishable key ของโปรเจกต์
- `supabase_admin_setup.sql` สร้างตารางสิทธิ์และ RLS
- `login.css` รูปแบบ Responsive ภาษาไทย

## ติดตั้งทีละขั้นตอน

### 1. สร้าง Supabase project
1. เปิด https://supabase.com/ และสร้าง Project ใหม่
2. ตั้งรหัสผ่านฐานข้อมูลที่คาดเดายาก เก็บไว้ในที่ปลอดภัย
3. ไปที่ Project Settings > API Keys (หรือหน้า Connect ตามหน้าตา Dashboard)
4. คัดลอก Project URL และ Publishable key (หรือ legacy anon key)
5. เปิด `supabase-config.js` แล้วแทนค่า placeholder ทั้งสองช่อง

ห้ามใช้ `service_role` หรือ secret key ในไฟล์หน้าเว็บเด็ดขาด เพราะไฟล์นี้จะเป็นสาธารณะ

### 2. สร้างตารางสิทธิ์ Admin
1. ใน Supabase เปิด SQL Editor > New query
2. วางเนื้อหาจาก `supabase_admin_setup.sql`
3. กด Run

### 3. สร้างบัญชีผู้ดูแล
1. Supabase > Authentication > Users > Add user
2. กรอกอีเมลหน่วยงานและตั้งรหัสผ่านที่ปลอดภัย
3. ยืนยัน/สร้างบัญชีตามหน้าจอ Supabase
4. คัดลอก UUID ของผู้ใช้จากหน้า Users
5. กลับไป SQL Editor แล้วรันคำสั่ง โดยแทน UUID จริง:
   `insert into public.admin_users (user_id) values ('UUID-จริง-ของผู้ดูแล');`
6. อย่าเปิด Public signups หากไม่จำเป็น ให้สร้างบัญชีเจ้าหน้าที่จาก Dashboard เท่านั้น

### 4. ตั้ง URL สำหรับ Auth
ใน Supabase ไปที่ Authentication > URL Configuration
- Site URL: `https://ibert10.github.io`
- เพิ่ม Redirect URL: `https://ibert10.github.io/hr-dashboard/login.html`
- เพิ่ม Redirect URL สำหรับรีเซ็ตรหัสผ่าน: `https://ibert10.github.io/hr-dashboard/update-password.html` (ต้องสร้างหน้า update-password แยกก่อนใช้ฟังก์ชันนี้จริง)

### 5. อัปโหลดไฟล์เข้า GitHub
1. เปิด repository `https://github.com/ibert10/hr-dashboard`
2. Add file > Upload files
3. อัปโหลด `login.html`, `admin.html`, `auth.js`, `supabase-config.js`, `login.css` และไฟล์ SQL/README (ไม่จำเป็นต่อการทำงานของเว็บ แต่ควรเก็บไว้เป็นเอกสาร)
4. Commit changes
5. เปิด `https://ibert10.github.io/hr-dashboard/login.html`

## วิธีทดสอบ
- เปิด `login.html` แล้วเข้าสู่ระบบด้วยบัญชีที่สร้างใน Supabase
- ถ้าผู้ใช้ไม่ได้อยู่ใน `admin_users` ระบบจะ sign out และไม่อนุญาตให้เข้าหน้า admin
- เข้าหน้า `admin.html` โดยตรงขณะไม่ได้ล็อกอินแล้วต้องถูกส่งกลับ `login.html`
- ทดสอบปุ่มออกจากระบบ

## ข้อจำกัดและความปลอดภัย
- นี่คือระบบยืนยันตัวตนและ gate หน้า Admin ขั้นต้น ยังไม่ใช่ระบบจัดการข้อมูล/อัปโหลด Excel
- GitHub Pages เป็น static hosting; ซ่อนหน้าเว็บไม่ได้เท่ากับป้องกัน API หรือข้อมูล หากเพิ่มข้อมูลส่วนบุคคล/ฟังก์ชันเขียนข้อมูล ต้องทำ RLS policy สำหรับทุกตารางและตรวจสิทธิ์ฝั่งฐานข้อมูล
- ตาราง `admin_users` ใช้ RLS และไม่มี policy ให้ผู้ใช้ทั่วไปเพิ่มสิทธิ์ตัวเอง
- Public Dashboard ยังคงเปิดสาธารณะตามแบบ A
- ลิงก์รีเซ็ตรหัสผ่านต้องมีหน้า `update-password.html` และตั้ง Redirect URL ให้ตรงก่อนใช้งานจริง; อย่าเปิดฟังก์ชันนี้ให้เจ้าหน้าที่ใช้จนกว่าจะติดตั้งหน้าเปลี่ยนรหัสผ่านครบ
