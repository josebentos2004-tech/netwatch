const db=require('../config/database'),{logAction}=require('../services/audit');
async function list(req,res,next){try{const [r]=await db.query('SELECT s.*,COUNT(d.id) device_count FROM sites s LEFT JOIN devices d ON d.site_id=s.id AND d.active=1 WHERE s.active=1 GROUP BY s.id ORDER BY s.name');res.json(r);}catch(e){next(e);}}
async function create(req,res,next){try{
 const {name,code,city,address,latitude,longitude}=req.body;if(!name||!code||!city)return res.status(400).json({message:'Nome, código e cidade são obrigatórios.'});
 const [r]=await db.execute('INSERT INTO sites(name,code,city,address,latitude,longitude) VALUES(?,?,?,?,?,?)',[name.trim(),code.trim().toUpperCase(),city.trim(),address||null,latitude??null,longitude??null]);
 await logAction(req.user.id,'create','site',r.insertId,{name,code});res.status(201).json({id:r.insertId,message:'Estação criada.'});
 }catch(e){if(e.code==='ER_DUP_ENTRY')return res.status(409).json({message:'Código de estação já existe.'});next(e);}}
async function update(req,res,next){try{const {name,code,city,address,latitude,longitude}=req.body;
 const [r]=await db.execute('UPDATE sites SET name=?,code=?,city=?,address=?,latitude=?,longitude=? WHERE id=? AND active=1',[name,code,city,address||null,latitude??null,longitude??null,req.params.id]);
 if(!r.affectedRows)return res.status(404).json({message:'Estação não encontrada.'});await logAction(req.user.id,'update','site',req.params.id,{name});res.json({message:'Estação actualizada.'});
 }catch(e){next(e);}}
async function remove(req,res,next){try{const [r]=await db.execute('UPDATE sites SET active=0 WHERE id=?',[req.params.id]);if(!r.affectedRows)return res.status(404).json({message:'Estação não encontrada.'});await logAction(req.user.id,'deactivate','site',req.params.id);res.json({message:'Estação desactivada.'});}catch(e){next(e);}}
module.exports={list,create,update,remove};
