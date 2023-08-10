const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  key: String,
  value: String,
})


const store_data_model = mongoose.model("store_data_model",userSchema);

module.exports = store_data_model;

