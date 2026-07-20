const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

blogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const BlogPost = global.BlogPostModel || mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
global.BlogPostModel = BlogPost;
module.exports = BlogPost;
