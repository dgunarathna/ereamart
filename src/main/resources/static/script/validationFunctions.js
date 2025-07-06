//******************commn validations ******************* */

const textValidator = (element, dataPattern, object, property) => {
    const elementValue = element.value;
    const regExp = new RegExp(dataPattern);
    const ob = window[object];


    if (elementValue != "") {
        if (regExp.test(elementValue)) {
            element.style.border = "1px solid lightgreen";
            ob[property] = (elementValue);
        } else {
            element.style.border = "1px solid pink";
            ob[property] = null;
        }
    } else {
        if (element.required) {
            element.style.border = "1px solid pink";
            ob[property] = null;
        } else {
            element.style.border = "1px solid #ced4da";
            ob[property] = "";
        }
    }
}

const dateElemantValidator = (element, object, property) => {
    const elementValue = element.value;
    const ob = window[object];

    if (elementValue != "") {
        element.style.border = "1px solid lightgreen";
        ob[property] = (elementValue);
    } else {
        element.style.border = "1px solid pink";
        ob[property] = null;
    }
}

const selectStaticElementValidator = (element, object, property)=>{
    const elementValue = element.value;
    const ob = window[object];

    if (elementValue != "") {
        element.style.border = "1px solid lightgreen";
        ob[property] = (elementValue);
    } else {
        element.style.border = "1px solid pink";
        ob[property] = null;
    }
}

const selectDynamicElementValidator = (element, object, property) => {
    const elementValue = element.value;
    const ob = window[object];

    if (elementValue != "") {
        element.style.border = "1px solid lightgreen";
        ob[property] = JSON.parse(elementValue);
    } else {
        element.style.border = "1px solid pink";
        ob[property] = null;
    }
}



//******************Employee validations ******************* */


const userPhotoValidation = (inputUserPhoto) => {
    const userPhotoValue = inputUserPhoto.value;

    if (userPhotoValue != "") {
        inputUserPhoto.style.border = "1px solid lightgreen";
        employee.userPhoto = inputUserPhoto.value;
    } else {
        inputUserPhoto.style.border = "1px solid pink";
        employee.userPhoto = null;
    }
}


const fullNameValidator = (textFullName) => {
    const fullNameValue = textFullName.value;
    if (fullNameValue != "") {
        if (new RegExp("^([A-Z][a-z]{1,20}[\\s])+([A-Z][a-z]{1,20})$").test(fullNameValue)) {
            textFullName.style.border = "1px solid lightgreen";
            employee.fullname = fullNameValue;
        } else {
            textFullName.style.border = "1px solid pink";
            employee.fullname = null;
        }
    } else {
        textFullName.style.border = "1px solid pink";
        employee.fullname = null;
    }
}


const nicValidator = (nicElement) => {
    const nicValue =  nicElement.value;
    if (nicValue != "") {
        if (new RegExp("^(([98765][0-9]{8}[VvXx])|([0-9]{12}))$").test(nicValue)) {
            nicElement.style.border = "1px solid lightgreen";
            employee.nic = nicValue;
        }else{
            nicElement.style.border = "1px solid pink";
            employee.nic = null;
        }
    } else {
        nicElement.style.border = "1px solid pink";
        employee.nic = null;
        
    }
}


const passwordvalidator = () => {

    if (textPassword == textRetypePassword) {
        user.password = textPassword.value;
        textPassword.style.boder = "1px solid green";
    } else {
        user.password = null;
        textPassword.style.boder = "1px solid pink";
    }
}