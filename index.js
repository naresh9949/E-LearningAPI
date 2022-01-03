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

app.use("/api/Courses", courseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/authenticate", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example AP listening at http://localhost:3000`);
});
