// ตรวจสอบสิทธิ์โดยอ่านเฉพาะแถวที่ตรงกับ user_id ของผู้ใช้ที่เข้าสู่ระบบ
async function isAdmin(userId) {
  const { data, error } = await window.sb
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}
