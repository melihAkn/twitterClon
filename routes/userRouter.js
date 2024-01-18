const {Router} = require('express');
const controller = require('../controller/userController');
const userRouter = Router();
//jwt control middleware
const tokenAuthForAllRoutes =require('../middleware/tokenAuthForAllRoutes')
userRouter.get('/username',tokenAuthForAllRoutes,controller.getUsername);
userRouter.get('/getUserToken',controller.getUserToken);
userRouter.get('/profile/:username',controller.profilePageRender);
//getting user infos
userRouter.post('/getUserInfos',tokenAuthForAllRoutes,controller.getUserInfos);

userRouter.post('/publishJitter',tokenAuthForAllRoutes,controller.publishJitter);

userRouter.get('/getAllJitters',tokenAuthForAllRoutes,controller.getAllJitters);
userRouter.get('/followedUsersJitters',tokenAuthForAllRoutes,controller.followedUsersJitters);

userRouter.post('/getUserRejitteredJitters',tokenAuthForAllRoutes,controller.getUserRejitteredJitters);
userRouter.post('/getUserLikedJitters',tokenAuthForAllRoutes,controller.getUserLikedJitters);

userRouter.post('/getUserFollowedUsers',tokenAuthForAllRoutes,controller.getUserFollowedUsers);
userRouter.post('/getUserFollowerUsers',tokenAuthForAllRoutes,controller.getUserFollowedUsers);

userRouter.post('/likeAndUnlikeJitter',tokenAuthForAllRoutes,controller.likeAndUnlikeJitter);

userRouter.post('/followUser',tokenAuthForAllRoutes,controller.userFollow);
userRouter.post('/unfollowUser',tokenAuthForAllRoutes,controller.unfollowUser);

userRouter.post('/addComment',tokenAuthForAllRoutes,controller.addComment);
//remove comment
//update comment

userRouter.post('/rejitter',tokenAuthForAllRoutes,controller.rejitter);
userRouter.post('/removeRejitter',tokenAuthForAllRoutes,controller.removeRejitter);

userRouter.get('/logout',controller.logout);
module.exports = userRouter;