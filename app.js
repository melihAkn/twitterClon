//necessary packages
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expHbs = require('express-handlebars');

//socket io dependencies
const http = require('http');
const socketIO = require('socket.io');

//
require('dotenv').config();
//middleware
const tokenAuth = require('./middleware/tokenAuthForAllRoutes')
//router files
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
//controller
const jitter = express();
jitter.use(express.static('public'));
jitter.use(express.urlencoded({extended:true}));
jitter.use(express.json());
jitter.use(cookieParser());

//template engine
jitter.engine('handlebars', expHbs.engine());
jitter.set('view engine', 'handlebars');
jitter.set('views', './views');

jitter.set('view options', { layout: 'main' });
//routers
jitter.use('/',indexRouter);
jitter.use('/user',userRouter);
const port = 3000;

//database connect
const connectionString = process.env.CONNECTION_STRING;

  mongoose.connect(connectionString).then(console.log('connection is success')).catch(e => console.log(e));




jitter.listen(port , _ => {
    console.log(`server running on ${port}`);
});

//socket io
const userModel = require('./model/userModel')
const {verify} = require('jsonwebtoken')
const server = http.createServer(jitter);
const io = socketIO(server);
let userId
let user
const secretKey = process.env.JWT_USER_SECRET_KEY
jitter.get('/notifications', async (req, res) => {
  console.log(req.cookies.userToken + "token")
  const userToken = verify(req.cookies.userToken,secretKey)
  userId = userToken.id
  user = await userModel.findById(userId)
  res.send()
});

io.on('connection', (socket) => {
  
socket.on('joinRoom', (userInfos) => {

  console.log(userInfos);
  socket.join(userInfos.roomID);
  user.notifications.reverse().forEach(e => {
    io.to(userInfos.roomID).emit('newMessage',e)
  });
});

 


  socket.on('disconnect', () => {
  });
});

const chatAndNotificationPort = 3001
server.listen(chatAndNotificationPort, () => {
  console.log('server on the go this port ' + chatAndNotificationPort);
});
