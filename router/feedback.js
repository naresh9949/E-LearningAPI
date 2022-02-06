const router = require("express").Router();
const Feedback = require("./../models/Feedback");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

router.get('/Getfeedbacks',(req,res)=>{
    Feedback.find().then((feeds)=>{
        res.status(200).json(feeds);
    }).catch(err=>{
        res.status(404).json({error:true,message : "review submission failed"})
       })
})


router.post('/Addfeedback',(req,res)=>{
   if(!req.body.name || !req.body.email || !req.body.subject || !req.body.message)
   return res.status(202).json({error:true,message : "all fields are required"})
   
   const feedback = new Feedback({
    name : req.body.name,
    email : req.body.email,
    subject : req.body.subject,
    message : req.body.message
   })
   feedback.save().then((result)=>{
    return res.status(201).json({message:"Feedback successfully saved"})
   }).catch(err=>{
    return res.status(202).json({error:err,message : "Feedback submission failed"})
   })
})

module.exports = router;