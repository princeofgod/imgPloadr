// const { models } = require("mongoose");

// const Stats = require("./stats"),
//   Images = require("./images"),
//   Comments = require("./comments"),
//   async = require("async"),
//   imageModel = require("../models/image").modelImage;

// module.exports = function (viewModel, callback) {
//   async.parallel(
//     [
//       function (next) {
//         imageModel.count({}, next);
//       },
//       function (next) {
//         models.Comment.count({}, next);
//       },
//       function (next) {
//         Comments.newest(next);
//       },
//       function (next) {
//         next(null, 0);
//       },
//     ],
//     function (err, results) {
//       viewModel.sidebar = {
//         images: results[0],
//         popular: results[1],
//         comments: results[2],
//         likes: results[3],
//       };
//       callback(viewModel);
//     }
//   );
// };

var Stats = require("./stats"),
  Images = require("./images"),
  Comments = require("./comments"),
  async = require("async");
module.exports = function (viewModel, callback) {
  async.parallel(
    [
      function (next) {
        Stats(next);
      },
      function (next) {
        next(null, Images.popular());
      },
      function (next) {
        Comments.newest(next);
      },
    ],
    function (err, results) {
      viewModel.sidebar = {
        stats: results[0],
        popular: results[1],
        comments: results[2],
      };
      callback(viewModel);
    }
  );
};
