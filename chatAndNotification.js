//socket io dependencies
const http = require('http');
const socketIO = require('socket.io');
const express = require('express')
const {verify} = require('jsonwebtoken')
const userModel = require('./model/userModel')
require('dotenv').config();
//express
const chatAndNotify = express()
chatAndNotify.use(express.static('public'));
chatAndNotify.use(express.urlencoded({extended:true}));
chatAndNotify.use(express.json());
//socket io
const server = http.createServer(express);
const io = socketIO(server);

let user
const secretKey = process.env.JWT_USER_SECRET_KEY
io.on('connection', (socket) => {
  
socket.on('joinRoom', async(userInfos) => {
    console.log(userInfos)
    const userToken = verify(userInfos.token,secretKey)
    user = await userModel.findById(userToken.id)
    .select("-_id -password -email -phoneNumber -dateOfBirth -followed -followers -likedJitters -repostedJitters -publishedJitters -createdAt -updatedAt -__v")
    const messages = []
    socket.join(userInfos.roomID);
    user.notifications.reverse().forEach(e => {
    messages.push(e)
    
  });
  io.to(userInfos.roomID).emit('newNotification',messages)
});


  socket.on('joinChatRoom',async(chatRoomInfos) => {



  })







  socket.on('disconnect', () => {
  });
});

const chatAndNotificationPort = 3001
server.listen(chatAndNotificationPort, () => {
  console.log('server on the go this port ' + chatAndNotificationPort);
});
