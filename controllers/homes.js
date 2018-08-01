var homesCtrl = function() {
    function loadHomes(req, res) {
        return res.send('Go to homes page');
    }
    function createHome(req, res) {
        return res.send('Create a house');
    }
    function deleteHome(req, res) {
        return res.send('Delete house');
    }
    return {
        loadHomes: loadHomes,
        createHome: createHome,
        deleteHome: deleteHome,
    }
};
 module.exports = homesCtrl;