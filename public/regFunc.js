let config = {
    homes: {
        preStartFn: ()=>{ loadFile('navBar.html', '#adding', false); },
        file: 'homeForm.html',
        where: '#underNavBar',
        async: false,
        startFn: () => { homeStart() },
        failFn: () => { returnToAuthz() }
    },
    edit: {
        preStartFn: ()=>{ loadFile('navBar.html', '#adding', false); },
        file: 'editForm.html',
        where: '#underNavBar',
        async: false,
        startFn: () => { getUserInfoFromLocalStorage(['login', 'email', 'userName', 'age']) },
        failFn: () => { returnToAuthz() }
    },
};

homeStart = ()=>{
    VT.getEl('#navBarEdit').disabled = false;
    VT.getEl('#navBarHome').disabled = true;
    presettingHomeMenu();
    populateDropdawnMenu();
};

returnToAuthz = ()=>{
    alert('You are not authorized!');
    loadFile('authorizationForm.html', '#adding', true);
};

bootWithConfig = (configSet, authorized)=>{
    if (authorized) {
        configSet.preStartFn();
        loadFile(configSet.file, configSet.where, configSet.async);
        configSet.startFn();
    }
    else {
        configSet.failFn()
    }
};

navigationFunc = (receivedHash, authorized)=>{
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

// authzCheck = () => {
//     return VT.isDefined(JSON.parse(localStorage.getItem("loginAut")))
// };

authzCheckNew = ()=>{
    if (VT.isDefined(localStorage.getItem('token'))) {
        userStart()
    }
    else {
        loadFile('authorizationForm.html', '#adding', true);
    }
};

signInBtn = ()=>{
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

userStart = ()=>{
    if( IsJsonString(localStorage.getItem('token')) ){
        token = JSON.parse(localStorage.getItem('token'));
    }
    else {
        token = localStorage.getItem('token');
    }

    requestWithPromise('GET', '/user', { token: token })
        .then(function (resData) {
            return loadWithPromise('navBar.html', '#adding', resData);
        }, function () {
            invalidToken()
        })
        .then(function (obj) {
            cleanEl(obj.where);
            VT.getEl(obj.where).innerHTML = obj.htmlCode;
            VT.getEl('#userNameNB').firstChild.data = obj.resData.login;
            return loadWithPromise('editForm.html', '#underNavBar', obj.resData);
        }, function () {})
        .then(function (obj) {
            cleanEl(obj.where);
            VT.getEl(obj.where).innerHTML = obj.htmlCode;
            getUserInfoFromResponse(obj.resData)
        }, function () {})
};

signUpBtn = ()=>{
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
};

editProfileBtn = ()=>{
    let userObj = {};
    getUserInfoFromForm(userObj, ['login', 'email', 'userName', 'age'], 'Edit');
    userObj.gender = getRadioValue('radioGender');
    userObj.token = JSON.parse(localStorage.getItem('token'));
    VT.send('PUT', '/user', userObj, function (status, data) {
        if (status === 409) return addBadForThis(['#form_loginEdit'], ['#form_loginErrorEdit']);
        else return alert(status + data);
    }, function (data) {
        remBadForThis(['#form_loginEdit'], ['#form_loginErrorEdit']);
        alert('User data ' + data[1] + ' have been edited!');
        VT.getEl('#userNameNB').firstChild.data = data[0].login;
        return getUserInfoFromResponse();
    }, true)
};

editProfilePasswordBtn = ()=>{
    let userObj = {};
    userObj.token = JSON.parse(localStorage.getItem('token'));
    getUserInfoFromForm(userObj, ['oldPassword', 'newPassword'], 'Edit');
    VT.send('PUT', '/user/editpassword', userObj, function (status, data) {
        if (status === 400) return addBadForThis(['#form_oldPasswordEdit'], ['#form_oldPasswordErrorEdit']);
    }, function (data) {
        alert('User password ' + data + ' have been edited!');
        VT.setValue('#form_oldPasswordEdit', '');
        VT.setValue('#form_newPasswordEdit', '');
        VT.setValue('#form_confirmNewPasswordEdit', '');
        removeModal('#modalEditPassword');
    }, true)
};

deleteProfileBtn = ()=>{
    let userObj = {};
    userObj.token = JSON.parse(localStorage.getItem('token'));
    getUserInfoFromForm(userObj, ['password'], 'DeleteProfile');
    VT.send('DELETE', '/user', userObj, function (status, data) {
        if (status === 400) {
            return addBadForThis(['#form_passwordDeleteProfile'], ['#form_passwordDeleteProfileError']);
        }
    }, function (data) {
        alert('User ' + data + ' was deleted!');
        logOut()
    }, true)
};

logOut = ()=>{
    localStorage.removeItem('token');
    loadFile('authorizationForm.html', '#adding', true);
};

invalidToken = ()=>{
    logOut();
    VT.getEl('#shadow').style.display = 'none';
    return alert('The token is not valid. You will be returned to the authorization page!');
};

getUserInfoFromForm = (interimObj, fields, idPart) => {
    idPart = idPart || '';
    for (let i = 0; i < fields.length; i++) {
        interimObj[fields[i]] = VT.getValue('#form_' + fields[i] + idPart);
    }
};

getUserInfoFromResponse = (fields)=>{
    for (let i in fields) {
        if (VT.isDefined(VT.getEl('#form_' + i + 'Edit'))) {
            VT.setValue('#form_' + i + 'Edit', fields[i]);
            if (fields.gender === 'Female') {
                VT.getEl('#radioFemale').checked = true;
            }
        }
    }
};

showModal = (modalId)=>{
    VT.getEl('#shadow').style.display = 'block';
    VT.getEl(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
    VT.getEl('#shadow').onclick = function(){removeModal(modalId)};
};

removeModal = (modalId)=>{
    VT.getEl('#shadow').style.display = 'none';
    VT.getEl(modalId).style.display = 'none';
    document.body.style.overflow = "auto";
    return false;
};

inWhichUser = ()=>{
    let user = JSON.parse(localStorage.getItem("loginAut"));
    let usersArray = JSON.parse(localStorage.getItem("users"));
    for (let i = 0; i < usersArray.length; i++) {
        if (user === usersArray[i].login) {
            return i;
        }
    }
};