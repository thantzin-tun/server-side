const mongoose = require("mongoose");

let authSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    min:3,
    max:255
  },
  address: {
    type: String,
    min:3,
    max:255
  },
  phone: {
    type: String,
    min:3,
    max:20
  },
  profileImg:{
    data: Buffer,
    contentType: String
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  token:{
    type: String,
    required: true
  }
});

const User = mongoose.model("user", authSchema);
module.exports = User;