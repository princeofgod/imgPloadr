const models = require("../models"),
  async = require("async"),
  imageModel = require("../models/image").modelImage;
module.exports = function (callback) {
  async.parallel(
    [
      function (next) {
        imageModel.count({}, next);
      },
      function (next) {
        models.Comment.count({}, next);
      },
      function (next) {
        imageModel
          .aggregate()
          .group({
            _id: "1",
            viewsTotal: { $sum: "$views" },
          })
          .exec(function (err, result) {
            var viewsTotal = 0;
            if (result.length > 0) {
              viewsTotal += result[0].viewsTotal;
            }
            next(null, viewsTotal);
          });
      },
      function (next) {
        imageModel
          .aggregate()
          .group({
            _id: "1",
            likesTotal: { $sum: "$likes" },
          })
          .exec(function (err, result) {
            var likesTotal = 0;
            if (result.length > 0) {
              likesTotal += result[0].likesTotal;
            }
            next(null, likesTotal);
          });
      },
    ],
    function (err, results) {
      callback(null, {
        images: results[0],
        comments: results[1],
        views: results[2],
        likes: results[3],
      });
    }
  );
};
