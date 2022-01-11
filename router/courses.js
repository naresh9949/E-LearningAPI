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
    const course_id = req.params.id;
    Courses.find({_id:course_id}).then(course=>{
        if(!course)
        res.status(401).json({message:"invalid course id"});
        res.status(200).json(course);
    }).catch(err=>{
        res.status(401).json({message:"invalid course id"});
    });
});



//get popular courses
router.get('/GetCourseByName/:name',(req,res)=>{
    const name = req.params.name;
    Courses.findOne({name:name}).then(course=>{
        if(!course)
        res.status(404).json({message:"invalid course id"});
        res.status(200).json(course);
    }).catch(err=>{
        res.status(404).json({message:"invalid course id"});
    });
});


router.get('/SearchCourses',(req,res)=>{
    const search_query = req.query.search_query;
    const tags = req.query.tags;
    console.log(search_query,tags);
    res.status(200).json({message : search_query})
});


// get by category
router.get('/getByCategory/:category',(req,res)=>{
    const category = req.params.category;
    var courseProjection = {
        name:true,
        catrgory:true, 
        image : true,
        classes:true
    };
    Courses.find({catrgory:category},courseProjection).then(courses=>{
        if(!courses)
        res.status(401).json({message:"invalid course category"});
        res.status(200).json(courses);
    }).catch(err=>{
        res.status(401).json({message:"invalid course category"});
    });

})

module.exports = router;


// api/courses/getbycategory/:category
