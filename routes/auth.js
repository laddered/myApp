module.exports = function(app, jwt, configWT){
    var express = require('express');
    var authRouter = express.Router();
    var authCtrl = require('../controllers/auth')(app, jwt, configWT);
    authRouter.post('/reg', authCtrl.createUser);
    authRouter.post('/signIn', authCtrl.signIn);
    return authRouter;
}