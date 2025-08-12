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
        {propertyName: getSupplier, dataType: "function"},
        {propertyName: "totalprice", dataType: "string"},
        {propertyName: "request_date", dataType: "string"},
        {propertyName: "note", dataType: "string"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableRespondBody, responds, propertyList, respondFormRefill);
}

const getSupplier = (dataOb) => {
    return dataOb.supplier_id.reg_no;
}

const getStatus = (dataOb) => {
    if (dataOb.respond_status_id.name == "Active") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.respond_status_id.name + "</p>";
    } if (dataOb.respond_status_id.name == "Expired") {
        return "<p class='badge bg-dark w-100 my-auto'>" + dataOb.respond_status_id.name + "</p>";
    } 
}

//form *********************************************************************************************************************************************************************************************

const refreshRespondForm = () => {
    respond = new Object();
    respond.respondHasItemList = new Array();

    formRespond.reset();

    setDefault([selectquotation, selectsupplier, selectrequireddate, selectStatus, textNote, textdiscount, texttotalamount]);
    
    let quotations = getServiceRequest('/quotation/alldata');
    fillDataIntoSelect(selectquotation,"Select quotation",quotations,"quotation_code");

    let supliers = getServiceRequest('/supplier/alldata');
    fillDataIntoSelect(selectsupplier,"Select supplier",supliers,"name");

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


const respondFormRefill = (ob, index) => {
    refreshRespondForm();
    console.log("Edit", ob, index);

    selectquotation.value = JSON.stringify(ob.quotation_id);
    selectsupplier.value = JSON.stringify(ob.supplier_id);
    texttotalamount.value = ob.totalprice;
    selectrequireddate.value = ob.request_date;
    textNote.value = ob.note;
    textdiscount.value = ob.discount;
    selectStatus.value = JSON.stringify(ob.respond_status_id);


    Respond = JSON.parse(JSON.stringify(ob));
    oldRespond = JSON.parse(JSON.stringify(ob));

    $("#modalRespondForm").modal("show");
    $("#modalRespondFormLabel").text(ob.Respondno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}


const buttonRespondDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.respondno + "?");
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

    let newWindow = window.open();
    let printView =
    "<head>"
        +"<title>www.ereamart.com</title>"
        +"<link href='/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet'/>"
        +"<link rel='stylesheet' href='/css/main.css'>"
    +"</head>"
    +"<body>"
        +"<div class='container m-0 mt-4'>"
            +"<h5 class='mb-4'>"+ ob.Respondno + " Details</h5>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Q	 </th><td>"+ ob.Respondno +"</td></tr>" 
                +"<tr><th> Supplier </th><td>"+ ob.supplier_id.name +"</td></tr>" 
                +"<tr><th> Total Items  </th><td>"+ ob.totalitems +"</td></tr>"  
                +"<tr><th> Note </th><td>"+ ob.note +"</td></tr>" 
                +"<tr><th> Request Date </th><td>"+ ob.requestdate +"</td></tr>" 
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
    if (respond.note == null) {
        errors = errors + "Please select Note \n";
    }
    return errors;
}

const buttonRespondSubmit = () => {
    console.log(respond);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ respond.respondno +"?");
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
    
    if (Respond != null && oldRespond !== null) {
        if (Respond.supplier_id.name != oldRespond.supplier_id.name) {
            updates = updates + "Supplier - " + oldRespond.supplier_id.name + " to " + Respond.supplier_id.name + "\n";
        }
        if (Respond.totalitems != oldRespond.totalitems) {
            updates = updates + "Totalitems - " + oldRespond.totalitems + " to " + Respond.totalitems + "\n";
        }
        if (Respond.requestdate != oldRespond.requestdate) {
            updates = updates + "Requested Date - " + oldRespond.requestdate + " to " + Respond.requestdate + "\n";
        }
        if (Respond.status_id.name != oldRespond.status_id.name) {
            updates = updates + "Status - " + oldRespond.status_id.name + " to " + Respond.status_id.name + "\n";
        }
        if (Respond.note != oldRespond.note) {
            updates = updates + "Note - " + oldRespond.note + " to " + Respond.note + "\n";
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
            let userConfirm = window.confirm("Are you sure to update "+ respond.respondno +"? \n" + updates);
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
    selectStatus.setDefault = "Active";

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
    let extIndex = respond.respondHasItemList.map(oproduct=>oproduct.product_id.id).indexOf(selectedProduct.id);

    if (extIndex > -1) {
        window.alert(" Product Added already");
        refreshRespondInnerForm();
    } else {
        textUnitPrice.value = parseFloat(selectedProduct.price).toFixed(2);
        respondHasItem.unitprice = parseFloat(textUnitPrice.value).toFixed(2);
        textUnitPrice.style.border = "1px solid lightgreen"
    }
}

//define function for line price
const calculateLinePrice = ()=> {
    if (textQTY.value > 0) {
        let lineprice = (parseFloat(textQTY.value)* parseFloat(textUnitPrice.value)).toFixed(2);
        respondHasItem.lineprice = lineprice;
        textLinePrice.value = lineprice;
        textLinePrice.style.border = "1px solid lightgreen"
    } else {
        respondHasItem.unitPrice = null;
        respondHasItem.lineprice = null;
        textQTY.style.border = "1px solid pink";
        textLinePrice.style.border = "1px solid #ced4da";
        textLinePrice.value = "";
    }
}

// filter products by select supplier dropdown
const filterProductBySupplier = () => {
    let selectItems = getServiceRequest('/product/bysupplier/' + JSON.parse(selectsupplier.value).id);
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 
}

const refreshRespondInnerForm = () =>{
    respondHasItem = new Object();

    selectItem.disabled = "";

    textUnitPrice.value = "";
    textUnitPrice.disabled = "disabled";
    textQTY.value = "";
    textLinePrice.value = "";
    textLinePrice.disabled = "disabled";
    


    setDefault([selectItem,  textQTY, textUnitPrice, textLinePrice]);

    let selectItems = [];
    if (selectsupplier.value != "") {
        selectItems = getServiceRequest('/product/bysupplier/' + JSON.parse(selectsupplier.value).id);
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

    fillDataIntoInnerTable(tableRespondItemBody, respond.respondHasItemList, propertyList, respondInnerFormRefill, respondInnerFormDelete);

    //auto load total amount
    let totalAmount = 0.00;
    for (const orderproduct of respond.respondHasItemList) {
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

const getItemImage = (dataOb) => {
    return dataOb.productimage;
}

const getItemName = (dataOb) => {
    return dataOb.productname;
}

const respondInnerFormRefill = (ob, index) =>{

    refreshRespondInnerForm();
    console.log("Edit", ob, index);
    
    innerFormIndex = index;

    respondHasItem = JSON.parse(JSON.stringify(ob));
    oldOlrespondHasItem = JSON.parse(JSON.stringify(ob));


    selectItems = getServiceRequest('/product/alldata');
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 
    selectItem.disabled = "disabled";
    selectItem.value = JSON.stringify(respondHasItem.product_id)

    textUnitPrice.value = parseFloat(respondHasItem.unitprice);
    textQTY.value = respondHasItem.quantity;
    textLinePrice.value = parseFloat(respondHasItem.lineprice);

    $("#buttonItemSubmit").hide();
    $("#buttonItemUpdate").show();
}

const respondInnerFormDelete = (ob, index) => {
    console.log(respondHasItem);

    let userConfirm = window.confirm("Are you sure to remove " + ob.product_id.name + "?");
    if (userConfirm) {
        let extIndex = respond.respondHasItemList.map(orderproduct=>orderproduct.product_id.id).indexOf(ob.product_id.id);
        if (extIndex != -1) {
            respond.respondHasItemList.splice(extIndex,1);
        }
        refreshRespondInnerForm();
    }
}

const buttonRespondItemSubmit = () => {
    console.log(respondHasItem);

    respond.respondHasItemList.push(respondHasItem);
    refreshRespondInnerForm();
}

const buttonRespondItemUpdate = () => {
    console.log(respondHasItem);

    if (respondHasItem.quantity != oldOlrespondHasItem.quantity) {
        respond.respondHasItemList[innerFormIndex] = respondHasItem;
        refreshRespondInnerForm();
    }

}



