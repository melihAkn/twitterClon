const {Router} = require('express');
const controller = require('../controller/indexController');
const userController = require('../controller/userController');
const indexRouter = Router();

//pages
indexRouter.get('/login',controller.loginPage);
indexRouter.get('/register',controller.registerPage);
indexRouter.get('/',controller.mainPage);
//functions



indexRouter.post('/login',controller.login);
indexRouter.post('/register',controller.register);

module.exports = indexRouter;