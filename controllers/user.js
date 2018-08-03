var userCtrl = function (app, jwt) {
    function loadUser(req, res) {
        // var token = req.query.token;
        console.log(req.decodedWT.id)
        var User = require('./../models/user');
        User.findById(req.decodedWT.id, { password: 0 }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            res.send(JSON.stringify(user));
        })
        // return res.send(JSON.stringify('Success of token authentication!'));
    }
    function editUser(req, res) {
        var rB = req.body;
        var token = rB.token;
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
                    function (err, user) {
                        if (err) return res.status(500).send();
                        res.send(JSON.stringify(user));
                    });
            }
            else {
                res.status(409).send("This login is already registered!");
            }
        })
    }

    function deleteLogIn(req, res) {
        return res.send('Deleting a user account');
    }
    function editUserPassword(req, res) {
        return res.send('Edit password of user account');
    }
    return {
        loadUser: loadUser,
        editUser: editUser,
        deleteLogIn: deleteLogIn,
        editUserPassword: editUserPassword
    }
};
module.exports = userCtrl;