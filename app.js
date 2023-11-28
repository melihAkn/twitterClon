//necessary packages
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expHbs = require('express-handlebars');

require('dotenv').config();
//router files
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
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