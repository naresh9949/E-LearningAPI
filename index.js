const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
dotenv.config();
const userRoutes = require("./router/user.js");
const authRoutes = require("./router/auth.js");
const courseRoutes = require("./router/courses.js");
const reviewRoutes = require("./router/review.js");
const feedbackRoutes = require("./router/feedback.js");
const quizRoutes = require("./router/quiz.js");
const homeRoutes = require("./router/home.js");


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/",(req,res)=>{
  res.status(200).json({message:'ok'});
})
app.use("/api/Courses", courseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/home", homeRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example AP listening at http://localhost:3000`);
});
