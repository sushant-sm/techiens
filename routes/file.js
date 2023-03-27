const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const Post = require("../models/post");

router.get("/", (req, res) => {
    res.render("file/index");
  });

module.exports = router;