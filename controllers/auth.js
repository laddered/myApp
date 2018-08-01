module.exports = function (app) {

    function createUser(req, res) {
        let rB = req.body;
        var User = require('./../models/user');
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
                res.send();
            }
            else {
                console.log(res.status + 'Found a match!');
                res.status(409).send();
            }
        });
        // var Kitten = require('./../models/kitten');
        // var fluffy = new Kitten({ name: 'fluffy' });
        // fluffy.speak();

        // fluffy.save(function (err, fluffy) {
        //     if (err) return console.error(err);
        //     fluffy.speak();
        //     console.log(fluffy)
        // });
    }

    function signIn(req, res) {
        var rB = req.body;
        var User = require('./../models/user');
        User.findOne({ login: rB.login }, function (err, user) {
            if (err) return console.error(err);
            if (user !== null) {
                user.comparePassword(rB.password, function(err, isMatch){

                    // if (user.password === rB.password) {
                    if (isMatch) {
                        console.log('User authorized!');
                        res.send();
                    }
                    else {
                        console.log('Invalid user password!');
                        res.status(400).send();
                    }

                });
            }
            else {
                console.log('User is not found!');
                res.status(404).send();
            }
        });

        // var Kitten = require('./../models/kitten');
        // Kitten.find(function (err, kittens) {
        //     if (err) return console.error(err);
        //     console.log(kittens);
        //   })
    }

    return {
        createUser: createUser,
        signIn: signIn
    }
}

