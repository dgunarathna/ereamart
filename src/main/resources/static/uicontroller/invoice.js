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
        {propertyName: "invoice_code", dataType: "string"},
        {propertyName: getCustomer, dataType: "function"},
        {propertyName: "total_amount", dataType: "decimal"},
        {propertyName: "discount_amount", dataType: "string"},
        {propertyName: "net_amount", dataType: "decimal"},
        {propertyName: getStatus, dataType: "function"},
    ];

    fillDataIntoTable(tableInvoiceBody, invoices, propertyList, invoiceFormRefill);
}

const getCustomer = (dataOb) => {
    return dataOb.customer_id.fullname;
}

const getStatus = (dataOb) => {
    if (dataOb.invoice_status_id.name == "Complete") {
        return "<p class='badge bg-success text-light w-100 my-auto'>" + dataOb.invoice_status_id.name + "</p>";
    } if (dataOb.invoice_status_id.name == "Delete") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.invoice_status_id.name + "</p>";
    }
}

//form *********************************************************************************************************************************************************************************************

const refreshInvoiceForm = () => {
    invoice = new Object();
    invoice.invoiceHasItemList = new Array();

    formInvoice.reset();

    setDefault([ selectCustomer, textTotalAmount, textDisountAmount, textNetAmount, selectStatus]);

    let customers = getServiceRequest('/customer/alldata');
    fillDataIntoSelect(selectCustomer,"Select customer",customers,"fullname");

    let status = getServiceRequest('/invoicestatus/alldata');
    fillDataIntoSelect(selectStatus,"Select status",status,"name");
    

    //inner form ************************************
    refreshinvoiceInnerForm();

}

const invoiceFormRefill = (ob, index) => {
    refreshInvoiceForm();
    console.log("Edit", ob, index);

    selectCustomer.value = JSON.stringify(ob.customer_id);
    selectStatus.value = JSON.stringify(ob.invoice_status_id);
    textTotalAmount.value = ob.total_amount;
    textDisountAmount.value = ob.discount_amount;
    textNetAmount.value = ob.net_amount;

    invoice = JSON.parse(JSON.stringify(ob));
    oldInvoice = JSON.parse(JSON.stringify(ob));

    $("#modalInvoiceForm").modal("show");
    $("#modalInvoiceFormLabel").text(ob.invoice_code);
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
        let deleteResponce  = getHTTPServiceRequest("/invoice/delete", "DELETE", ob);
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
    if (invoice.customer_id == null) {
        errors = errors + "Please Enter Customer\n"
    }
    if (invoice.total_amount == null) {
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
            let postResponce = getHTTPServiceRequest("/invoice/insert", "POST", invoice);
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
        if (invoice.total_amount != oldInvoice.total_amount) {
            updates = updates + "Total Amount - " + oldInvoice.total_amount + " to " + invoice.total_amount + "\n";
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
                let putResponce = getHTTPServiceRequest("/invoice/update", "PUT", invoice);
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

// function for check item ext in the inner table
const checkProductExt = () => {
    let selectedProduct = JSON.parse(selectItem.value);
    let extIndex = invoice.invoiceHasItemList.map(oproduct=>oproduct.product_id.id).indexOf(selectedProduct.id);

    if (extIndex > -1) {
        window.alert(" Product Added already");
        refreshinvoiceInnerForm();
    } else {
        textUnitPrice.value = parseFloat(selectedProduct.price).toFixed(2);
        orderHasProduct.unitPrice = parseFloat(textUnitPrice.value).toFixed(2);
        textUnitPrice.style.border = "1px solid lightgreen"
    }
}

//define function for line price
const calculateLinePrice = ()=> {
    if (textQTY.value > 0) {
        let lineprice = (parseFloat(textQTY.value)* parseFloat(textUnitPrice.value)).toFixed(2);
        orderHasProduct.lineprice = lineprice;
        textLinePrice.value = lineprice;
        textLinePrice.style.border = "1px solid lightgreen"
    } else {
        orderHasProduct.unitPrice = null;
        orderHasProduct.lineprice = null;
        textQTY.style.border = "1px solid pink";
        textLinePrice.style.border = "1px solid #ced4da";
        textLinePrice.value = "";
    }
}


const refreshinvoiceInnerForm = () =>{
    orderHasProduct = new Object();

    selectItem.disabled = "";

    textUnitPrice.value = "";
    textUnitPrice.disabled = "disabled";
    textQTY.value = "";
    textLinePrice.value = "";
    textLinePrice.disabled = "disabled";


    setDefault([selectItem, textUnitPrice, textQTY, textLinePrice]);
 
    selectItems = getServiceRequest('/product/alldata');       
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 


    //refresh inner table ****************************************************************************************************************************************************************************   

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: getProductName, dataType: "function"},
        {propertyName: "quantity", dataType: "string"},
        {propertyName: "unitPrice", dataType: "decimal"},
        {propertyName: "lineprice", dataType: "decimal"}
    ];

    fillDataIntoInnerTable(tableInvoiceItemBody, invoice.invoiceHasItemList, propertyList, orderInnerFormRefill, orderInnerFormDelete);


    //auto load total amount
    let totalAmount = 0.00;
    for (const orderproduct of invoice.invoiceHasItemList) {
        totalAmount = parseFloat (totalAmount) + parseFloat(orderproduct.lineprice);
    };

    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        invoice.total_amount = textTotalAmount.value;
        textTotalAmount.style.border = "1px solid lightgreen"
    };

    $("#buttonItemSubmit").show();
    $("#buttonItemUpdate").hide();

}

const getProductName = (dataOb) => {  
    return dataOb.product_id.name;
}

const orderInnerFormRefill = (ob, index) =>{

    refreshinvoiceInnerForm();
    console.log("Edit", ob, index);
    

    innerFormIndex = index;

    orderHasProduct = JSON.parse(JSON.stringify(ob));
    oldOlorderHasProduct = JSON.parse(JSON.stringify(ob));


    selectItems = getServiceRequest('/product/alldata');
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 

    selectItem.disabled = "disabled";
    selectItem.value = JSON.stringify(orderHasProduct.product_id)
    textUnitPrice.value = parseFloat(orderHasProduct.unitPrice);
    textQTY.value = orderHasProduct.quantity;
    textLinePrice.value = parseFloat(orderHasProduct.lineprice);

    $("#buttonItemSubmit").hide();
    $("#buttonItemUpdate").show();
}

const orderInnerFormDelete = (ob, index) => {
    console.log(orderHasProduct);

    let userConfirm = window.confirm("Are you sure to remove " + ob.product_id.name + "?");
    if (userConfirm) {
        let extIndex = invoice.invoiceHasItemList.map(orderproduct=>orderproduct.product_id.id).indexOf(ob.product_id.id);
        if (extIndex != -1) {
            invoice.invoiceHasItemList.splice(extIndex,1);
        }
        refreshinvoiceInnerForm();
    }
}

const buttonInvoiceItemSubmit = () => {
    console.log(orderHasProduct);

    invoice.invoiceHasItemList.push(orderHasProduct);
    refreshinvoiceInnerForm();
}

const buttonInvoiceItemUpdate = () => {
    console.log(orderHasProduct);

    if (orderHasProduct.quantity != oldOlorderHasProduct.quantity) {
        invoice.invoiceHasItemList[innerFormIndex] = orderHasProduct;
        refreshinvoiceInnerForm();
    }

}




