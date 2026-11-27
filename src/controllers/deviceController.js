const db=require('../config/database'),{logAction}=require('../services/audit');
async function list(req,res,next){try{
 let sql='SELECT d.*,s.name site_name,s.code site_code FROM devices d LEFT JOIN sites s ON s.id=d.site_id WHERE d.active=1',p=[];
 for(const [k,col] of [['status','d.status'],['type','d.type']])if(req.query[k]){sql+=` AND ${col}=?`;p.push(req.query[k]);}
 if(req.query.search){sql+=' AND (d.name LIKE ? OR d.ip_address LIKE ? OR d.serial_number LIKE ?)';p.push(...Array(3).fill(`%${req.query.search}%`));}
 sql+=' ORDER BY d.name';const [r]=await db.execute(sql,p);res.json(r);
 }catch(e){next(e);}}
async function create(req,res,next){try{
 const {site_id,name,type,manufacturer,model,ip_address,serial_number,status}=req.body;
 if(!site_id||!name||!type)return res.status(400).json({message:'Estação, nome e tipo são obrigatórios.'});
 const [r]=await db.execute('INSERT INTO devices(site_id,name,type,manufacturer,model,ip_address,serial_number,status) VALUES(?,?,?,?,?,?,?,?)',[site_id,name.trim(),type,manufacturer||null,model||null,ip_address||null,serial_number||null,status||'online']);
 await logAction(req.user.id,'create','device',r.insertId,{name,type});res.status(201).json({id:r.insertId,message:'Equipamento registado.'});
 }catch(e){if(e.code==='ER_DUP_ENTRY')return res.status(409).json({message:'Número de série já registado.'});next(e);}}
async function update(req,res,next){try{
 const {site_id,name,type,manufacturer,model,ip_address,serial_number,status}=req.body;
 const [r]=await db.execute('UPDATE devices SET site_id=?,name=?,type=?,manufacturer=?,model=?,ip_address=?,serial_number=?,status=? WHERE id=? AND active=1',[site_id,name,type,manufacturer||null,model||null,ip_address||null,serial_number||null,status,req.params.id]);
 if(!r.affectedRows)return res.status(404).json({message:'Equipamento não encontrado.'});await logAction(req.user.id,'update','device',req.params.id,{name,status});res.json({message:'Equipamento actualizado.'});
 }catch(e){next(e);}}
async function changeStatus(req,res,next){try{const {status}=req.body;if(!['online','offline','maintenance'].includes(status))return res.status(400).json({message:'Estado inválido.'});
 const [r]=await db.execute('UPDATE devices SET status=? WHERE id=? AND active=1',[status,req.params.id]);if(!r.affectedRows)return res.status(404).json({message:'Equipamento não encontrado.'});
 await logAction(req.user.id,'status_change','device',req.params.id,{status});res.json({message:'Estado actualizado.'});
 }catch(e){next(e);}}
module.exports={list,create,update,changeStatus};
