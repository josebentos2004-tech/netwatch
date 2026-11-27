const db=require('../config/database'),{logAction}=require('../services/audit');
async function list(req,res,next){try{const [r]=await db.query("SELECT i.*,d.name device_name,s.name site_name,u.name assigned_name FROM incidents i LEFT JOIN devices d ON d.id=i.device_id LEFT JOIN sites s ON s.id=i.site_id LEFT JOIN users u ON u.id=i.assigned_to ORDER BY FIELD(i.status,'open','in_progress','resolved'),FIELD(i.priority,'critical','high','medium','low'),i.created_at DESC");res.json(r);}catch(e){next(e);}}
async function create(req,res,next){try{
 const {title,description,priority,site_id,device_id,assigned_to}=req.body;
 if(!title||!priority)return res.status(400).json({message:'Título e prioridade obrigatórios.'});
 if(!['low','medium','high','critical'].includes(priority))return res.status(400).json({message:'Prioridade inválida.'});
 const [r]=await db.execute('INSERT INTO incidents(title,description,priority,site_id,device_id,assigned_to,reported_by) VALUES(?,?,?,?,?,?,?)',[title.trim(),description||null,priority,site_id||null,device_id||null,assigned_to||null,req.user.id]);
 if(device_id)await db.execute("UPDATE devices SET status='offline' WHERE id=?",[device_id]);
 await logAction(req.user.id,'create','incident',r.insertId,{title,priority});res.status(201).json({id:r.insertId,message:'Incidente registado.'});
 }catch(e){next(e);}}
async function updateStatus(req,res,next){try{const {status}=req.body;if(!['open','in_progress','resolved'].includes(status))return res.status(400).json({message:'Estado inválido.'});
 const [r]=await db.execute('UPDATE incidents SET status=?,resolved_at=IF(?="resolved",NOW(),NULL) WHERE id=?',[status,status,req.params.id]);
 if(!r.affectedRows)return res.status(404).json({message:'Incidente não encontrado.'});await logAction(req.user.id,'incident_status','incident',req.params.id,{status});res.json({message:'Incidente actualizado.'});
 }catch(e){next(e);}}
module.exports={list,create,updateStatus};
