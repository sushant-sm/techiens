const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const Post = require("../models/post");

router.get("/:name",middleware.isLoggedIn, (req, res) => {

  Post.find({ "author.username": req.params.name }, (err, allposts) => {
    if (err) {
      console.log("Error in find");
      console.log(err);
    } else {
      res.render("profile", {
        posts: allposts.reverse(),
        curUser: req.user,
      });
    }
  });

});

module.exports = router;