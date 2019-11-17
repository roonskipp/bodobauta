const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const Post = mongoose.model('Post', PostSchema, "Post");

module.exports = Post;