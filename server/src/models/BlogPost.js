import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000
    },
    category: {
      type: String,
      default: 'Kinh nghiệm tập luyện',
      trim: true,
      maxlength: 60
    },
    image: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    reviewNote: {
      type: String,
      default: '',
      maxlength: 500
    }
  },
  { timestamps: true }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;