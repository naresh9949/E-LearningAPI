// addCourse
// editCourse

const router = require("express").Router();
const Courses = require("./../../models/Course");
const PlaylistSummary = require('youtube-playlist-summary')
const config = {
  GOOGLE_API_KEY: 'AIzaSyD4-WnBIxCj7KZ3NN1pcHEqBjEmYt0HSVY', // require
  PLAYLIST_ITEM_KEY: ['title','videoId'], // option
}
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./../verifyToken");


router.get('/searchCourse',(req,res)=>{
    const search_query = req.body.search_query;
    const category = req.body.catrgory;
    const branch = req.body.branch;

    var courseProjection = {
        name:true,
        image : true,
        classes:true,
        price : true,
        channelName:true
    };
    Courses.find({name: new RegExp(search_query,'i'), catrgory: (req.body.catrgory) ? category:/.*/, branch: (req.body.branch) ? branch:/.*/ },courseProjection).then(items=>{
        if(!items)
            res.status(404).json({message:"No such courses available"});
        res.status(200).json(items);
    }).catch(err=>{
        res.status(404).json({message:"Something went wrong"});
        });
});




  router.post('/addCourse',(req,res)=>{
    const ps = new PlaylistSummary(config)
    const PLAY_LIST_ID = 'PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3';
    const courseData = req.body;
    if(!req.body.name)
        res.status(200).json({message :"Course Name required"})
    if(!req.body.playListId)
        res.status(200).json({message :"playlist Id required"});
    if(!req.body.branch)
        res.status(200).json({message :"Branch required"});
    if(!req.body.channelName)
        res.status(200).json({message :"Channel Name required"});
    if(!req.body.catrgory)
        res.status(200).json({message :"Category required"});
    if(!req.body.description)
        res.status(200).json({message :"Description required"});
    if(!req.body.cos)
        res.status(200).json({message :"Course outcomes required"});
        


    ps.getPlaylistItems(PLAY_LIST_ID)
    .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.error(error)
  })

    

    const course = new Course({
        name : courseData.name,
        playListId : courseData.playListId,
        branch : courseData.branch,
        image : courseData.image,
        channelName : courseData.channelName,
        catrgory : courseData.catrgory,
        description : courseData.description,
        cos : courseData.cos,
    })
    course.save().then((course)=>{
        res.status(200).json({message :"course added successfully"})
    }).then(err=>{
        res.status(404).json({error:true,message :"course adding failed"})
    })
    });


module.exports = router;