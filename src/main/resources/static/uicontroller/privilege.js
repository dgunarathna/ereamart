window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshPrivilegeTable();
    refreshPrivilegeForm();
});


//table *********************************************************************************************************************************************************************************************
const refreshPrivilegeTable = () => {
    let privileges = getServiceRequest('/privilege/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: getModule, dataType: "function"},
        {propertyName: getRole, dataType: "function"},
        {propertyName: getSelet, dataType: "function"},
        {propertyName: getInsert, dataType: "function"},
        {propertyName: getUpdate, dataType: "function"},
        {propertyName: getDelete, dataType: "function"},
    ];

    fillDataIntoTable(tablePrivilegeBody, privileges, propertyList, privilegeFormRefill);

};

const getRole = (ob)=>{
    return ob.role_id.name;
};

const getModule = (ob)=>{
    return ob.module_id.name;
};

const getSelet = (ob)=>{
    if (ob.privi_select) {
        return "<p class='badge bg-success w-100 my-auto'>Granted</p>";
    } else {
        return "<p class='badge bg-danger  w-100 my-auto'>Not Granted</p>";
    }
};

const getInsert = (ob)=>{
    if (ob.privi_insert) {
        return "<p class='badge bg-success w-100 my-auto'>Granted</p>";
    } else {
        return "<p class='badge bg-danger w-100 my-auto'>Not Granted</p>";
    }
};

const getUpdate = (ob)=>{
    if (ob.privi_update) {
        return "<p class='badge bg-success w-100 my-auto'>Granted</p>";
    } else {
        return "<p class='badge bg-danger w-100 my-auto'>Not Granted</p>";
    }
};

const getDelete = (ob)=>{
    if (ob.privi_delete) {
        return "<p class='badge bg-success w-100 my-auto'>Granted</p>";
    } else {
        return "<p class='badge bg-danger w-100 my-auto'>Not Granted</p>";
    }
};

//form *********************************************************************************************************************************************************************************************
const refreshPrivilegeForm = () => {
    privilege = new Object();

    formPrivilege.reset();

    setDefault([selectRole, selectModule]);

    let roles = getServiceRequest('/role/alldata');

    fillDataIntoSelect(selectRole,"Select Role", roles, "name");
    
    let modules = getServiceRequest('/module/alldata');

    fillDataIntoSelect(selectModule,"Select Module", modules, "name");

    selectRole.disabled = false;
    selectModule.disabled = false;

    chkBoxSelect.checked = true;
    privilege.privi_select = true;

    chkBoxInsert.checked = true;
    privilege.privi_insert = true;

    chkBoxUpdate.checked = true;
    privilege.privi_update = true;

    chkBoxDelete.checked = true;
    privilege.privi_delete = true;

    selectRole.style.border = "1px solid #ced4da";
    selectModule.style.border = "1px solid #ced4da";
};

const privilegeFormRefill = (ob, index) => {
    console.log("Edit", ob, index);

    selectRole.value = JSON.stringify(ob.role_id);
    selectModule.value = JSON.stringify(ob.module_id);

    if (ob.privi_select) {
        chkBoxSelect.checked = true;
    } else {
        chkBoxSelect.checked = false;
    }

    if (ob.privi_insert) {
        chkBoxInsert.checked = true;
    } else {
        chkBoxInsert.checked = false;
    }

    if (ob.privi_update) {
        chkBoxUpdate.checked = true;
    } else {
        chkBoxUpdate.checked = false;
    }

    if (ob.privi_delete) {
        chkBoxDelete.checked = true;
    } else {
        chkBoxDelete.checked = false;
    }
    
    privilege = JSON.parse(JSON.stringify(ob));
    oldprivilege = JSON.parse(JSON.stringify(ob));

    $("#modalPrivilegeForm").modal("show");
    $("#modalPrivilegeFormLabel").text(ob.role_id.name);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
};

const buttonPrivilegeDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.role_id.name + " privileges of " + ob.module_id.name + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/privilege/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshPrivilegeTable();
            $("#modalPrivilegeForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
};

const buttonPrivilegePrint = (ob, index) => {
    let newWindow = window.open();
    let printView =
    "<head>"
        +"<title>www.ereamart.com</title>"
        +"<link href='/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet'/>"
        +"<link rel='stylesheet' href='/css/main.css'>"
    +"</head>"
    +"<body>"
        +"<div class='container m-0 mt-4'>"
            +"<h5 class='mb-4'>"+ ob.role_id.name + " Details</h5>"
            +"<table class='table'>"
                +"<tbody>"
                    +"<tr><th> Role </th><td>"+ ob.role_id.name +"</td></tr>" 
                    +"<tr><th> Module </th><td>"+ getModule(ob) +"</td></tr>" 
                    +"<tr><th> Select </th><td>"+ getSelet(ob) +"</td></tr>" 
                    +"<tr><th> Insert </th><td>"+ getInsert(ob) +"</td></tr>" 
                    +"<tr><th> Update </th><td>"+ getUpdate(ob) +"</td></tr>" 
                    +"<tr><th> Delete </th><td>"+ getDelete(ob) +"</td></tr>"
                +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalPrivilegeForm").modal("hide"); 
    }, 500);
};

const checkFormError = ()=>{
    let errors = "";
    if (privilege.role_id == null) {
        errors = errors + "Please select Role \n"
    }

    if (privilege.module_id == null) {
        errors = errors + "Please select module \n"
    }

    return errors;
};

const buttonPrivilegeSubmit = () => {
    console.log(privilege);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ privilege.role_id.name + " privileges of " + privilege.module_id.name + "?");
        if (userConfirm == true) {
            let postResponce  = getHTTPServiceRequest("/privilege/insert", "POST", privilege);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshPrivilegeTable();
                refreshPrivilegeForm();
                $("#modalPrivilegeForm").modal("hide"); 
            }else{
                window.alert("Faild to submit\n" + postResponce);
            }
        }
    }else{
        window.alert("Form has following errors\n" + errors);
    }
};

const checkFormUpdate = () => {
    let updates = "";

    if (privilege != null && oldprivilege != null) {
        if (privilege.role_id.name != oldprivilege.role_id.name) {
            updates = updates + "Role - " + oldprivilege.role_id.name + " to " + privilege.role_id.name + "\n";
        }
        if (privilege.module_id.name != oldprivilege.module_id.name) {
            updates = updates + "Module - " + oldprivilege.module_id.name + " to " + privilege.module_id.name + "\n";
        }
        if (privilege.privi_select != oldprivilege.privi_select) {
            updates = updates + "Select privilege - " + oldprivilege.privi_select + " to " + privilege.privi_select + "\n";
        }
        if (privilege.privi_insert != oldprivilege.privi_insert) {
            updates = updates + "Insert privilege - " + oldprivilege.privi_insert + " to " + privilege.privi_insert + "\n";
        }
        if (privilege.privi_update != oldprivilege.privi_update) {
            updates = updates + "Update privilege - " + oldprivilege.privi_update + " to " + privilege.privi_update + "\n";
        }
        if (privilege.privi_delete != oldprivilege.privi_delete) {
            updates = updates + "Delete privilege - " + oldprivilege.privi_delete + " to " + privilege.privi_delete + "\n";
        }
    }
    return updates;
};

const buttonPrivilegeUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure want to update "+ privilege.role_id.name + " privileges of " + privilege.module_id.name + "? \n");
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/privilege/update", "PUT", privilege);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshPrivilegeTable();
                    refreshPrivilegeForm();
                    $("#modalPrivilegeForm").modal("hide");
                } else {
                    window.alert("Failed to update" + putResponce);
                }
            }
        }
    } else {
        window.alert("Form has following errors..\n" + errors)
    }
};

//Add new record ************************************************************************************************************************************************************************************

const buttonAddNew = () => {
    refreshPrivilegeForm();
    $("#modalPrivilegeFormLabel").text("Add New Privilege");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
};