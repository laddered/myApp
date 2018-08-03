
var config = {
    homes: {
        preStartFn: () => { loadFile('navBar.html', '#adding', false); },
        file: 'homeForm.html',
        where: '#underNavBar',
        async: false,
        startFn: () => { homeStart() },
        failFn: () => { returnToAuthz() }
    },
    edit: {
        preStartFn: () => { loadFile('navBar.html', '#adding', false); },
        file: 'editForm.html',
        where: '#underNavBar',
        async: false,
        startFn: () => { getUserInfoFromLocalStorage(['login', 'email', 'userName', 'age']) },
        failFn: () => { returnToAuthz() }
    },
};

homeStart = () => {
    VT.getEl('#navBarEdit').disabled = false;
    VT.getEl('#navBarHome').disabled = true;
    presettingHomeMenu();
    populateDropdawnMenu();
};

returnToAuthz = () => {
    alert('You are not authorized!');
    loadFile('authorizationForm.html', '#adding', true);
};

bootWithConfig = (configSet, authorized) => {
    if (authorized) {
        configSet.preStartFn();
        loadFile(configSet.file, configSet.where, configSet.async);
        configSet.startFn();
    }
    else {
        configSet.failFn()
    }
};

navigationFunc = (receivedHash, authorized) => {
    switch (receivedHash) {
        case '#authz':
            loadFile('authorizationForm.html', '#adding', true);
            break;
        case '#reg':
            loadFile('registrationForm.html', '#adding', true);
            break;
        case '#edit':
            bootWithConfig(config.edit, authorized);
            break;
        case '#homes':
            bootWithConfig(config.homes, authorized);
            break;
        default:
            if (authorized) {
                loadFile('navBar.html', '#adding', false);
                loadFile('editForm.html', '#underNavBar', false);
                getUserInfoFromLocalStorage(['login', 'email', 'userName', 'age']);
            }
            else {
                loadFile('authorizationForm.html', '#adding', true);
            }
            break;
    }
};

authzCheck = () => {
    return VT.isDefined(JSON.parse(localStorage.getItem("loginAut")))
};

function authzCheckNew() {
    if (VT.isDefined(localStorage.getItem('token'))) {
        userStart()
    }
}

function signInBtn() {
    let userAuth = {};
    getUserInfoFromForm(userAuth, ['login', 'password'], 'Aut');
    VT.send('POST', '/auth/signIn', userAuth, function (status, data) {
        switch (status) {
            case 404:
                addBadForThis(['#form_loginAut'], ['#form_loginErrorAut']);
                break;
            case 400:
                addBadForThis(['#form_passwordAut'], ['#form_passwordErrorAut']);
                break;
            default:
                alert(this.status + ' server could not find or process data');
                return;
        }
    }, function (data) {
        remBadForThis(['#form_passwordAut'], ['#form_passwordErrorAut']);
        localStorage.setItem('token', JSON.stringify(data.token));
        alert('User ' + data.login + ' is logged in!');
        userStart();
    }, true);
};

// function signInBtn() {
//     let userAuth = {};
//     getUserInfoFromForm(userAuth, ['login', 'password'], 'Aut');
//     signInRequest = new XMLHttpRequest();
//     signInRequest.open('POST', '/auth/signIn', true);
//     signInRequest.setRequestHeader('content-type', 'application/JSON;crarset=UTF-8');
//     signInRequest.send(JSON.stringify(userAuth));
//     signInRequest.onreadystatechange = function () {
//         if (signInRequest.readyState === 4) {
//             switch (signInRequest.status) {
//                 case 200:
//                     remBadForThis(['#form_passwordAut'], ['#form_passwordErrorAut']);
//                     let res = JSON.parse(signInRequest.response);
//                     localStorage.setItem('token', JSON.stringify(res.token));
//                     alert('User ' + res.login + ' is logged in!');
//                     userStart();
//                     break;
//                 case 404:
//                     addBadForThis(['#form_loginAut'], ['#form_loginErrorAut']);
//                     break;
//                 case 400:
//                     addBadForThis(['#form_passwordAut'], ['#form_passwordErrorAut']);
//                     break;
//                 default:
//                     alert(signInRequest.status + ' server could not find or process data');
//                     return;
//             }
//         }
//     }
// };

function userStart() {
    if (VT.isDefined(localStorage.getItem('token'))) {
        let token = JSON.parse(localStorage.getItem('token'));

        requestWithPromise('GET', '/user', { token: token })
            .then(function (resData) {
                return loadWithPromise('navBar.html', '#adding', resData);
            })
            .then(function (obj) {
                cleanEl(obj.where);
                VT.getEl(obj.where).innerHTML = obj.htmlCode;
                VT.getEl('#userNameNB').firstChild.data = obj.resData.login;
                return loadWithPromise('editForm.html', '#underNavBar', obj.resData);
            })
            .then(function (obj) {
                cleanEl(obj.where);
                VT.getEl(obj.where).innerHTML = obj.htmlCode;
                getUserInfoFromResponse(obj.resData)
            })
    }
    else {
        console.log('Token is not found! Perhaps it was deleted. Log in again!')
    }
}

function requestWithPromise(method, url, param) {
    return new Promise(function (resolve, reject) {
        VT.send(method, url, param, function () {
            reject(new Error("Network Error"));
        }, function (resData) {
            resolve(resData);
        }, true)
    });
}

function loadWithPromise(file, where, resData) {
    return new Promise(function (resolve, reject) {
        VT.send("GET", file, {}, function () {
            reject(new Error("Network Error"));
        }, function (htmlCode) {
            resolve({ htmlCode: htmlCode, where: where, resData: resData });
        }, true)
    });
}

function signUpBtn() {
    let userObj = {};
    getUserInfoFromForm(userObj, ['login', 'email', 'userName', 'age', 'password']);
    userObj.gender = getRadioValue('radioGender');
    VT.send('POST', '/auth/reg', userObj, function (status, data) {
        if (status === 409) {
            addBadForThis(['#form_login'], ['#form_loginErrorReg']);
            return;
        }
        else {
            alert(status + ' server could not find or process data');
            return;
        }
    }, function (data) {
        localStorage.setItem('token', JSON.stringify(data.token));
        alert('User ' + data.login + ' has been registered!');
        userStart();
    }, true)
}

// function signUpBtn() {
//     let userObj = {};
//     getUserInfoFromForm(userObj, ['login', 'email', 'userName', 'age', 'password']);
//     userObj.gender = getRadioValue('radioGender');
//     var regRequest = new XMLHttpRequest();
//     regRequest.open('POST', '/auth/reg', true);
//     regRequest.setRequestHeader('Content-Type', 'application/JSON;crarset=UTF-8');
//     regRequest.send(JSON.stringify(userObj));
//     regRequest.onreadystatechange = function () {
//         if (regRequest.readyState === 4) {
//             if (regRequest.status === 200) {
//                 let res = JSON.parse(regRequest.response);
//                 localStorage.setItem('token', JSON.stringify(res.token));
//                 alert('User ' + res.login + ' has been registered!');
//                 userStart();
//             }
//             else {
//                 if (regRequest.status === 409) {
//                     addBadForThis(['#form_login'], ['#form_loginErrorReg']);
//                     return;
//                 }
//                 else {
//                     alert(regRequest.status + ' server could not find or process data');
//                     return;
//                 }
//             }
//         }
//     }
// };

editProfilePasswordBtn = () => {
    let usersArray = extractFromLS("users");
    let number = inWhichUser();
    if (VT.getValue('#form_OldPasswordEdit').hashCode() === usersArray[number].password) {
        VT.removeClass('#form_OldPasswordEdit', 'badS');
        usersArray[number].password = VT.getValue('#form_NewPasswordEdit').hashCode();
        localStorage.setItem("users", JSON.stringify(usersArray));
    }
    else {
        VT.addClass('#form_OldPasswordEdit', 'badS')
    }
};

editProfileBtn = () => {
    let userObj = {};
    getUserInfoFromForm(userObj, ['login', 'email', 'userName', 'age'], 'Edit');
    userObj.gender = getRadioValue('radioGender');
    userObj.token = JSON.parse(localStorage.getItem('token'));
    VT.send('POST', '/user/edit', userObj, function (status, data) {
        if (status === 409) {
            console.log("This login is already registered!");
            return addBadForThis(['#form_loginEdit'], ['#form_loginErrorEdit']);
        }
        else {
            return alert(status + ' server could not find or process data');
        }
    }, function (data) {
        remBadForThis(['#form_loginEdit'], ['#form_loginErrorEdit']);
        alert('User data ' + data.login + ' have been edited!');
        VT.getEl('#userNameNB').firstChild.data = data.login;
        return getUserInfoFromResponse();
    }, true)
};

// editProfileBtn = () => {
//     let usersArray = extractFromLS("users");
//     let interimObj = {};
//     let number = inWhichUser();
//     getUserInfoFromForm(interimObj, ['login', 'email', 'userName', 'age'], 'Edit');
//     interimObj.gender = getRadioValue('radioGender');
//     for (let i = 0; i < usersArray.length; i++) {
//         if (VT.getValue('#form_loginEdit') === usersArray[i].login) {
//             addBadForThis(['#form_loginEdit'], ['#form_loginErrorEdit']);
//             return;
//         }
//     }
//     remBadForThis(['#form_loginEdit'], ['#form_loginErrorEdit']);
//     interimObj.password = usersArray[number].password;
//     usersArray[number] = interimObj;
//     let usersString = JSON.stringify(usersArray);
//     localStorage.setItem("loginAut", JSON.stringify(VT.getValue('#form_loginEdit')));
//     localStorage.setItem("users", usersString);
// };

logOut = () => {
    cleanEl('#adding');
    localStorage.removeItem('token');
    loadFile('authorizationForm.html', '#adding', true);
};

extractFromLS = (item) => {
    return JSON.parse(localStorage.getItem(item))
};

getUserInfoFromForm = (interimObj, fields, idPart) => {
    idPart = idPart || '';
    for (let i = 0; i < fields.length; i++) {
        interimObj[fields[i]] = VT.getValue('#form_' + fields[i] + idPart);
    }
};

getUserInfoFromResponse = (fields) => {
    for (let i in fields) {
        if (VT.isDefined(VT.getEl('#form_' + i + 'Edit'))) {
            VT.setValue('#form_' + i + 'Edit', fields[i])
            if (fields.gender === 'Female') {
                VT.getEl('#radioFemale').checked = true;
            }
        }
    }
};

inWhichUser = () => {
    let user = JSON.parse(localStorage.getItem("loginAut"));
    let usersArray = JSON.parse(localStorage.getItem("users"));
    for (let i = 0; i < usersArray.length; i++) {
        if (user === usersArray[i].login) {
            return i;
        }
    }
};