const router = require("express").Router();
const Review = require("./../models/Review");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

router.get('/Getreviews',(req,res)=>{
    Review.find().then((reviews)=>{
        res.status(200).json(reviews);
    })
})


router.post('/Addreview',verifyToken,(req,res)=>{
   if(!req.body.first_name ||!req.body.id || !req.body.last_name || !req.body.rating || !req.body.message)
   res.status(404).json({error:true,message : "all fields are required"})
   
   const review = new Review({
    id : req.body.id,
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    rating : req.body.rating,
    message : req.body.message
   })
   review.save().then((result)=>{
       res.status(200).json({message:"review successfully saved"})
   }).catch(err=>{
    res.status(404).json({error:true,message : "review submission failed"})
   })
})

module.exports = router;