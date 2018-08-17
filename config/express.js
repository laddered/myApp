module.exports = function (app) {
    var express = require('express');
    app.use(express.static('public'))

    var jwt = require('jsonwebtoken');
    var configWT = require('./../configWebTokensJSON')

    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    var mongoose = require('mongoose');
    var mongoDB = 'mongodb://localhost:27017/myappdatabase';
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    require('./router')(app, jwt, configWT);
};