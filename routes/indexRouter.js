const {Router} = require('express');
const controller = require('../controller/indexController');
const userController = require('../controller/userController');
const indexRouter = Router();

//page renders
indexRouter.get('/login',controller.loginPage);
indexRouter.get('/register',controller.registerPage);
indexRouter.get('/',controller.mainPage);
//indexRouter.get('/comments/:id')

//post patch delete

indexRouter.post('/login',controller.login);
indexRouter.post('/register',controller.register);

indexRouter.get('/jitter/:username/:jitterId',controller.jitterPage)
indexRouter.post('/jitter/commentData',controller.getCommentData)
indexRouter.post('/comments/getId',controller.getCommentID)
module.exports = indexRouter;