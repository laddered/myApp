var homesCtrl = function() {

    let User = require('./../models/user');
    let Home = require('./../models/home');
    let Room = require('./../models/room');


    function loadHomes(req, res) {
        return res.send('Go to homes page');
    }
    function createHome(req, res) {
        let param = req.body;
        User.findById(req.decodedWT.id, function(err, user){
            if (err) return console.error(err);
            let newHome = Home({
                homeName: param.homeName,
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
        let param = req.body;
        Home.findById(param.homeId, function (err, home) {
            if (err) return console.error(err);
            let newRoom = Room({
                roomName: param.roomName,
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
        let param = req.query;
        if (param.homeId) {
            Home.findById(param.homeId, function (err, home) {
                if (err) return console.error(err);
                Room.find({homeId:home._id}, function (err, arrRoom) {
                    if (err) return console.error(err);
                    res.send(JSON.stringify(arrRoom));
                    console.log('Rooms send!')
                })
            })
        }
        else {
            res.send(JSON.stringify([]))
        }

    }

    function saveHome(req, res) {
        let param = req.body;

        User.findById(req.decodedWT.id, (err, user)=>{
            if (err) return console.error(err);
            Home.findOne({_id:param.homeId})

        });

        Home.findByIdAndUpdate(param.homeId, {
            $set:{homeName: param.newName}}, function (err, oldHome) {
            if (err) return res.status(400).send();
            console.log('Home save!');
            res.send();
        })
    }

    // function saveHome(req, res) {
    //     let param = req.body;
    //     let Home = require('./../models/home');
    //     Home.findByIdAndUpdate(param.homeId, {
    //         $set:{homeName: param.newName}}, function (err, oldHome) {
    //         if (err) return res.status(400).send();
    //         console.log('Home save!');
    //         res.send();
    //     })
    // }

    function saveRoom(req, res) {
        let param = req.body;
        Room.findByIdAndUpdate(param.roomId, {
            $set:{roomName: param.newName}}, function (err, oldRoom) {
            if (err) return res.status(400).send();
            console.log('Room save!');
            res.send();
        })
    }

    function deleteHome(req, res) {
        let param = req.body;
        Room.find({homeId: param.homeId}).remove().exec();
        Home.findByIdAndRemove(param.homeId, function (err, home) {
            if (err) return res.status(500).send();
            console.log('Home delete!');
            res.send();
        });
    }

    function deleteRoom(req, res) {
        let param = req.body;
        Room.findByIdAndRemove(param.roomId, function (err, room) {
            if (err) return res.status(500).send();
            console.log('Room delete!');
            res.send();
        });
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