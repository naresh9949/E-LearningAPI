const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const token = req.body.authToken; 
    try{
    if(token){
        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err) return res.status(401).json({message:"Authentication Failed!"});
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json({message:"Authentication Failed!"});
    }
    }
    catch(err){
        return res.status(401).json({message:"Authentication Failed!"});
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{
        try{
        verifyToken(req,res,()=>{
            if(req.user.email === req.body.email || req.user.isAdmin){
                next();
            }else{
                return res.status(403).json({error:true,message:"Invalid Access!"});
            }
        })
    }
    catch(err){
        return res.status(401).json({error:true,message:"Authentication Failed!"});
    }
}

const verifyTokenAndAdmin = (req,res,next)=>{
    try{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({message:"Invalid Access!"});
        }
    })
    }
    catch(err)
    {
        return res.status(403).json({message:"Invalid Access!"});
    }
}



const verifyTokenAndInstructor = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.verified){
            next();
        }else{
            return res.status(403).json({message:"Verify the email!"});
        }
    })
}



module.exports = {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin,verifyTokenAndInstructor}
