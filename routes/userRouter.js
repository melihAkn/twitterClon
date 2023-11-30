const {Router} = require('express');
const controller = require('../controller/userController')
const userRouter = Router();

userRouter.get('/',);
userRouter.get('/getUserToken',controller.getUserToken);
userRouter.post('/publishJitter',controller.publishJitter);
userRouter.get('/getAllJitters',controller.getAllJitters);
userRouter.get('/logout',controller.logout);
module.exports = userRouter;