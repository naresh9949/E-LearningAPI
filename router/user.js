const router = require("express").Router();
const User = require("./../models/User");
const passport = require('passport');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin, 
} = require("./verifyToken");

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


router.patch("/Enroll/:id", verifyTokenAndAuthorization, (req, res) => {
    const id = req.params.id;
    const courseid = req.query.courseid;
    if(!courseid)
      return res.status(404).json({ message: "invalid arguments" });

    User.findOneAndUpdate({ _id: id }, { $push: {courses : {courseId:courseid,date:new Date()}} })
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
