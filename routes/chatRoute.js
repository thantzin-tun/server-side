const express = require("express");
const chatMethods = require("../controller/ChatController");
const router = express.Router();

router.get("/access/token/:token",chatMethods.checkToken);
router.post("/",chatMethods.operations);
router.get("/user/conversations/:userID",chatMethods.getUserConversation)


module.exports = router;