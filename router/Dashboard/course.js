const router = require("express").Router();
var VideoParser = require("video-parser");
const Course = require("./../../models/Course");
const PlaylistSummary = require("youtube-playlist-summary");
const config = {
  GOOGLE_API_KEY: "AIzaSyD4-WnBIxCj7KZ3NN1pcHEqBjEmYt0HSVY", // require
  PLAYLIST_ITEM_KEY: ["title", "videoId"], // option
};
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./../verifyToken");
var parser = new VideoParser({
  name: "video-parser-cache",
  youtube: {
    key: "AIzaSyD4-WnBIxCj7KZ3NN1pcHEqBjEmYt0HSVY",
  },
  ttl: 3600,
});

parser.on("error", function (err) {
  console.error(err);
});

function format(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
 
    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
       ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
 }


 // Dashboard search course
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
    Course.find({name: new RegExp(search_query,'i'), catrgory: (req.body.catrgory) ? category:/.*/, branch: (req.body.branch) ? branch:/.*/ },courseProjection).then(items=>{
        if(!items)
            res.status(404).json({message:"No such courses available"});
        res.status(200).json(items);
    }).catch(err=>{
        res.status(404).json({message:"Something went wrong"});
        });
});



//delete course
router.post('/deleteCourse',(req,res)=>{
    const courseid = req.body.courseid;
    if(!courseid)
        res.status(200).json({message:"Course id is required"})

    Course.findOneAndDelete({ _id: courseid }).then((courses)=>{
        res.status(200).json({message:"Course deleted successfully"})
    }).catch(err=>{
        res.status(201).json({message:"something went wrong"})
    })
})



//make popular
router.post('/makePopular',(req,res)=>{
    const courseid = req.body.courseid;
    if(!courseid)
        res.status(200).json({message:"Course id is required"})

    Course.findOneAndUpdate({_id: courseid},[{$set:{popular:{$eq:[false,"$popular"]}}}]).then((course)=>{
        res.status(200).json({message:"updated successfully"})
    }).catch(err=>{
        res.status(201).json({message:"something went wrong"})
    })
})


router.post('/createcourse',async(req,res)=>{

   
    const ps = new PlaylistSummary(config)
    
    const courseData = req.body;
    if(!req.body.name)
        return res.status(201).json({message :"Course Name required"})
    if(!req.body.playListId)
        return res.status(201).json({message :"playlist Id required"});
    if(!req.body.branch)
    return res.status(201).json({message :"Branch required"});
    if(!req.body.channelName)
    return res.status(201).json({message :"Channel Name required"});
    if(!req.body.category)
    return res.status(201).json({message :"Category required"});
    if(!req.body.description)
    return res.status(201).json({message :"Description required"});
    if(!req.body.cos)  
    return res.status(201).json({message :"Course outcomes required"});
        
    var videos = [];

    const data = await ps.getPlaylistItems(req.body.playListId);
    videos = data.items;
    
    for(let i=0;i<videos.length;i++)
    videos[i].duration = "0:00"

    var time = [];

    for (var i = 0; i < videos.length; i++) {
        await parser.parse(function(err, video) {
            if(video){
                time.push(video.duration);
            }else{
                time.push(0);
            }
        }, videos[i].videoUrl)
    }
    
    if(time.length!==videos.length)
    return res.status(504).json({message:"failed at matching length"})
    
    for(let i=0;i<videos.length;i++){
    videos[i].duration = format(time[i])
    delete videos[i].videoUrl;
  }

  var duration = 0;
  for (let i = 0; i < time.length; i++) duration = time[i];

  duration = format(duration);

  const durations = duration.split(":");
  const tags = courseData.name.split(" ");
  //console.log(videos);

  console.log(duration);
  const course = {
    name: courseData.name,
    playListId: courseData.playListId,
    branch: courseData.branch,
    image: courseData.image,
    channelName: courseData.channelName,
    category: courseData.category,
    description: courseData.description,
    cos: courseData.cos,
    videos: videos,
    duration: {
      hours: durations[0],
      minutes: durations[1],
    },
    classes: videos.length,
    tags: tags,
  };

  return res.status(200).json(course);
});

router.post("/addcourse", (req, res) => {
  const {
    name,
    playListId,
    branch,
    image,
    channelName,
    category,
    description,
    cos,
    duration,
    classes,
    tags,
    video_content,
  } = req.body;

  console.log(req.body);

  if (!description && !cos && !video_content)
    res.status(204).json({ message: "missing fields!" });

  const course = new Course({
    name: name,
    playListId: playListId,
    branch: branch,
    image: image,
    channelName: channelName,
    category: category,
    description: description,
    cos: cos,
    duration: duration,
    classes: classes,
    tags: tags,
    video_content: video_content,
  });

  course
    .save()
    .then((course) => {
      res.status(201).json({ message: "course created successfully" });
    })
    .catch((err) => {
      if (err.code === 11000)
        res.status(203).json({ message: "course with given name exists" });

      res.status(203).json({ message: "something went wrong!" });
    });
});

router.post("/editcourse", (req, res) => {
  const id = req.body.id;
  const filter = { _id: id };
  const update = {};
  Courses.findOneAndUpdate(filter);
});


module.exports = router;
