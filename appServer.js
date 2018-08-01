var express = require('express');
var app = express();

require('./config/express')(app);

var url = require("url"),
port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('App listening on port ' + port + '!');
});