var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  path = require("path");
var ImageSchema = new Schema({
  title: { type: String, required: true, allowedProtoMethod: true },
  description: { type: String },
  filename: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});
ImageSchema.virtual("uniqueId").get(function () {
  return this.filename.replace(path.extname(this.filename), "");
});

module.exports.modelImage = mongoose.model("Image", ImageSchema);
