function tokenCheck(req, res, next) {
    if ( req.method === "GET"){
        var token = req.query.token;
    }
    else {
        var token = req.body.token;
    }
    var jwt = require('jsonwebtoken');
    var configWT = require('././/configWebTokensJSON');

    jwt.verify(token, configWT.secret, function (err, decoded) {
        if (err) {return res.status(500).send()}
        else {
            req.decodedWT = decoded;
            next()
        }
    });

}

module.exports = tokenCheck