window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshGRNTable();
    refreshGRNForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshGRNTable = () => {
    let grns = [
        { id: 1, grnno: "GRN001", invoiceno: "INV001", receiveddate: "2025-03-12", totalamount: 150.75, discountrate: "66.27%", netamount: 50.75, note: "Note 1", order_id: { id: 1, orderno: "O001" }, status_id: { id: 1, name: "Active" } },
        { id: 2, grnno: "GRN002", invoiceno: "INV002", receiveddate: "2025-03-11", totalamount: 200.50, discountrate: "100%", netamount: 0.00, note: "Note 2", order_id: { id: 2, orderno: "O002" }, status_id: { id: 2, name: "Received" } },
        { id: 3, grnno: "GRN003", invoiceno: "INV003", receiveddate: "2025-03-10", totalamount: 500.00, discountrate: "90%", netamount: 50.00, note: "Note 3", order_id: { id: 3, orderno: "O003" }, status_id: { id: 1, name: "Active" } },
        { id: 4, grnno: "GRN004", invoiceno: "INV004", receiveddate: "2025-03-09", totalamount: 320.25, discountrate: "62.44%", netamount: 120.25, note: "Note 4", order_id: { id: 4, orderno: "O004" }, status_id: { id: 2, name: "Received" } },
        { id: 5, grnno: "GRN005", invoiceno: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "O005" }, status_id: { id: 1, name: "Active" } }
      ];
    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "grnno", dataType: "string"},
        {propertyName: getOrder_id, dataType: "function"},
        {propertyName: "invoiceno", dataType: "string"},
        {propertyName: "receiveddate", dataType: "string"},
        {propertyName: "totalamount", dataType: "string"},
        {propertyName: "discountrate", dataType: "string"},
        {propertyName: "netamount", dataType: "string"},
        {propertyName: "note", dataType: "string"},
        {propertyName: getGRNStatus, dataType: "function"},
    ];

    fillDataIntoTable(tableGRNBody, grns, propertyList, grnFormRefill);
}

const getOrder_id = (dataOb) => {
    return dataOb.order_id.orderno;
}

const getGRNStatus = (dataOb) => {
    if (dataOb.status_id.name == "Active") {
        return "<p class='badge bg-warning text-dark w-100 my-auto'>" + dataOb.status_id.name + "</p>";
    } if (dataOb.status_id.name == "Received") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.status_id.name + "</p>";
    }
}

//form *********************************************************************************************************************************************************************************************
const refreshGRNForm = () => {
    grn = new Object();
    grn.grnHasItemList = new Array();

    formGRN.reset();

    setDefault([textGRN, textInvoiceNo, selectOrder, textTotalAmount, textDiscountRate, textNetAmount, textNote, textReceivedDate, selectStatus]);

    let orders = [
        {id:1, orderno:"O001"},
        {id:2, orderno:"O002"},
        {id:3, orderno:"O003"},
        {id:4, orderno:"O004"},
        {id:5, orderno:"O005"},
    ];
    
    fillDataIntoSelect(selectOrder,"Select order no",orders,"orderno");

    let grnStatus = [
        {id:1, name:"Active"},
        {id:2, name:"Received"},
    ];

    fillDataIntoSelect(selectStatus,"Select Status",grnStatus,"name");

    //inner form ************************************
    refreshGRNInnerForm();
}

const grnFormRefill = (ob, index) => {
    refreshGRNForm();
    console.log("Edit", ob, index);

    textGRN.value = ob.grnno;
    textInvoiceNo.value = ob.invoiceno;
    selectOrder.value = JSON.stringify(ob.order_id);
    textTotalAmount.value = ob.totalamount;
    textDiscountRate.value = ob.discountrate;
    textNetAmount.value = ob.netamount;
    textNote.value = ob.note;
    textReceivedDate.value = ob.receiveddate;
    selectStatus.value = JSON.stringify(ob.status_id);

    grn = JSON.parse(JSON.stringify(ob));
    oldGrn = JSON.parse(JSON.stringify(ob));

    $("#modalGRNForm").modal("show");
    $("#modalGRNFormLabel").text(ob.grnno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}


const buttonGRNDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.grnno + "?");
    if (userConfirm == true) {
        let deleteResponce = "OK";
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshGRNTable();
            $("#modalGRNForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonGRNPrint = (ob, index) => {
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
                +"<tr><th> GRN No </th><td>"+ ob.grnno +"</td></tr>" 
                +"<tr><th> Order no </th><td>"+ ob.order_id.orderno +"</td></tr>" 
                +"<tr><th> Supplier Invoice Number </th><td>"+ ob.invoiceno +"</td></tr>" 
                +"<tr><th> Total Amount </th><td>"+ ob.totalamount +"</td></tr>" 
                +"<tr><th> Discount Rate </th><td>"+ ob.discountrate +"</td></tr>" 
                +"<tr><th> Net Amount</th><td>"+ ob.netamount +"</td></tr>" 
                +"<tr><th> Note </th><td>"+ ob.note +"</td></tr>" 
                +"<tr><th> Received Date </th><td>"+ ob.receiveddate +"</td></tr>" 
                +"<tr><th> Status </th><td>"+ ob.status_id.name +"</td></tr>" 
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalGRNForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (grn.grnno == null) {
        errors = errors + "Please Enter GRN no\n"
    }
    if (grn.order_id == null) {
        errors = errors + "Please Select Order no\n"
    }
    if (grn.invoiceno == null) {
        errors = errors + "Please Enter Invoice No\n"
    }
    if (grn.receiveddate == null) {
        errors = errors + "Please Enter Received date\n"
    }
    if (grn.totalamount == null) {
        errors = errors + "Please Enter Total Amount\n"
    }
    if (grn.discountrate == null) {
        errors = errors + "Please Enter Discount Rate\n"
    }
    if (grn.netamount == null) {
        errors = errors + "Please Enter Net amount\n"
    }
    if (grn.note == null) {
        errors = errors + "Please Enter Note\n"
    }
    if (grn.status_id == null) {
        errors = errors + "Please Select Status\n"
    }
    return errors;
}

const buttonGRNSubmit = () => {
    console.log(grn);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ grn.grnno +"?");
        if (userConfirm == true) {
            let postResponce = "OK";
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshGRNTable();
                refreshGRNForm();
                $("#modalGRNForm").modal("hide");
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

    console.log(grn);
    console.log(oldGrn);
    
    if (grn != null && oldGrn !== null) {
        if (grn.grnno != oldGrn.grnno) {
            updates = updates + "GRN no - " + oldGrn.grnno + " to " + grn.grnno + "\n";
        }
        if (grn.order_id.orderno != oldGrn.order_id.orderno) {
            updates = updates + "Order no - " + oldGrn.order_id.orderno + " to " + grn.order_id.orderno + "\n";
        }
        if (grn.invoiceno != oldGrn.invoiceno) {
            updates = updates + "Invoice No - " + oldGrn.invoiceno + " to " + grn.invoiceno + "\n";
        }
        if (grn.totalamount != oldGrn.totalamount) {
            updates = updates + "Total Amount - " + oldGrn.totalamount + " to " + grn.totalamount + "\n";
        }
        if (grn.discountrate != oldGrn.discountrate) {
            updates = updates + "Discount Rate - " + oldGrn.discountrate + " to " + grn.discountrate + "\n";
        }
        if (grn.netamount != oldGrn.netamount) {
            updates = updates + "Net amount - " + oldGrn.netamount + " to " + grn.netamount + "\n";
        }
        if (grn.note != oldGrn.note) {
            updates = updates + "Note - " + oldGrn.note + " to " + grn.note + "\n";
        }
        if (grn.receiveddate != oldGrn.receiveddate) {
            updates = updates + "Received date - " + oldGrn.receiveddate + " to " + grn.receiveddate + "\n";
        }
        if (grn.status_id.name != oldGrn.status_id.name) {
            updates = updates + "Status - " + oldGrn.status_id.name + " to " + grn.status_id.name + "\n";
        }
    }
    return updates;
}

const buttonGRNUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ grn.grnno +"?\n" + updates);
            if (userConfirm) {
                let putResponce = "OK";
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshGRNTable();
                    refreshGRNForm();
                    $("#modalGRNForm").modal("hide");
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
    refreshGRNForm();
    $("#modalgrnFormLabel").text("Add New grn");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}

// inner form ***************************************************************************************************************************************************************************************