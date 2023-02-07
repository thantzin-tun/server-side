
const express = require("express");
const app = express();

const http = require("http");
const {Server} = require("socket.io");


//Route
const authRouter = require("./routes/authRoute");

//chat Router
const chatRouter = require("./routes/chatRoute");

//Static File
const path = require("path");


//Template Engine
const jade = require("jade");

//Cors
const cors = require("cors");

//Dotenv
const dotenv = require("dotenv");
dotenv.config();

//MOngoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const chalk = require("chalk");
const sockerOperations = require("./socket");

//Connect Mongo Db
mongoose.connect(process.env.DB_CONNECT,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> {
  console.log("MongoDb is connect is successfully!")
}).catch((err)=> {
  console.log(err)
});


app.use(cors());

//Body Json Data
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Public Directory
app.use(express.static(path.join(__dirname, 'public')));


//User Pug Engine
app.set("views", __dirname + "/views")
app.set('view engine','jade');


//User Middlaware
app.use("/",authRouter);
app.use("/chat",chatRouter);

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:['GET','POST','PUT','DELETE']
  }
})

sockerOperations.socketFunc(io);


//Server
server.listen(process.env.PORT,()=> {
    console.log(chalk.blue("Server is running now at port " , process.env.PORT));
})