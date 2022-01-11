const router = require("express").Router();
const Quiz = require("../models/Quiz");
const Home = require("./../models/Home");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");


//get home details
  router.get('/getHomeDetails',(req,res)=>{
      Home.find().then(home=>{
          console.log(home)
          return res.status(200).json(home)
      }).catch(err=>{
          return res.status(404).json({message:"Something went wrong"})
      })
  })



//update home details
  router.post('/updateHomeDetails', async (req,res)=>{
      const data = await Home.find({}); 
      const home = data[0];
      const newHome = {
        bannerPage : req.body.bannerPage?req.body.bannerPage:home.bannerPage,
        courseImage : req.body.courseImage?req.body.courseImage:home.courseImage,
        quickLearnImage : req.body.quickLearnImage?req.body.quickLearnImage:home.quickLearnImage,
        youtubeImage : req.body.youtubeImage?req.body.youtubeImage:home.youtubeImage,
        quizImage : req.body.quizImage?req.body.quizImage:home.quizImage,
        videoLink : req.body.videoLink?req.body.videoLink:home.videoLink,
        latestTechImage : req.body.latestTechImage?req.body.latestTechImage:home.latestTechImage,
        facebookLink : req.body.facebookLink?req.body.facebookLink:home.facebookLink,
        instagramLink : req.body.instagramLink?req.body.instagramLink:home.instagramLink,
        twitterLink : req.body.twitterLink?req.body.twitterLink:home.twitterLink,
        whatsappLink : req.body.whatsappLink?req.body.whatsappLink:home.whatsappLink
      }
      
      Home.findOneAndUpdate({},{ $set: newHome }).then(home=>{
          res.status(200).json(newHome)
      }).catch(err=>{
          res.status(404).json({message:"Something went wrong!!"})
      })
  })



//   router.post('/newsLetter',(req,res)=>{
//       const userMail = req.body.email;

//   })

  module.exports = router;

  