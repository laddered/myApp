module.exports = function(app){
    var express = require('express');
    var authRouter = express.Router();
    var authCtrl = require('../controllers/auth')(app);
    authRouter.post('/reg', authCtrl.createUser);
    authRouter.post('/signIn', authCtrl.signIn);
    return authRouter;
}