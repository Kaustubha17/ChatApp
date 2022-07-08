const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router  = require('./routes/userRoutes');
const messageRouter = require('./routes/messagesRoute');
const app = express();
const socket = require('socket.io');
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use("/api/auth", router)
app.use('/api/messages',messageRouter)
async function dbConnection() {
  await mongoose.connect(process.env.MONGO_URL)
     .then(() => {
       console.log("db Connection successfull")
     })
     .catch((err) => {
       console.log(err.message);
     });
 }
 dbConnection()

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
})

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});

