const User = require("../model/authSchema");
let authMethods = {};
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");

const sendingMail = require("../common/sendingEmail");

const client = new OAuth2Client(
  "enter your google client id"
);

//Common Functions generate Token login with google
const generateToken_google = (user) => {
  let token = jwt.sign(
    {
      id: user,
    },
    process.env.PRIVATE_KEY,
    { expiresIn: "10d" }
  );
  return token;
};

//Register User
let user = {
  name: "",
  email: "",
  password: null,
  profileImg:{
      data: "",
      contentType: "image/png"
  }
};


//Register and Sign in with google hash password and save database
const passHash = (pass) => {
  return new Promise((resolve,reject) => {
    if(pass){
      var salt = bcrypt.genSaltSync(10);
      let hashPassword = bcrypt.hash(pass, salt);
      resolve(hashPassword);
    }
    else {
        reject("Wrong!")
    }
  })
};


//Return User
const userData = async (name, email, pass,profileImg) => {
  let password = await passHash(pass);
  user.name = name;
  user.email = email;
  user.password = password;
  user.profileImg.data = profileImg
};


//Register From Application
authMethods.register = async (req,res) => {
  const url = req.protocol + '://' + req.get('host');
  let profileImg = url + '/public/upload/' + req.file.filename;

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let emailExit = await User.findOne({ email: req.body.email });
  if (emailExit) return res.json({message:"Email already have been register!",status: false});

  try {
    let successMail = await sendingMail(req.body.email);
    if (successMail) {
      const { name, email, password } = req.body;
      userData(name, email, password,profileImg);
      res.status(200).json({status: true});
      console.log("The success email is" , successMail);
    } else {
      res.status(500).send("No register this email!");
      console.log("Something wrong");
    }
  } catch (error) {
    res.status(400).send("Failed");
  }

  // const {name,email,password} = req.body;
  //  try {
  //     const result = await User.create({name,email,password,profileImg});
  //     console.log("Result is" ,result);
  //  } catch (error) {
  //     res.send("Again Upload");
  //  }
};

//Verify Email
authMethods.verifyEmail = async (req, res) => {
  const { verifyCode } = req.body;
  if (verifyCode === process.env.EMAIL_CODE) {
    try{
        const token = generateToken_google(verifyCode);
        let newUser = await User.create({...user,token});
        res.status(200).json({
          message: "Registered Successfully",
          verify: true
        });
    }
    catch {
        console.log("Something Wrong Verfiy Email to Insert User Database")
    }
  } else {
    res.status(200).json({
        message: "Invalid Code",
        verify: false
    });
  }
};


//Simple Login
authMethods.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let exit_user = await User.findOne({ email: req.body.email });
  if (!exit_user) return res.send({message:"These credentials do not match our records.",status: false});

  let oldpassword = bcrypt.compareSync(req.body.password, exit_user.password);
  if (!oldpassword) return res.send( {message:"Password in incorrect!",status:false} );

  // const token = generateToken_google(exit_user._id);
  let token = exit_user.token
  res.status(200).send({
    message:token,
    status: true
  });
};


//Sign In with google button from frontend
authMethods.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "enter you google clinet id",
    })
    .then(async (result) => {
      const { email_verified, name, email } = result.payload;
      if (email_verified) {
        let hasUser = await User.findOne({ email });
        if (hasUser) {
          // const { id, name, email ,token} = hasUser;
          const {token} = hasUser;
          return res.status(200).send(token);
        } else {
          let token = jwt.sign(
            {
              email: email,
            },
            process.env.PRIVATE_KEY,
            { expiresIn: "10d" }
          );
          var password = email + process.env.PRIVATE_KEY;
          let newUser = new User({ name, email, password, token });
          let user = await newUser.save();
          return res.status(200).send(token);
        }
      } else {
        console.log("Something went wrong!");
      }
    })
    .catch((err) => {
      console.log("Error is", err);
    });
};


module.exports = authMethods;
