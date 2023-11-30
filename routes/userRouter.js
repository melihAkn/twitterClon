const {Router} = require('express');
const controller = require('../controller/userController')
const userRouter = Router();

userRouter.get('/',);
userRouter.get('/getUserToken',controller.getUserToken);

module.exports = userRouter;