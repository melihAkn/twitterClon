const {Router} = require('express');
const controller = require('../controller/userController');
const userRouter = Router();

userRouter.get('/username',controller.getUsername);
userRouter.get('/getUserToken',controller.getUserToken);
userRouter.get('/profile/:username',controller.profilePageRender);
userRouter.get('/getUserInfos',controller.getUserInfos);

userRouter.post('/publishJitter',controller.publishJitter);

userRouter.get('/getAllJitters',controller.getAllJitters);
userRouter.get('/followedUsersJitters',controller.followedUsersJitters);



userRouter.post('/getUserRejitteredJitters',controller.getUserRejitteredJitters);
userRouter.post('/getUserLikedJitters',controller.getUserLikedJitters);

userRouter.post('/getUserFollowedUsers',controller.getUserFollowedUsers);
userRouter.post('/getUserFollowerUsers',controller.getUserFollowedUsers);
userRouter.post('/likeAndUnlikeJitter',controller.likeAndUnlikeJitter);

userRouter.post('/followUser',controller.userFollow);
userRouter.post('/unfollowUser',controller.unfollowUser);

userRouter.post('/addComment',controller.addComment);

userRouter.post('/rejitter',controller.rejitter);
userRouter.post('/removeRejitter',controller.removeRejitter);

userRouter.get('/logout',controller.logout);
module.exports = userRouter;