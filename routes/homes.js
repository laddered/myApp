module.exports = function(app){
    var express = require('express');
    var homesRouter = express.Router();

    var homesCtrl = require('../controllers/homes')(app);
    homesRouter.get('/', homesCtrl.loadHomes);
    homesRouter.post('/', homesCtrl.createHome);
    // homesRouter.delete('/logIn', homesCtrl.deleteHome);
    return homesRouter;
}