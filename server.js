var express = require("express"),
  config = require("./server/configure"),
  app = express(),
  path = require("path"),
  mongoose = require("mongoose");

app = config(app);

app.set("port", process.env.PORT || 3300);

app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/imgPloadr", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("open", function () {
  console.log("Mongoose connected");
});
// app.get('/', function(req, res){
//
// res.send('Hello World');
// });
var server = app.listen(app.get("port"), function () {
  console.log("Server up: http://localhost:" + app.get("port"));
});
