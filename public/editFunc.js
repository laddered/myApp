
presettingHomeMenu = ()=>{
    VT.getEl('#saveBtn').disabled = true;
    arrHomes = getHomesNameAnd_id();
    oldHomeName = arrHomes[arrHomes.length - 1].homeName;
    searchHome_id = arrHomes[arrHomes.length - 1]._id;
    VT.getEl('#homeDropdownBtn').firstChild.data = arrHomes[arrHomes.length - 1].homeName;
    VT.setValue('#form_homeEdit', arrHomes[arrHomes.length - 1].homeName);
    presettingRoomMenu()
};

presettingRoomMenu = ()=>{
    VT.getEl('#saveBtnRoom').disabled = true;
    arrRooms = getHomesRooms();
    oldRoomName = arrRooms[arrRooms.length - 1].roomName;
    searchRoomId = arrRooms[arrRooms.length - 1].id;
    VT.getEl('#roomDropdownBtn').firstChild.data = arrRooms[arrRooms.length - 1].roomName;
    VT.setValue('#form_roomEdit', arrRooms[arrRooms.length - 1].roomName);
};

getHomesNameAnd_id = ()=>{
    let resultArr = [];
    let resultObj = {};
    for (let i = 0; i < home.length; i++) {
        resultObj._id = home[i]._id;
        resultObj.homeName = home[i].homeName;
        resultArr.push(resultObj);
        resultObj = {};
    }
    return resultArr;
};

getHomesRooms = ()=>{
    let resultArr = [];
    for ( let i = 0; i < home.length; i++) {
        if ( home[i]._id === searchHome_id ) {
            resultArr = home[i].rooms;
            return resultArr;
        }
    }
};

mainNavBarBtn = ()=>{
    if ( VT.getEl('#navBarEdit').disabled === true ) {
        VT.getEl('#navBarEdit').disabled = false;
        VT.getEl('#navBarHome').disabled = true;
        loadFile('homeForm.html','#underNavBar', false);
        presettingHomeMenu();
        populateDropdawnMenu();
        populateDropdawnMenuRoom();
    }
    else {
        VT.getEl('#navBarEdit').disabled = true;
        VT.getEl('#navBarHome').disabled = false;
        loadFile('editForm.html', '#underNavBar', false);
        getUserInfoFromLocalStorage(['login', 'email', 'userName', 'age']);
    }
};

populateDropdawnMenu = ()=>{
    for ( let i = 0; i < arrHomes.length; i++ ) {
        VT.addEl('#forItems', `<div><a onclick="clickOnItem(\'${arrHomes[i].homeName}\', \'${arrHomes[i]._id}\')"  aria-labelledby='${arrHomes[i]._id}' href="#">${arrHomes[i].homeName}</a></div>`, true);
    }
};

clickOnItem = (name, id)=>{
    searchHome_id = id;
    oldHomeName = name;
    VT.getEl('#homeDropdownBtn').firstChild.data = name;
    VT.setValue('#form_homeEdit', name);
    presettingRoomMenu();
    cleanEl('#forItemsRoom');
    populateDropdawnMenuRoom();
};

populateDropdawnMenuRoom = ()=>{
    for ( let i = 0; i < arrRooms.length; i++ ) {
        VT.addEl('#forItemsRoom', `<div><a onclick="clickOnItemRoom(\'${arrRooms[i].roomName}\', \'${arrRooms[i].id}\')"  aria-labelledby='${arrRooms[i].id}' href="#">${arrRooms[i].roomName}</a></div>`, true);
    }
};

clickOnItemRoom = (name, id)=>{
    searchRoomId = id;
    oldRoomName = name;
    VT.getEl('#roomDropdownBtn').firstChild.data = name;
    VT.setValue('#form_roomEdit', name);
};

saveNewName = ()=>{
    for ( let i = 0; i < arrHomes.length; i++ ) {
        if ( searchHome_id === arrHomes[i]._id ) {
            home[i].homeName = VT.getValue('#form_homeEdit');
            VT.getEl('#homeDropdownBtn').firstChild.data = VT.getValue('#form_homeEdit');
            cleanEl('#forItems');
            cleanEl('#forItemsRoom');
            arrHomes = getHomesNameAnd_id();
            arrRooms = getHomesRooms();
            populateDropdawnMenu();
            populateDropdawnMenuRoom();
            oldHomeName = arrHomes[i].homeName;
            VT.getEl('#saveBtn').disabled = true;
        }
    }
};

saveNewNameRoom = ()=>{
    for ( let i = 0; i < home.length; i++ ) {
        if ( searchHome_id === arrHomes[i]._id ) {
            for ( let j = 0; j < home[i].rooms.length; j++ ) {
                if ( searchRoomId === home[i].rooms[j].id) {
                    home[i].rooms[j].roomName = VT.getValue('#form_roomEdit');
                    VT.getEl('#roomDropdownBtn').firstChild.data = arrRooms[j].roomName;
                    arrRooms = getHomesRooms();
                    oldRoomName = arrRooms[j].roomName;
                    VT.getEl('#saveBtnRoom').disabled = true;
                    cleanEl('#forItemsRoom');
                    populateDropdawnMenuRoom();
                }
            }
        }
    }
};

let arrHomes;
let arrRooms;
let searchHome_id;
let searchRoomId;
let oldHomeName;
let oldRoomName;



// populateDropdawnMenuAny = (arr, name, id, where, forClickBtn, forClickInput, otherFn)=>{
//     for ( let i = 0; i < arr.length; i++ ) {
//         VT.addEl(where, `<div><a onclick="clickOnItemR(\'${arr[i][name]}\', \'${arr[i][id]}\', \'${forClickBtn}\', \'${forClickInput}\' ,\'${otherFn}\')"  aria-labelledby='${arr[i][id]}' href="#">${arr[i][name]}</a></div>`, true);
//     }
// };
//
// clickOnItemR = (name, id, buttonChange, inputChange , otherFn)=>{
//     searchHome_id = id;
//     oldHomeName = name;
//     VT.getEl(buttonChange).firstChild.data = name;
//     VT.setValue(inputChange, name);
//     if ( VT.isDefined(otherFn) ) {
//         otherFn;
//     }
// };