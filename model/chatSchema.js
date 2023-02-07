const mongoose = require("mongoose");

let chatSchema = mongoose.Schema({
    conversation:{
        type: [String],
        required: true
    },
    message: [
      {
        type: new mongoose.Schema(
          {
            text: String,
            senderID: String,
            receiverID: String
          },
          { timestamps: true }
        )
      }
      // { 
      //   text: {
      //   type: String,
      //   require: true,
      //   max:200
      // }, 
      //   senderID: String,
      //   receiverID: String,
      // },
      // {
      //   timestamps: true
      // }

    ]
},
{
  timestamps: true
}
)

const ChatSchema = mongoose.model("chat",chatSchema);

module.exports = ChatSchema;