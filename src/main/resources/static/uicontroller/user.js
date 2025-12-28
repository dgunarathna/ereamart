window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshUserTable();
    refreshUserForm();
});


//table *********************************************************************************************************************************************************************************************
const refreshUserTable = () => {

    let users = getServiceRequest('/user/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        { propertyName: getEmpNo, dataType: "function" },
        { propertyName: "userphoto", dataType: "image-array" },
        { propertyName: getName, dataType: "function" },
        { propertyName: getEmail, dataType: "function" },
        { propertyName: getDesignation, dataType: "function" },
        { propertyName: getRoles, dataType: "function" },
        { propertyName: "username", dataType: "string" },
        { propertyName: getStatus, dataType: "function" },
    ];

    fillDataIntoTable(tableUserBody, users, propertyList, UserFormRefill);
<<<<<<< HEAD
    $('#tableUser').DataTable.DataTable().destroy()({
=======
    $('#tableUser').DataTable({
>>>>>>> 1ab9c77be7d7d40021360caaef45e71af74249d7
        info: false,
        paging: false,
        searching: false
        });
}



const getRoles = (ob) => {

    let roles = "";
    ob.roles.forEach(role => {
        roles = roles + role.name
    });

    return roles;
}

const getEmpNo = (dataOb) => {
    return dataOb.employee_id.empno;
}

const getName = (dataOb) => {
    return dataOb.employee_id.fullname;
}

const getDesignation = (dataOb) => {
    return dataOb.employee_id.designation_id.name;
}

const getEmail = (dataOb) => {
    return dataOb.email;
}

const getStatus = (dataOb) => {
    if (dataOb.status == "1") {
        return "<p class='badge bg-success w-100 my-auto'>" + "Active" + "</p>";
    } if (dataOb.status == "0") {
        return "<p class='badge bg-danger w-100 my-auto'>" + "Delete" + "</p>";
    }
}


//form *********************************************************************************************************************************************************************************************

const refreshUserForm = () => {

    user = new Object();
    oldUser = null;
    user.roles = new Array();

    formUser.reset();

    setDefault([selectEmployee, textUsername, textPassword, textRetypePassword, selectStatus]);

    let employees = getServiceRequest('/employee/withoutuseraccount');
    fillDataIntoSelect(selectEmployee, "Select Employee", employees, "fullname");

    selectStatus.checked = "checked";
    user.status = true;

    textPassword.disabled = false;
    textRetypePassword.disabled = false;

    let roles = getServiceRequest('/role/withoutadmin');
    let divRole = document.querySelector("#divRoles");
    divRole.innerHTML = "";
    roles.forEach((role, index) => {
        let div = document.createElement("div");
        div.className = "form-check form-check-inline py-1";
        divRole.appendChild(div);

        let inputCheck = document.createElement("input");
        inputCheck.type = "checkbox"; //dhanushka - radio 
        inputCheck.id = role.id;
        inputCheck.className = "form-check-input";

        inputCheck.onclick = () => {
            if (inputCheck.checked) {
                user.roles.push(role)
            } else {
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        div.appendChild(inputCheck);

        let label = document.createElement("label");
        label.className = "form-check-label";
        label.innerText = role.name;
        div.appendChild(label);
    });

    selectEmployee.disabled = false
}

const UserFormRefill = (ob, index) => {
    refreshUserForm();
    console.log("Edit", ob, index);

    user = new Object();
    user.roles = new Array();

    let employees = getServiceRequest('/employee/alldata');
    fillDataIntoSelect(selectEmployee, "Select Employee", employees, "fullname");
    selectEmployee.value = JSON.stringify(ob.employee_id);
    selectEmployee.disabled = true;

    textUsername.value = ob.username;

    if (ob.status) {
        selectStatus.checked = "checked";
    } else {
        selectStatus.checked = "";
    }

    let roles = getServiceRequest('/role/withoutadmin');
    let divRole = document.querySelector("#divRoles");
    divRole.innerHTML = "";
    roles.forEach((role, index) => {
        let div = document.createElement("div");
        div.className = "form-check form-check-inline py-1";
        divRole.appendChild(div);

        let inputCheck = document.createElement("input");
        inputCheck.type = "checkbox";
        inputCheck.id = role.id;
        inputCheck.className = "form-check-input";

        const isChecked = ob.roles.some(r => r.name === role.name); // dhanushka
        inputCheck.checked = isChecked;
        
        inputCheck.onclick = () => {
            if (inputCheck.checked) {
                user.roles.push(role)
            } else {
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
        if (extIndex != -1) {
            inputCheck.checked = true;
        }

        div.appendChild(inputCheck);

        let label = document.createElement("label");
        label.className = "form-check-label";
        label.innerText = role.name;
        div.appendChild(label);
    });


    user = JSON.parse(JSON.stringify(ob));
    oldUser = JSON.parse(JSON.stringify(ob));

    $("#modalUserForm").modal("show");
    $("#modalUserFormLabel").text(ob.employee_id.empno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}

const buttonUserDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.employee_id.fullname + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/user/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshUserTable();
            $("#modalUserForm").modal("hide");
        } else {
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonUserPrint = (ob, index) => {
    let newWindow = window.open();
    let printView =
        "<head>"
        + "<title>www.ereamart.com</title>"
        + "<link href='/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet'/>"
        + "<link rel='stylesheet' href='/css/main.css'>"
        + "</head>"
        + "<body>"
        + "<div class='container m-0 mt-4'>"
        + "<h6 class='mb-4'>Details</h6>"
        + "<table class='table'>"
        + "<tbody>"
        + "<tr><th> Employee </th><td>" + ob.employee_id.fullname + "</td></tr>"
        + "<tr><th> Designation </th><td>" + ob.employee_id.designation_id.name + "</td></tr>"
        + "<tr><th> Email </th><td>" + ob.employee_id.email + "</td></tr>"
        + "<tr><th> User name </th><td>" + ob.username + "</td></tr>"
        + "<tr><th> Password </th><td>" + ob.password + "</td></tr>"
        + "<tr><th> Status </th><td>" + ob.status + "</td></tr>"
        + "</tbody>"
        + "</table>"
        + "</div>"
        + "</body>";

    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalUserForm").modal("hide");
    }, 500);
}

const checkFormError = () => {
    let errors = "";
    if (user.employee_id == null) {
        errors = errors + "Please select Employee \n"
    }
    if (user.username == null) {
        errors = errors + "Please select username \n"
    }
    if (user.roles.lenght == 0) {
        errors = errors + "Please select username \n"
    }

    if (user.password == null) {
        errors = errors + "Please select Password \n"
    }
    if (oldUser == null) {
        if (textRetypePassword.value == "") {
            errors = errors + "Please re enter password"
        }
    }
    if (user.status == null) {
        errors = errors + "Please select account status \n"
    }

    return errors;
}

const buttonUserSubmit = () => {
    console.log(user);

    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add " + user.employee_id.fullname + "?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/user/insert", "POST", user);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshUserTable();
                refreshUserForm();
                $("#modalUserForm").modal("hide");
            } else {
                window.alert("Faild to submit\n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors\n" + errors);
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (user != null && oldUser != null) {
        if (user.employee_id.name != oldUser.employee_id.name) {
            updates = updates + "Employee - " + oldUser.employee_id.name + " to " + user.employee_id.name + "\n";
        }
        if (user.username != oldUser.username) {
            updates = updates + "Username name - " + oldUser.username + " to " + user.username + "\n";
        }
        if (user.password != oldUser.password) {
            updates = updates + "Password - " + oldUser.password + " to " + user.password + "\n";
        }
        if (user.status != oldUser.status) {
            updates = updates + "Accout status - " + oldUser.status + " to " + user.status + "\n";
        }
        if (user.roles != oldUser.roles) {
            updates = updates + "Username name - " + oldUser.roles + " to " + user.roles + "\n";
        }

    }
    return updates;
}

const buttonUserUpdate = () => {
    console.log(user);
    console.log(oldUser);


    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure want to update " + user.employee_id.fullname + "? \n");
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/user/update", "PUT", user);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshUserTable();
                    refreshUserForm();
                    $("#modalUserForm").modal("hide");
                } else {
                    window.alert("Failed to update" + putResponce);
                }
            }
        }
    } else {
        window.alert("Form has following errors..\n" + errors)
    }
}

//Add new record ************************************************************************************************************************************************************************************

const buttonAddNew = () => {
    refreshUserForm();
    $("#modalUserFormLabel").text("Add New User");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}