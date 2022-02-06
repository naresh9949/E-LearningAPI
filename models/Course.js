const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    playListId: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    price: { type: String, default: "FREE" },
    popular: { type: Boolean, required: true, default: false },
    rating: { type: Number, default: 4 },
    noenrolls: { type: Number, default: 0 },
    branch: { type: String, default: "" },
    category: { type: String, default: "" },
    channelName: { type: String },
    classes: { type: Number, required: true, default: "0" },
    image: { type: String, default: "#" },
    duration: {
      hours: { type: String, default: "0" },
      minutes: { type: String, default: "0" },
    },
    cos: [String],
    tags: [String],
    video_content: [
      {
        section_title: { type: String, required: true },
        videos: [
          {
            duration: { type: String, default: "0" },
            videoId: { type: String, default: "" },
            title: { type: String, required: true },
          },
        ],
      },
    ],
    comments: [
      {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        image: { type: String, required: true, default: "#" },
        userId: { type: String, required: true },
        comment: { type: String, required: true },
        date: { type: Date, required: true },
        replies: [
          {
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            image: { type: String, required: true, default: "#" },
            userId: { type: String, required: true },
            comment: { type: String, required: true },
            date: { type: Date, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
