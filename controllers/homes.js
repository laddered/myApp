var homesCtrl = function() {
    function loadHomes(req, res) {
        return res.send('Go to homes page');
    }
    function createHome(req, res) {
        let rB = req.body;
        let User = require('./../models/user');
        let Home = require('./../models/home');

        User.findById(req.decodedWT.id, function(err, user){
            if (err) return console.error(err);
            let newHome = Home({
                homeName: 'New home',
                userId: user.id
            });
            newHome.save(function(err){
                if (err) return console.error(err);
                console.log('Home created!');
                res.send();
            });
        })
    }

    function createRoom(req, res) {
        let rB = req.body;
        let Home = require('./../models/home');
        let Room = require('./../models/room');
        Home.findById(rB.homeId, function (err, home) {
            if (err) return console.error(err);
            let newRoom = Room({
                roomName: 'New room',
                homeId: home.id
            });
            newRoom.save(function (err) {
                if (err) return console.error(err);
                console.log('Room created!');
                res.send();
            })
        })
    }

    function getHomesArr(req, res) {
        let User = require('./../models/user');
        let Home = require('./../models/home');
        User.findById(req.decodedWT.id, function(err, user){
            if (err) return console.error(err);

            Home.find({userId:user.id}, function (err, arrHomes) {
                if (err) return console.error(err);
                res.send(JSON.stringify(arrHomes));
                console.log('Homes send!')
            })
        })
    }

    function getRoomsArr(req, res){
        let rB = req.query;
        console.log(rB);
        if (rB.homeId === undefined) {return res.send(JSON.stringify([]))}
        let Home = require('./../models/home');
        let Room = require('./../models/room');
        Home.findById(rB.homeId, function (err, home) {
            if (err) return console.error(err);

            Room.find({homeId:home._id}, function (err, arrRoom) {
                if (err) return console.error(err);
                res.send(JSON.stringify(arrRoom));
                console.log('Rooms send!')
            })
        })
    }

    function saveHome(req, res) {
        let rB = req.body;
        let Home = require('./../models/home');
        Home.findByIdAndUpdate(rB.homeId, {
            $set:{homeName: rB.newName}}, function (err, oldHome) {
            if (err) return res.status(400).send();
            console.log('Home save!');
            res.send();
        })
    }

    function saveRoom(req, res) {
        let rB = req.body;
        let Room = require('./../models/room');
        Room.findByIdAndUpdate(rB.roomId, {
            $set:{roomName: rB.newName}}, function (err, oldRoom) {
            if (err) return res.status(400).send();
            console.log('Room save!');
            res.send();
        })
    }

    function deleteHome(req, res) {
        let rB = req.body;
        let Home = require('./../models/home');
        let Room = require('./../models/room');
        Room.find({homeId: rB.homeId}).remove().exec();
        Home.findByIdAndRemove(rB.homeId, function (err, home) {
            if (err) return res.status(500).send();
            console.log('Home delete!');
            res.send();
        });
    }

    function deleteRoom(req, res) {
        let rB = req.body;
        let Room = require('./../models/room');

        return res.send('Room delete!');
    }
    return {
        loadHomes: loadHomes,
        getHomesArr: getHomesArr,
        createHome: createHome,
        saveHome: saveHome,
        deleteHome: deleteHome,

        getRoomsArr: getRoomsArr,
        createRoom: createRoom,
        saveRoom: saveRoom,
        deleteRoom: deleteRoom
    }
};
 module.exports = homesCtrl;