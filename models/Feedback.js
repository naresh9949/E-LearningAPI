const mongoose = require('mongoose')
const Schema = mongoose.Schema
const feedbackSchema = new Schema ({
    first_name : {type: String , required : true},
    last_name : {type: String , default:""},
    email : {type: String , required : true},
    subject : {type: String},
    message : {type: String }
})

module.exports = mongoose.model('Feedback',feedbackSchema)