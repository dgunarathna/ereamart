window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshCustomerTable();
    refreshCustomerForm();
});


//table *********************************************************************************************************************************************************************************************
const refreshCustomerTable = () => {
    let customers = getServiceRequest('/customer/alldata');
    
    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "regno", dataType: "string"},
        {propertyName: "fullname", dataType: "string"},
        {propertyName: "email", dataType: "string"},
        {propertyName: "mobileno", dataType: "string"},
        {propertyName: "address", dataType: "string"},
        {propertyName: "note", dataType: "string"},
        {propertyName: getStatus, dataType: "function"},
    ];

    fillDataIntoTable(tableCustomerBody, customers, propertyList, customerFormRefill);
    
};

const getStatus = (dataOb) => {
    if (dataOb.customer_status_id.name == "Active") {
        return "<p class='badge bg-success text-light w-100 my-auto'>" + dataOb.customer_status_id.name + "</p>";
    } if (dataOb.customer_status_id.name == "Inactive") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.customer_status_id.name + "</p>";
    }
}
//form *********************************************************************************************************************************************************************************************

const refreshCustomerForm = () => {
    customer = new Object();

    formCustomer.reset();

    setDefault([ textName, textEmail, textMobileNo, textAddress, textNote, selectStatus]);

    let customers = getServiceRequest('/customerstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select status",customers,"name");

};

const customerFormRefill = (ob, index) => {
    refreshCustomerForm();
    console.log("Edit", ob, index);

    textName.value = ob.fullname;
    textEmail.value = ob.email;
    textMobileNo.value = ob.mobileno;
    textAddress.value = ob.address;
    textNote.value = ob.note;
    selectStatus.value = JSON.stringify(ob.customer_status_id);

    customer = JSON.parse(JSON.stringify(ob));
    oldCustomer = JSON.parse(JSON.stringify(ob));

    $("#modalCustomerForm").modal("show");
    $("#modalCustomerFormLabel").text(ob.regno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
};

const buttonCustomerDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.fullname + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/customer/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshCustomerTable();
            $("#modalCustomerForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
};

const buttonCustomerPrint = (ob, index) => {
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
                +"<tr><th> Name </th><td>"+ ob.fullname +"</td></tr>" 
                +"<tr><th> Email </th><td>"+ ob.email +"</td></tr>" 
                +"<tr><th> Mobile </th><td>"+ ob.mobileno +"</td></tr>" 
                +"<tr><th> Address </th><td>"+ ob.address +"</td></tr>" 
                +"<tr><th> Note </th><td>"+ ob.note +"</td></tr>" 
                +"<tr><th> Status </th><td>"+ ob.status +"</td></tr>"
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalCustomerForm").modal("hide"); 
    }, 500);
};

const checkFormError = ()=>{
    let errors = "";
    if (customer.regno == null) {
        errors = errors + "Please Enter Reg No\n"
    }
    if (customer.fullname == null) {
        errors = errors + "Please Enter Name\n"
    }
    if (customer.email == null) {
        errors = errors + "Please Enter Email\n"
    }
    if (customer.mobileno == null) {
        errors = errors + "Please Enter Mobile\n"
    }
    if (customer.address == null) {
        errors = errors + "Please Enter Address\n"
    }
    return errors;
};

const buttonCustomerSubmit = () => {
    console.log(customer);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ customer.fullname +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/customer/insert", "POST", customer);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshCustomerTable();
                refreshCustomerForm();
                $("#modalCustomerForm").modal("hide");
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

    console.log(customer);
    console.log(oldCustomer);
    
    if (customer != null && oldCustomer !== null) {
        if (customer.regno != oldCustomer.regno) {
            updates = updates + "Reg No - " + oldCustomer.regno + " to " + customer.regno + "\n";
        }
        if (customer.fullname != oldCustomer.fullname) {
            updates = updates + "Name - " + oldCustomer.fullname + " to " + customer.fullname + "\n";
        }
        if (customer.email != oldCustomer.email) {
            updates = updates + "Email - " + oldCustomer.email + " to " + customer.email + "\n";
        }
        if (customer.mobileno != oldCustomer.mobileno) {
            updates = updates + "Mobile - " + oldCustomer.mobileno + " to " + customer.mobileno + "\n";
        }
        if (customer.address != oldCustomer.address) {
            updates = updates + "Address - " + oldCustomer.address + " to " + customer.address + "\n";
        }
        if (customer.note != oldCustomer.note) {
            updates = updates + "Note - " + oldCustomer.note + " to " + customer.note + "\n";
        }
        if (customer.status != oldCustomer.status) {
            updates = updates + "Status - " + oldCustomer.status + " to " + customer.status + "\n";
        }
    }
    return updates;
};

const buttonCustomerUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ customer.fullname +"?\n"+updates);
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/customer/update", "PUT", customer);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshCustomerTable();
                    refreshCustomerForm();
                    $("#modalCustomerForm").modal("hide");
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
    refreshCustomerForm();
    $("#modalCustomerFormLabel").text("Add New Customer");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
};