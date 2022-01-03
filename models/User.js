const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema ({
    email : {type: String , required : true,unique:true},
    first_name : {type: String,default:""},
    last_name : {type: String,default:""},
    branch : {type: String , default:"Engineering"},
    institute_name : {type: String},
    address : {type: Object},
    mobile : {type: String},
    password : {type: String , required : true},
    verified : {type: Boolean , required : true,default:false},
    image : {type: String , required : true,default:"#"},
    isAdmin : {type: Boolean , required : true,default:false},
    isNotificationsAllowed : {type: Boolean , required : true,default:true},
    courses : [{
        courseId : {type: String , required : true,unique : true},
        date : {type: Date,required : true}
    }],
    otps : [],
},{timestamps:true}) 



module.exports = mongoose.model('User',userSchema)