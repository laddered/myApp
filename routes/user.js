module.exports = function(app){
    var express = require('express');
    var userRouter = express.Router();
    var tokenCheck = require('./../tokenFunc');

    var userCtrl = require('../controllers/user')(app);
    userRouter.get('/', tokenCheck, userCtrl.loadUser);
    userRouter.put('/', tokenCheck, userCtrl.editUser);
    userRouter.put('/editpassword', tokenCheck, userCtrl.editUserPassword);
    userRouter.delete('/', tokenCheck, userCtrl.deleteUser);
    return userRouter;
}