const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const User = require("../model/authSchema");

const checkToken = (req,res,next) => {
  var token = req.headers.authorization || req.headers.Authorization;

  if(token && token.startsWith("Bearer")){
    let userToken = token.split(" ")[1];
    jwt.verify(userToken,process.env.PRIVATE_KEY,(err, decoded) => {
      if(err) {
        console.log(err);
      }
      req.user = decoded;
      next();
    })
  }
  else {
    res.status(401).send('Access denied! No token provided.');
  }
}

module.exports = checkToken;