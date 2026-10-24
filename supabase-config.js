// ใส่ Project URL และ Publishable key ของ Supabase ของคุณที่นี่
// Publishable key/anon key ใช้ในหน้าเว็บได้ แต่ห้ามใส่ secret/service_role key เด็ดขาด
// URL และ publishable key หาได้จาก Supabase Dashboard > Project Settings > API Keys
window.SUPABASE_URL = "https://dshjfzbfsdxdfisobrto.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_lWya0-ZDaue999A9l4D3Og_2F903PIl";
if (!window.supabase || !window.SUPABASE_URL.startsWith("https://dshjfzbfsdxdfisobrto.supabase.co") || window.SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_lWya0-ZDaue999A9l4D3Og_2F903PIl")) {
  console.warn("โปรดตั้งค่า supabase-config.js ก่อนใช้งานระบบ Login");
}
window.sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
