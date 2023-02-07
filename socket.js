const chalk = require("chalk");

const sockerOperations = {};

let activeUser = [];

sockerOperations.socketFunc = (io) => {
  io.on("connection", (socket) => {
    //Connected User Functions
    socket.on("add-user", (userID) => {
      let checkUser = activeUser.some((user) => user?.id === userID);
      if (!checkUser) {
        activeUser.push({
          id: userID,
          socketID: socket.id,
        });
      }
      io.emit("get-user", activeUser);
      console.log("The active user is", activeUser);
    });

    socket.on("send_message_to_another", ({message,senderID,receiverID}) => {
      console.log("The id is", message,senderID,receiverID);
      let get_receiver_user_id = activeUser.filter((c) => {
        return c?.id === receiverID;
      });
      if (get_receiver_user_id.length > 0) {
        console.log("Get_receiver_user_id is" , get_receiver_user_id[0].socketID);
        // io.to(get_receiver_user_id[0].socketID).emit(
        //   "returnMessage",
        //   { message:message,senderID:senderID,receiverID:receiverID }
        // );
        socket.broadcast.emit('returnMessage',{ message:message,senderID:senderID,receiverID:receiverID });
      } else {
        console.log("No active user");
      }
    });


    // Disconnected User
    socket.on("disconnect", () => {
        activeUser = activeUser.filter((user) => {
          return user.socketID !== socket.id
        })
        if(activeUser.length > 0) {
          console.log("offline user is" , activeUser);
          console.log(chalk.green("User is disconnected now!", socket.id));
          io.emit("get-user", activeUser);
        }
        else {
          console.log("No user offline.");
        }
      });
  });
  
};

module.exports = sockerOperations;
