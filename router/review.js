const router = require("express").Router();
const Review = require("./../models/Review");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");


//get reviews

router.get('/getReviews',(req,res)=>{
    Review.aggregate([
        {$sort: {rating: -1}},
        {$limit: 10},
        ]).then(data=>{
            return res.status(200).json(data)
        }).catch(err=>{
            return res.status(404).json({message:"Something went wrong!"})
        })
})




router.post('/addReview',verifyToken,(req,res)=>{
   if(!req.body.first_name ||!req.body.id || !req.body.last_name || !req.body.rating || !req.body.message)
   res.status(404).json({error:true,message : "all fields are required"})
   
   const review = new Review({
    id : req.body.id,
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    rating : req.body.rating,
    message : req.body.message,
    image : req.body.image
   })
   review.save().then((result)=>{
       res.status(201).json({message:"review successfully saved"})
   }).catch(err=>{
    res.status(404).json({error:true,message : "review submission failed"})
   })
})



module.exports = router;