window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshInventoryTable();
    refreshInventoryForm();
});


//table *********************************************************************************************************************************************************************************************
const refreshInventoryTable = () => {

    let inventorys = getServiceRequest('/inventory/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "inventory_code", dataType: "string"},
        {propertyName: getProductName, dataType: "function"},
        {propertyName: getGrnNo, dataType: "function"},
        {propertyName: "sales_price", dataType: "string"},
        {propertyName: "available_qty", dataType: "string"},
        {propertyName: "total_qty", dataType: "string"},
        {propertyName: "expire_date", dataType: "string"},
        {propertyName: "manufacture_date", dataType: "string"},
        {propertyName: "batch_number", dataType: "string"},
        {propertyName: getStatus, dataType: "function"},
    ];

    fillDataIntoTable(tableInventoryBody, inventorys, propertyList, inventoryFormRefill);
}

const getGrnNo = (dataOb) => {
    return dataOb.grn_id.grn_no;
}

const getProductName = (dataOb) => {
    return dataOb.product_id.name;
}

const getStatus = (dataOb) => {
    if (dataOb.inventory_status_id.name == "In stock") {
        return "<p class='badge bg-success text-light w-100 my-auto'>" + dataOb.inventory_status_id.name + "</p>";
    } if (dataOb.inventory_status_id.name == "Out of stock") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.inventory_status_id.name + "</p>";
    }
}

//form *********************************************************************************************************************************************************************************************

// filter products by order dropdown
const filterProductByGRN = () => {
    let selectItems = getServiceRequest('/product/bygrncode/' + JSON.parse(selectGRN.value).id);
    fillDataIntoSelect(selectProduct,"Select Product",selectItems,"name");   
}

const refreshInventoryForm = () => {
    inventory = new Object();

    formInventory.reset();

    setDefault([selectProduct, textSalePrice, textAvailableQty, textTotalQty, textExpireDate, textManufactureDate, textBatchNo, selectGRN, selectStatus]);

    let grns = getServiceRequest('/grn/alldata');
    fillDataIntoSelect(selectGRN,"Select GRN",grns,"grn_no");
    
    let selectItems = [];
    if (selectGRN.value != "") {
        selectItems = getServiceRequest('/product/bygrncode/' + JSON.parse(selectGRN.value).id);
    } else {
        selectItems = getServiceRequest('/product/alldata');
    }  
    fillDataIntoSelect(selectProduct,"Select Product",selectItems,"name");

    let status = getServiceRequest('/inventorystatus/alldata');
    fillDataIntoSelect(selectStatus,"Select status",status,"name");
    selectStatus.value = JSON.stringify(status[0]); // set default values
    inventory.inventory_status_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen";
}

const inventoryFormRefill = (ob, index) => {
    refreshInventoryForm();
    console.log("Edit", ob, index);

    selectProduct.value = JSON.stringify(ob.product_id);
    textSalePrice.value = ob.sales_price;
    textAvailableQty.value = ob.available_qty;
    textTotalQty.value = ob.total_qty;
    textExpireDate.value = ob.expire_date;
    textManufactureDate.value = ob.manufacture_date;
    textBatchNo.value = ob.batch_number;
    selectGRN.value = JSON.stringify(ob.grn_id);
    selectStatus.value = JSON.stringify(ob.inventory_status_id);

    inventory = JSON.parse(JSON.stringify(ob));
    oldInventory = JSON.parse(JSON.stringify(ob));

    $("#modalInventoryForm").modal("show");
    $("#modalInventoryFormLabel").text(ob.inventory_code);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}

const buttonInventoryDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.product_id.name + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/inventory/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshInventoryTable();
            $("#modalInventoryForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonInventoryPrint = (ob, index) => {
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
                +"<tr><th> Product </th><td>"+ ob.product_id.name +"</td></tr>" 
                +"<tr><th> Sale Price </th><td>"+ ob.saleprice +"</td></tr>" 
                +"<tr><th> Available QTY </th><td>"+ ob.availableqty +"</td></tr>" 
                +"<tr><th> Total QTY </th><td>"+ ob.totalqty +"</td></tr>" 
                +"<tr><th> Expire Date </th><td>"+ ob.expiredate +"</td></tr>" 
                +"<tr><th> Manufacture Date </th><td>"+ ob.manufacturedate +"</td></tr>" 
                +"<tr><th> Batch Number </th><td>"+ ob.batchno +"</td></tr>" 
                +"<tr><th> GRN No </th><td>"+ ob.grn_id.grnno +"</td></tr>" 
                +"<tr><th> Status ID </th><td>"+ ob.status_id.name +"</td></tr>" 
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalInventoryForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (inventory.sales_price == null) {
        errors = errors + "Please Enter Sale Price\n"
    }
    if (inventory.total_qty == null) {
        errors = errors + "Please Enter Total QTY\n"
    }
    if (inventory.expire_date == null) {
        errors = errors + "Please Enter Expire Date\n"
    }
    if (inventory.manufacture_date == null) {
        errors = errors + "Please Enter Manufacture Date\n"
    }
    if (inventory.batch_number == null) {
        errors = errors + "Please Enter Batch Number\n"
    }
    if (inventory.grn_id == null) {
        errors = errors + "Please Enter GRN No\n"
    }
    if (inventory.inventory_status_id == null) {
        errors = errors + "Please Enter Status ID\n"
    }
    return errors;
}

const buttonInventorySubmit = () => {
    console.log(inventory);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/inventory/insert", "POST", inventory);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshInventoryTable();
                refreshInventoryForm();
                $("#modalInventoryForm").modal("hide");
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

    console.log(inventory);
    console.log(oldInventory);
    
    if (inventory != null && oldInventory !== null) {
        if (inventory.product_id.name != oldInventory.product_id.name) {
            updates = updates + "Product - " + oldInventory.product_id.name + " to " + inventory.product_id.name + "\n";
        }
        if (inventory.saleprice != oldInventory.saleprice) {
            updates = updates + "Sale Price - " + oldInventory.saleprice + " to " + inventory.saleprice + "\n";
        }
        if (inventory.availableqty != oldInventory.availableqty) {
            updates = updates + "Available QTY - " + oldInventory.availableqty + " to " + inventory.availableqty + "\n";
        }
        if (inventory.totalqty != oldInventory.totalqty) {
            updates = updates + "Total QTY - " + oldInventory.totalqty + " to " + inventory.totalqty + "\n";
        }
        if (inventory.expiredate != oldInventory.expiredate) {
            updates = updates + "Expire Date - " + oldInventory.expiredate + " to " + inventory.expiredate + "\n";
        }
        if (inventory.manufacturedate != oldInventory.manufacturedate) {
            updates = updates + "Manufacture Date - " + oldInventory.manufacturedate + " to " + inventory.manufacturedate + "\n";
        }
        if (inventory.batchno != oldInventory.batchno) {
            updates = updates + "Batch Number - " + oldInventory.batchno + " to " + inventory.batchno + "\n";
        }
        if (inventory.grn_id.grnno != oldInventory.grn_id.grnno) {
            updates = updates + "GRN No - " + oldInventory.grn_id.grnno + " to " + inventory.grn_id.grnno + "\n";
        }
        if (inventory.status_id.name != oldInventory.status_id.name) {
            updates = updates + "Status ID - " + oldInventory.status_id.name + " to " + inventory.status_id.name + "\n";
        }
    }
    return updates;
}

const buttonInventoryUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ inventory.product_id.name +"?\n" +updates);
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/inventory/update", "PUT", inventory);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshInventoryTable();
                    refreshInventoryForm();
                    $("#modalInventoryForm").modal("hide");
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
    refreshInventoryForm();
    $("#modalInventoryFormLabel").text("Add New Inventory");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}