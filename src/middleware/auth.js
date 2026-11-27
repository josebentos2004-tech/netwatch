const jwt=require('jsonwebtoken');
function authenticate(req,res,next){
  const h=req.headers.authorization||'', token=h.startsWith('Bearer ')?h.slice(7):null;
  if(!token)return res.status(401).json({message:'Autenticação necessária.'});
  try{req.user=jwt.verify(token,process.env.JWT_SECRET);next();}
  catch{return res.status(401).json({message:'Sessão inválida ou expirada.'});}
}
function allowRoles(...roles){return(req,res,next)=>req.user&&roles.includes(req.user.role)?next():res.status(403).json({message:'Sem permissão.'});}
module.exports={authenticate,allowRoles};
