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




router.get('/getCourses',(req,res)=>{
    var courseProjection = {
        name:true,
        catrgory:true, 
        image : true,
        classes:true,
        channelName:true
    };
    Courses.find({$query: {}, $orderby: {$natural : -1}},courseProjection).limit(20).then((courses)=>{
        console.log(courses)
        res.status(200).json()
    })   
});







router.get('/GetPopularCourses',(req,res)=>{
    var courseProjection = {
        name:true,
        catrgory:true, 
        image : true,
        classes:true,
        price : true,
        channelName:true
    };
    Courses.find({popular:true},courseProjection).then((courses)=>{
        res.status(200).json(courses);
    })
});



// router.get('/GetCourse/:id',(req,res)=>{
//     const course_id = req.params.id;
//     Courses.find({_id:course_id}).then(course=>{
//         if(!course)
//         res.status(401).json({message:"invalid course id"});
//         res.status(200).json(course);
//     }).catch(err=>{
//         res.status(401).json({message:"invalid course id"});
//     });
// });




router.get('/GetCourseByName/:name',(req,res)=>{
    const name = req.params.name;
    var courseProjection = {
        name:true,
        description:true, 
        cos:true,
        image : true,
        classes:true,
        noenrolls:true,
        price : true,
        video_content:true,
        channelName:true
    };
    Courses.findOne({name:name},courseProjection).then(course=>{
        if(!course)
            res.status(404).json({message:"invalid course Name"});
        res.status(200).json(course);
    }).catch(err=>{
        res.status(404).json({message:"invalid course Name"});
    });
});



//search course
router.get('/searchCourse',(req,res)=>{
    const search_query = req.query.search_query; 
    var courseProjection = {
        name:true,
        image : true,
        classes:true,
        price : true,
        channelName:true
    };
    Courses.find({name: new RegExp(search_query,'i') },courseProjection).then(items=>{
        if(!items)
            res.status(404).json({message:"No such courses available"});
        res.status(200).json(items);
    }).catch(err=>{
        res.status(404).json({message:"Something went wrong"});
    });
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
