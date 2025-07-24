window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshInvoiceTable();
    refreshInvoiceForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshInvoiceTable = () => {

    let invoices = getServiceRequest('/invoice/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "invoiceno", dataType: "string"},
        {propertyName: getCustomer, dataType: "function"},
        {propertyName: "totalamount", dataType: "string"},
        {propertyName: "discountamount", dataType: "string"},
        {propertyName: "netamount", dataType: "string"},
    ];

    fillDataIntoTable(tableInvoiceBody, invoices, propertyList, invoiceFormRefill);
}

const getCustomer = (dataOb) => {
    return dataOb.customer_id.fullname;
}

//form *********************************************************************************************************************************************************************************************

const refreshInvoiceForm = () => {
    invoice = new Object();
    invoice.invoiceHasItemList = new Array();

    formInvoice.reset();

    setDefault([textInvoiceNo, selectCustomer, textTotalAmount, textDisountAmount, textNetAmount]);

    let customers = [
        {id:1, name:"Jane Smith"},
        {id:2, name:"John Doe"},
        {id:3, name:"Emma Brown"},
        {id:4, name:"Michael Le"},
        {id:5, name:"Sophia White"},
    ];
    
    fillDataIntoSelect(selectCustomer,"Select customer",customers,"name");

    //inner form ************************************
    refreshinvoiceInnerForm();

}

const invoiceFormRefill = (ob, index) => {
    refreshInvoiceForm();
    console.log("Edit", ob, index);

    textInvoiceNo.value = ob.invoiceno;
    selectCustomer.value = JSON.stringify(ob.customer_id);
    textTotalAmount.value = ob.totalamount;
    textDisountAmount.value = ob.discountamount;
    textNetAmount.value = ob.netamount;

    invoice = JSON.parse(JSON.stringify(ob));
    oldInvoice = JSON.parse(JSON.stringify(ob));

    $("#modalInvoiceForm").modal("show");
    $("#modalInvoiceFormLabel").text(ob.invoiceno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}


const buttonInvoiceDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.invoiceno + "?");
    if (userConfirm == true) {
        let deleteResponce = "OK";
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshInvoiceTable();
            $("#modalInvoiceForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonInvoicePrint = (ob, index) => {
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
            +"<h5 class='mb-4'>"+ ob.invoiceno + " Details</h5>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Invoice no </th><td>"+ ob.invoiceno +"</td></tr>" 
                +"<tr><th> Customer </th><td>"+ ob.customer_id.fullname +"</td></tr>" 
                +"<tr><th> Total Amount </th><td>"+ ob.totalamount +"</td></tr>" 
                +"<tr><th> Discount Amount </th><td>"+ ob.discountamount +"</td></tr>" 
                +"<tr><th> Net Amount </th><td>"+ ob.netamount +"</td></tr>" 
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalInvoiceForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (invoice.invoiceno == null) {
        errors = errors + "Please Enter Invoice no\n"
    }
    if (invoice.customer_id == null) {
        errors = errors + "Please Enter Customer\n"
    }
    if (invoice.totalamount == null) {
        errors = errors + "Please Enter Total Amount\n"
    }
    if (invoice.discountamount == null) {
        errors = errors + "Please Enter Discount Amount\n"
    }
    if (invoice.netamount == null) {
        errors = errors + "Please Enter Net Amount\n"
    }
    return errors;
}

const buttonInvoiceSubmit = () => {
    console.log(invoice);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ invoice.invoiceno +"?");
        if (userConfirm == true) {
            let postResponce = "OK";
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshInvoiceTable();
                refreshInvoiceForm();
                $("#modalInvoiceForm").modal("hide");
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

    console.log(invoice);
    console.log(oldInvoice);
    
    if (invoice != null && oldInvoice !== null) {
        if (invoice.invoiceno != oldInvoice.invoiceno) {
            updates = updates + "Invoice no - " + oldInvoice.invoiceno + " to " + invoice.invoiceno + "\n";
        }
        if (invoice.customer_id.name != oldInvoice.customer_id.name) {
            updates = updates + "Customer - " + oldInvoice.customer_id.fullname + " to " + invoice.customer_id.name + "\n";
        }
        if (invoice.totalamount != oldInvoice.totalamount) {
            updates = updates + "Total Amount - " + oldInvoice.totalamount + " to " + invoice.totalamount + "\n";
        }
        if (invoice.discountamount != oldInvoice.discountamount) {
            updates = updates + "Discount Amount - " + oldInvoice.discountamount + " to " + invoice.discountamount + "\n";
        }
        if (invoice.netamount != oldInvoice.netamount) {
            updates = updates + "Net Amount - " + oldInvoice.netamount + " to " + invoice.netamount + "\n";
        }
    }
    return updates;
}

const buttonInvoiceUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ invoice.invoiceno +"?\n" + updates);
            if (userConfirm) {
                let putResponce = "OK";
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshInvoiceTable();
                    refreshInvoiceForm();
                    $("#modalInvoiceForm").modal("hide");
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
    refreshInvoiceForm();
    $("#modalInvoiceFormLabel").text("Add New Invoice");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}

// inner form ***************************************************************************************************************************************************************************************