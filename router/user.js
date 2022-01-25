const router = require("express").Router();
const User = require("./../models/User");
const passport = require('passport');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin, 
} = require("./verifyToken");
const { response } = require("express");
const Course = require("../models/Course");

// GET The user with given id
router.get("/:id", verifyTokenAndAuthorization, (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: id })
    .then((user) => {
      const {
        password,
        isAdmin,
        courses,
        otps,
        createdAt,
        updatedAt,
        ...others
      } = user._doc;
      res.status(200).json(others);
    })
    .catch((err) => {
      res.status(404).json({error:true,message: "failed to get the user data" });
    });
});

//update user basic data
router.patch("/:id", verifyTokenAndAuthorization, (req, res) => {
  const id = req.params.id;
  if (
    req.body.email ||
    req.body.password ||
    req.body.verified ||
    req.body.image ||
    req.body.isAdmin ||
    req.body.isNotificationsAllowed
  )
    return res.status(404).json({ message: "invalid body arguments" });
  User.findOneAndUpdate({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "user updated successfully!" });
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: "user update failed",
      });
    });
});



// enroll course
router.post("/enroll",verifyTokenAndAuthorization, async(req, res) => {
  const userId = req.user._id;
  const courseid = req.body.courseid;
  if(!courseid)
    return res.status(201).json({ message: "invalid Course ID" });

  var enrolledCourses = await User.findOne({_id:userId},{courses:true});
  enrolledCourses = enrolledCourses.courses;
  for(let i=0;i<enrolledCourses.length;i++)
  {
      if(enrolledCourses[i].courseId == courseid)
        return res.status(400).json({message:"course already enrolled!!!"})
  }

  User.findOneAndUpdate({ _id: userId }, { $push: {courses : {courseId:courseid,date:new Date()}} }).then((course) => {
        //console.log(course)
        Course.findOneAndUpdate( {_id: courseid},{$inc : {'noenrolls' : 1}}, {new: true}).then(
          res.status(200)
        );
        res.status(200).json({message:"You've Enrolled"});
      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          message: err,
        });
      });
  })





router.post("/addVideo", (req,res)=>{
  const userId = req.body._id;
  const courseid = req.body.courseid;
  const videoId = req.body.videoid;

  if(!userId)
    return res.status(204).json({ message: "Invalid user" });
  if(!courseid)
    return res.status(204).json({ message: "Invalid course" });
  if(!videoId)
    return res.status(204).json({ message: "unable to find video" });

  //User.findOneAndUpdate({ 'req.body._id': userId }, { "$push": {'courses' : {'videos' : videoId} }})
  User.findOneAndUpdate({ _id:userId,"courses.courseId": req.body.courseid},{ $push: { "courses.videos": videoId } } ).then((course) => {
      console.log(course)
      //res.status(200).json({message:""});
    }).catch(err=>{
      res.status(401).json({message:"Something wrong"})
    }) 
})
  



router.put("/updateuser/hello", (req, res) => {
  //const id = req.params.id;
  const nums = req.query.num;
  const query_string = req.query.query_string;

  console.log(nums, query_string);

  res.status(200).json({ message: "user updated successfully" });
});

// Update The firstname and lastname of user
router.put("/updateuser/:id", verifyTokenAndAuthorization, (req, res) => {
  const id = req.params.id;
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;

  res.status(200).json({ message: "user updated successfully" });
});

module.exports = router;

// 1106307
