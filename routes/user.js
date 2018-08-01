module.exports = function(app){
    var express = require('express');
    var userRouter = express.Router();

    var userCtrl = require('../controllers/user')(app);
    userRouter.get('/', userCtrl.loadUser);
    userRouter.post('/', userCtrl.editUser);
    // userRouter.delete('/', userCtrl.deleteUser);
    return userRouter;
}