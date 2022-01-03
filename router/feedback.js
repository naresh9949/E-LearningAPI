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
   if(!req.body.first_name ||!req.body.email || !req.body.subject || !req.body.message)
   res.status(404).json({error:true,message : "all fields are required"})
   
   const feedback = new Feedback({
    first_name : req.body.first_name,
    last_name : req.body.last_name?req.body.last_name:null,
    email : req.body.email,
    subject : req.body.subject,
    message : req.body.message
   })
   feedback.save().then((result)=>{
       res.status(200).json({message:"Feedback successfully saved"})
   }).catch(err=>{
    res.status(404).json({error:true,message : "Feedback submission failed"})
   })
})

module.exports = router;