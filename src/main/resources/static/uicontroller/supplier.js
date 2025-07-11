window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshSupplierTable();
    refreshSupplierForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshSupplierTable = () => {
    let suppliers = getServiceRequest('/supplier/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "reg_no", dataType: "string"},
        {propertyName: "name", dataType: "string"},
        {propertyName: "supplier_brn", dataType: "string"},
        {propertyName: "email", dataType: "string"},
        {propertyName: "mobile_no", dataType: "string"},
        {propertyName: "address", dataType: "string"},
        {propertyName: "description", dataType: "string"},
        {propertyName: "bank", dataType: "string"},
        {propertyName: "branch", dataType: "string"},
        {propertyName: "accno", dataType: "string"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableSupplierBody, suppliers, propertyList, supplierFormRefill);

    
}

const getStatus = (dataOb) => {
    if (dataOb.suplier_status_id == "Active") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.suplier_status_id + "</p>";
    } if (dataOb.suplier_status_id == "Inactive") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.suplier_status_id + "</p>";
    } 
}

//form *********************************************************************************************************************************************************************************************

const refreshSupplierForm = () => {
    supplier = new Object();
    suplier.suplierHasItemList = new Array();

    formSupplier.reset();

    setDefault([textRegNo, textBRN, textName, textEmail, textMobileNo, textAddress, textNote, textBank, textBranch, textAccountNo, selectState]);

    //inner form ************************************
    refreshSuplierInnerForm();
}

const supplierFormRefill = (ob, index) => {
    refreshSupplierForm();
    console.log("Edit", ob, index);

    textRegNo.value = ob.regno;
    textBRN.value = ob.brn;
    textName.value = ob.fullname;
    textEmail.value = ob.email;
    textMobileNo.value = ob.mobileno;
    textAddress.value = ob.address;
    textNote.value = ob.note;
    textBank.value = ob.bank;
    textBranch.value = ob.branch;
    textAccountNo.value = ob.accno;
    selectState.value = ob.status

    supplier = JSON.parse(JSON.stringify(ob));
    oldSupplier = JSON.parse(JSON.stringify(ob));

    $("#modalSupplierForm").modal("show");
    $("#modalSupplierFormLabel").text(ob.fullname);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}

const buttonSupplierDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.fullname + "?");
    if (userConfirm == true) {
        let deleteResponce = "OK";
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshSupplierTable();
            $("#modalSupplierForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonSupplierPrint = (ob, index) => {
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
            +"<h5 class='mb-4'>"+ ob.fullname + " Details</h5>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Reg No </th><td>"+ ob.regno +"</td></tr>" 
                +"<tr><th> BRN </th><td>"+ ob.fullname +"</td></tr>" 
                +"<tr><th> Name </th><td>"+ ob.brn +"</td></tr>" 
                +"<tr><th> Email </th><td>"+ ob.email +"</td></tr>" 
                +"<tr><th> Mobile Number </th><td>"+ ob.mobileno +"</td></tr>" 
                +"<tr><th> Address </th><td>"+ ob.address +"</td></tr>" 
                +"<tr><th> Note </th><td>"+ ob.note +"</td></tr>" 
                +"<tr><th> Bank </th><td>"+ ob.bank +"</td></tr>" 
                +"<tr><th> Branch </th><td>"+ ob.branch +"</td></tr>" 
                +"<tr><th> Account No </th><td>"+ ob.accno +"</td></tr>" 
                +"<tr><th> Supplier Status </th><td>"+ ob.status +"</td></tr>" 
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalSupplierForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (supplier.regno == null) {
        errors = errors + "Please Enter Reg No\n"
    }
    if (supplier.fullname == null) {
        errors = errors + "Please Enter BRN\n"
    }
    if (supplier.brn == null) {
        errors = errors + "Please Enter Name\n"
    }
    if (supplier.email == null) {
        errors = errors + "Please Enter Email\n"
    }
    if (supplier.mobileno == null) {
        errors = errors + "Please Enter Mobile Number\n"
    }
    if (supplier.address == null) {
        errors = errors + "Please Enter Address\n"
    }
    if (supplier.note == null) {
        errors = errors + "Please Enter Note\n"
    }
    if (supplier.bank == null) {
        errors = errors + "Please Enter Bank\n"
    }
    if (supplier.branch == null) {
        errors = errors + "Please Enter Branch\n"
    }
    if (supplier.accno == null) {
        errors = errors + "Please Enter Account No\n"
    }
    if (supplier.status == null) {
        errors = errors + "Please Enter Supplier Status\n"
    }
    return errors;
}

const buttonSupplierSubmit = () => {
    console.log(supplier);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ supplier.fullname +"?");
        if (userConfirm == true) {
            let postResponce = "OK";
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshSupplierTable();
                refreshSupplierForm();
                $("#modalSupplierForm").modal("hide");
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

    console.log(supplier);
    console.log(oldSupplier);
    
    if (supplier != null && oldSupplier !== null) {
        if (supplier.regno != oldSupplier.regno) {
            updates = updates + "Reg No - " + oldSupplier.regno + " to " + supplier.regno + "\n";
        }
        if (supplier.fullname != oldSupplier.fullname) {
            updates = updates + "Name - " + oldSupplier.fullname + " to " + supplier.fullname + "\n";
        }
        if (supplier.brn != oldSupplier.brn) {
            updates = updates + "BRN - " + oldSupplier.brn + " to " + supplier.brn + "\n";
        }
        if (supplier.email != oldSupplier.email) {
            updates = updates + "Email - " + oldSupplier.email + " to " + supplier.email + "\n";
        }
        if (supplier.mobileno != oldSupplier.mobileno) {
            updates = updates + "Mobile Number - " + oldSupplier.mobileno + " to " + supplier.mobileno + "\n";
        }
        if (supplier.address != oldSupplier.address) {
            updates = updates + "Address - " + oldSupplier.address + " to " + supplier.address + "\n";
        }
        if (supplier.note != oldSupplier.note) {
            updates = updates + "Note - " + oldSupplier.note + " to " + supplier.note + "\n";
        }
        if (supplier.bank != oldSupplier.bank) {
            updates = updates + "Bank - " + oldSupplier.bank + " to " + supplier.bank + "\n";
        }
        if (supplier.branch != oldSupplier.branch) {
            updates = updates + "Branch - " + oldSupplier.branch + " to " + supplier.branch + "\n";
        }
        if (supplier.accno != oldSupplier.accno) {
            updates = updates + "Account No - " + oldSupplier.accno + " to " + supplier.accno + "\n";
        }
        if (supplier.status != oldSupplier.status) {
            updates = updates + "Supplier Status - " + oldSupplier.status + " to " + supplier.status + "\n";
        }
    }
    return updates;
}

const buttonSupplierUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ supplier.fullname +"?\n" + updates);
            if (userConfirm) {
                let putResponce = "OK";
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshSupplierTable();
                    refreshSupplierForm();
                    $("#modalSupplierForm").modal("hide");
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
    refreshSupplierForm();
    $("#modalSupplierFormLabel").text("Add New Supplier");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}

// inner form ***************************************************************************************************************************************************************************************