const Blog = require("../models/blogModel");

exports.aliasTopFiveLiked = async (req, res, next) => {
  req.query.sort = "-likes";
  req.query.limit = 5;
  next();
};
exports.alistTopFiveRecent = async (req, res, next) => {
  req.query.limit = 5;
  next();
};
exports.getAllBlogs = async (req, res) => {
  try {
    console.log("req.query", req.query);
    //made a shallow copy
    const queryObj = { ...req.query }; //iss { likes: '3', page: '1', sort: 'likes'  } queryObj ko BLog.find(queryObj) m daalunga
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj);
    //ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj); //{ likes: { lte: '3' } } likes[lte]=3
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //{ likes: { $lte: '3' } }
    let query = Blog.find(JSON.parse(queryStr)); //returns a query object which isnt executed yet so we can use different methods on it
    //SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //FIELD LIMITING
    // console.log(req.query.fields, "fields");
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    //PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //fix limiting pages
    query = query.skip(skip).limit(limit);
    const blogs = await query;
    res.status(200).json({
      status: "success",
      results: blogs.length,
      blogs,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error occured ${err}`,
    });
  }
};
exports.createBlog = async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    // console.log("created Blog", newBlog);
    res.status(201).json({
      status: "success",
      newBlog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error occured ${err}`,
    });
  }
};
exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      message: updatedBlog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error occured ${err}`,
    });
  }
};
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json({
      status: "success",
      blog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error occured ${err}`,
    });
  }
};
exports.deleteBlog = async (req, res) => {
  try {
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error occured ${err}`,
    });
  }
};
exports.blogStats = async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        //MATCH STAGE similar to .find
        // The $match stage filters out documents that don't match the given filter parameter
        $match: { likes: { $lte: 5 } },
      },
      {
        //GROUP STAGE ACTS AS REDUCE
        //we can set group by documents we filtered in above stage , we can group by similar property and do other methods on them
        $group: {
          // Each `_id` must be unique, so if there are multiple
          // documents with the same likes, MongoDB will increment `count`
          _id: "$likes",
          countOfLikes: { $sum: 1 },
          blogs: { $push: "$title" },
        },
      },
      {
        //add additional fields ->with a value
        $addFields: { liked: "$_id" },
      },
    ]);
    res.status(200).json({
      status: "success",
      results: stats.length,
      stats,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error occured ${err}`,
    });
  }
};
exports.similarBlogs = async (req, res) => {
  try {
    const similarBlogs = await Blog.aggregate([
      {
        //as tags (is an array of strings)
        //i want to unwind tags of each document so that later i can group each document with similar tag
        $unwind: "$tags",
      },
      {
        //MATCH STAGE
        //for now i want all blogs , therefore i will filter out blogs that are less than some specific date(which is in future)
        //match will take filter object {propertyInSchema:{mongodb_operator:some_val}}
        $match: {
          createdAt: {
            //yyyy-mm-dd
            $lte: new Date(`2024-04-18`),
          },
        },
      },
      {
        $group: {
          _id: "$tags",
          blogs: { $push: "$title" },
          numBlogs: { $sum: 1 }, //for each of the document going thru this pipeline , add 1 to it
        },
      },
      {
        //add additional fields
        $addFields: { tag: "$_id" },
      },
      {
        //exclude fields
        $project: {
          _id: 0,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      results: similarBlogs.length,
      similarBlogs,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error occured ${err}`,
    });
  }
};
