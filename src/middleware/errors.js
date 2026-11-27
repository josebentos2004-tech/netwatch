function notFound(req,res){res.status(404).json({message:'Recurso não encontrado.'});}
function errorHandler(err,req,res,next){
 console.error(err);const status=err.status||500;
 res.status(status).json({message:status===500?'Erro interno do servidor.':err.message,
 ...(process.env.NODE_ENV!=='production'&&status===500?{detail:err.message}:{})});
}
module.exports={notFound,errorHandler};
