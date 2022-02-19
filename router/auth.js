const router = require('express').Router();
const User = require('./../models/User');
const CryptoJs = require('crypto-js');
var jwt = require('jsonwebtoken');
require('./passport.config') 
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const axios = require('axios')
const {SendVerificationLink} = require('./../Utils/emailHandler');


let options = {
    maxAge: 1000 * 60 * 60 * 24 * 7,
}

// SignUp
router.post('/signup',async (req,res)=>{
    console.log("dwekfd")
    const email = req.body.email;
    const password = req.body.password;
    
    const newUser = User({
        email:email,
        password:CryptoJs.AES.encrypt(password, process.env.PASS_SEC).toString()
    }) 
    User.exists({email:email}).then(user=>{
        if(user)
        res.status(200).json({message:'user already exists'});
        else{
            newUser.save().then((result)=>{
                const accessToken = jwt.sign({
                    id:result._id,
                    isAdmin:result.isAdmin,
                    email:result.email,
                    verified:result.verified
                },process.env.JWT_SEC,{expiresIn:'3d'});
                return res.status(201).json({token:accessToken})
            
            }).catch((err)=>{
                console.log(err)
                res.status(403).json({message:err});
            })
        }
    }).catch(err=>{
        res.status(401).json({message:'something went wrong!'});
    })

})


// SignIn
router.post('/signin',async (req,res)=>{
    const email = req.body.email;
    const RequestPassword = req.body.password;
    if(!email || !RequestPassword)
    return res.status(201).json({message:"Invalid Credentials"})

    User.findOne({email:email}).then((user)=>{
        
        if(!user)
        return res.status(201).json({message:"User does not exist!"})
       
        
        const hashedPassword = CryptoJs.AES.decrypt(user.password,process.env.PASS_SEC);
        const actual_password = hashedPassword.toString(CryptoJs.enc.Utf8);

        
        if(actual_password!==RequestPassword)
        return res.status(201).json({message:"Incorrect Password!"})

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin,
            email:user.email,
            verified:user.verified
        },process.env.JWT_SEC,{expiresIn:'3d'});
        return res.status(200).json({token:accessToken,admin:user.isAdmin}) 
    })
})


router.post('/google',async(req,res)=>{
    const { token }  = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const user = ticket.getPayload();    
    
    const{email,picture,given_name,family_name} = user;
    User.exists({email:email}).then(user=>{
        if(user){
            User.findOne({ email: email}).then(user=>{
                const accessToken = jwt.sign({
                    id:user._id,
                    isAdmin:user.isAdmin,
                    email:user.email,
                    verified:true
                },process.env.JWT_SEC,{expiresIn:'3d'});
                return res.status(200).json({token:accessToken})
            })
            
        }
        else{
            const newUser = User({
                email:email,
                password:"#",
                image:picture,
                first_name : given_name,
                last_name : family_name,
                verified : true
            })
            console.log(newUser);
            newUser.save().then((result)=>{
                const accessToken = jwt.sign({
                    id:result._id,
                    isAdmin:result.isAdmin,
                    email:result.email,
                    verified:result.verified
                },process.env.JWT_SEC,{expiresIn:'3d'});

                return res.status(201).json({token:accessToken})
            
            }).catch((err)=>{
                console.log(err)
                res.status(403).json({message:err});
            })
        }
    }).catch(err=>{
        res.status(401).json({message:'something went wrong!'});
    })
    
})


router.post('/fb',async(req,res)=>{

    const {token,email,picture,id} = req.body;
    console.log(req.body)
    const data = await axios.get('https://graph.facebook.com/me?access_token='+token);
    const reqid = data.data.id;
    const name = data.data.name;
    const names = name.split(" ");
    console.log(names);
    if(reqid!==id)
        return res.status(204).json({message:"Invalid Credentials"})
    
        User.exists({email:email}).then(user=>{
            if(user){
                User.findOne({ email: email}).then(user=>{
                    const accessToken = jwt.sign({
                        id:user._id,
                        isAdmin:user.isAdmin,
                        email:user.email,
                        verified:true
                    },process.env.JWT_SEC,{expiresIn:'3d'});
    
                    return res.status(200).json({token:accessToken})
                })
                
            }
            else{
                const newUser = User({
                    email:email,
                    password:"#",
                    image:picture,
                    first_name : names.length>=1?names[0]:null,
                    last_name : names.length>=2?names[1]:null,
                    verified : true
                })
                newUser.save().then((result)=>{
                    const accessToken = jwt.sign({
                        id:result._id,
                        isAdmin:result.isAdmin,
                        email:result.email,
                        verified:result.verified
                    },process.env.JWT_SEC,{expiresIn:'3d'});
    
                    return res.status(201).json({token:accessToken})
                
                }).catch((err)=>{
                    console.log(err)
                    res.status(403).json({message:err});
                })
            }
        }).catch(err=>{
            res.status(401).json({message:'something went wrong!'});
        })
    
})

module.exports = router;
