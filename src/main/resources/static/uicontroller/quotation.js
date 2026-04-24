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
        { propertyName: "quotation_code", dataType: "string" },
        { propertyName: getSupplier, dataType: "function" },
        { propertyName: "totalitems", dataType: "string" },
        { propertyName: "requestdate", dataType: "string" },
        { propertyName: getStatus, dataType: "function" }
    ];

    $('#tableQuotation').DataTable().destroy();
    fillDataIntoTable(tableQuotationBody, Quotations, propertyList, QuotationFormRefill);
    new DataTable('#tableQuotation', {
        destroy: true,
        info: false,
        paging: false,
        language: {
            search: "",
            searchPlaceholder: "Search quotations..."
        }
    });
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
    quotation.quotationHasProductList = new Array();

    formQuotation.reset();

    setDefault([selectsupplier, textItems, selectrequireddate, selectStatus]);

    let supliers = getServiceRequest('/supplier/alldata');
    fillDataIntoSelect(selectsupplier, "Select supplier", supliers, "name");

    let status = getServiceRequest('/quotationstatus/alldata');
    fillDataIntoSelect(selectStatus, "Select Status", status, "name");
    selectStatus.value = JSON.stringify(status[0]); // set default values
    quotation.quotation_status_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen"

    let currentDate = new Date();
    selectrequireddate.value = currentDate.toISOString().split('T')[0];
    quotation.requestdate = selectrequireddate.value;
    selectrequireddate.style.border = "1px solid lightgreen";
    selectrequireddate.disabled = "disabled"


    //inner form ************************************
    refreshQuotationInnerForm();

}


const QuotationFormRefill = (ob, index) => {
    refreshQuotationForm();
    console.log("Edit", ob, index);

    selectsupplier.disabled = "disabled";
    textItems.disabled = "disabled";


    selectsupplier.value = JSON.stringify(ob.supplier_id);
    textItems.value = ob.totalitems;
    selectrequireddate.value = ob.requestdate;
    selectStatus.value = JSON.stringify(ob.quotation_status_id);

    if (ob.quotation_status_id.name == "Delete") {
        buttonDelete.disabled = "disabled";
        buttonUpdate.disabled = "disabled";
        selectStatus.disabled = "disabled";
    }


    quotation = JSON.parse(JSON.stringify(ob));
    oldQuotation = JSON.parse(JSON.stringify(ob));

    $("#modalQuotationForm").modal("show");
    $("#modalQuotationFormLabel").text(ob.quotation_code);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();

    refreshQuotationInnerForm();
}


const buttonQuotationDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.quotation_code + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/quotation/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshQuotationTable();
            $("#modalQuotationForm").modal("hide");
        } else {
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonQuotationPrint = (ob, index) => {
    console.log("View", ob, index);

    let printTable = tableQuotationItem.cloneNode(true);
    printTable.querySelector('thead tr th:last-child').remove();
    printTable.querySelectorAll('tbody tr td:last-child').forEach(td => td.remove());

    let newWindow = window.open();
    let printView =
        "<head>"
        + "<title>www.ereamart.com</title>"
        + "<link href='/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet'/>"
        + "<link rel='stylesheet' href='/css/main.css'>"
        + "</head>"
        + "<body>"
        + "<div class='container m-0 mt-4'>"
        + "<h6 class='mb-4'>Details</h6>"
        + "<table class='table'>"
        + "<tbody>"
        + "<tr><th> Quotation code </th><td>" + ob.quotation_code + "</td></tr>"
        + "<tr><th> Supplier </th><td>" + ob.supplier_id.name + "</td></tr>"
        + "<tr><th> Total Items  </th><td>" + ob.totalitems + "</td></tr>"
        + "<tr><th> Request Date </th><td>" + ob.requestdate + "</td></tr>"
        + "<tr><th> Status </th><td>" + ob.quotation_status_id.name + "</td></tr>"
        + "</tbody>"
        + "</table>"
        + "<h6 class='mt-4'>Products</h6>"
        + "<div class='mt-3'> " + printTable.outerHTML + "</div>"
        + "</div>"
        + "</body>";

    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalQuotationForm").modal("hide");
    }, 500);
}

const checkFormError = () => {
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
    return errors;
}

const buttonQuotationSubmit = () => {
    console.log(quotation);

    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add " + (quotation.quotation_code ?? "this quotation") + "?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/quotation/insert", "POST", quotation);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshQuotationTable();
                refreshQuotationForm();
                $("#modalQuotationForm").modal("hide");
            } else {
                window.alert("Faild to submit\n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors\n" + errors);
    }
}

const checkFormUpdate = () => {
    let updates = "";

    console.log(quotation);
    console.log(oldQuotation);

    if (quotation != null && oldQuotation !== null) {
        if (quotation.supplier_id.name != oldQuotation.supplier_id.name) {
            updates = updates + "Supplier - " + oldQuotation.supplier_id.name + " to " + quotation.supplier_id.name + "\n";
        }
        if (quotation.totalitems != oldQuotation.totalitems) {
            updates = updates + "Totalitems - " + oldQuotation.totalitems + " to " + quotation.totalitems + "\n";
        }
        if (quotation.requestdate != oldQuotation.requestdate) {
            updates = updates + "Requested Date - " + oldQuotation.requestdate + " to " + quotation.requestdate + "\n";
        }
        if (quotation.quotation_status_id.name != oldQuotation.quotation_status_id.name) {
            updates = updates + "Status - " + oldQuotation.quotation_status_id.name + " to " + quotation.quotation_status_id.name + "\n";
        }
        //check inner form updates
        if (quotation.quotationHasProductList.length != oldQuotation.quotationHasProductList.length) {
            updates = updates + "Products List changeged\n";
        } else {
            let equalCount = 0;
            for (const oldoproduct of oldQuotation.quotationHasProductList) {
                for (const newoproduct of quotation.quotationHasProductList) {
                    if (oldoproduct.product_id.id == newoproduct.product_id.id) {
                        equalCount = equalCount + 1;
                    }
                }
            }

            if (equalCount != quotation.quotationHasProductList.length) {
                updates = updates + "Products List changeged\n";
            } else {
                for (const oldoproduct of oldQuotation.quotationHasProductList) {
                    for (const newoproduct of quotation.quotationHasProductList) {
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

const buttonQuotationUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update " + quotation.quotation_code + "? \n" + updates);
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

    selectsupplier.disabled = false;
}

// inner form ***************************************************************************************************************************************************************************************

// function for check item ext in the inner table
const checkProductExt = () => {
    let selectedProduct = JSON.parse(selectItem.value);
    let extIndex = quotation.quotationHasProductList.map(oproduct => oproduct.product_id.id).indexOf(selectedProduct.id);

    if (extIndex > -1) {
        window.alert(" Product Added already");
        refreshQuotationInnerForm();
    }
}



// filter products by select supplier dropdown
const filterProductBySupplier = () => {
    let selectItems = getServiceRequest('/product/bysupplier/' + JSON.parse(selectsupplier.value).id);
    fillDataIntoSelect(selectItem, "Select Product", selectItems, "name");
}

// Calculate order quantity based on ROQ and inventory
function calculateOrderQty() {
    const roq = getServiceRequest('/roq/byproduct/' + JSON.parse(selectItem.value).id);
    const inventoryQty = getServiceRequest('/qty/byinventory/' + JSON.parse(selectItem.value).id);

    const qty = roq - inventoryQty;
    textQTY.value = qty;
    quotationHasItem.quantity = qty;
}


const refreshQuotationInnerForm = () => {
    quotationHasItem = new Object();

    selectItem.disabled = "";
    textQTY.value = "";



    setDefault([selectItem, textQTY,]);

    let selectItems = [];
    if (selectsupplier.value != "") {
        selectItems = getServiceRequest('/product/bysupplier/' + JSON.parse(selectsupplier.value).id);
    } else {
        selectItems = getServiceRequest('/product/alldata');
    }
    fillDataIntoSelect(selectItem, "Select Product", selectItems, "name");


    //refresh inner table ****************************************************************************************************************************************************************************   

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        { propertyName: getProductName, dataType: "function" },
        { propertyName: "quantity", dataType: "string" }
    ];

    fillDataIntoInnerTable(tableQuotationItemBody, quotation.quotationHasProductList, propertyList, quotationInnerFormRefill, quotationInnerFormDelete);

    //auto load totalqty
    let totalqty = 0;
    for (const orderproduct of quotation.quotationHasProductList) {
        totalqty = parseFloat(totalqty) + parseFloat(orderproduct.quantity);
    };

    if (totalqty != 0) {
        textItems.value = totalqty;
        quotation.totalitems = textItems.value;
        textItems.style.border = "1px solid lightgreen"

    };

    $("#buttonItemSubmit").show();
    $("#buttonItemUpdate").hide();
}


const getProductName = (dataOb) => {
    return dataOb.product_id.name;
}

const quotationInnerFormRefill = (ob, index) => {

    refreshQuotationInnerForm();
    console.log("Edit", ob, index);



    innerFormIndex = index;

    quotationHasItem = JSON.parse(JSON.stringify(ob));
    oldQuotationHasItem = JSON.parse(JSON.stringify(ob));


    selectItems = getServiceRequest('/product/alldata');
    fillDataIntoSelect(selectItem, "Select Product", selectItems, "name");
    selectItem.value = JSON.stringify(quotationHasItem.product_id)

    textQTY.value = quotationHasItem.quantity;

    $("#buttonItemSubmit").hide();
    $("#buttonItemUpdate").show();


}

const quotationInnerFormDelete = (ob, index) => {
    console.log(quotationHasItem);

    let userConfirm = window.confirm("Are you sure to remove " + ob.product_id.name + "?");
    if (userConfirm) {
        let extIndex = quotation.quotationHasProductList.map(orderproduct => orderproduct.product_id.id).indexOf(ob.product_id.id);
        if (extIndex != -1) {
            quotation.quotationHasProductList.splice(extIndex, 1);
        }
        refreshQuotationInnerForm();

        if (quotation.quotationHasProductList.length === 0) {
            selectsupplier.disabled = false;
        }
    }


}

const buttonQuotationItemSubmit = () => {
    console.log(quotationHasItem);

    quotation.quotationHasProductList.push(quotationHasItem);
    refreshQuotationInnerForm();
    selectsupplier.disabled = "disabled";
}

const buttonQuotationItemUpdate = () => {
    console.log(quotationHasItem);

    if (quotationHasItem.quantity != oldQuotationHasItem.quantity) {
        quotation.quotationHasProductList[innerFormIndex] = quotationHasItem;
        refreshQuotationInnerForm();
    } else {
        window.alert("Nothing to update");
    }

}



