module.exports = function (app, jwt, configWT) {

    function createUser(req, res) {
        var rB = req.body;
        var User = require('./../models/user')
        User.findOne({ login: rB.login }, function (err, user) {
            if (err) return console.error(err);
            if (user === null) {
                var newUser = User({
                    userName: rB.userName,
                    login: rB.login,
                    password: rB.password,
                    email: rB.email,
                    age: rB.age,
                    gender: rB.gender,
                });
                newUser.save(function (err) {
                    if (err) return console.error(err);
                    console.log('User created!');
                });
                var token = jwt.sign({id:newUser._id},configWT.secret,{
                    expiresIn: 86400
                });
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({login: rB.login, auth: true, token: token}));
            }
            else {
                console.log(res.status + 'Found a match!');
                res.status(409).send();
            }
        });
    }

    function signIn(req, res) {
        var rB = req.body;
        var User = require('./../models/user');
        User.findOne({ login: rB.login }, function (err, user) {
            if (err) return console.error(err);
            if (user !== null) {
                user.comparePassword(rB.password, function(err, isMatch){
                    if (isMatch) {
                        //User authorized
                        var token = jwt.sign({id:user._id},configWT.secret,{
                            expiresIn: 86400
                        });
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({login: rB.login, auth: true, token: token}));
                    }
                    else {
                        //Invalid user password
                        res.status(400).send();
                    }
                });
            }
            else {
                console.log('User is not found!');
                res.status(404).send();
            }
        });
    }

    return {
        createUser: createUser,
        signIn: signIn
    }
}