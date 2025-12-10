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
        {propertyName: "bank", dataType: "string"},
        {propertyName: "branch", dataType: "string"},
        {propertyName: "account_no", dataType: "string"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableSupplierBody, suppliers, propertyList, supplierFormRefill);
}

const getStatus = (dataOb) => {
    if (dataOb.supplier_status_id.name == "Active") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.supplier_status_id.name + "</p>";
    } if (dataOb.supplier_status_id.name == "Inactive") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.supplier_status_id.name + "</p>";
    } 
}

//form *********************************************************************************************************************************************************************************************

const refreshSupplierForm = () => {
    supplier = new Object();
    supplier.supplierItemList = new Array();
    

    formSupplier.reset();

    setDefault([textBRN, textName, textEmail, textMobileNo, textAddress, textBank, textBranch, textAccountNo, selectStatus]);

    let supplierStatus = getServiceRequest('/supplierstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select Status",supplierStatus,"name");
    selectStatus.value = JSON.stringify(supplierStatus[0]);
    supplier.supplier_status_id = supplierStatus[0];
    selectStatus.style.border = "1px solid lightgreen"


    allProducts = getServiceRequest('/product/alldata');
    fillDataIntoSelect(selectAllProducts, "" ,allProducts,"name");

    fillDataIntoSelect(selectSelectedProducts, "" ,supplier.supplierItemList,"name");
}


const supplierFormRefill = (ob, index) => {
    refreshSupplierForm();
    console.log("Edit", ob, index);

    supplier = getServiceRequest('/supplier/getbyid?id=' + ob.id);
    oldSupplier = getServiceRequest('/supplier/getbyid?id=' + ob.id);

    textBRN.value = supplier.supplier_brn;
    textName.value = supplier.name;
    textEmail.value = supplier.email;
    textMobileNo.value = supplier.mobile_no;
    textAddress.value = supplier.address;
    textBank.value = supplier.bank;
    textBranch.value = supplier.branch;
    textAccountNo.value = supplier.account_no;
    selectStatus.value = JSON.stringify(supplier.supplier_status_id);

    if (ob.supplier_status_id.name == "Inactive") {
        buttonDelete.disabled = "disabled";
        buttonUpdate.disabled = "disabled";
        selectStatus.disabled = "disabled";
    }

    allProducts = getServiceRequest('/product/withoutsupply/' + supplier.id);
    fillDataIntoSelect(selectAllProducts, "" ,allProducts,"name");

    fillDataIntoSelect(selectSelectedProducts, "" ,supplier.supplierItemList,"name");

    // supplier = JSON.parse(JSON.stringify(ob));
    // oldSupplier = JSON.parse(JSON.stringify(ob));

    $("#modalSupplierForm").modal("show");
    $("#modalSupplierFormLabel").text(ob.name);
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
        let deleteResponce = getHTTPServiceRequest("/supplier/delete", "DELETE", ob);
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
            +"<h6 class='mb-4'>Details</h6>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Reg No </th><td>"+ ob.reg_no +"</td></tr>" 
                +"<tr><th> BRN </th><td>"+ ob.name +"</td></tr>" 
                +"<tr><th> Name </th><td>"+ ob.supplier_brn +"</td></tr>" 
                +"<tr><th> Email </th><td>"+ ob.email +"</td></tr>" 
                +"<tr><th> Mobile Number </th><td>"+ ob.mobile_no +"</td></tr>" 
                +"<tr><th> Address </th><td>"+ ob.address +"</td></tr>"
                +"<tr><th> Bank </th><td>"+ ob.bank +"</td></tr>"
                +"<tr><th> Branch </th><td>"+ ob.branch +"</td></tr>" 
                +"<tr><th> Account No </th><td>"+ ob.account_no +"</td></tr>" 
                +"<tr><th> Supplier Status </th><td>"+ ob.supplier_status_id.name +"</td></tr>" 
            +"</tbody>" 
            +"</table>"  
            + "<h6 class='mt-4'>Products</h6>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Supply Products </th><td>"+ selectSelectedProducts.innerHTML +"</td></tr>" 
            +"</tbody>"
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
    if (supplier.name == null) {
        errors = errors + "Please Enter BRN\n"
    }
    if (supplier.supplier_brn == null) {
        errors = errors + "Please Enter Name\n"
    }
    if (supplier.email == null) {
        errors = errors + "Please Enter Email\n"
    }
    if (supplier.mobile_no == null) {
        errors = errors + "Please Enter Mobile Number\n"
    }
    if (supplier.address == null) {
        errors = errors + "Please Enter Address\n"
    }
    if (supplier.bank == null) {
        errors = errors + "Please Enter Bank\n"
    }
    if (supplier.branch == null) {
        errors = errors + "Please Enter Branch\n"
    }
    if (supplier.account_no == null) {
        errors = errors + "Please Enter Account No\n"
    }
    if (supplier.supplier_status_id == null) {
        errors = errors + "Please Enter Supplier Status\n"
    }
    return errors;
}

const buttonSupplierSubmit = () => {
    console.log(supplier);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ supplier.name +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/supplier/insert", "POST", supplier);
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
        if (supplier.name != oldSupplier.name) {
            updates = updates + "Name - " + oldSupplier.name + " to " + supplier.name + "\n";
        }
        if (supplier.supplier_brn != oldSupplier.supplier_brn) {
            updates = updates + "BRN - " + oldSupplier.supplier_brn + " to " + supplier.supplier_brn + "\n";
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
        if (supplier.bank != oldSupplier.bank) {
            updates = updates + "Bank - " + oldSupplier.bank + " to " + supplier.bank + "\n";
        }
        if (supplier.branch != oldSupplier.branch) {
            updates = updates + "Branch - " + oldSupplier.branch + " to " + supplier.branch + "\n";
        }
        if (supplier.account_no != oldSupplier.account_no) {
            updates = updates + "Account No - " + oldSupplier.account_no + " to " + supplier.account_no + "\n";
        }
        if (supplier.supplier_status_id.name != oldSupplier.supplier_status_id.name) {
            updates = updates + "Supplier Status - " + oldSupplier.supplier_status_id.name + " to " + supplier.supplier_status_id.name + "\n";
        }
        if (supplier.supplierItemList.map(product=>product.id).sort().toString() !== oldSupplier.supplierItemList.map(product=>product.id).sort().toString()) {
            updates = updates + "Selected Products - updated\n";
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
                let putResponce = getHTTPServiceRequest("/supplier/update", "PUT", supplier);
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

// List transfer ***************************************************************************************************************************************************************************************
const addProduct = () =>{

    if (selectAllProducts.value != "") {
        let selectedProduct = JSON.parse(selectAllProducts.value);
        supplier.supplierItemList.push(selectedProduct);
        fillDataIntoSelect(selectSelectedProducts,"",supplier.supplierItemList,"name");

        let extIndex =  allProducts.map(product=>product.id).indexOf(selectedProduct.id);
        if (extIndex != -1) {
            allProducts.splice(extIndex, 1)
        }
        fillDataIntoSelect(selectAllProducts,"",allProducts,"name");
    } else {
        window.alert("Please select product")
    }

}

const removeProduct = () =>{

    if (selectSelectedProducts.value != "") {
        let selectedProduct = JSON.parse(selectSelectedProducts.value);
        allProducts.push(selectedProduct);
        fillDataIntoSelect(selectAllProducts,"",allProducts,"name");
        

        let extIndex =  supplier.supplierItemList.map(product=>product.id).indexOf(selectedProduct.id);
        if (extIndex != -1) {
            supplier.supplierItemList.splice(extIndex, 1)
        }
        fillDataIntoSelect(selectSelectedProducts,"",supplier.supplierItemList,"name");
    } else {
        window.alert("Please select product")
    }
    
}

