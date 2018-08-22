module.exports = function (app, jwt, configWT) {

    var User = require('./../models/user');

    function createUser(req, res) {
        var param = req.body;
        User.findOne({ login: param.login }, function (err, user) {
            if (err) return console.error(err);
            if (user === null) {
                var newUser = User({
                    userName: param.userName,
                    login: param.login,
                    password: param.password,
                    email: param.email,
                    age: param.age,
                    gender: param.gender,
                });
                newUser.save(function (err) {
                    if (err) return console.error(err);
                    console.log('User created!');
                });
                var token = jwt.sign({id:newUser._id},configWT.secret,{
                    expiresIn: 86400
                });
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({login: param.login, auth: true, token: token}));
            }
            else {
                console.log(res.status + 'Found a match!');
                res.status(409).send();
            }
        });
    }

    function signIn(req, res) {
        var param = req.body;
        User.findOne({ login: param.login }, function (err, user) {
            if (err) return console.error(err);
            if (user !== null) {
                user.comparePassword(param.password, function(err, isMatch){
                    if (isMatch) {
                        //User authorized
                        var token = jwt.sign({id:user._id},configWT.secret,{
                            expiresIn: 86400
                        });
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({login: param.login, auth: true, token: token}));
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
};