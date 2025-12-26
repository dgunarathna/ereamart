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
    if (dataOb.customer_id == null) {
        return "Unregisted customer";
    } else {
        return dataOb.customer_id.fullname;
    }
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
    invoice.invoiceHasProductList = new Array();

    textTotalAmount.disabled = "disabled";
    textNetAmount.disabled = "disabled";
    textDisountAmount.disabled = "disabled";
    textUnitPrice.disabled = "disabled";
    textLinePrice.disabled = "disabled";
    
    
    textdiscount.disabled = "disabled";
    textDisountAmount.value = "";

    formInvoice.reset();

    setDefault([ selectCustomer, textTotalAmount, textDisountAmount, textNetAmount, selectStatus]);

    let customers = getServiceRequest('/customer/alldata');
    fillDataIntoSelect(selectCustomer,"Select customer",customers,"fullname");

    let status = getServiceRequest('/invoicestatus/alldata');
    fillDataIntoSelect(selectStatus,"Select status",status,"name");
    selectStatus.value = JSON.stringify(status[0]);
    invoice.invoice_status_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen"
    

    //inner form ************************************
    refreshinvoiceInnerForm();

}



const invoiceFormRefill = (ob, index) => {
    refreshInvoiceForm();
    console.log("Edit", ob, index);

    selectCustomer.value = JSON.stringify(ob.customer_id);
    textTotalAmount.value = ob.total_amount;
    textDisountAmount.value = ob.discount_amount;
    textNetAmount.value = ob.net_amount;
    selectStatus.value = JSON.stringify(ob.invoice_status_id);

    if (ob.invoice_status_id.name == "Delete") {
        buttonDelete.disabled = "disabled";
        buttonUpdate.disabled = "disabled";
        selectStatus.disabled = "disabled";
    }

    invoice = JSON.parse(JSON.stringify(ob));
    oldInvoice = JSON.parse(JSON.stringify(ob));

    $("#modalInvoiceForm").modal("show");
    $("#modalInvoiceFormLabel").text(ob.invoice_code);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();

    refreshinvoiceInnerForm();
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

    let printTable = tableInvoiceItem.cloneNode(true);
    printTable.querySelector('thead tr th:last-child').remove();
    printTable.querySelectorAll('tbody tr td:last-child').forEach(td => td.remove());

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
                +"<tr><th> Invoice code </th><td>"+ ob.invoice_code +"</td></tr>" 
                +"<tr><th> Customer </th><td>"+ ob.customer_id.fullname +"</td></tr>" 
                +"<tr><th> Total Amount </th><td>"+ ob.total_amount +"</td></tr>" 
                +"<tr><th> Discount Amount </th><td>"+ ob.discount_amount +"</td></tr>" 
                +"<tr><th> Net Amount </th><td>"+ ob.net_amount +"</td></tr>" 
                +"<tr><th> Status </th><td>"+ ob.invoice_status_id.name +"</td></tr>" 
            +"</tbody>" 
            +"</table>" 
            + "<h6 class='mt-4'>Products</h6>"
            + "<div class='mt-3'> "+ printTable.outerHTML +"</div>"
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
    if (invoice.total_amount == null) {
        errors = errors + "Please Enter Total Amount\n"
    }
    if (invoice.discount_amount == null) {
        errors = errors + "Please Enter Discount Amount\n"
    }
    if (invoice.net_amount == null) {
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
        if (oldInvoice.customer_id != null) {
            if (invoice.customer_id.name != oldInvoice.customer_id.name) {
                updates = updates + "Customer - " + oldInvoice.customer_id.fullname + " to " + invoice.customer_id.name + "\n";
            }
        }
        if (invoice.total_amount != oldInvoice.total_amount) {
            updates = updates + "Total Amount - " + oldInvoice.total_amount + " to " + invoice.total_amount + "\n";
        }
        if (invoice.discount_amount != oldInvoice.discount_amount) {
            updates = updates + "Discount Amount - " + oldInvoice.discount_amount + " to " + invoice.discount_amount + "\n";
        }
        if (invoice.netamount != oldInvoice.netamount) {
            updates = updates + "Net Amount - " + oldInvoice.netamount + " to " + invoice.netamount + "\n";
        }
        if (invoice.invoice_status_id.name != oldInvoice.invoice_status_id.name) {
            updates = updates + "Invoice Status - " + oldInvoice.invoice_status_id.name + " to " + invoice.invoice_status_id.name + "\n";
        }
        //check inner form updates
        if (invoice.invoiceHasProductList.length != oldInvoice.invoiceHasProductList.length) {
            updates = updates + "Products List changeged\n";
        } else {
            let equalCount = 0;
            for(const oldoproduct of oldInvoice.invoiceHasProductList){
                for(const newoproduct of invoice.invoiceHasProductList){
                    if (oldoproduct.product_id.id == newoproduct.product_id.id) {
                        equalCount = equalCount + 1;
                    }
                }
            }

            if (equalCount != invoice.invoiceHasProductList.length) {
                updates = updates + "Products List changeged\n";
            }else{
                for(const oldoproduct of oldInvoice.invoiceHasProductList){
                    for(const newoproduct of invoice.invoiceHasProductList){
                        if (oldoproduct.product_id.id == newoproduct.product_id.id && oldoproduct.quantity != newoproduct.quantity) {
                            updates = updates + "Products quantity changeged\n";
                            break;
                        }
                    }
                }
            }
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
    let extIndex = invoice.invoiceHasProductList.map(oproduct=>oproduct.product_id.id).indexOf(selectedProduct.id);
    let getsaleprice = getServiceRequest('/salesprice/byproduct/' + JSON.parse(selectItem.value).id);
    

    if (extIndex > -1) {
        window.alert(" Product Added already");
        refreshinvoiceInnerForm();
    } else {
        textUnitPrice.value = getsaleprice;
        invoiceHasProduct.unitprice = parseFloat(textUnitPrice.value).toFixed(2);
        textUnitPrice.style.border = "1px solid lightgreen";
    }
}




//define function for line price
const calculateLinePrice = ()=> {
    if (textQTY.value > 0) {
        let lineprice = (parseFloat(textQTY.value)* parseFloat(textUnitPrice.value)).toFixed(2);
        invoiceHasProduct.lineprice = lineprice;
        textLinePrice.value = lineprice;
        textLinePrice.style.border = "1px solid lightgreen"
    } else {
        invoiceHasProduct.unitprice = null;
        invoiceHasProduct.lineprice = null;
        textQTY.style.border = "1px solid pink";
        textLinePrice.style.border = "1px solid #ced4da";
        textLinePrice.value = "";
    }
}


const refreshinvoiceInnerForm = () =>{
    invoiceHasProduct = new Object();

    selectItem.disabled = "";

    textUnitPrice.value = "";
    // textUnitPrice.disabled = "disabled";
    textQTY.value = "";
    textdiscount.value = "";
    textLinePrice.value = "";
    // textLinePrice.disabled = "disabled";


    setDefault([selectItem, textUnitPrice, textQTY, textdiscount, textLinePrice]);
 
    getallproducts();

    //refresh inner table ****************************************************************************************************************************************************************************   

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: getProductName, dataType: "function"},
        {propertyName: "quantity", dataType: "string"},
        {propertyName: "unitprice", dataType: "decimal"},
        {propertyName: "discount", dataType: "string"},
        {propertyName: "lineprice", dataType: "decimal"},
    ];

    fillDataIntoInnerTable(tableInvoiceItemBody, invoice.invoiceHasProductList, propertyList, orderInnerFormRefill, orderInnerFormDelete);


    let totalAmount = 0.00;
    let netAmount = 0.00;
    let totalDiscountAmount  = 0.00;

    for (const orderproduct of invoice.invoiceHasProductList) {
        totalAmount = parseFloat (totalAmount) + parseFloat(orderproduct.unitprice) * parseFloat(orderproduct.quantity);
        netAmount = parseFloat (netAmount) + parseFloat(orderproduct.lineprice);
        totalDiscountAmount = totalAmount - netAmount;
    }
    
    //auto load total amount
    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        invoice.total_amount = textTotalAmount.value;
        textTotalAmount.style.border = "1px solid lightgreen"
    }
    //auto load net amount
    if (netAmount != 0.00) {
        textNetAmount.value = netAmount.toFixed(2);
        invoice.net_amount = textNetAmount.value;
        textNetAmount.style.border = "1px solid lightgreen"
    };
     //load discount amount
    if (totalDiscountAmount != 0.00) {
        textDisountAmount.value = totalDiscountAmount.toFixed(2);
        invoice.discount_amount = textDisountAmount.value;
        textDisountAmount.style.border = "1px solid lightgreen";
    }

    $("#buttonItemSubmit").show();
    $("#buttonItemUpdate").hide();

}



const getallproducts = () => {  
    selectItems = getServiceRequest('/product/byinventory');
    fillDataIntoSelect(selectItem, "Select Product", selectItems, "name"); 
}  

const getProductName = (dataOb) => {  
    return dataOb.product_id.name;
}

const orderInnerFormRefill = (ob, index) =>{

    refreshinvoiceInnerForm();
    console.log("Edit", ob, index);
    

    innerFormIndex = index;

    invoiceHasProduct = JSON.parse(JSON.stringify(ob));
    oldOlinvoiceHasProduct = JSON.parse(JSON.stringify(ob));


    selectItems = getServiceRequest('/product/alldata');
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 

    selectItem.disabled = "disabled";
    selectItem.value = JSON.stringify(invoiceHasProduct.product_id)
    textUnitPrice.value = parseFloat(invoiceHasProduct.unitprice);
    textQTY.value = invoiceHasProduct.quantity;
    textLinePrice.value = parseFloat(invoiceHasProduct.lineprice);

    $("#buttonItemSubmit").hide();
    $("#buttonItemUpdate").show();
}

const orderInnerFormDelete = (ob, index) => {
    console.log(invoiceHasProduct);

    let userConfirm = window.confirm("Are you sure to remove " + ob.product_id.name + "?");
    if (userConfirm) {
        let extIndex = invoice.invoiceHasProductList.map(orderproduct=>orderproduct.product_id.id).indexOf(ob.product_id.id);
        if (extIndex != -1) {
            invoice.invoiceHasProductList.splice(extIndex,1);
        }
        refreshinvoiceInnerForm();
    }
}

const buttonInvoiceItemSubmit = () => {
    console.log(invoiceHasProduct);

    invoice.invoiceHasProductList.push(invoiceHasProduct);
    refreshinvoiceInnerForm();
}

const buttonInvoiceItemUpdate = () => {
    console.log(invoiceHasProduct);

    if (invoiceHasProduct.quantity != oldOlinvoiceHasProduct.quantity) {
        invoice.invoiceHasProductList[innerFormIndex] = invoiceHasProduct;
        refreshinvoiceInnerForm();
    } else {
        window.alert("Nothing to update");
    }

}




