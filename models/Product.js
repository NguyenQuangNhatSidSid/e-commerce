const { default: mongoose, Schema } = require("mongoose");

const ModelSchema = new Schema({
  title: { type: String, require: true },
  description: String,
  price: { type: String, require: true },
});
