const db=require('../config/database'),bcrypt=require('bcryptjs'),jwt=require('jsonwebtoken');
async function login(req,res,next){
 try{
  const {email,password}=req.body;if(!email||!password)return res.status(400).json({message:'Email e palavra-passe obrigatórios.'});
  const [rows]=await db.execute('SELECT id,name,email,password_hash,role,active FROM users WHERE email=? LIMIT 1',[String(email).trim().toLowerCase()]);
  const u=rows[0];if(!u||!u.active||!(await bcrypt.compare(password,u.password_hash)))return res.status(401).json({message:'Credenciais incorrectas.'});
  const token=jwt.sign({id:u.id,name:u.name,email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'8h'});
  res.json({token,user:{id:u.id,name:u.name,email:u.email,role:u.role}});
 }catch(e){next(e);}
}
module.exports={login};
