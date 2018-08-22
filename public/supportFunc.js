function requestWithPromise(method, url, param) {
    return new Promise(function (resolve, reject) {
        VT.send(method, url, param, function (error, resData) {
            reject(error, resData);
        }, function (resData) {
            resolve(resData);
        }, true)
    });
}

function loadWithPromise(file, where, resData) {
    return new Promise(function (resolve, reject) {
        VT.send("GET", file, {}, function (error, resData) {
            reject(error);
        }, function (htmlCode) {
            resolve({ htmlCode: htmlCode, where: where, resData: resData });
        }, true)
    });
}

loadFile = (file, where, async)=>{
    cleanEl(where);
    VT.send("GET", file, '', function failureSend(code,error){
        console.log(code + error)
    }, function successSend(data){
        VT.getEl(where).innerHTML = data;
    }, async);
};

updCheck = (oldStr, newStr, needDis)=>{
    if (newStr !== oldStr && newStr !== '')  {
        VT.getEl(needDis).disabled = false;
    }
    else {VT.getEl(needDis).disabled = true;}
};

cleanEl = (elementID)=>{
    let div = VT.getEl(elementID);
    if ( VT.getEl(elementID) !== null ) {
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
    }
};

String.prototype.hashCode = function() {
    for(var ret = 0, i = 0, len = this.length; i < len; i++) {
        ret = (31 * ret + this.charCodeAt(i)) << 0;
    }
    return ret;
};

addBadForThis = (arrFields, arrErrors)=>{
    for ( let i = 0; i < arrFields.length; i++ ) {
        VT.addClass( arrFields[i], 'badS');
        VT.getEl(arrErrors[i]).style.display = 'block';
    }
};

remBadForThis = (arrFields, arrErrors)=>{
    for ( let i = 0; i < arrFields.length; i++ ) {
        VT.removeClass( arrFields[i], 'badS');
        VT.getEl(arrErrors[i]).style.display = 'none';
    }
};

passwordCheck = ( first, second, needToBloc)=>{
    let line1 = VT.getValue(first);
    let line2 = VT.getValue(second);
    if ( line1 !== line2 ) {
        VT.getEl(needToBloc).disabled = true;
        VT.removeClass(first, 'goodS'); VT.addClass(first, 'badS');
        VT.removeClass(second, 'goodS'); VT.addClass(second, 'badS');
    }
    else {
        VT.getEl(needToBloc).disabled = false;
        VT.removeClass(first, 'badS'); VT.addClass(first, 'goodS'); setTimeout(function() {VT.removeClass(first, 'goodS')}, 1000);
        VT.removeClass(second, 'badS'); VT.addClass(second, 'goodS'); setTimeout(function() {VT.removeClass(second, 'goodS')}, 1000);
    }
};

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

getToken = ()=>{
    if( IsJsonString(localStorage.getItem('token')) ){
        token = JSON.parse(localStorage.getItem('token'));
    }
    else {
        token = localStorage.getItem('token');
    }
};

getRadioValue = (name)=>{
    let radios = document.getElementsByName(name);
    for (let i = 0, radio; radio = radios[i]; i++) {
        if (radio.checked) return radio.value;
    }
    return null;
};