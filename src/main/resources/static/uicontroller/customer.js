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
        {propertyName: "loyalty_points", dataType: "string"},
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

    setDefault([ textName, textEmail, textMobileNo, textLoyaltyPoints, selectStatus]);

    let customers = getServiceRequest('/customerstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select status",customers,"name");

};

const customerFormRefill = (ob, index) => {
    refreshCustomerForm();
    console.log("Edit", ob, index);

    textName.value = ob.fullname;
    textEmail.value = ob.email;
    textMobileNo.value = ob.mobileno;
    textLoyaltyPoints.value = ob.loyalty_points;
    selectStatus.value = JSON.stringify(ob.customer_status_id);

    if (ob.customer_status_id.name == "Inactive") {
        buttonDelete.disabled = "disabled";
        buttonUpdate.disabled = "disabled";
        selectStatus.disabled = "disabled";
    }

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
            +"<h6 class='mb-4'>Details</h6>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Reg No </th><td>"+ ob.regno +"</td></tr>" 
                +"<tr><th> Name </th><td>"+ ob.fullname +"</td></tr>" 
                +"<tr><th> Email </th><td>"+ ob.email +"</td></tr>" 
                +"<tr><th> Mobile </th><td>"+ ob.mobileno +"</td></tr>" 
                +"<tr><th> Loyalty Points </th><td>"+ ob.loyalty_points +"</td></tr>" 
                +"<tr><th> Status </th><td>"+ ob.customer_status_id.name +"</td></tr>"
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
    if (customer.loyalty_points == null || !/^[0-9]+$/.test(customer.loyalty_points)) {
        errors = errors + "Please Enter valid Loyalty Points\n"
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
        if (customer.loyalty_points != oldCustomer.loyalty_points) {
            updates = updates + "Loyalty Points - " + oldCustomer.loyalty_points + " to " + customer.loyalty_points + "\n";
        }
        if (customer.customer_status_id.name != oldCustomer.customer_status_id.name) {
            updates = updates + "Status - " + oldCustomer.customer_status_id.name + " to " + customer.customer_status_id.name + "\n";
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