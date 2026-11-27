const db=require('../config/database');
async function overview(req,res,next){try{
 const [[devices]]=await db.query("SELECT COUNT(*) total,SUM(status='online') online,SUM(status='offline') offline,SUM(status='maintenance') maintenance FROM devices WHERE active=1");
 const [[incidents]]=await db.query("SELECT COUNT(*) total_open,SUM(priority='critical') critical FROM incidents WHERE status IN('open','in_progress')");
 const [recentIncidents]=await db.query("SELECT i.id,i.title,i.priority,i.status,i.created_at,d.name device_name,s.name site_name FROM incidents i LEFT JOIN devices d ON d.id=i.device_id LEFT JOIN sites s ON s.id=i.site_id ORDER BY i.created_at DESC LIMIT 6");
 const [recentDevices]=await db.query("SELECT d.id,d.name,d.type,d.status,d.ip_address,s.name site_name FROM devices d LEFT JOIN sites s ON s.id=d.site_id WHERE d.active=1 ORDER BY d.updated_at DESC LIMIT 8");
 const total=Number(devices.total||0),online=Number(devices.online||0);
 res.json({devices:{...devices,availability:total?Number((online/total*100).toFixed(1)):0},incidents,recentIncidents,recentDevices});
 }catch(e){next(e);}}
module.exports={overview};
