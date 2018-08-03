function tokenCheck(req, res, next) {
    console.log(req.method);
    if ( req.method === "GET"){
        var token = req.query.token;
    }
    else {
        var token = req.body.token;
    }
    console.log(token);
    var jwt = require('jsonwebtoken');
    var configWT = require('././/configWebTokensJSON');

    jwt.verify(token, configWT.secret, function (err, decoded) {
        if (err) return res.status(500).send();
        req.decodedWT = decoded;
    });

    next()
}

module.exports = tokenCheck