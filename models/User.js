const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema ({
    email : {type: String , required : true,unique:true},
    first_name : {type: String,default:null},
    last_name : {type: String,default:null},
    branch : {type: String , default:null},
    institute_name : {type: String,default:null},
    address : {type: Object,default:null},
    mobile : {type: String,default:null},
    password : {type: String , required : true},
    verified : {type: Boolean , required : true,default:false},
    image : {type: String , required : true,default:"#"},
    isAdmin : {type: Boolean , required : true,default:false},
    isNotificationsAllowed : {type: Boolean , required : true,default:true},
    courses : [{
        courseId : {type: String , required : true,unique : true},
        date : {type: Date,required : true},
        note : {type: String,default : '<p>Add Note<p/>'},
        videos : []
    }],
    createdQuizzes : [{
        id : {type: String , required : true},
    }],
    quizzes:[{
        id : {type: String , required : true},
        attempts : [
            {
                time : {type: String , required : true},
                date : {type: String , required : true},
                score : {type: Number , required : true},
            }
        ]
    }],
    otps : [],
},{timestamps:true}) 



module.exports = mongoose.model('User',userSchema)