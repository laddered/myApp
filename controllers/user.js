let userCtrl = function (app, jwt) {

    let User = require('./../models/user');

    function loadUser(req, res) {
        if (req.decodedWT.id) {
            User.findById(req.decodedWT.id, { password: 0 }, function (err, user) {
                if (err) return res.status(401).send("There was a problem finding the user.");
                if (!user) return res.status(404).send("No user found.");
                res.send(JSON.stringify(user));
            })
        }
        else {res.status(401).send()}
    }

    function editUser(req, res) {
        let param = req.body;

        User.findById(req.decodedWT.id, function(err, thisUser){
            if (err) return res.status(500).send('Error on By Id');

            User.findOne({ login: param.login }, function (err, searchUser) {
                if (searchUser === null || thisUser.login) {
                    User.findByIdAndUpdate(req.decodedWT.id, {
                        $set: {
                            login: param.login,
                            email: param.email,
                            userName: param.userName,
                            age: param.age,
                            gender: param.gender
                        }
                    },
                        function (err, oldUser) {
                            if (err) return res.status(409).send();
                            User.findOne({ login: param.login }, { password: 0 }, function (err, updateUser) {
                                res.send(JSON.stringify([updateUser, oldUser.login]));
                            })
                        });
                }
                else {
                    res.status(409).send("This login is already registered!");
                }
            })
        })
    }

    function editUserPassword(req, res) {
        let param = req.body;

        bcrypt = require('bcrypt'),
            SALT_WORK_FACTOR = 10;

        User.findById(req.decodedWT.id, function (err, user) {
            if (err) return res.status(500).send()
            user.comparePassword(param.oldPassword, function(err, isMatch){
                if(isMatch){

                    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                        if (err) return err;
                        bcrypt.hash(param.newPassword, salt, function(err, hash) {
                            if (err) return err;
                            param.newPassword = hash;

                            User.findByIdAndUpdate(req.decodedWT.id, {$set: {password: param.newPassword}},
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

    function deleteUser(req, res) {
        let param = req.body;
        User.findById(req.decodedWT.id, function (err, user) {
            if (err) return res.status(500).send();
            user.comparePassword(param.password, function(err, isMatch){
                if(isMatch){
                    User.findByIdAndRemove(req.decodedWT.id, function(err, againUser){
                        res.send(user.login)
                    })
                }
                else{
                    res.status(400).send()
                }
            })
        })
    }

    return {
        loadUser: loadUser,
        editUser: editUser,
        editUserPassword: editUserPassword,
        deleteUser: deleteUser
    }
};
module.exports = userCtrl;