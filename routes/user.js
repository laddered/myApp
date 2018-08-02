module.exports = function(app){
    var express = require('express');
    var userRouter = express.Router();
    var tokenCheck = require('./../tokenFunc');

    var userCtrl = require('../controllers/user')(app);
    userRouter.get('/', tokenCheck, userCtrl.loadUser);
    userRouter.post('/edit', tokenCheck, userCtrl.editUser);
    userRouter.post('/editpassword', tokenCheck, userCtrl.editUserPassword);
    // userRouter.delete('/', userCtrl.deleteUser);
    return userRouter;
}