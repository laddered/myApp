var express = require('express');
var app = express();

require('./config/express')(app);

var url = require("url"),
port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('App listening on port ' + port + '!');
});

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