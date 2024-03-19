const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

//aliasing
//
router
  .route("/top-five-liked")
  .get(blogController.aliasTopFiveLiked, blogController.getAllBlogs);
router
  .route("/top-five-recent")
  .get(blogController.alistTopFiveRecent, blogController.getAllBlogs);
router.route("/blog-stats").get(blogController.blogStats);
router.route("/similar-blogs").get(blogController.similarBlogs);
//
//ROUTES
router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(blogController.createBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
