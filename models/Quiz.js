const mongoose = require('mongoose')
const Schema = mongoose.Schema
const quizSchema = new Schema ({
    name : {type: String , required : true},
    secretKey : {type:Number},
    tags : [],
    branch : {type: String , default:""},
    public : {type:Boolean,required:true,default:true},
    maxAttempts : {type:Number,required:true,default:5},
    ownerId : {type:String,required:true},
    users : [String],
    questions : [
        {
            question : {type: String , required:true},
            options : [String],
            ans : {type:Number,required:true}
        }
    ]
},{timestamps:true}) 



module.exports = mongoose.model('Quiz',quizSchema)