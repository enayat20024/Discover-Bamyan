const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  descript: String,
  imageUrl: String,
  author: String,
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: null,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
