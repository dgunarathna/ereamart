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
        {propertyName: getUserPhoto, dataType: "function"},
        {propertyName: getName, dataType: "function"},
        {propertyName: getDesignation, dataType: "function"},
        {propertyName: getEmail, dataType: "function"},
        {propertyName: "username", dataType: "string"},
        {propertyName: "password", dataType: "string"},
        {propertyName: "note", dataType: "string"},
        {propertyName: getStatus, dataType: "function"},
    ];

    fillDataIntoTable(tableUserBody, users, propertyList, UserFormRefill);
}


const getUserPhoto = (dataOb) => {
    return dataOb.employee_id.empphoto;
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
    if (dataOb.status.name == "Active") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.accountstatus_id.name + "</p>";
    } if (dataOb.status.name == "Inactive") {
        return "<p class='badge bg-dark w-100 my-auto'>" + dataOb.accountstatus_id.name + "</p>";
    }
}


//form *********************************************************************************************************************************************************************************************

const refreshUserForm = () => {

    user = new Object();

    formUser.reset();

    setDefault([selectEmployee, textUsername, textPassword, textRetypePassword, textNote, selectAccountStatus]);

    let employees = getServiceRequest('/employee/alldata');
    
    fillDataIntoSelect(selectEmployee,"Select Employee",employees,"fullname");
    
    let accountStatus = [
        {id:1, name:"Active"},
        {id:2, name:"Inactive"}
    ];
    
    fillDataIntoSelect(selectAccountStatus,"Select Status",accountStatus,"name");

    selectEmployee.disabled = false
}

const UserFormRefill = (ob, index) => {
    refreshUserForm();
    console.log("Edit", ob, index);

    selectEmployee.value = JSON.stringify(ob.employee_id);
    textUsername.value = ob.username;
    textPassword.value = ob.password;
    textRetypePassword.value = ob.password;
    textNote.value = ob.note;
    selectAccountStatus.value = JSON.stringify(ob.accountstatus_id);
    
    user = JSON.parse(JSON.stringify(ob));
    oldUser = JSON.parse(JSON.stringify(ob));

    $("#modalUserForm").modal("show");
    $("#modalUserFormLabel").text(ob.employee_id.fullname);
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
        let deleteResponce = "OK";
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshUserTable();
            $("#modalUserForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonUserPrint = (ob, index) => {
    let newWindow = window.open();
    let printView =
    "<head>"
        +"<title>www.ereamart.com</title>"
        +"<link href='/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet'/>"
        +"<link rel='stylesheet' href='/css/main.css'>"
    +"</head>"
    +"<body>"
        +"<div class='container m-0 mt-4'>"
            +"<h5 class='mb-4'>"+ ob.employee_id.fullname + " Details</h5>"
            +"<table class='table'>"
                +"<tbody>"
                    +"<tr><th> Employee </th><td>"+ ob.employee_id.fullname +"</td></tr>" 
                    +"<tr><th> Designation </th><td>"+ ob.employee_id.designation_id.name +"</td></tr>" 
                    +"<tr><th> Email </th><td>"+ ob.employee_id.email +"</td></tr>" 
                    +"<tr><th> User name </th><td>"+ ob.username +"</td></tr>" 
                    +"<tr><th> Password </th><td>"+ ob.password +"</td></tr>" 
                    +"<tr><th> Note </th><td>"+ ob.note +"</td></tr>"
                    +"<tr><th> Status </th><td>"+ ob.accountstatus_id.name +"</td></tr>"
                +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalUserForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (user.employee_id == null) {
        errors = errors + "Please select Employee \n"
    }

    if (user.username == null) {
        errors = errors + "Please select username \n"
    }
    if (user.password == null) {
        errors = errors + "Please select Password \n"
    }
    if (user.accountstatus_id == null) {
        errors = errors + "Please select account status \n"
    }

    return errors;
}

const buttonUserSubmit = () => {
    console.log(user);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add " +  user.employee_id.fullname + "?");
        if (userConfirm == true) {
            let postResponce = "OK";
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshUserTable();
                refreshUserForm();
                $("#modalUserForm").modal("hide"); 
            }else{
                window.alert("Faild to submit\n" + postResponce);
            }
        }
    }else{
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
        if (user.note != oldUser.note) {
            updates = updates + "Note - " + oldUser.note + " to " + user.note + "\n";
        }
        if (user.accountstatus_id.name != oldUser.accountstatus_id.name) {
            updates = updates + "Accout status - " + oldUser.accountstatus_id.name + " to " + user.accountstatus_id.name + "\n";
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
            let userConfirm = window.confirm("Are you sure want to update "+  user.employee_id.fullname + "? \n");
            if (userConfirm) {
                let putResponce = "OK";
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