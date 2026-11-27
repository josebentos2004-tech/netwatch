require('dotenv').config();
const bcrypt=require('bcryptjs'),db=require('../src/config/database');
async function seed(){
 const c=await db.getConnection();
 try{
  await c.beginTransaction();
  const hash=await bcrypt.hash('NetWatch@2026',12);
  await c.execute("INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,'admin') ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),role='admin'",['Administrador NetWatch','admin@netwatch.local',hash]);
  const sites=[['Estação Viana Centro','VIA-001','Viana','Viana, Luanda'],['Estação Talatona','TAL-002','Talatona','Talatona, Luanda'],['Estação Maianga','MAI-003','Maianga','Maianga, Luanda'],['Estação Cacuaco','CAC-004','Cacuaco','Cacuaco, Luanda']];
  for(const s of sites)await c.execute('INSERT INTO sites(name,code,city,address) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name)',s);
  const [sr]=await c.query('SELECT id,code FROM sites'),map=Object.fromEntries(sr.map(x=>[x.code,x.id]));
  const devices=[
   [map['VIA-001'],'Router Core Viana','router','Cisco','ISR 4331','10.10.1.1','NW-VIA-R01','online'],
   [map['VIA-001'],'Antena Viana Norte','antenna','Huawei','RRU 5901','10.10.1.10','NW-VIA-A01','online'],
   [map['TAL-002'],'Switch Talatona 01','switch','Cisco','Catalyst 9200','10.10.2.2','NW-TAL-S01','online'],
   [map['TAL-002'],'Antena Talatona Sul','antenna','Ericsson','Radio 4422','10.10.2.10','NW-TAL-A01','offline'],
   [map['MAI-003'],'Firewall Maianga','firewall','Fortinet','FortiGate 100F','10.10.3.1','NW-MAI-F01','maintenance'],
   [map['CAC-004'],'Router Cacuaco','router','MikroTik','CCR2004','10.10.4.1','NW-CAC-R01','online']
  ];
  for(const d of devices)await c.execute('INSERT IGNORE INTO devices(site_id,name,type,manufacturer,model,ip_address,serial_number,status) VALUES(?,?,?,?,?,?,?,?)',d);
  const [[admin]]=await c.query("SELECT id FROM users WHERE email='admin@netwatch.local'");
  const [[dev]]=await c.query("SELECT id,site_id FROM devices WHERE serial_number='NW-TAL-A01'");
  const [[old]]=await c.query("SELECT id FROM incidents WHERE title='Perda de comunicação com antena' LIMIT 1");
  if(dev&&!old)await c.execute('INSERT INTO incidents(title,description,priority,device_id,site_id,reported_by) VALUES(?,?,?,?,?,?)',['Perda de comunicação com antena','Equipamento sem resposta no cenário de demonstração.','high',dev.id,dev.site_id,admin.id]);
  await c.commit();console.log('Seed concluído. Login: admin@netwatch.local | Palavra-passe: NetWatch@2026');
 }catch(e){await c.rollback();throw e;}finally{c.release();await db.end();}
}
seed().catch(e=>{console.error(e);process.exit(1);});
