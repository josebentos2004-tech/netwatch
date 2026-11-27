const db=require('../config/database'),{logAction}=require('../services/audit');
// Simulação didáctica: não comunica com routers, antenas ou equipamentos reais.
async function run(req,res,next){try{
 const [rows]=await db.query("SELECT id,status FROM devices WHERE active=1 AND status<>'maintenance'");
 let changed=0;
 for(const d of rows.filter(()=>Math.random()<0.3)){
  const status=d.status==='online'?'offline':'online';
  await db.execute('UPDATE devices SET status=? WHERE id=?',[status,d.id]);
  await db.execute('INSERT INTO monitoring_events(device_id,event_type,message) VALUES(?,?,?)',[d.id,status==='offline'?'warning':'recovery',status==='offline'?'Falha simulada: equipamento sem resposta.':'Recuperação simulada.']);
  if(status==='offline')await db.execute("INSERT INTO incidents(title,description,priority,device_id,site_id,reported_by) SELECT 'Falha detectada na simulação','Incidente criado pelo módulo de demonstração.','high',d.id,d.site_id,? FROM devices d WHERE d.id=?",[req.user.id,d.id]);
  changed++;
 }
 await logAction(req.user.id,'run_simulation','network',null,{changed});
 res.json({message:'Simulação concluída. Os dados são fictícios.',changed});
 }catch(e){next(e);}}
module.exports={run};
