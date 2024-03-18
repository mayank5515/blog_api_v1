const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRouter = require("./routes/blogRouter");

const app = express();
//MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));

// app.get("/api/v1/blog", (req, res) => {
//   //   console.log(req);
//   res.status(200).json({
//     status: "success",
//     message: "Hello from server side",
//   });
// });
app.use("/api/v1/blog", blogRouter);

module.exports = app;
