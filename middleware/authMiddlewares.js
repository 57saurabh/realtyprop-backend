const jwt= require('jsonwebtoken')
module.exports = (req,res,next)=>{
try {
     
     const token= req.get('Authorization').split('Bearer ')[1];
 
     if (!token) {
         return  res.status(400).json({message:'auth Failed',error});
     }
 
     var decoded = jwt.verify(token, process.env.SECRET);
     req.body.email = decoded.email;
     if(decoded.email){
         next()
     }else{
         res.sendStatus(401);
     } 
    } catch (error) {
     res.sendStatus(401);
    }
    
 };