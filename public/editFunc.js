mainNavBarBtn = ()=>{
    getToken();

    if (VT.getEl('#navBarEdit').disabled === true) {
        VT.getEl('#navBarEdit').disabled = false;
        VT.getEl('#navBarHome').disabled = true;

        requestWithPromise('GET', '/homes/getHomesArr', {token: token})
            .then( (resData)=>{
                return loadWithPromise('homeForm.html', '#underNavBar', resData)
            }, ()=>{
                invalidToken()
            })
            .then( (obj)=>{
                cleanEl(obj.where);
                VT.getEl(obj.where).innerHTML = obj.htmlCode;
                presettingHomeMenu(obj.resData);
                populateDropdawnMenu();
                return requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
            }, ()=>{})
            .then( (resData)=>{
                presettingRoomMenu(resData);
                populateDropdawnMenuRoom();
            }, (error)=>{
            });
    }
    else {
        VT.getEl('#navBarEdit').disabled = true;
        VT.getEl('#navBarHome').disabled = false;

        requestWithPromise('GET', '/user', { token: token })
            .then( (resData)=>{
                return loadWithPromise('editForm.html', '#underNavBar', resData);
            }, ()=>{
                invalidToken();
                return Promise.reject();
            })
            .then( (obj)=>{
                cleanEl(obj.where);
                VT.getEl(obj.where).innerHTML = obj.htmlCode;
                getUserInfoFromResponse(obj.resData);
            }, ()=>{})
    }
};

presettingHomeMenu = (resData)=>{
    VT.getEl('#saveBtn').disabled = true;

    if (resData && resData.length >= 1) {

        VT.getEl('#roomDropdownBtn').disabled = false;
        VT.getEl('#createRoomBtn').disabled = false;
        VT.getEl('#deleteRoomBtn').disabled = false;

        VT.getEl('#form_homeEdit').disabled = false;
        VT.getEl('#deleteHomeBtn').disabled = false;

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

        VT.getEl('#form_homeEdit').disabled = true;
        VT.getEl('#deleteHomeBtn').disabled = true;

        arrHomes = [];
        searchHome_id = undefined;
        VT.getEl('#homeDropdownBtn').firstChild.data = 'No homes available';
        VT.setValue('#form_homeEdit', '');
    }
};

presettingRoomMenu = (resDataRoom)=>{
    VT.getEl('#saveBtnRoom').disabled = true;

    if (resDataRoom && resDataRoom.length >= 1) {

        VT.getEl('#form_roomEdit').disabled = false;
        VT.getEl('#deleteRoomBtn').disabled = false;

        arrRooms = resDataRoom;
        oldRoomName = arrRooms[arrRooms.length - 1].roomName;
        searchRoomId = arrRooms[arrRooms.length - 1]._id;
        VT.getEl('#roomDropdownBtn').firstChild.data = arrRooms[arrRooms.length - 1].roomName;
        VT.setValue('#form_roomEdit', arrRooms[arrRooms.length - 1].roomName);
    }
    else {

        VT.getEl('#form_roomEdit').disabled = true;
        VT.getEl('#deleteRoomBtn').disabled = true;

        arrRooms = [];
        searchRoomId = undefined;
        VT.getEl('#roomDropdownBtn').firstChild.data = 'No rooms available';
        VT.setValue('#form_roomEdit', '');
    }
};

populateDropdawnMenu = ()=>{
    if (arrHomes && arrHomes.length >= 1) {
        for (let i = 0; i < arrHomes.length; i++) {
            VT.addEl('#forItems', `<div class="dropdawnItems" onclick="clickOnItem(\'${arrHomes[i].homeName}\', \'${arrHomes[i]._id}\')" id='${arrHomes[i]._id}'>${arrHomes[i].homeName}</div>`, true);
        }
    }
};

populateDropdawnMenuRoom = ()=>{
    if (arrRooms && arrRooms.length >= 1) {
        for (let i = 0; i < arrRooms.length; i++) {
            VT.addEl('#forItemsRoom', `<div class="dropdawnItems" onclick="clickOnItemRoom(\'${arrRooms[i].roomName}\', \'${arrRooms[i]._id}\')"  id='${arrRooms[i]._id}'>${arrRooms[i].roomName}</div>`, true);
        }
    }
};

clickOnItem = (name, id)=>{
    getToken();
    cleanEl('#forItemsRoom');
    searchHome_id = id;
    oldHomeName = name;
    VT.getEl('#homeDropdownBtn').firstChild.data = name;
    VT.setValue('#form_homeEdit', name);
    requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
        .then( (resData)=>{
            presettingRoomMenu(resData);
            populateDropdawnMenuRoom();
        }, ()=>{
            invalidToken();
            return Promise.reject();
        })
};

clickOnItemRoom = (name, id)=>{
    searchRoomId = id;
    oldRoomName = name;
    VT.getEl('#roomDropdownBtn').firstChild.data = name;
    VT.setValue('#form_roomEdit', name);
    VT.getEl('#saveBtnRoom').disabled = true;
};

saveNewNameHome = ()=>{
    let newName = VT.getValue('#form_homeEdit');
    let userObj = {};
    getToken();
    userObj.token = token;
    userObj.newName = newName;
    userObj.homeId = searchHome_id;

    requestWithPromise('PUT', '/homes/saveHome', userObj)
        .then( ()=>{
            return requestWithPromise('GET', '/homes/getHomesArr', {token: token})
        }, ()=>{
            invalidToken();
            return Promise.reject();
        })
        .then( (resData)=>{
            cleanEl('#forItems');
            VT.getEl('#saveBtn').disabled = true;
            oldHomeName = newName;
            arrHomes = resData;
            VT.getEl('#homeDropdownBtn').firstChild.data = newName;
            populateDropdawnMenu();
            console.log('Home save!');
        }, ()=>{});
};

// saveNewNameHome = ()=>{
//     let newName = VT.getValue('#form_homeEdit');
//     getToken();
//     let userObj = {};
//     userObj.token = token;
//     userObj.newName = newName;
//     userObj.homeId = searchHome_id;
//
//     console.log(token);
//
//     requestWithPromise('PUT', '/homes/saveHome', userObj)
//         .then( ()=>{
//             return requestWithPromise('GET', '/homes/getHomesArr', {token: token})
//         }, ()=>{
//             invalidToken();
//             return Promise.reject();
//         })
//         .then( (resData)=>{
//             cleanEl('#forItems');
//             VT.getEl('#saveBtn').disabled = true;
//             oldHomeName = newName;
//             arrHomes = resData;
//             VT.getEl('#homeDropdownBtn').firstChild.data = newName;
//             populateDropdawnMenu();
//             console.log('Home save!');
//         }, ()=>{});
// };

saveNewNameRoom = ()=>{
    getToken();
    let newName = VT.getValue('#form_roomEdit');
    requestWithPromise('PUT', '/homes/saveRoom',{token:token, newName:newName, roomId:searchRoomId})
        .then( ()=>{
            return requestWithPromise('GET', '/homes/getRoomsArr', {token: token, homeId:searchHome_id})
        }, ()=>{
            invalidToken();
            return Promise.reject();
        })
        .then( (resData)=>{
            cleanEl('#forItemsRoom');
            VT.getEl('#saveBtnRoom').disabled = true;
            oldRoomName = newName;
            arrRooms = resData;
            VT.getEl('#roomDropdownBtn').firstChild.data = newName;
            populateDropdawnMenuRoom();
            console.log('Room save!');
        }, ()=>{})
};

createHomeBtn = ()=>{
    getToken();
    let userObj = {};
    userObj.token = token;
    userObj.homeName = VT.getValue('#form_newHomeName');
    requestWithPromise("POST", '/homes/createHome', userObj)
        .then( ()=>{
            console.log('Home create!');
            VT.setValue("#form_newHomeName", "");
            removeModal('#modalCreateHome');
            return requestWithPromise('GET', '/homes/getHomesArr', {token:token})
        }, ()=>{
            invalidToken();
            return Promise.reject();
        })
            .then( (resData)=>{
                cleanEl('#forItems');
                presettingHomeMenu(resData);
                populateDropdawnMenu();
                return requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
            }, ()=>{
                return Promise.reject();
            })
            .then( (resData)=>{
                presettingRoomMenu(resData);
                populateDropdawnMenuRoom()
            }, ()=>{})
};

createRoomBtn = ()=>{
    getToken();
    let userObj = {};
    userObj.token = token;
    userObj.roomName = VT.getValue("#form_newRoomName");
    userObj.homeId = searchHome_id;
    requestWithPromise("POST", '/homes/createRoom', userObj)
        .then( ()=>{
            console.log('Room create!');
            VT.setValue("#form_newRoomName", "");
            removeModal('#modalCreateRoom');
            return requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
        }, ()=>{
            invalidToken();
            return Promise.reject();
        })
        .then( (resData)=>{
            cleanEl('#forItemsRoom');
            presettingRoomMenu(resData);
            populateDropdawnMenuRoom();
        }, ()=>{})
};

beforeDeleteHome = ()=>{
    VT.getEl("#forDeleteHome").innerHTML = oldHomeName;
    showModal('#modalDeleteHome');
};

beforeDeleteRoom = ()=>{
    VT.getEl("#forDeleteRoom").innerHTML = oldRoomName;
    showModal('#modalDeleteRoom');
};

deleteHomeBtn = ()=>{
    getToken();
    let userObj = {};
    userObj.token = token;
    userObj.homeId = searchHome_id;
    requestWithPromise('DELETE', '/homes/deleteHome', userObj)
        .then( ()=>{
            return requestWithPromise('GET', '/homes/getHomesArr', {token:token});
        }, ()=>{
            invalidToken();
            return Promise.reject();
        })
        .then( (resData)=>{
            console.log('Home delete!');
            removeModal('#modalDeleteHome');
            cleanEl('#forItems');
            presettingHomeMenu(resData);
            populateDropdawnMenu();
            return requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id})
        }, ()=>{
            return Promise.reject();
        })
        .then( (resData)=>{
            cleanEl('#forItemsRoom');
            presettingRoomMenu(resData);
            populateDropdawnMenuRoom()
        }, ()=>{})
};

deleteRoomBtn = ()=>{
    getToken();
    let userObj = {};
    userObj.token = token;
    userObj.roomId = searchRoomId;
    requestWithPromise('DELETE', '/homes/deleteRoom', userObj)
        .then( ()=>{
            console.log('Room delete!');
            removeModal('#modalDeleteRoom');
            return requestWithPromise('GET', '/homes/getRoomsArr', {token:token, homeId:searchHome_id});
        }, ()=>{
            invalidToken();
            return Promise.reject();
        })
        .then( (resData)=>{
            cleanEl('#forItemsRoom');
            presettingRoomMenu(resData);
            populateDropdawnMenuRoom()
        }, ()=>{
        })
};

let token;
let arrHomes;
let arrRooms;
let searchHome_id;
let searchRoomId;
let oldHomeName;
let oldRoomName;