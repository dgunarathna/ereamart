window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshRespondTable();
    refreshRespondForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshRespondTable = () => {

    let responds = getServiceRequest('/respond/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "respond_code", dataType: "string"},
        {propertyName: getQuotationCode, dataType: "function"},
        {propertyName: getSupplier, dataType: "function"},
        {propertyName: "totalprice", dataType: "decimal"},
        {propertyName: "request_date", dataType: "string"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableRespondBody, responds, propertyList, respondFormRefill);
<<<<<<< HEAD
    $('#tableRespond').DataTable.DataTable().destroy()({
=======
    $('#tableRespond').DataTable({
>>>>>>> 1ab9c77be7d7d40021360caaef45e71af74249d7
        info: false,
        paging: false,
        searching: false
        });
}

const getSupplier = (dataOb) => {
    return dataOb.supplier_id.name;
}

const getQuotationCode = (dataOb) => {  
    return dataOb.quotation_id.quotation_code;
}

const getStatus = (dataOb) => {
    if (dataOb.respond_status_id.name == "Active") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.respond_status_id.name + "</p>";
    } if (dataOb.respond_status_id.name == "Delete") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.respond_status_id.name + "</p>";
    } 
}

//form *********************************************************************************************************************************************************************************************

const refreshRespondForm = () => {
    respond = new Object();
    respond.respondHasProductList = new Array();
    
    formRespond.reset();

        setDefault([selectquotation, selectsupplier, selectrequireddate, selectStatus, texttotalamount]);
    
    let quotations = getServiceRequest('/quotation/alldata');
    fillDataIntoSelect(selectquotation,"Select quotation",quotations,"quotation_code");

    let status = getServiceRequest('/respondstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select status",status,"name");
    selectStatus.value = JSON.stringify(status[0]); // set default values
    respond.respond_status_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen";

    let currentDate = new Date();
    selectrequireddate.value = currentDate.toISOString().split('T')[0];
    respond.request_date = selectrequireddate.value;
    selectrequireddate.style.border = "1px solid lightgreen";

    //inner form ************************************
    refreshRespondInnerForm();

}

// filter supplier by select quotation 
const filterSupplierByQuotation = () => {
    let suppliers = getServiceRequest('/supplier/byquotation/' + JSON.parse(selectquotation.value).id);
    fillDataIntoSelect(selectsupplier,"Select Supplier",suppliers,"name"); 
    selectsupplier.value = JSON.stringify(suppliers[0]); // set default values
    respond.supplier_id = JSON.parse(selectsupplier.value);
    selectsupplier.style.border = "1px solid lightgreen";
}

// filter products by select supplier dropdown
const filterProductByQuotation = () => {
    let selectItems = getServiceRequest('/product/byquotation/' + JSON.parse(selectquotation.value).id);
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 
}


const respondFormRefill = (ob, index) => {
    refreshRespondForm();
    console.log("Edit", ob, index);

    let suppliers = getServiceRequest('/supplier/alldata');
    fillDataIntoSelect(selectsupplier,"Select Supplier",suppliers,"name"); 

    let quotations = getServiceRequest('/quotation/alldata');
    fillDataIntoSelect(selectquotation,"Select quotation",quotations,"quotation_code");

    selectrequireddate.value = ob.request_date;
    selectquotation.value = JSON.stringify(ob.quotation_id);
    selectsupplier.value = JSON.stringify(ob.supplier_id);
    texttotalamount.value = ob.totalprice;
    selectStatus.value = JSON.stringify(ob.respond_status_id);

    if (ob.respond_status_id.name == "Delete") {
        buttonDelete.disabled = "disabled";
        buttonUpdate.disabled = "disabled";
        selectStatus.disabled = "disabled";
    }

    respond = JSON.parse(JSON.stringify(ob));
    oldRespond = JSON.parse(JSON.stringify(ob));

    $("#modalRespondForm").modal("show");
    $("#modalRespondFormLabel").text(ob.respond_code);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();

    refreshRespondInnerForm();
    console.log(respond.respondHasProductList);
    
}


const buttonRespondDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.respond_code + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/respond/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshRespondTable();
            $("#modalRespondForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonRespondPrint = (ob, index) => {
    console.log("View", ob, index);

    let printTable = tableRespondItem.cloneNode(true);
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
                +"<tr><th> Respond code </th><td>"+ ob.respond_code +"</td></tr>" 
                +"<tr><th> Supplier </th><td>"+ ob.supplier_id.name +"</td></tr>" 
                +"<tr><th> Total Items  </th><td>"+ ob.totalprice +"</td></tr>"  
                +"<tr><th> Request Date </th><td>"+ ob.request_date +"</td></tr>" 
                +"<tr><th> Status </th><td>"+ ob.respond_status_id.name +"</td></tr>" 
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
        $("#modalRespondForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (respond.supplier_id == null) {
        errors = errors + "Please enter supplier\n"
    }
    if (respond.totalprice == null) {
        errors = errors + "Please enter total items\n"
    }
    if (respond.request_date == null) {
        errors = errors + "Please select Date \n";
    }
    if (respond.respond_status_id == null) {
        errors = errors + "Please select Status \n";
    }
    return errors;
}

const buttonRespondSubmit = () => {
    console.log(respond);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ respond.respond_code +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/respond/insert", "POST", respond);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshRespondTable();
                refreshRespondForm();
                $("#modalRespondForm").modal("hide");
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

    console.log(respond);
    console.log(oldRespond);
    
    if (respond != null && oldRespond !== null) {
        if (respond.totalitems != oldRespond.totalitems) {
            updates = updates + "Totalitems - " + oldRespond.totalitems + " to " + respond.totalitems + "\n";
        }
        if (respond.totalprice != oldRespond.totalprice) {
            updates = updates + "Totalitems - " + oldRespond.totalprice + " to " + respond.totalprice + "\n";
        }
        if (respond.request_date != oldRespond.request_date) { 
            updates = updates + "Request Date - " + oldRespond.request_date + " to " + respond.request_date + "\n";
        }
        if (respond.quotation_id.quotation_code != oldRespond.quotation_id.quotation_code) {        
            updates = updates + "Quotation - " + oldRespond.quotation_id.quotation_code + " to " + respond.quotation_id.quotation_code + "\n";
        }
        if (respond.supplier_id.reg_no != oldRespond.supplier_id.reg_no) {  
            updates = updates + "Supplier - " + oldRespond.supplier_id.reg_no + " to " + respond.supplier_id.reg_no + "\n";
        }
        if (respond.respond_status_id.name != oldRespond.respond_status_id.name) {  
            updates = updates + "Status - " + oldRespond.respond_status_id.name + " to " + respond.respond_status_id.name + "\n";
        }
        //check inner form updates
        if (respond.respondHasProductList.length != oldRespond.respondHasProductList.length) {
            updates = updates + "Products List changeged\n";
        } else {
            let equalCount = 0;
            for(const oldoproduct of oldRespond.respondHasProductList){
                for(const newoproduct of respond.respondHasProductList){
                    if (oldoproduct.product_id.id == newoproduct.product_id.id) {
                        equalCount = equalCount + 1;
                    }
                }
            }

            if (equalCount != respond.respondHasProductList.length) {
                updates = updates + "Products List changeged\n";
            }else{
                for(const oldoproduct of oldRespond.respondHasProductList){
                    for(const newoproduct of respond.respondHasProductList){
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

const buttonRespondUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ respond.respond_code +"? \n" + updates);
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/respond/update", "PUT", respond);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshRespondTable();
                    refreshRespondForm();
                    $("#modalRespondForm").modal("hide");
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

const buttonrAddNew = () => {
    refreshRespondForm();
    $("#modalRespondFormLabel").text("Add New Respond");

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
    let extIndex = respond.respondHasProductList.map(oproduct=>oproduct.product_id.id).indexOf(selectedProduct.id);
    let getQty = getServiceRequest('/productqty/byquotation/' + JSON.parse(selectquotation.value).id + '/productqty/byquotation/' + JSON.parse(selectItem.value).id);

    if (extIndex > -1) {
        window.alert(" Product Added already");
        refreshRespondInnerForm();
    } else {
        respondHasProduct.unitprice = parseFloat(textUnitPrice.value).toFixed(2);
        textQTY.value = getQty;
        respondHasProduct.quantity = textQTY.value;
        calculateLinePrice();
    }
}

//define function for line price
const calculateLinePrice = ()=> {
    if (textQTY.value > 0) {
        let lineprice = (parseFloat(textQTY.value)* parseFloat(textUnitPrice.value)).toFixed(2);
        respondHasProduct.lineprice = lineprice;
        textLinePrice.value = lineprice;
        textLinePrice.style.border = "1px solid lightgreen"
    } else {
        respondHasProduct.unitprice = null;
        respondHasProduct.lineprice = null;
        textQTY.style.border = "1px solid pink";
        textLinePrice.style.border = "1px solid #ced4da";
        textLinePrice.value = "";
    }
}



const refreshRespondInnerForm = () =>{
    respondHasProduct = new Object();

    selectItem.value = "";

    textUnitPrice.value = "";
    textQTY.value = "";
    textLinePrice.value = "";
    textLinePrice.disabled = "disabled";
    


    setDefault([selectItem,  textQTY, textUnitPrice, textLinePrice]);



    //refresh inner table ****************************************************************************************************************************************************************************   

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: getProductName, dataType: "function"},
        {propertyName: "quantity", dataType: "string"},
        {propertyName: "unitprice", dataType: "decimal"},
        {propertyName: "lineprice", dataType: "decimal"}
    ];

    fillDataIntoInnerTable(tableRespondItemBody, respond.respondHasProductList, propertyList, respondInnerFormRefill, respondInnerFormDelete);


    //auto load total amount
    let totalAmount = 0.00;
    for (const orderproduct of respond.respondHasProductList) {
        totalAmount = parseFloat (totalAmount) + parseFloat(orderproduct.lineprice);
    };

    if (totalAmount != 0.00) {
        texttotalamount.value = totalAmount.toFixed(2);
        respond.totalprice = texttotalamount.value;
        texttotalamount.style.border = "1px solid lightgreen"
    };

    $("#buttonItemSubmit").show();
    $("#buttonItemUpdate").hide();

}


const getProductName = (dataOb) => {  
    return dataOb.product_id.name;
}

const respondInnerFormRefill = (ob, index) =>{
    
    refreshRespondInnerForm();
    console.log("Edit", ob, index);
    innerFormIndex = index;

    respondHasProduct = JSON.parse(JSON.stringify(ob));
    oldRespondHasProduct = JSON.parse(JSON.stringify(ob));

    selectItems = getServiceRequest('/product/alldata');
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 

    selectItem.value = JSON.stringify(respondHasProduct.product_id);
    textUnitPrice.value = parseFloat(respondHasProduct.unitprice);
    textQTY.value = respondHasProduct.quantity;
    textLinePrice.value = parseFloat(respondHasProduct.lineprice);

    $("#buttonItemSubmit").hide();
    $("#buttonItemUpdate").show();
    filterSupplierByQuotation(); 
    filterProductByQuotation();
}

const respondInnerFormDelete = (ob, index) => {
    console.log(respondHasProduct);

    let userConfirm = window.confirm("Are you sure to remove " + ob.product_id.name + "?");
    if (userConfirm) {
        let extIndex = respond.respondHasProductList.map(orderproduct=>orderproduct.product_id.id).indexOf(ob.product_id.id);
        if (extIndex != -1) {
            respond.respondHasProductList.splice(extIndex,1);
        }
        refreshRespondInnerForm();
    }
}

const buttonRespondItemSubmit = () => {
    console.log(respondHasProduct);

    respond.respondHasProductList.push(respondHasProduct);
    refreshRespondInnerForm();

}

const buttonRespondItemUpdate = () => {
    console.log(respondHasProduct);

    if (respondHasProduct.quantity != oldRespondHasProduct.quantity) {
        respond.respondHasProductList[innerFormIndex] = respondHasProduct;
        refreshRespondInnerForm();
    } else {
        window.alert("Nothing to update");
    }

}



