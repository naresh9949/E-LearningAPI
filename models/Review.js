const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ReviewSchema = new Schema ({
    id:{type: String , required : true},
    first_name : {type: String , required : true},
    last_name : {type: String , required : true},
    rating : {type: Number , required : true},
    message : {type: String }
})

module.exports = mongoose.model('Review',ReviewSchema)