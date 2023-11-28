const {Router} = require('express');
const controller = require('../controller/indexController');
const indexRouter = Router();

indexRouter.get('/login',controller.loginPage)
indexRouter.get('/register',controller.registerPage)

indexRouter.post('/register',controller.register)
module.exports = indexRouter;