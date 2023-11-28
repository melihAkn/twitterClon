const express = require('express')
const cookieParser = require('cookie-parser')

//router files
const indexRouter = require('./routes/indexRouter')





const jitter = express()

jitter.use('/',indexRouter)