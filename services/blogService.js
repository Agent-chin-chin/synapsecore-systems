const BlogPost = require('../lib/models/BlogPost');
const connectDB = require('../lib/mongoose');

async function getAllPosts() {
  await connectDB();
  return BlogPost.find().sort({ createdAt: -1 }).lean();
}

async function getPostById(id) {
  await connectDB();
  return BlogPost.findById(id).lean();
}

async function createPost(data) {
  await connectDB();
  const post = new BlogPost(data);
  await post.save();
  return post.toObject();
}

async function updatePost(id, data) {
  await connectDB();
  return BlogPost.findByIdAndUpdate(id, data, { new: true }).lean();
}

async function deletePost(id) {
  await connectDB();
  return BlogPost.findByIdAndDelete(id);
}

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
