const sidebar = require("../helpers/sidebar");
const imageModel = require("../models/image").modelImage;

module.exports = {
  index: function (req, res) {
    var viewModel = {
      images: [],
    };

    imageModel.find({}, {}, { limit: 6, sort: { timestamp: -1 } }, function (
      err,
      images
    ) {
      if (err) {
        throw err;
      }

      viewModel.images = images;
      sidebar(viewModel, function (viewModel) {
        res.render("index", viewModel);
      });
    });
    sidebar(viewModel, function (viewModel) {
      res.render("index", viewModel);
    });
  },
};
