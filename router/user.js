const router = require("express").Router();
const User = require("./../models/User");
const passport = require("passport");
const { SendVerificationLink,SendCourseEnrollment } = require("../Utils/emailHandler");
const { calculatePersentage } = require("./../Utils/calculatePersentage");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Course = require("../models/Course");

let options = {
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

// GET The user with given id
router.post("/getUserInfo", verifyToken, (req, res) => {
  const email = req.user.email;
  if (!email) return res.status(400).json({ message: "email is required" });

  var projection = {
    email: true,
    first_name: true,
    last_name: true,
    branch: true,
    institute_name: true,
    address: true,
    mobile: true,
    isNotificationsAllowed: true,
    branch: true,
    image: true,
  };
  User.findOne({ email: email }, projection)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res
        .status(404)
        .json({ error: true, message: "failed to get the user data" });
    });
});

//update user basic data
router.post("/verify", (req, res) => {
  const id = req.body.id;
  User.findOneAndUpdate({ _id: id }, { verified: true })
    .then((user) => {
      return res.status(201).json({ message: "user verified successfully!" });
    })
    .catch((err) => {
      return res.status(403).json({ message: "verification failed!" });
    });
});


router.patch("/Enroll/:id", verifyToken, (req, res) => {
  const email = req.user.email;
  const courseid = req.query.courseid;
  if (!courseid) return res.status(404).json({ message: "invalid arguments" });

  User.findOneAndUpdate(
    { email: email },
    { $push: { courses: { courseId: courseid, date: new Date() } } }
  )
    .exec()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: err,
      });
    });
});




// Update The firstname and lastname,clg,branch,mobile
router.post("/updateuser", verifyToken, async (req, res) => {
  const name = req.body.first_name + " " + req.body.last_name;

  const email = req.user.email;

  if (!email) return res.status(403).json({ message: "invalid email" });

  var cur_obj;
  try {
    cur_obj = await User.findOne({ email: email });
  } catch (err) {
    return res.status(403).json({ message: "something went wrong!" });
  }

  const update_obj = {
    first_name: req.body.first_name ? req.body.first_name : cur_obj.first_name,
    last_name: req.body.last_name ? req.body.last_name : cur_obj.last_name,
    branch: req.body.branch ? req.body.branch : cur_obj.branch,
    institute_name: req.body.institute_name
      ? req.body.institute_name
      : cur_obj.institute_name,
    mobile: req.body.mobile ? req.body.mobile : cur_obj.mobile,
    address: req.body.address ? req.body.address : cur_obj.address,
    isNotificationsAllowed: req.body.isNotificationsAllowed
      ? req.body.isNotificationsAllowed
      : cur_obj.isNotificationsAllowed,
  };

  User.findOneAndUpdate({ email: req.user.email }, update_obj,{new:true})
    .then(async (user) => {
      const b = await SendVerificationLink(
        req.user.email,
        name,
        process.env.FRONTEND_URL + "/user/verify/" + req.user.id
      );
      const cookieUser = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        branch: user.branch,
        institute_name: user.institute_name,
        address: user.address,
        mobile: user.mobile,
        isNotificationsAllowed: user.isNotificationsAllowed,
        branch: user.branch,
        image: user.image,
      };
      res.cookie("user", cookieUser, options);
      return res.status(201).json({ message: "updated successfully!" });
    })
    .catch((err) => {
      return res.status(403).json({ message: "something went wrong!" });
    });
});



// enroll course
router.post("/enroll",verifyToken, async(req, res) => {
  const userId = req.user.id;
  const courseid = req.body.courseId;
  if(!courseid)
    return res.status(201).json({ message: "invalid Course ID" });


  var enrolledCourses = await User.findOne({_id:userId},{courses:true});
  console.log(userId)
  enrolledCourses = enrolledCourses.courses;
  for(let i=0;i<enrolledCourses.length;i++)
  {
      if(enrolledCourses[i].courseId == courseid)
        return res.status(202).json({message:"course already enrolled!!!"})
  }

  User.findOneAndUpdate({ _id: userId }, { $push: {courses : {courseId:courseid,date:new Date()}} }).then(async(user) =>{
        //console.log(course)
        await Course.findOneAndUpdate( {_id: courseid},{$inc : {'noenrolls' : 1}}, {new: true}).then(async(course)=>{
          await SendCourseEnrollment(req.user.email,user.first_name+" "+user.last_name,course.name,process.env.FRONTEND_URL+"/courseplayer/"+course.name)
          return res.status(200).json({message:"You've Enrolled"});
        }); 
       
      })

      .catch((err) => {
        res.status(202).json({
          error: true,
          message: err,
        });
      });
  })



//my Enrollments
router.post('/myEnrollments',verifyToken,async(req,res)=>{
  const userId = req.user.id;
  var courseProjection = {
    courses:true
  };
  const data = await User.findOne({_id:userId},courseProjection);
  var courseids = []
  for(let i=0;i<data.courses.length;i++)
  {
    courseids.push(data.courses[i].courseId);
  }
  var Projection = {
      name:true,
      image : true,
      classes:true,
      channelName:true

  };
  Course.find({ '_id': { $in: courseids } },Projection).then((records)=>{
    let result = [];
    for(let i=0;i<data.courses.length;i++)
    {
      for(let j=0;j<records.length;j++)
      {
       
        
        if(data.courses[i].courseId == records[j]._id.toString()){
        percentage = calculatePersentage(data.courses[i].videos.length,records[j].classes);
        const obj = {...records[j]._doc,percentage:percentage};
        result.push(obj);
        }
      }
    }
    res.status(200).json(result)
  }).catch(err=>{
    res.status(203).json({message:"something went wrong"})
  })
  
})





router.post("/addVideo",verifyToken, (req,res)=>{
  const userId = req.user.id;
  const courseid = req.body.courseId;
  const videoId = req.body.videoId;

  if(!userId)
    return res.status(204).json({ message: "Invalid user" });
  if(!courseid)
    return res.status(204).json({ message: "Invalid course" });
  if(!videoId)
    return res.status(204).json({ message: "unable to find video" });

  
  User.findOneAndUpdate({ _id:userId,"courses.courseId": courseid},{ $push: { "courses.$.videos": videoId } } ).then((user) => {
      let vidCount = 0;
      const courses = user.courses;
      for(let i=0;i<courses.length;i++)
      {
        if(courses[i].courseId===courseid){
        vidCount = courses[i].videos.length;
        break;
        }
      }
      Course.findOne({_id:courseid},{classes:true}).then(course=>{
        let totalCount = course.classes;
        if(vidCount!==totalCount)
          vidCount++;
        const result = calculatePersentage(vidCount,totalCount);
        res.status(201).json(result);
      })
      
    }).catch(err=>{
      res.status(202).json({message:err})
    }) 
})


router.post("/addNote",verifyToken, (req,res)=>{
  const userId = req.user.id;
  const courseId = req.body.courseId;
  const content = req.body.content;
  if(!courseId || content===null || content===undefined)
    return res.status(202).json({ message: "all fields are required" });
 
  User.findOneAndUpdate({ _id:userId,"courses.courseId":courseId},{"courses.$.note": content}).then((c) => {
      res.status(201).json({message:"added successfully"});
    }).catch(err=>{
      res.status(202).json({message:"Something wrong"})
    }) 
})


router.post("/getNote",verifyToken, (req,res)=>{
  const userId = req.user.id;
  const courseId = req.body.courseId;
 
  if(!courseId)
    return res.status(202).json({ message: "all fields are required" });
 
  User.findOne({ _id:userId,"courses.courseId":courseId},{courses:true}).then((c) => {
    console.log(c)
      const courses = c.courses;
      for(let i=0;i<courses.length;i++)
      {
        if(courses[i].courseId===courseId)
          res.status(200).json(courses[i].note);
      }
      res.status(202).json({message:'course not found'});
    }).catch(err=>{
      res.status(202).json({message:"Something wrong"})
    }) 
})
  




router.post("/updateuseraccount", verifyToken, async (req, res) => {
  const email = req.user.email;
  console.log(req.body)
  if (!email) return res.status(403).json({ message: "invalid email" });

  var cur_obj;
  try {
    cur_obj = await User.findOne({ email: email });
  } catch (err) {
    return res.status(403).json({ message: "something went wrong!" });
  }

  const update_obj = {
    first_name: req.body.first_name ? req.body.first_name : cur_obj.first_name,
    last_name: req.body.last_name ? req.body.last_name : cur_obj.last_name,
    branch: req.body.branch ? req.body.branch : cur_obj.branch,
    institute_name: req.body.institute_name
      ? req.body.institute_name
      : cur_obj.institute_name,
    mobile: req.body.mobile ? req.body.mobile : cur_obj.mobile,
    address: req.body.address ? req.body.address : cur_obj.address,
    isNotificationsAllowed: req.body.isNotificationsAllowed
      ? req.body.isNotificationsAllowed
      : cur_obj.isNotificationsAllowed,
  };

  User.findOneAndUpdate({ email: req.user.email }, update_obj,{new:true})
    .then(async (user) => {
      const cookieUser = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        branch: user.branch,
        institute_name: user.institute_name,
        address: user.address,
        mobile: user.mobile,
        isNotificationsAllowed: user.isNotificationsAllowed,
        branch: user.branch,
        image: user.image,
      };
      res.status(201).json(cookieUser);
    })
    .catch((err) => {
      return res.status(403).json({ message: "something went wrong!" });
    });
});



router.post("/updateusernotification", verifyToken, async (req, res) => {
  const email = req.user.email;
  console.log(req.body)
  if (!email) return res.status(403).json({ message: "invalid email" });

  User.findOneAndUpdate({ email: req.user.email }, {isNotificationsAllowed:req.body.isNotificationsAllowed},{new:true})
    .then(async (user) => {
      const cookieUser = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        branch: user.branch,
        institute_name: user.institute_name,
        address: user.address,
        mobile: user.mobile,
        isNotificationsAllowed: user.isNotificationsAllowed,
        branch: user.branch,
        image: user.image,
      };
      res.cookie("user", cookieUser, options);
      res.status(201).json(cookieUser);
    })
    .catch((err) => {
      return res.status(403).json({ message: "something went wrong!" });
    });
});

module.exports = router;