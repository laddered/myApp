var userCtrl = function (app, jwt) {
    function loadUser(req, res) {
        var User = require('./../models/user');
        User.findById(req.decodedWT.id, { password: 0 }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            res.send(JSON.stringify(user));
        })
    }

    function editUser(req, res) {
        var rB = req.body;
        var User = require('./../models/user');
        User.findOne({ login: rB.login }, function (err, searchUser) {
            if (searchUser === null) {
                User.findByIdAndUpdate(req.decodedWT.id, {
                    $set: {
                        login: rB.login,
                        email: rB.email,
                        userName: rB.userName,
                        age: rB.age,
                        gender: rB.gender
                    }
                },
                    function (err, oldUser) {
                        if (err) return res.status(500).send();
                        User.findOne({ login: rB.login }, { password: 0 }, function (err, updateUser) {
                            res.send(JSON.stringify([updateUser, oldUser.login]));
                        })
                    });
            }
            else {
                res.status(409).send("This login is already registered!");
            }
        })
    }

    function editUserPassword(req, res) {
        var rB = req.body;
        var User = require('./../models/user');

        bcrypt = require('bcrypt'),
            SALT_WORK_FACTOR = 10;

        User.findById(req.decodedWT.id, function (err, user) {
            if (err) return res.status(500).send()
            user.comparePassword(rB.oldPassword, function(err, isMatch){
                if(isMatch){

                    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                        if (err) return err;
                        bcrypt.hash(rB.newPassword, salt, function(err, hash) {
                            if (err) return err;
                            rB.newPassword = hash;

                            User.findByIdAndUpdate(req.decodedWT.id, {$set: {password: rB.newPassword}},
                                function (err, alsoUser) {
                                    res.send(user.login)
                                })

                        });
                    });

                }
                else{
                    res.status(400).send();
                }
            })
        });
        }

    function deleteLogIn(req, res) {
        return res.send('Deleting a user account');
    }

    return {
        loadUser: loadUser,
        editUser: editUser,
        editUserPassword: editUserPassword,
        deleteLogIn: deleteLogIn
    }
};
module.exports = userCtrl;