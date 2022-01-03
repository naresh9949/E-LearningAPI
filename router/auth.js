const router = require('express').Router();
const User = require('./../models/User');
const CryptoJs = require('crypto-js');
var jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport.config') 

// SignUp
router.post('/signup',async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const newUser = User({
        email:email,
        password:CryptoJs.AES.encrypt(password, process.env.PASS_SEC).toString()
    })
    console.log(newUser);
    newUser.save().then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        res.status(404).json({message:err});
    })

})


// SignIn
router.post('/signin',async (req,res)=>{
    const email = req.body.email;
    const RequestPassword = req.body.password;
    
    if(!email || !RequestPassword)
    res.status(401).json({message:"Invalid Credentials"})

    User.findOne({email:email}).then((user)=>{
        if(!user)
            res.status(401).json({message:"Invalid Credentials"})
         
        const hashedPassword = CryptoJs.AES.decrypt(user.password,process.env.PASS_SEC);
        const actual_password = hashedPassword.toString(CryptoJs.enc.Utf8);

        if(actual_password!==RequestPassword)
            res.status(401).json({message:"Invalid Credentials"})

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin,
            email:user.email
        },process.env.JWT_SEC,{expiresIn:'3d'});
        const {password,...others} = user._doc;
        res.status(200).json({...others,accessToken})     
    })

})


router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/authenticate/googleauthfailed' }),(req,res)=>{
    console.log(req.user)
    res.status(200).json({message:'success'})
  })

  router.get('/googleauthfailed',(req,res)=>{
      res.status(403).json({message:'err'})
  })

  

module.exports = router;

// https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauthenticate%2Fgoogle%2Fcallback&scope=profile%20email&client_id=179671460509-b53nr1gho01c43ac985cu83qpm8aqj0m.apps.googleusercontent.com&flowName=GeneralOAuthFlow

