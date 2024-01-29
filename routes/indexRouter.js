const {Router} = require('express');
const controller = require('../controller/indexController');
const userController = require('../controller/userController');
const indexRouter = Router();
const tokenAuthForAllRoutes =require('../middleware/tokenAuthForAllRoutes')
//page renders
indexRouter.get('/login',controller.loginPage);
indexRouter.get('/register',controller.registerPage);
indexRouter.get('/',controller.mainPage);
indexRouter.get('/messaging',controller.messagePage)
//indexRouter.get('/comments/:id')

indexRouter.get('/suggestedUsers',tokenAuthForAllRoutes,controller.suggestedUsers)

//post patch delete
indexRouter.post('/searchUser',userController.getSearchedUsers)
indexRouter.post('/login',controller.login);
indexRouter.post('/register',controller.register);

indexRouter.get('/jitter/:username/:jitterId',controller.jitterPage)
indexRouter.post('/jitter/commentData',controller.getCommentData)
indexRouter.post('/comments/getId',controller.getCommentID)
module.exports = indexRouter;