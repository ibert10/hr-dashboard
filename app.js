const fmt = n => new Intl.NumberFormat('th-TH').format(n);
const percent = (n, total) => total ? (n / total * 100).toLocaleString('th-TH', {maximumFractionDigits:1, minimumFractionDigits: n && n < total ? 1 : 0}) + '%' : '0%';
const colors = ['#2878d0','#1fa866','#f0a12d','#d94e8d','#0b9aab','#8c72c8','#4a9d83','#bd6a58','#5d8fd8','#c7a32f','#8164bc','#d878a6','#29a3d0','#d8a62c','#8a9c54'];
let dashboardData = null;

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}
function render(data) {
  dashboardData = data;
  const total = data.totalEmployees;
  document.getElementById('updatedAt').textContent = data.updatedAt;
  document.getElementById('totalEmployees').textContent = fmt(total);
  document.getElementById('donutTotal').textContent = fmt(total);
  document.getElementById('departmentCount').textContent = fmt(data.departmentCount);
  const active = data.status.reduce((sum, s) => sum + (s.name === 'ปฏิบัติงาน' ? s.count : 0), 0);
  document.getElementById('activeCount').textContent = fmt(active);
  document.getElementById('activePercent').textContent = percent(active,total) + ' ของทั้งหมด';
  document.getElementById('statusTotal').textContent = fmt(active);
  document.getElementById('statusLabel').textContent = data.status[0]?.name || 'ไม่ระบุ';
  document.getElementById('statusPercent').textContent = percent(active,total);
  // Contact completeness is deliberately 0 when source has no contact data.
  const missingPhone = data.dataQuality.find(x=>x.name==='เบอร์โทรศัพท์')?.missing ?? total;
  const missingEmail = data.dataQuality.find(x=>x.name==='อีเมล')?.missing ?? total;
  document.getElementById('contactComplete').textContent = fmt(Math.max(0,total-Math.max(missingPhone,missingEmail)));

  const prefixColors = {'นาย':'#2878d0','นางสาว':'#1fa866'};
  const male = data.prefix.find(x=>x.name==='นาย')?.count || 0;
  const female = data.prefix.find(x=>x.name==='นางสาว')?.count || 0;
  const malePct = total ? male/total*100 : 0;
  document.getElementById('prefixDonut').style.background = `conic-gradient(${prefixColors['นาย']} 0 ${malePct}%, ${prefixColors['นางสาว']} ${malePct}% 100%)`;
  const legend = document.getElementById('prefixLegend'); legend.replaceChildren();
  data.prefix.forEach(item=>{
    const row = el('div','legend-item');
    const dot = el('i','legend-dot'); dot.style.background = prefixColors[item.name] || '#8496a8';
    const txt = el('div'); txt.append(el('span','',item.name)); txt.append(el('strong','',`${fmt(item.count)} คน`)); txt.append(el('small','',percent(item.count,total)));
    row.append(dot,txt); legend.append(row);
  });

  const select = document.getElementById('departmentFilter');
  data.departments.forEach(d=>{const opt=el('option','',d.name); opt.value=d.name; select.append(opt);});
  renderDepartments('all');

  const tbody = document.getElementById('summaryTable'); tbody.replaceChildren();
  const rows = [
    ['พนักงานทั้งหมด',total,'100%'],
    ...data.prefix.map(x=>[x.name,x.count,percent(x.count,total)]),
    ['จำนวนแผนก',data.departmentCount,'—'],
    ['สถานะปฏิบัติงาน',active,percent(active,total)]
  ];
  rows.forEach((r,i)=>{const tr=el('tr'); r.forEach((v,j)=>{const td=el('td',j===1||j===2?'num':'',String(v)); tr.append(td);}); tbody.append(tr);});

  const quality = document.getElementById('qualityList'); quality.replaceChildren();
  data.dataQuality.forEach(item=>{
    const row=el('div','quality-item'); row.append(el('span','',item.name));
    const track=el('div','quality-track'); const fill=el('div','quality-fill'); fill.style.width=(total?item.missing/total*100:0)+'%'; track.append(fill);
    row.append(track,el('strong','',`${fmt(item.missing)} คน`)); quality.append(row);
  });
}
function renderDepartments(filter) {
  if(!dashboardData) return;
  const list = filter==='all' ? dashboardData.departments : dashboardData.departments.filter(d=>d.name===filter);
  const chart=document.getElementById('departmentChart'); chart.replaceChildren();
  const max=Math.max(1,...list.map(d=>d.count));
  list.forEach(d=>{
    const row=el('div','bar-row');
    const label=el('span','bar-label',d.name); label.title=d.name;
    const track=el('div','bar-track'); const fill=el('div','bar-fill'); fill.style.width=(d.count/max*100)+'%'; track.append(fill);
    row.append(label,track,el('span','bar-value',fmt(d.count))); chart.append(row);
  });
}
document.getElementById('departmentFilter').addEventListener('change',e=>renderDepartments(e.target.value));
document.getElementById('resetFilter').addEventListener('click',()=>{document.getElementById('departmentFilter').value='all';renderDepartments('all');});
fetch('data.json').then(r=>{if(!r.ok)throw new Error('ไม่สามารถอ่านไฟล์ข้อมูล');return r.json();}).then(render).catch(err=>{
  document.querySelector('.notice strong').textContent='ไม่สามารถโหลดข้อมูลได้';
  document.querySelector('.notice p').textContent='โปรดตรวจสอบว่าเปิดผ่านเว็บเซิร์ฟเวอร์ และมีไฟล์ data.json อยู่ในโฟลเดอร์เดียวกับ index.html';
  console.error(err);
});
