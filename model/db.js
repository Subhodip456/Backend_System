const mongoose = require("mongoose")

var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  full_name: String,
  age: Number,
  gender: String
})


const db = mongoose.model("db",userSchema)

module.exports = db

