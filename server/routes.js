const errorHandler = require("errorhandler");
const uniqueId = require("../models/image");
const imagemodel = require("../models/image").modelImage;
const express = require("express"),
  Models = require("../models").Image;
const router = express.Router(),
  home = require("../controllers/home"),
  image = require("../controllers/image"),
  multer = require("multer"),
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/upload");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname +
          "-" +
          Date.now() +
          "." +
          file.originalname.split(".")[1].toLowerCase()
      );
    },
  }),
  upload = multer({
    storage: storage,
  });

module.exports = function (app) {
  router.get("/", home.index);

  router.get("/images/:image_id", image.index);

  router.post("/images", upload.single("file"), (req, res) => {
    // console.log("jshgkhs");
    var unique_Id = req.file.filename.split(".")[0];
    const newImage = new imagemodel({
      title: req.body.title,
      description: req.body.description,
      filename: req.file.filename,
    });
    console.log(newImage);
    newImage.save((err, image) => {
      if (err) {
        console.log(err);
        // res.redirect("http://localhost:3300/");
      }
      if (image) {
        console.log("Data successfully saved!");
        // console.log("1", unique_Id);
        // console.log("2", uniqueId.img);
        res.redirect("http://localhost:3300/images/" + image.filename);
      }
    });
  });

  // router.post("/images", image.createe);
  router.post("/images/:image_id/like", image.like);
  router.post("/images/:image_id/comment", image.comment);

  app.use(router);
};
