var userCtrl = function(app) {
    function loadUser(req, res) {
        var token = req.query.token;
        return res.send(JSON.stringify('Success of token authentication!'));
    }
    function editUser(req, res) {
        return res.send('Editing a user account');
    }
    function deleteLogIn(req, res) {
        return res.send('Deleting a user account');
    }
    function editUserPassword(req, res){
        return res.send('Edit password of user account');
    }
    return {
        loadUser: loadUser,
        editUser: editUser,
        deleteLogIn: deleteLogIn,
        editUserPassword:editUserPassword
    }
};
 module.exports = userCtrl;