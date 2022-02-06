const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const homeSchema = new Schema ({
    name:{type: String , required:true,default:"Home"},
    bannerPage : {type: String , required:true},
    courseImage : {type: String , required:true},
    quickLearnImage : {type: String , required:true},
    youtubeImage : {type: String , required:true},
    quizImage : {type: String , required:true},
    videoLink : {type: String , required:true},
    latestTechImage : {type: String , required:true},
    facebookLink : {type: String , required:true},
    instagramLink : {type: String , required:true},
    twitterLink : {type: String , required:true},
    whatsappLink :{type: String , required:true},
    users : [String],
    email : {type: String ,unique:true},
    branchs : [],
    institutes : [],
    categories:[],
    terms:[],
    privacy : []
    
},{timestamps:true})

module.exports = mongoose.model('Home',homeSchema)


