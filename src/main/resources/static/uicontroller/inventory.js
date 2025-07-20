window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshInventoryTable();
    refreshInventoryForm();
});


//table *********************************************************************************************************************************************************************************************
const refreshInventoryTable = () => {
    let inventorys = [
        { id: 1, availableqty: 15, totalqty: 150, saleprice: "66.27", expiredate: "2025-03-12", manufacturedate: "2025-03-12", batchno: "654684849", grn_id: { id: 1, grnno: "GRN001", invoicenumber: "INV001", receiveddate: "2025-03-12", totalamount: 150.75, discountrate: "66.27%", netamount: 50.75, note: "Note 1", order_id: { id: 1, orderno: "PO001" }, status_id: { id: 1, name: "Active" }}, product_id: { id: 1, name: "Munchi busicut" }, status_id: { id: 1, name: "Active" }},
        { id: 2, availableqty: 20, totalqty: 200, saleprice: "75.00", expiredate: "2025-03-11", manufacturedate: "2025-03-11", batchno: "316486484", grn_id: { id: 2, grnno: "GRN002", invoicenumber: "INV002", receiveddate: "2025-03-11", totalamount: 200.50, discountrate: "100%", netamount: 0.00, note: "Note 2", order_id: { id: 2, orderno: "PO002" }, status_id: { id: 2, name: "Received" } }, product_id: { id: 2, name: "Cake" }, status_id: { id: 2, name: "Received" }},
        { id: 3, availableqty: 50, totalqty: 500, saleprice: "90.00", expiredate: "2025-03-10", manufacturedate: "2025-03-10", batchno: "654686546", grn_id: { id: 3, grnno: "GRN003", invoicenumber: "INV003", receiveddate: "2025-03-10", totalamount: 500.00, discountrate: "90%", netamount: 50.00, note: "Note 3", order_id: { id: 3, orderno: "PO003" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 3, name: "Meat" }, status_id: { id: 1, name: "Active" }},
        { id: 4, availableqty: 32, totalqty: 320, saleprice: "62.44", expiredate: "2025-03-09", manufacturedate: "2025-03-09", batchno: "6516865", grn_id: { id: 4, grnno: "GRN004", invoicenumber: "INV004", receiveddate: "2025-03-09", totalamount: 320.25, discountrate: "62.44%", netamount: 120.25, note: "Note 4", order_id: { id: 4, orderno: "PO004" }, status_id: { id: 2, name: "Received" } }, product_id: { id: 4, name: "Oil" }, status_id: { id: 2, name: "Received" }},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }}
      ];
    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: getProductNo, dataType: "function"},
        {propertyName: "saleprice", dataType: "string"},
        {propertyName: "availableqty", dataType: "string"},
        {propertyName: "totalqty", dataType: "string"},
        {propertyName: "expiredate", dataType: "string"},
        {propertyName: "manufacturedate", dataType: "string"},
        {propertyName: "batchno", dataType: "string"},
        {propertyName: getGrnNo, dataType: "function"},
        {propertyName: getStatus, dataType: "function"},
    ];

    fillDataIntoTable(tableInventoryBody, inventorys, propertyList, inventoryFormRefill);
}

const getGrnNo = (dataOb) => {
    return dataOb.grn_id.grnno;
}

const getProductNo = (dataOb) => {
    return dataOb.product_id.name;
}

const getStatus = (dataOb) => {
    if (dataOb.status_id.name == "Active") {
        return "<p class='badge bg-warning text-dark w-100 my-auto'>" + dataOb.status_id.name + "</p>";
    } if (dataOb.status_id.name == "Received") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.status_id.name + "</p>";
    }
}

//form *********************************************************************************************************************************************************************************************
const refreshInventoryForm = () => {
    inventory = new Object();

    formInventory.reset();

    setDefault([selectProduct, textSalePrice, textAvailableQty, textTotalQty, textExpireDate, textManufactureDate, textBatchNo, selectGRN, selectStatus]);

    let products = [
        {id:1, name:"Munchi busicut"},
        {id:2, name:"Cake"},
        {id:3, name:"Meat"},
        {id:4, name:"Oil"},
        {id:5, name:"Gas"},
    ];
    
    fillDataIntoSelect(selectProduct,"Select Product",products,"name");

    let grns = [
        {id:1, grnno:"GRN001"},
        {id:2, grnno:"GRN002"},
        {id:3, grnno:"GRN003"},
        {id:4, grnno:"GRN004"},
        {id:5, grnno:"GRN005"},
    ];

    fillDataIntoSelect(selectGRN,"Select GRN",grns,"grnno");

    let status = [
        {id:1, name:"Active"},
        {id:2, name:"Received"},
    ];

    fillDataIntoSelect(selectStatus,"Select Status",status,"name");
}

const inventoryFormRefill = (ob, index) => {
    refreshInventoryForm();
    console.log("Edit", ob, index);

    selectProduct.value = JSON.stringify(ob.product_id);
    textSalePrice.value = ob.saleprice;
    textAvailableQty.value = ob.availableqty;
    textTotalQty.value = ob.totalqty;
    textExpireDate.value = ob.expiredate;
    textManufactureDate.value = ob.manufacturedate;
    textBatchNo.value = ob.batchno;
    selectGRN.value = JSON.stringify(ob.grn_id);
    selectStatus.value = JSON.stringify(ob.status_id);

    inventory = JSON.parse(JSON.stringify(ob));
    oldInventory = JSON.parse(JSON.stringify(ob));

    $("#modalInventoryForm").modal("show");
    $("#modalInventoryFormLabel").text(ob.product_id.name);
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
        let deleteResponce = "OK";
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
            +"<h5 class='mb-4'>"+ ob.product_id.name + " Details</h5>"
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
    if (inventory.product_id == null) {
        errors = errors + "Please Enter Product\n"
    }
    if (inventory.saleprice == null) {
        errors = errors + "Please Enter Sale Price\n"
    }
    if (inventory.availableqty == null) {
        errors = errors + "Please Enter Available QTY\n"
    }
    if (inventory.totalqty == null) {
        errors = errors + "Please Enter Total QTY\n"
    }
    if (inventory.expiredate == null) {
        errors = errors + "Please Enter Expire Date\n"
    }
    if (inventory.manufacturedate == null) {
        errors = errors + "Please Enter Manufacture Date\n"
    }
    if (inventory.batchno == null) {
        errors = errors + "Please Enter Batch Number\n"
    }
    if (inventory.grn_id == null) {
        errors = errors + "Please Enter GRN No\n"
    }
    if (inventory.status_id == null) {
        errors = errors + "Please Enter Status ID\n"
    }
    return errors;
}

const buttonInventorySubmit = () => {
    console.log(inventory);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ inventory.product_id.name +"?");
        if (userConfirm == true) {
            let postResponce = "OK";
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
                let putResponce = "OK";
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