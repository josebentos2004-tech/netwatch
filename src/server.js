require('dotenv').config();
const express=require('express'),path=require('path'),helmet=require('helmet'),cors=require('cors'),morgan=require('morgan'),rateLimit=require('express-rate-limit'),db=require('./config/database'),routes=require('./routes'),{notFound,errorHandler}=require('./middleware/errors');
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32){console.error('JWT_SECRET deve ter pelo menos 32 caracteres.');process.exit(1);}
const app=express();
app.use(helmet({contentSecurityPolicy:false}));
app.use(cors({origin:process.env.APP_URL||'http://localhost:3000'}));
app.use(express.json({limit:'1mb'}));app.use(express.urlencoded({extended:false}));app.use(morgan('dev'));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:300,standardHeaders:true,legacyHeaders:false}));
app.use('/api',routes);app.use(express.static(path.join(__dirname,'..','public')));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'..','public','index.html')));
app.use(notFound);app.use(errorHandler);
async function start(){try{await db.query('SELECT 1');const port=Number(process.env.PORT||3000);app.listen(port,()=>console.log(`NetWatch: http://localhost:${port}`));}catch(e){console.error('Falha de ligação ao MySQL:',e.message);process.exit(1);}}
if(require.main===module)start();module.exports=app;
