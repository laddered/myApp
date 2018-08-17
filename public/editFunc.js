mainNavBarBtn = () => {
    token = JSON.parse(localStorage.getItem('token'));

    if (VT.getEl('#navBarEdit').disabled === true) {
        VT.getEl('#navBarEdit').disabled = false;
        VT.getEl('#navBarHome').disabled = true;

        loadWithPromise('homeForm.html', '#underNavBar', {token:token})
            .then(function (obj) {
                cleanEl(obj.where);
                VT.getEl(obj.where).innerHTML = obj.htmlCode;
                return requestWithPromise('GET', '/homes/getHomesArr', {token: token})
            })
            .then(function (resData) {
                presettingHomeMenu(resData);
                populateDropdawnMenu();
                return requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
            })
            .then(function (resDataRoom) {
                presettingRoomMenu(resDataRoom);
                populateDropdawnMenuRoom();
            });
    }
    else {
        VT.getEl('#navBarEdit').disabled = true;
        VT.getEl('#navBarHome').disabled = false;

        requestWithPromise('GET', '/user', { token: token })
            .then(function (resData) {
                return loadWithPromise('editForm.html', '#underNavBar', resData);
            })
            .then(function(obj){
                cleanEl(obj.where);
                VT.getEl(obj.where).innerHTML = obj.htmlCode;
                getUserInfoFromResponse(obj.resData);
            })
    }
};

presettingHomeMenu = (resData) => {
        VT.getEl('#saveBtn').disabled = true;

    if (resData && resData.length >= 1) {

        VT.getEl('#roomDropdownBtn').disabled = false;
        VT.getEl('#createRoomBtn').disabled = false;
        VT.getEl('#deleteRoomBtn').disabled = false;

        VT.getEl('#form_homeEdit').disabled = false;
        arrHomes = resData;
        oldHomeName = arrHomes[arrHomes.length - 1].homeName;
        searchHome_id = arrHomes[arrHomes.length - 1]._id;
        VT.getEl('#homeDropdownBtn').firstChild.data = arrHomes[arrHomes.length - 1].homeName;
        VT.setValue('#form_homeEdit', arrHomes[arrHomes.length - 1].homeName);
    }
    else {

        VT.getEl('#roomDropdownBtn').disabled = true;
        VT.getEl('#createRoomBtn').disabled = true;
        VT.getEl('#deleteRoomBtn').disabled = true;

        arrHomes = [];
        searchHome_id = undefined;
        VT.getEl('#homeDropdownBtn').firstChild.data = 'No homes available';
        VT.setValue('#form_homeEdit', '');
        VT.getEl('#form_homeEdit').disabled = true;
    }
};

presettingRoomMenu = (resDataRoom) => {
        VT.getEl('#saveBtnRoom').disabled = true;

    if (resDataRoom && resDataRoom.length >= 1) {
        VT.getEl('#form_roomEdit').disabled = false;
        arrRooms = resDataRoom;
        oldRoomName = arrRooms[arrRooms.length - 1].roomName;
        searchRoomId = arrRooms[arrRooms.length - 1]._id;
        VT.getEl('#roomDropdownBtn').firstChild.data = arrRooms[arrRooms.length - 1].roomName;
        VT.setValue('#form_roomEdit', arrRooms[arrRooms.length - 1].roomName);
    }
    else {
        arrRooms = [];
        searchRoomId = undefined;
        VT.getEl('#roomDropdownBtn').firstChild.data = 'No rooms available';
        VT.setValue('#form_roomEdit', '');
        VT.getEl('#form_roomEdit').disabled = true;
    }
};

populateDropdawnMenu = () => {
    if (arrHomes && arrHomes.length >= 1) {
        for (let i = 0; i < arrHomes.length; i++) {
            VT.addEl('#forItems', `<div class="dropdawnItems" onclick="clickOnItem(\'${arrHomes[i].homeName}\', \'${arrHomes[i]._id}\')" id='${arrHomes[i]._id}'>${arrHomes[i].homeName}</div>`, true);
        }
    }
};

populateDropdawnMenuRoom = () => {
    console.log(arrRooms);
    if (arrRooms && arrRooms.length >= 1) {
        for (let i = 0; i < arrRooms.length; i++) {
            VT.addEl('#forItemsRoom', `<div class="dropdawnItems" onclick="clickOnItemRoom(\'${arrRooms[i].roomName}\', \'${arrRooms[i]._id}\')"  id='${arrRooms[i]._id}'>${arrRooms[i].roomName}</div>`, true);
        }
    }
};

clickOnItem = (name, id) => {
    cleanEl('#forItemsRoom');
    searchHome_id = id;
    oldHomeName = name;
    VT.getEl('#homeDropdownBtn').firstChild.data = name;
    VT.setValue('#form_homeEdit', name);
    requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
        .then(function (resData) {
            presettingRoomMenu(resData);
            populateDropdawnMenuRoom();
        });
};

clickOnItemRoom = (name, id) => {
    searchRoomId = id;
    oldRoomName = name;
    VT.getEl('#roomDropdownBtn').firstChild.data = name;
    VT.setValue('#form_roomEdit', name);
    VT.getEl('#saveBtnRoom').disabled = true;
};

saveNewName = () => {
    let newName = VT.getValue('#form_homeEdit');
    requestWithPromise('PUT', '/homes/saveHome',{token:token, newName:newName, homeId:searchHome_id})
        .then(function () {
            return requestWithPromise('GET', '/homes/getHomesArr', {token: token})
        })
        .then(function (resData) {
            cleanEl('#forItems');
            VT.getEl('#saveBtn').disabled = true;
            oldHomeName = newName;
            arrHomes = resData;
            VT.getEl('#homeDropdownBtn').firstChild.data = newName;
            populateDropdawnMenu();
            console.log('Home save!');
        });
};

saveNewNameRoom = () => {
    let newName = VT.getValue('#form_roomEdit');
    requestWithPromise('PUT', '/homes/saveRoom',{token:token, newName:newName, roomId:searchRoomId})
        .then(function () {
            return requestWithPromise('GET', '/homes/getRoomsArr', {token: token, homeId:searchHome_id})
        })
        .then(function (resData) {
            cleanEl('#forItemsRoom');
            VT.getEl('#saveBtnRoom').disabled = true;
            oldRoomName = newName;
            arrRooms = resData;
            VT.getEl('#roomDropdownBtn').firstChild.data = newName;
            populateDropdawnMenuRoom();
            console.log('Room save!');
        })
};

createHomeBtn=()=>{
    let userObj = {};
    userObj.token = JSON.parse(localStorage.getItem('token'));
    VT.send("POST", '/homes/createHome', userObj, (status, data)=>{
        if (status === 400) return console.log('Something wrong!')
    }, (data)=>{

        requestWithPromise('GET', '/homes/getHomesArr', {token:token})
            .then(function (resData) {
                console.log('Home create!');
                cleanEl('#forItems');
                presettingHomeMenu(resData);
                populateDropdawnMenu();
            })
    }, true)
};

createRoomBtn=()=>{
    let userObj = {};
    userObj.token = JSON.parse(localStorage.getItem('token'));
    userObj.homeId = searchHome_id;
    VT.send("POST", '/homes/createRoom', userObj, (status, data)=>{
        if (status === 400) return console.log('Something wrong!')
    }, (data)=>{

        requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
            .then(function (resData) {
                console.log('Room create!');
                cleanEl('#forItemsRoom');
                presettingRoomMenu(resData);
                populateDropdawnMenuRoom();
            });
    }, true)
};

deleteHomeBtn=()=>{
    let userObj = {};
    userObj.token = token;
    userObj.homeId = searchHome_id;
    requestWithPromise('DELETE', '/homes/deleteHome', {token:token, homeId:searchHome_id})
        .then(()=>{
            return requestWithPromise('GET', '/homes/getHomesArr', {token:token});
        })
        .then((resData)=>{
            console.log('Home delete!');
            cleanEl('#forItems');
            presettingHomeMenu(resData);
            populateDropdawnMenu();
            return requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
        })
        .then((resDataRoom)=>{
            presettingRoomMenu(resDataRoom);
            populateDropdawnMenuRoom()
        });
};

deleteRoomBtn=()=>{
    let userObj = {};
    userObj.token = token;

};

let token;
let arrHomes;
let arrRooms;
let searchHome_id;
let searchRoomId;
let oldHomeName;
let oldRoomName;