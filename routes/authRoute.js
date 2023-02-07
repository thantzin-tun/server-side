const {Router, request} = require("express");
const router = Router();

//Imgae Upload and Create Upload Folder
// const multer = require("multer");
// const upload = multer({dest:"./public/upload"})
const upload = require('../common/uploadImage')

const authMethods = require("../controller/AuthController");
const User = require("../model/authSchema");

const checkToken = require("../validation/tokenValidation")

router.post("/login",authMethods.login)
.post("/api/google/login",authMethods.googleLogin)
.post("/email/verify",authMethods.verifyEmail).post("/register",upload.single("profileImg"),authMethods.register);



//Jade File Serve
router.get("/homepage", checkToken,(req,res,next)=> {
    res.render("index",({
        title:"Welcome To My Home",
        src:"/images/merry.jpg"
    }));
})

router.get("/posts", async(req,res)=>{
    let user = await User.find({ _id:(req.user.id)});
    res.status(200).send(user);
})

// router.post("/upload",upload.array("merry-christmas",2),(req,res)=> {
//     res.status(200).send("Uploaded");
//     console.log(req.file);
// })

module.exports = router;