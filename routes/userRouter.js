const {Router} = require('express');
const controller = require('../controller/userController')
const userRouter = Router();

userRouter.get('/',);
userRouter.get('/getUserToken',controller.getUserToken);
userRouter.post('/publishJitter',controller.publishJitter);
userRouter.get('/getAllJitters',controller.getAllJitters);
userRouter.post('/likeAndUnlikeJitter',controller.likeAndUnlikeJitter)

userRouter.post('/followUser',controller.userFollow)
userRouter.post('/unfollowUser',controller.unfollowUser)

userRouter.post('/addComment',controller.addComment)


userRouter.get('/logout',controller.logout);
module.exports = userRouter;