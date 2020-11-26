var path = require("path"),
  routes = require("./routes"),
  exphbs = require("express-handlebars"),
  express = require("express"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  morgan = require("morgan"),
  methodOverride = require("method-override"),
  errorHandler = require("errorhandler"),
  moment = require("moment");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

Handlebars.registerHelper("times", function (n = 6, limit) {
  let acc = "";
  for (let i = 0; i < n; ++i) {
    acc += limit.fn(i);
  }
  return acc;
});

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(methodOverride());
  app.use(cookieParser("some-secret-value-here"));
  app.engine(
    "handlebars",
    exphbs.create({
      handlebars: allowInsecurePrototypeAccess(Handlebars),
      extname: "handlebars",
      defaultLayout: "main",
      layoutsDir: app.get("views") + "/layouts",
      partialsDir: [app.get("views") + "/partials"],
      helpers: {
        timeago: function (timestamp) {
          return moment(timestamp).startOf("minute").fromNow();
        },
      },
    }).engine
  );

  app.set("view engine", "handlebars");
  routes(app);

  app.use("/images", express.static(path.join(__dirname, "../public/upload")));
  app.use("/public/", express.static(path.join(__dirname, "../public")));

  if ("development" === app.get("env")) {
    app.use(errorHandler());
  }

  return app;
};
