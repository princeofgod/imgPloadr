var fs = require("fs"),
  path = require("path"),
  sidebar = require("../helpers/sidebar"),
  md5 = require("md5"),
  multer = require("multer"),
  Models = require("../models");
const express = require("express");
const imageModel = require("../models/image").modelImage;
const router = express.Router();
//
// ---------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/upload/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// ---------------------------------------
module.exports = upload;
module.exports = router;
module.exports = {
  index: function (req, res) {
    // res.render("image");
    const viewModel = {
      image: {},
      comments: [],
    };

    // find the image by searching the filename matching the url parameter:
    imageModel.findOne({ filename: req.params.image_id }, function (
      err,
      image
    ) {
      if (err) {
        throw err;
      }
      if (image) {
        viewModel.image = image;

        // if the image was found, increment its views counter
        viewModel.image.views++;

        // save the model (since it has been updated):
        image.save();
        // find any comments with the same image_id as the image:
        Models.Comment.find(
          { image_id: image._id },
          {},
          { sort: { timestamp: 1 } },
          function (err, comments) {
            // save the comments collection to the viewModel:
            viewModel.comments = comments;
            // build the sidebar sending along the viewModel:
            sidebar(viewModel, function (viewModel) {
              // render the page view with its viewModel:
              console.log("60 second viewmodel", viewModel);
            });
          }
        );
        res.render("image", viewModel);
      }
    });
  },

  like: function (req, res) {
    imageModel.findOne({ filename: { $regex: req.params.image_id } }, function (
      err,
      image
    ) {
      if (!err && image) {
        image.likes = image.likes + 1;
        image.save(function (err) {
          if (err) {
            res.json(err);
          } else {
            res.json({ likes: image.likes });
          }
        });
      }
    });
  },

  comment: (req, res) => {
    imageModel.findOne({ filename: { $regex: req.params.image_id } }, function (
      err,
      image
    ) {
      // console.log("30 = req.body:", req.body);
      if (err) {
        throw err;
      }
      if (image) {
        var newComment = new Models.Comment(req.body);

        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        newComment.save();
        res.redirect("localhost:3300/" + image.filename);
        req.body = {};
      } else {
        res.redirect("/");
      }
    });
  },
};
