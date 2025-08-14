window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshQuotationTable();
    refreshQuotationForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshQuotationTable = () => {

    let Quotations = getServiceRequest('/quotation/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "quotation_code", dataType: "string"},
        {propertyName: getSupplier, dataType: "function"},
        {propertyName: "totalitems", dataType: "string"},
        {propertyName: "note", dataType: "string"},
        {propertyName: "requestdate", dataType: "string"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableQuotationBody, Quotations, propertyList, QuotationFormRefill);
}

const getSupplier = (dataOb) => {
    return dataOb.supplier_id.name;
}

const getStatus = (dataOb) => {
    if (dataOb.quotation_status_id.name == "Active") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.quotation_status_id.name + "</p>";
    } if (dataOb.quotation_status_id.name == "Delete") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.quotation_status_id.name + "</p>";
    } 
}

//form *********************************************************************************************************************************************************************************************

const refreshQuotationForm = () => {
    quotation = new Object();
    quotation.quotationHasItemList = new Array();

    formQuotation.reset();

    setDefault([selectsupplier, textItems, selectrequireddate, selectStatus, textNote]);
    
    let supliers = getServiceRequest('/supplier/alldata');
    fillDataIntoSelect(selectsupplier,"Select supplier",supliers,"name");

    let QuotationStatus = getServiceRequest('/quotationstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select Status",QuotationStatus,"name");  

    //set mix max date [YYYY - mm - DD]

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1; // [0-11]
    if (currentMonth < 10) {
        currentMonth = '0' + currentMonth;
    }
    let currentDay = currentDate.getDate(); // [1-31]
    if (currentDay < 10) {
        currentDay = '0' + currentDay;
    }
    selectrequireddate.min = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

    currentDate.setDate(currentDate.getDate() + 0);
    let maxCurrentMonth = currentDate.getMonth() + 1; // [0-11]
    if (maxCurrentMonth < 10) {
        maxCurrentMonth = '0' + maxCurrentMonth;
    }
    let maxCurrentDay = currentDate.getDate(); // [1-31]
    if (maxCurrentDay < 10) {
        maxCurrentDay = '0' + maxCurrentDay;
    }
    selectrequireddate.max = currentDate.getFullYear() + "-" + maxCurrentMonth + "-" + maxCurrentDay;

    //inner form ************************************
    refreshquotationInnerForm();

}


const QuotationFormRefill = (ob, index) => {
    refreshQuotationForm();
    console.log("Edit", ob, index);

    selectsupplier.value = JSON.stringify(ob.supplier_id);
    textItems.value = ob.totalitems;
    selectrequireddate.value = ob.requestdate;
    textNote.value = ob.note;
    selectStatus.value = JSON.stringify(ob.quotation_status_id);


    quotation = JSON.parse(JSON.stringify(ob));
    oldQuotation = JSON.parse(JSON.stringify(ob));

    $("#modalQuotationForm").modal("show");
    $("#modalQuotationFormLabel").text(ob.quotation_code);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}


const buttonQuotationDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.Quotationno + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/quotation/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshQuotationTable();
            $("#modalQuotationForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonQuotationPrint = (ob, index) => {
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
            +"<h5 class='mb-4'>"+ ob.Quotationno + " Details</h5>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Q	 </th><td>"+ ob.Quotationno +"</td></tr>" 
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
        $("#modalQuotationForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (quotation.supplier_id == null) {
        errors = errors + "Please enter supplier\n"
    }
    if (quotation.totalitems == null) {
        errors = errors + "Please enter total items\n"
    }
    if (quotation.requestdate == null) {
        errors = errors + "Please select Date \n";
    }
    if (quotation.quotation_status_id == null) {
        errors = errors + "Please select Status \n";
    }
    if (quotation.note == null) {
        errors = errors + "Please select Note \n";
    }
    return errors;
}

const buttonQuotationSubmit = () => {
    console.log(quotation);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ quotation.Quotationno +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/quotation/insert", "POST", quotation);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshQuotationTable();
                refreshQuotationForm();
                $("#modalQuotationForm").modal("hide");
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

    console.log(quotation);
    console.log(oldQuotation);
    
    if (Quotation != null && oldQuotation !== null) {
        if (quotation.supplier_id.name != oldQuotation.supplier_id.name) {
            updates = updates + "Supplier - " + oldQuotation.supplier_id.name + " to " + Quotation.supplier_id.name + "\n";
        }
        if (quotation.totalitems != oldQuotation.totalitems) {
            updates = updates + "Totalitems - " + oldQuotation.totalitems + " to " + Quotation.totalitems + "\n";
        }
        if (quotation.requestdate != oldQuotation.requestdate) {
            updates = updates + "Requested Date - " + oldQuotation.requestdate + " to " + Quotation.requestdate + "\n";
        }
        if (quotation.status_id.name != oldQuotation.status_id.name) {
            updates = updates + "Status - " + oldQuotation.status_id.name + " to " + Quotation.status_id.name + "\n";
        }
        if (quotation.note != oldQuotation.note) {
            updates = updates + "Note - " + oldQuotation.note + " to " + Quotation.note + "\n";
        }
    }
    return updates;
}

const buttonQuotationUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ Quotation.Quotationno +"? \n" + updates);
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/quotation/update", "PUT", quotation);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshQuotationTable();
                    refreshQuotationForm();
                    $("#modalQuotationForm").modal("hide");
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
    refreshQuotationForm();
    selectStatus.setDefault = "Active";

    $("#modalQuotationFormLabel").text("Add New Quotation");

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
    let extIndex = quotation.quotationHasItemList.map(oproduct=>oproduct.product_id.id).indexOf(selectedProduct.id);

    if (extIndex > -1) {
        window.alert(" Product Added already");
        refreshquotationInnerForm();
    }
}



// filter products by select supplier dropdown
const filterProductBySupplier = () => {
    let selectItems = getServiceRequest('/product/bysupplier/' + JSON.parse(selectsupplier.value).id);
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 
}

const refreshquotationInnerForm = () =>{
    quotationHasItem = new Object();

    selectItem.disabled = "";
    textQTY.value = "";
    


    setDefault([selectItem,  textQTY, ]);

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
        {propertyName: "quantity", dataType: "string"}
    ];

    fillDataIntoInnerTable(tableQuotationItemBody, quotation.quotationHasItemList, propertyList, orderInnerFormRefill, orderInnerFormDelete);


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

const orderInnerFormRefill = (ob, index) =>{

    refreshquotationInnerForm();
    console.log("Edit", ob, index);
    
    innerFormIndex = index;

    quotationHasItem = JSON.parse(JSON.stringify(ob));
    oldOlquotationHasItem = JSON.parse(JSON.stringify(ob));


    selectItems = getServiceRequest('/product/alldata');
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 
    selectItem.disabled = "disabled";
    selectItem.value = JSON.stringify(quotationHasItem.product_id)

    textUnitPrice.value = parseFloat(quotationHasItem.unitprice);
    textQTY.value = quotationHasItem.quantity;
    textLinePrice.value = parseFloat(quotationHasItem.lineprice);

    $("#buttonItemSubmit").hide();
    $("#buttonItemUpdate").show();
}

const orderInnerFormDelete = (ob, index) => {
    console.log(quotationHasItem);

    let userConfirm = window.confirm("Are you sure to remove " + ob.product_id.name + "?");
    if (userConfirm) {
        let extIndex = quotation.quotationHasItemList.map(orderproduct=>orderproduct.product_id.id).indexOf(ob.product_id.id);
        if (extIndex != -1) {
            quotation.quotationHasItemList.splice(extIndex,1);
        }
        refreshquotationInnerForm();
    }
}

const buttonQuotationItemSubmit = () => {
    console.log(quotationHasItem);

    quotation.quotationHasItemList.push(quotationHasItem);
    refreshquotationInnerForm();
}

const buttonQuotationItemUpdate = () => {
    console.log(quotationHasItem);

    if (quotationHasItem.quantity != oldOlquotationHasItem.quantity) {
        quotation.quotationHasItemList[innerFormIndex] = quotationHasItem;
        refreshquotationInnerForm();
    }

}



