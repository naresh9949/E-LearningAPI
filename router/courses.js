const router = require("express").Router();
const Courses = require("./../models/Course");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

router.post('/wait/AddCourse',verifyTokenAndAdmin,(req,res)=>{
    const course = new Course(req.body);
    course.save().then((course)=>{
        res.status(200).json({message :"course added successfully"})
    }).then(err=>{
        res.status(404).json({error:true,message :"course adding failed"})
    })
});

router.get('/GetCourses',(req,res)=>{
    var courseProjection = {
        name:true,
        catrgory:true, 
        image : true,
        classes:true
    };
    Courses.find({},courseProjection).then((courses)=>{
        res.status(200).json(courses);
    })
});

router.get('/GetPopularCourses',(req,res)=>{
    var courseProjection = {
        name:true,
        catrgory:true, 
        image : true,
        classes:true
    };
    Courses.find({popular:true},courseProjection).then((courses)=>{
        res.status(200).json(courses);
    })
});

router.get('/GetCourse/:id',(req,res)=>{
    res.status(200).json({message : 'done'})
});


router.get('/SearchCourses',(req,res)=>{
    const search_query = req.query.search_query;
    const tags = req.query.tags;
    console.log(search_query,tags);
    res.status(200).json({message : search_query})
});


module.exports = router;