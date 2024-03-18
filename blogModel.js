const mongoose = require("mongoose");
// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require("slugify");

//SCHEMA
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog Title is required!"],
  },

  blog: {
    type: String,
    required: [true, "Blog is required!"],
    minLength: [10, "A Blog should be atleast 20 words or more"],
    maxLength: [500, "A Blog should be at max 500 words or less"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: {
    type: Number,
    default: 0,
  },
  tags: [String],
  by: {
    type: String,
  },
  slug: String,
});

//MIDDLEWARES
//DOCUMENT MIDDLEWARE
blogSchema.pre("save", function (next) {
  // console.log(`Hello from document middleware...`, this);
  this.slug = slugify(this.title);
  next();
});
//QUERY MIDDLEWARE ->will run before or after certain query is executed like findById,find,findByIdAndUpdate etc
// blogSchema.pre(/^find/, function (next) {

//   console.log(`Hello from query middleware...`, this);
//   next()
// });
//MODEL
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
