window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshGRNTable();
    refreshGRNForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshGRNTable = () => {

    let grns = getServiceRequest('/grn/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "grn_no", dataType: "string"},
        {propertyName: getOrder_id, dataType: "function"},
        {propertyName: "supplier_invoice_number", dataType: "string"},
        {propertyName: "recieved_date", dataType: "string"},
        {propertyName: "total_amount", dataType: "string"},
        {propertyName: "discount", dataType: "string"},
        {propertyName: "net_amount", dataType: "string"},
        {propertyName: "note", dataType: "string"},
        {propertyName: getGRNStatus, dataType: "function"},
    ];

    fillDataIntoTable(tableGRNBody, grns, propertyList, grnFormRefill);
}

const getOrder_id = (dataOb) => {
    return dataOb.orders_id.orders_code;
}

const getGRNStatus = (dataOb) => {
    if (dataOb.grn_status_id.name == "Active") {
        return "<p class='badge bg-warning text-dark w-100 my-auto'>" + dataOb.grn_status_id.name + "</p>";
    } if (dataOb.grn_status_id.name == "Received") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.grn_status_id.name + "</p>";
    }
}

//form *********************************************************************************************************************************************************************************************
const refreshGRNForm = () => {
    grn = new Object();
    grn.grnHasProductList = new Array();

    console.log(grn.grnHasProductList);

    formGRN.reset();

    setDefault([ textInvoiceNo, selectOrder, textTotalAmount, textDiscountRate, textNetAmount, textNote, textReceivedDate, selectStatus]);

    let orders = getServiceRequest('/orders/alldata');
    fillDataIntoSelect(selectOrder,"Select order no",orders,"orders_code");

    let status = getServiceRequest('/grnstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select status",status,"name");
    selectStatus.value = JSON.stringify(status[0]); // set default values
    grn.grn_status_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen";

    let currentDate = new Date();
    textReceivedDate.value = currentDate.toISOString().split('T')[0];
    grn.recieved_date = textReceivedDate.value;
    textReceivedDate.style.border = "1px solid lightgreen";

    //inner form ************************************
    refreshGRNInnerForm();
}

const grnFormRefill = (ob, index) => {
    refreshGRNForm();
    console.log("Edit", ob, index);

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
        let deleteResponce = getHTTPServiceRequest("/grn/delete", "DELETE", ob);
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
            +"<h5 class='mb-4'>"+ ob.grnno + " Details</h5>"
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
    if (grn.orders_id == null) {
        errors = errors + "Please Select Order no\n"
    }
    if (grn.supplier_invoice_number == null) {
        errors = errors + "Please Enter Invoice No\n"
    }
    if (grn.recieved_date == null) {
        errors = errors + "Please Enter Received date\n"
    }
    if (grn.total_amount == null) {
        errors = errors + "Please Enter Total Amount\n"
    }
    if (grn.discount == null) {
        errors = errors + "Please Enter Discount Rate\n"
    }
    if (grn.net_amount == null) {
        errors = errors + "Please Enter Net amount\n"
    }
    if (grn.grn_status_id == null) {
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
            let postResponce = getHTTPServiceRequest("/grn/insert", "POST", grn);
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
                let putResponce = getHTTPServiceRequest("/grn/update", "PUT", grn);
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

// function for check item ext in the inner table
const checkProductExt = () => {
    let selectedProduct = JSON.parse(selectItem.value);
    let extIndex = grn.grnHasProductList.map(oproduct=>oproduct.product_id.id).indexOf(selectedProduct.id);

    if (extIndex > -1) {
        window.alert(" Product Added already");
        refreshGRNInnerForm();
    } else {
        textUnitPrice.value = parseFloat(selectedProduct.price).toFixed(2);
        grnHasProduct.unitprice = parseFloat(textUnitPrice.value).toFixed(2);
        textUnitPrice.style.border = "1px solid lightgreen"
    }
}

//define function for line price
const calculateLinePrice = ()=> {
    if (textQTY.value > 0) {
        let lineprice = (parseFloat(textQTY.value)* parseFloat(textUnitPrice.value)).toFixed(2);
        grnHasProduct.lineprice = lineprice;
        textLinePrice.value = lineprice;
        textLinePrice.style.border = "1px solid lightgreen"
    } else {
        grnHasProduct.unitPrice = null;
        grnHasProduct.lineprice = null;
        textQTY.style.border = "1px solid pink";
        textLinePrice.style.border = "1px solid #ced4da";
        textLinePrice.value = "";
    }
}


// filter products by order dropdown
const filterProductByOrder = () => {
    let selectItems = getServiceRequest('/product/byorderscode/' + JSON.parse(selectOrder.value).id);
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name");   
}


const refreshGRNInnerForm = () =>{
    grnHasProduct = new Object();

    selectItem.disabled = "";

    textUnitPrice.value = "";
    textUnitPrice.disabled = "disabled";
    textQTY.value = "";
    textLinePrice.value = "";
    textLinePrice.disabled = "disabled";


    setDefault([selectItem, textUnitPrice, textQTY, textLinePrice]);

    let selectItems = [];
    if (selectOrder.value != "") {
        selectItems = getServiceRequest('/product/byorderscode/' + JSON.parse(selectOrder.value).id);
    } else {
        selectItems = getServiceRequest('/product/alldata');
    }        
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name");


    //refresh inner table ****************************************************************************************************************************************************************************   

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: getProductName, dataType: "function"},
        {propertyName: "quantity", dataType: "string"},
        {propertyName: "unitprice", dataType: "decimal"},
        {propertyName: "lineprice", dataType: "decimal"}
    ];

    fillDataIntoInnerTable(tableGRNItemBody, grn.grnHasProductList, propertyList, orderInnerFormRefill, orderInnerFormDelete);


    //auto load total amount
    let totalAmount = 0.00;
    for (const orderproduct of grn.grnHasProductList) {
        totalAmount = parseFloat (totalAmount) + parseFloat(orderproduct.lineprice);
    };

    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        grn.total_amount = textTotalAmount.value;
        textTotalAmount.style.border = "1px solid lightgreen"
    };

    $("#buttonItemSubmit").show();
    $("#buttonItemUpdate").hide();

}

const getProductName = (dataOb) => {  
    return dataOb.product_id.name;
}

const orderInnerFormRefill = (ob, index) =>{

    refreshGRNInnerForm();
    console.log("Edit", ob, index);
    

    innerFormIndex = index;

    grnHasProduct = JSON.parse(JSON.stringify(ob));
    oldgrnHasProduct = JSON.parse(JSON.stringify(ob));


    selectItems = getServiceRequest('/product/alldata');
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 

    selectItem.disabled = "disabled";
    selectItem.value = JSON.stringify(grnHasProduct.product_id)
    textUnitPrice.value = parseFloat(grnHasProduct.unitPrice);
    textQTY.value = grnHasProduct.quantity;
    textLinePrice.value = parseFloat(grnHasProduct.lineprice);

    $("#buttonItemSubmit").hide();
    $("#buttonItemUpdate").show();
}

const orderInnerFormDelete = (ob, index) => {
    console.log(grnHasProduct);

    let userConfirm = window.confirm("Are you sure to remove " + ob.product_id.name + "?");
    if (userConfirm) {
        let extIndex = grn.grnHasProductList.map(orderproduct=>orderproduct.product_id.id).indexOf(ob.product_id.id);
        if (extIndex != -1) {
            grn.grnHasProductList.splice(extIndex,1);
        }
        refreshGRNInnerForm();
    }
}

const buttonInvoiceItemSubmit = () => {
    console.log(grnHasProduct);

    grn.grnHasProductList.push(grnHasProduct);
    refreshGRNInnerForm();
}

const buttonInvoiceItemUpdate = () => {
    console.log(grnHasProduct);

    if (grnHasProduct.quantity != oldgrnHasProduct.quantity) {
        grn.grnHasProductList[innerFormIndex] = grnHasProduct;
        refreshGRNInnerForm();
    }

}




