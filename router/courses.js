const router = require("express").Router();
const Courses = require("./../models/Course");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.post("/wait/AddCourse", verifyTokenAndAdmin, (req, res) => {
  const course = new Course(req.body);
  course
    .save()
    .then((course) => {
      res.status(200).json({ message: "course added successfully" });
    })
    .then((err) => {
      res.status(404).json({ error: true, message: "course adding failed" });
    });
});

router.get("/getCourses", (req, res) => {
  var courseProjection = {
    name: true,
    catrgory: true,
    image: true,
    classes: true,
    channelName: true,
    noenrolls: true,
  };
  Courses.find({ $query: {}, $orderby: { $natural: -1 } }, courseProjection)
    .limit(20)
    .then((courses) => {
      res.status(200).json(courses);
    });
});

router.get("/GetPopularCourses", (req, res) => {
  var courseProjection = {
    name: true,
    catrgory: true,
    image: true,
    classes: true,
    price: true,
    channelName: true,
  };
  Courses.find({ popular: true }, courseProjection).then((courses) => {
    res.status(200).json(courses);
  });
});

router.get("/GetCourseByName/:name", (req, res) => {
  const name = req.params.name;
  var courseProjection = {
    name: true,
    description: true,
    cos: true,
    image: true,
    classes: true,
    noenrolls: true,
    price: true,
    video_content: true,
    channelName: true,
    popular: true,
    branch: true,
    category: true,
  };
  Courses.findOne({ name: name }, courseProjection)
    .then((course) => {
      if (!course) res.status(404).json({ message: "invalid course Name" });
      res.status(200).json(course);
    })
    .catch((err) => {
      res.status(404).json({ message: "invalid course Name" });
    });
});

router.get("/GetCoursePlayer/:name", (req, res) => {
  const name = req.params.name;
  var courseProjection = {
    name: true,
    description: true,
    video_content: true,
    channelName: true,
    comments: true,
  };
  Courses.findOne({ name: name }, courseProjection)
    .then((course) => {
      if (!course) res.status(404).json({ message: "invalid course Name" });
      res.status(200).json(course);
    })
    .catch((err) => {
      res.status(404).json({ message: "invalid course Name" });
    });
});

//search course
router.get("/searchCourse", (req, res) => {
  const search_query = req.query.search_query;
  console.log(search_query);
  var courseProjection = {
    name: true,
    image: true,
    classes: true,
    price: true,
    channelName: true,
  };

  Courses.find({ name: new RegExp(search_query, "i") }, courseProjection)
    .then((items) => {
      if (!items)
        res.status(202).json({ message: "No such courses available" });
      res.status(200).json(items);
    })
    .catch((err) => {
      res.status(202).json({ message: "Something went wrong" });
    });
});

router.post("/addComment", (req, res) => {
  const { first_name, last_name, image, userId, comment, courseId } = req.body;

  if (!first_name || !last_name || !image || !userId || !comment || !courseId)
    return res.status(202).json({ message: "all fields are required" });

  const obj = {
    first_name: first_name,
    last_name: last_name,
    image: image,
    userId: userId,
    comment: comment,
    date: new Date(),
  };
  Courses.findOneAndUpdate({ _id: courseId }, { $push: { comments: obj } })
    .then(() => {
      res.status(201).json({ message: "comment added successfully" });
    })
    .catch((err) => {
      res.status(202).json({ message: err });
    });
});


router.post("/addReply", (req, res) => {
    const { first_name, last_name, image, userId, comment, courseId,commentId } = req.body;
  
   
    if (!first_name || !last_name || !image || !userId || !comment || !courseId || !commentId)
      return res.status(202).json({ message: "all fields are required" });
  
    const obj = {
      first_name: first_name,
      last_name: last_name,
      image: image,
      userId: userId,
      comment: comment,
      date: new Date(),
    };
    Courses.findOneAndUpdate({ _id: courseId,"comments._id":commentId }, { $push: {"comments.$.replies": obj} })
      .then(() => {
        res.status(201).json({ message: "comment added successfully" });
      })
      .catch((err) => {
        res.status(202).json({ message: err });
      });
  });
  
// get by category
router.get("/getByCategory/:category", (req, res) => {
  const category = req.params.category;
  var courseProjection = {
    name: true,
    category: true,
    image: true,
    classes: true,
  };
  Courses.find({ category: category }, courseProjection)
    .then((courses) => {
      if (!courses)
        res.status(201).json({ message: "invalid course category" });
      res.status(200).json(courses);
    })
    .catch((err) => {
      res.status(401).json({ message: "invalid course category" });
    });
});

module.exports = router;

// api/courses/getbycategory/:category
