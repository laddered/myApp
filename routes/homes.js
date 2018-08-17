module.exports = function(app){
    var express = require('express');
    var homesRouter = express.Router();
    var tokenCheck = require('./../tokenFunc');

    var homesCtrl = require('../controllers/homes')(app);

    homesRouter.get('/', homesCtrl.loadHomes);

    homesRouter.post('/createHome', tokenCheck, homesCtrl.createHome);
    homesRouter.get('/getHomesArr', tokenCheck, homesCtrl.getHomesArr);
    homesRouter.put('/saveHome', tokenCheck, homesCtrl.saveHome);
    homesRouter.delete('/deleteHome', tokenCheck, homesCtrl.deleteHome);


    homesRouter.post('/createRoom', tokenCheck, homesCtrl.createRoom);
    homesRouter.get('/getRoomsArr', tokenCheck, homesCtrl.getRoomsArr);
    homesRouter.put('/saveRoom', tokenCheck, homesCtrl.saveRoom);
    homesRouter.delete('/deleteRoom', tokenCheck, homesCtrl.deleteRoom);

    return homesRouter;
};