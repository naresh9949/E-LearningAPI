const router = require("express").Router();
const res = require("express/lib/response");
const Quiz = require("../models/Quiz");
const Feedback = require("./../models/Feedback");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndInstructor
  } = require("./verifyToken");


  // create Quiz

router.post('/createQuiz',verifyTokenAndInstructor,(req,res)=>{
    const quizData = req.body;

    if(!quizData.name || !quizData.branch || !quizData.questions)
        return res.status(402).json({message:"all fields are required!"})
    
    const tags = quizData.name.split(" ");
    const quiz = new Quiz({
        name : quizData.name,
        tags : tags,
        branch : quizData.branch,
        ownerId : '90000',
        secretKey : Math.floor(100000 + Math.random() * 900000),
        users: quizData.users?quizData.users:[],
        maxAttempts : quizData.maxAttempts?quizData.maxAttempts:5,
        public : quizData.public?quizData.public:true,
        questions : quizData.questions
    })

    quiz.save().then(quiz=>{
        return res.status(200).json({message:"quiz created successfully!"})
    }).catch(err=>{
        return res.status(401).json({message:err})
    })
})


// get Quizzes

router.get('/getQuizzes',(req,res)=>{
    var quizProjection = {
        name:true,
        public:true
    };
    Quiz.find({public:true},quizProjection).then(quizzes=>{
        return res.status(200).json(quizzes);
    }).catch(err=>{
        return res.status(404).json({message:err})
    })
})


// getQuiz by ID

router.get('/getQuiz/:id',verifyToken,(req,res)=>{
    console.log(req.params.id)
    const quiz_id = req.params.id
    var quizProjection = {
        name:true,
        questions:true
    };
    Quiz.exists({_id:quiz_id}).then(exists=>{
        if(exists)
        {
            Quiz.findOne({_id:quiz_id}).then(quiz=>{
                return res.status(200).json(quiz)
            })
        }
        else
        {
            return res.status(404).json({message:"Invalid quiz ID"})
        }
    }).catch(err=>{
        return res.status(404).json({message:err})
    })
})

// remove Quiz by ID

router.get('/removeQuiz/:id',verifyToken,(req,res)=>{
    const quiz_id = req.params.id;
    Quiz.findOneAndRemove({_id: quiz_id}).then(quiz=>{
        if(!quiz){
            return res.status(404).json({message:"quiz not found!"})
        }
        return res.status(200).json({message:"Quiz removed successfully!"})
    }).catch(err=>{
        return res.status(404).json({message:"quiz not found!"})
    })
})


// add User

router.post('/addUser',verifyToken,(req,res)=>{
    const quizId = req.body.id;      
    const key = req.body.key;
    const email = 'xyz2.com';
    Quiz.findOneAndUpdate({_id:quizId,secretKey:key},{$push:{users:email}}).then(quiz=>{
        console.log(quiz)
        if(quiz)
        return res.status(200).json({message:'user added successfully!'})
        else
        return res.status(404).json({message:'invalid key,ID not found'})
    }).catch(err=>{
        return res.status(404).json({message:'invalid key,ID not found'})
    })
})


module.exports = router;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZDFiMWU2OTJmY2VmMmNkMzJhZTI4MCIsImlzQWRtaW4iOmZhbHNlLCJlbWFpbCI6ImVtYWlsOW8wQGdtYWlsLmNvbSIsImlhdCI6MTY0MTEzMjUxOSwiZXhwIjoxNjQxMzkxNzE5fQ.Ge-Biwsi2thzcMQWJr6E8W5f73nzaNGsHUJ7hdcaJXk