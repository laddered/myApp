var userCtrl = function() {
    function loadUser(req, res) {
        return res.send('Go to users page');
    }
    function editUser(req, res) {
        return res.send('Editing a user account');
    }
    function deleteLogIn(req, res) {
        return res.send('Deleting a user account');
    }
    return {
        loadUser: loadUser,
        editUser: editUser,
        deleteLogIn: deleteLogIn
    }
};
 module.exports = userCtrl;