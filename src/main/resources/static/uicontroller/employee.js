window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshEmployeeTable();
    refreshEmployeeForm();
});


//table *********************************************************************************************************************************************************************************************


const refreshEmployeeTable = () => {

    let employees = getServiceRequest('/employee/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        { propertyName: "empno", dataType: "string" },
        { propertyName: "empphoto", dataType: "image-array" },
        { propertyName: "fullname", dataType: "string" },
        { propertyName: "email", dataType: "string" },
        { propertyName: "nic", dataType: "string" },
        { propertyName: "dob", dataType: "string" },
        { propertyName: "gender", dataType: "string" },
        { propertyName: "mobileno", dataType: "string" },
        { propertyName: "civilstatus", dataType: "string" },
        { propertyName: "address", dataType: "string" },
        { propertyName: "note", dataType: "string" },
        { propertyName: getDesignation, dataType: "function" },
        { propertyName: getEmployeeStatus, dataType: "function" },
    ];

    fillDataIntoTable(tableEmployeeBody, employees, propertyList, employeeFormRefill);
<<<<<<< HEAD
    $('#tableEmployee').DataTable({
=======
    $('#tableEmployee').DataTable({
>>>>>>> 1ab9c77be7d7d40021360caaef45e71af74249d7
        info: false,
        paging: false,
        searching: false
        });   
    
};

const getDesignation = (dataOb) => {
    return dataOb.designation_id.name;
};

const getEmployeeStatus = (dataOb) => {
    if (dataOb.employeestatus_id.name == "Working") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.employeestatus_id.name + "</p>";
    } if (dataOb.employeestatus_id.name == "Resign") {
        return "<p class='badge bg-dark w-100 my-auto'>" + dataOb.employeestatus_id.name + "</p>";
    } if (dataOb.employeestatus_id.name == "Removed") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.employeestatus_id.name + "</p>";
    }
};

//form *********************************************************************************************************************************************************************************************

const refreshEmployeeForm = () => {
    employee = new Object();


    formEmployee.reset();
    
    fileEmployeePhoto.value = "";
    imgEmpPhotoPreview.src = "/images/default.png";

    setDefault([ textFullName, textNic, radioMale, radioFemale, textAddress, dteDOB, textEmail, selectCivilStatus, textMobile, selectDesignation, selectStatus, textNote]);

    let designations = getServiceRequest('/designation/alldata');
    fillDataIntoSelect(selectDesignation,"Select Designation",designations,"name");

    let employeeStatus = getServiceRequest('/employeestatus/alldata');
    fillDataIntoSelect(selectStatus,"Select Status",employeeStatus,"name");
};

const employeeFormRefill = (ob, index) => {
    refreshEmployeeForm();
    console.log("Edit", ob, index);

    // set photo 
    if (ob.empphoto != null) {
        imgEmpPhotoPreview.src = atob(ob.empphoto);
    } else {
        imgEmpPhotoPreview.src = "/images/default.png";
    }

    textFullName.value = ob.fullname;
    textNic.value = ob.nic;
    dteDOB.value = ob.dob;
    
    if (ob.gender == "Male") {
        radioMale.checked = true;
    } else {
        radioFemale.checked = true;
    }

    textEmail.value = ob.email;
    textMobile.value = ob.mobileno;
    textAddress.value = ob.address;
    textNote.value = ob.note;
    selectCivilStatus.value = ob.civilstatus;
    selectDesignation.value = JSON.stringify(ob.designation_id);
    selectStatus.value = JSON.stringify(ob.employeestatus_id);

    employee = JSON.parse(JSON.stringify(ob));
    oldEmployee = JSON.parse(JSON.stringify(ob));

    $("#modalEmployeeForm").modal("show");
    $("#modalEmployeeFormLabel").text(ob.empno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
};

const buttonEmployeeDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.fullname + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/employee/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshEmployeeTable();
            $("#modalEmployeeForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors + deleteResponce)
        }
    }
};

const buttonEmployeePrint = (ob, index) => {
    console.log("View", ob, index);

    let newWindow = window.open();
    let printView =
    "<head>"
        +"<title>www.ereamart.com</title>"
        +"<link href='/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet'/>"
        +"<link rel='stylesheet' href='/css/main.css'>"
    +"</head>"
    +"<body>"
        +"<div class='container m-0 mt-4'>"
            +"<h6 class='mb-4'>Details</h6>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Emp No </th><td>"+ ob.empno +"</td></tr>" 
                +"<tr><th> Fullname </th><td>"+ ob.fullname +"</td></tr>" 
                +"<tr><th> Callingname </th><td>"+ ob.callingname +"</td></tr>" 
                +"<tr><th> Email </th><td>"+ ob.email +"</td></tr>" 
                +"<tr><th> NIC </th><td>"+ ob.nic +"</td></tr>" 
                +"<tr><th> Date of Birth </th><td>"+ ob.dob +"</td></tr>" 
                +"<tr><th> Gender </th><td>"+ ob.gender +"</td></tr>" 
                +"<tr><th> Mobile </th><td>"+ ob.mobileno +"</td></tr>" 
                +"<tr><th> Civil Status </th><td>"+ ob.civilstatus +"</td></tr>" 
                +"<tr><th> Address </th><td>"+ ob.address +"</td></tr>" 
                +"<tr><th> Note </th><td>"+ ob.note +"</td></tr>" 
                +"<tr><th> Designation </th><td>"+ ob.designation_id.name +"</td></tr> "
                +"<tr><th> Status </th><td>"+ ob.employeestatus_id.name +"</td></tr> "
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalEmployeeForm").modal("hide"); 
    }, 500);
};

const checkFormError = ()=>{
    let errors = "";
    if (employee.fullname == null) {
        errors = errors + "Please Enter Valid Full Name\n"
    }
    if (employee.nic == null) {
        errors = errors + "Please Enter Nic\n"
    }
    if (employee.dob == null) {
        errors = errors + "Please select dob \n";
    }
    if (employee.civilstatus == null) {
        errors = errors + "Please Select Civilstatus \n";
    }
    if (employee.gender == null) {
        errors = errors + "Please select Gender \n";
    }
    if (employee.email == null) {
        errors = errors + "Please Enter Valid Email \n";
    }
    if (employee.mobileno == null) {
        errors = errors + "Please Enter Valid Mobile no \n";
    }
    if (employee.address == null) {
        errors = errors + "Please Enter Valid Address \n";
    }
    if (employee.designation_id == null) {
        errors = errors + "Please Select Designation \n";
    }
    if (employee.employeestatus_id == null) {
        errors = errors + "Please Select Employee Status \n";
    }
    return errors;
};

const buttonEmployeeSubmit = () => {
    console.log(employee);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ employee.fullname +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/employe/insert", "POST", employee);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshEmployeeTable();
                refreshEmployeeForm();
                $("#modalEmployeeForm").modal("hide");
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

    console.log(employee);
    console.log(oldEmployee);
    
    if (employee != null && oldEmployee !== null) {
        if (employee.fullname != oldEmployee.fullname) {
            updates = updates + "Full name - " + oldEmployee.fullname + " to " + employee.fullname + "\n";
        }
        if (employee.callingname != oldEmployee.callingname) {
            updates = updates + "Calling name - " + oldEmployee.callingname + " to " + employee.callingname + "\n";
        }
        if (employee.nic != oldEmployee.nic) {
            updates = updates + "Nic - " + oldEmployee.nic + " to " + employee.nic + "\n";
        }
        if (employee.dob != oldEmployee.dob) {
            updates = updates + "DOB - " + oldEmployee.dob + " to " + employee.dob + "\n";
        }
        if (employee.civilstatus != oldEmployee.civilstatus) {
            updates = updates + "Civil Status - " + oldEmployee.civilstatus + " to " + employee.civilstatus + "\n";
        }
        if (employee.gender != oldEmployee.gender) {
            updates = updates + "Gender - " + oldEmployee.gender + " to " + employee.gender + "\n";
        }
        if (employee.email != oldEmployee.email) {
            updates = updates + "Email - " + oldEmployee.email + " to " + employee.email + "\n";
        }
        if (employee.mobileno != oldEmployee.mobileno) {
            updates = updates + "Mobile no - " + oldEmployee.mobileno + " to " + employee.mobileno + "\n";
        }
        if (employee.address != oldEmployee.address) {
            updates = updates + "Address - " + oldEmployee.address + " to " + employee.address + "\n";
        }
        if (employee.designation_id.name != oldEmployee.designation_id.name) {
            updates = updates + "Designation - " + oldEmployee.designation_id.name + " to " + employee.designation_id.name + "\n";
        }
        if (employee.employeestatus_id.name != oldEmployee.employeestatus_id.name) {
            updates = updates + "Status - " + oldEmployee.employeestatus_id.name + " to " + employee.employeestatus_id.name + "\n";
        }
        if (employee.note != oldEmployee.note) {
            updates = updates + "note - " + oldEmployee.note + " to " + employee.note + "\n";
        } 
        if (employee.empphoto != oldEmployee.empphoto) {
            updates = updates + "Photo - " + oldEmployee.empphoto + " to " + employee.empphoto + "\n";
        } 
    }
    return updates;
};

const buttonEmployeeUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ employee.fullname +"?");
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/employee/update", "PUT", employee);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshEmployeeTable();
                    refreshEmployeeForm();
                    $("#modalEmployeeForm").modal("hide");
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
    refreshEmployeeForm();
    $("#modalEmployeeFormLabel").text("Add New Employee");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
};