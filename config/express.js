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

/*Для сервера mongoDB была написана служба 'mongodb.service'
которая лежит в /lib/systemd/system/mongodb.service
Содержание:

[Unit]
Description=MongoDB Database Service
Wants=network.target
After=network.target
[Service]
ExecStart=/usr/bin/mongod --config /etc/mongod.conf
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
User=mongodb
Group=mongodb
StandardOutput=syslog
StandardError=syslog
[Install]
WantedBy=multi-user.target

Включение сервера mongoDB: sudo systemctl start mongodb
Выключение сервера mongoDB: sudo systemctl stop mongodb
Включение сервера mongoDB при запуске: sudo systemctl enable mongodb.service*/