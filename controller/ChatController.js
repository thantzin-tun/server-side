const User = require("../model/authSchema");
const Chat = require("../model/chatSchema");

let chatMethods = {};


//Check Login Token but who Token
chatMethods.checkToken = async (req,res) => {
    const {token} = req.params;
    try {
        let user = await User.find({
            token: token
        })
        res.status(200).send(user);
    } catch (error) {
        console.log("Token error is" , error);
    }
}


//Chat Schema Create Conversation
chatMethods.operations = async (req, res) => {
  const {text,senderID,receiverID } = req.body;
  var message = {
    text,
    senderID,
    receiverID,
  };
  let haveConversation = await Chat.find({
    conversation: { $all: [senderID, receiverID] },
  });
  if (haveConversation.length == 0) {
    let userChat = new Chat({
      conversation: [senderID, receiverID],
      message: [message],
    });
    try {
      let result = await userChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    try {
      let result = await Chat.findOneAndUpdate(
        { _id: haveConversation[0]._id },
        { $push: { message: message } }
      );
      res.status(200).json({ result: result });
    } catch (error) {
      res.status(500).send("No chat conversations");
    }
  }
};

//Sender Chat list about userID
chatMethods.getUserConversation = async (req, res) => {
  const { userID } = req.params;

  try {
    let completeConversation = [];

    let otheruser = [];

    let allMessage;

    let result = await Chat.find({
      $or:[{"message.senderID": userID},{"message.receiverID": userID}]
      // conversation: { $all: [userID] },
    });
    
    let one = result.map((c) => {
        if(c.conversation[0] !== userID ){
          otheruser.push(c.conversation[0])
        }
    })

    let two = result.map((c) => {
      if(c.conversation[1] !== userID){
        otheruser.push(c.conversation[1])
      }
  })

  for (let i = 0; i < otheruser.length; i++) {
    
      let user = await User.findById({
        _id: otheruser[i]
      })
  
      allMessage = await Chat.find({
        conversation: { $all: [userID,otheruser[i]] },
      });
      completeConversation.push({
          id: user._id,
          name: user.name,
          email: user.email,
          message:allMessage[0].message
      })

    }
    res.status(200).send(completeConversation);
  } catch (error) {
    res.status(400).send("No found chat conversation!");
  }
};

module.exports = chatMethods;
