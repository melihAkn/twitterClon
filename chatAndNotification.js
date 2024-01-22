//socket io dependencies
const http = require('http');
const socketIO = require('socket.io');
const express = require('express')
const {verify} = require('jsonwebtoken')
const userModel = require('./model/userModel')
require('dotenv').config();
//express
const chatAndNotify = express()
//socket io
const server = http.createServer(express);
const io = socketIO(server);

let userId
let user
const secretKey = process.env.JWT_USER_SECRET_KEY
chatAndNotify.get('/notifications', async (req, res) => {
  console.log(req.cookies.userToken + "token")
  const userToken = verify(req.cookies.userToken,secretKey)
  userId = userToken.id
  user = await userModel.findById(userId)
  .select("-_id -password -email -phoneNumber -dateOfBirth -followed -followers -likedJitters -repostedJitters -publishedJitters -createdAt -updatedAt -__v")
  console.log(user)
  res.send()
});

io.on('connection', (socket) => {
  
socket.on('joinRoom', (userInfos) => {
  const messages = []
  console.log(userInfos);
  socket.join(userInfos.roomID);
  user.notifications.reverse().forEach(e => {
    messages.push(e)
    
  });
  io.to(userInfos.roomID).emit('newMessage',messages)

});

  socket.on('disconnect', () => {
  });
});

const chatAndNotificationPort = 3001
server.listen(chatAndNotificationPort, () => {
  console.log('server on the go this port ' + chatAndNotificationPort);
});
