function tokenCheck(req, res, next) {
    var token = req.query.token;
    var jwt = require('jsonwebtoken');
    var configWT = require('././/configWebTokensJSON');

    jwt.verify(token, configWT.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    });
    next()
}

module.exports = tokenCheck