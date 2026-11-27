const db=require('../config/database');
async function logAction(userId,action,entity,entityId,details=null){
 await db.execute('INSERT INTO audit_logs(user_id,action,entity,entity_id,details) VALUES(?,?,?,?,?)',
 [userId||null,action,entity,entityId||null,details?JSON.stringify(details):null]);
}
module.exports={logAction};
