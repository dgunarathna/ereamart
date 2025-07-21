window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshOrderTable();
    refreshOrderForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshOrderTable = () => {
    
    let Orders = getServiceRequest('/orders/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "orders_code", dataType: "string"},
        {propertyName: getQuotation, dataType: "function"},
        {propertyName: "required_date", dataType: "string"},
        {propertyName: "total_amount", dataType: "string"},
        {propertyName: "note", dataType: "string"},
        {propertyName: getSupplier, dataType: "function"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableOrderBody, Orders, propertyList, orderFormRefill);

    //diable when status delete - dhanushka
    // for (const index in Orders) {
    //     if (Orders[index].orders_status_id.name == "Delete") {
    //         // tableOrderBody.children[index].lastChild.children[1].disabled = "disabled";
    //         $("#buttonDelete").hide();
    //     }
    // }
    
}

const getSupplier = (dataOb) => {
    return dataOb.supplier_id.reg_no;
}

const getQuotation = (dataOb) => {
    return dataOb.supplier_id.name;
}

const getStatus = (dataOb) => {
    if (dataOb.orders_status_id.name == "Available") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.orders_status_id.name + "</p>";
    } if (dataOb.orders_status_id.name == "Delete") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.orders_status_id.name + "</p>";
    }
}   

//form *********************************************************************************************************************************************************************************************

const refreshOrderForm = () => {   
    order = new Object();
    order.orderHasProductList = new Array();
    console.log(order.orderHasProductList);
    
    selectsupplier.disabled = "";

    formOrder.reset();

    setDefault([ selectrequireddate, texttotalamount, selectsupplier, selectorderstate, textnote]);

    let suppliers = getServiceRequest('/supplier/alldata');
    fillDataIntoSelect(selectsupplier,"Select supplier",suppliers,"name");

    let status = getServiceRequest('/ordersstatus/alldata');
    fillDataIntoSelect(selectorderstate,"Select status",status,"name");
    selectorderstate.value = JSON.stringify(status[0]); // set default values
    order.orders_status_id = JSON.parse(selectorderstate.value);
    selectorderstate.style.border = "1px solid lightgreen"
    

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

    currentDate.setDate(currentDate.getDate() + 1);
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
    refreshOrderInnerForm();
}

const orderFormRefill = (ob, index) => {
    refreshOrderForm();
    console.log("Edit", ob, index);

    selectrequireddate.value = ob.required_date;
    texttotalamount.value = ob.total_amount;
    selectsupplier.value = JSON.stringify(ob.supplier_id);
    selectsupplier.disabled = "disabled";
    selectorderstate.value = JSON.stringify(ob.orders_status_id);
    textnote.value = ob.note;

    order = JSON.parse(JSON.stringify(ob));
    oldOrder = JSON.parse(JSON.stringify(ob));

    
    $("#modalOrderForm").modal("show");
    $("#modalOrderFormLabel").text(ob.orderno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();
    
    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
    
    refreshOrderInnerForm();
}

const buttonOrderDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.orderno + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/orders/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshOrderTable();
            $("#modalOrderForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonOrderPrint = (ob, index) => {
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
            +"<h5 class='mb-4'>"+ ob.orders_code + " Details</h5>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Order no	 </th><td>"+ ob.orders_code +"</td></tr>" 
                +"<tr><th> Required Date	 </th><td>"+ ob.required_date +"</td></tr>" 
                +"<tr><th> Total Amount	 </th><td>"+ ob.total_amount +"</td></tr>" 
                +"<tr><th> Note	 </th><td>"+ ob.note +"</td></tr>" 
                +"<tr><th> Supplier	 </th><td>"+ ob.supplier_id.name +"</td></tr>" 
                +"<tr><th> Status </th><td>"+ ob.orders_status_id.name +"</td></tr>" 
            +"</tbody>" 
            +"</table>" // dhanushka - inner table
        +"</div>" 
    +"</body>";


    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalOrderForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (order.required_date == null) {
        errors = errors + "Please enter required date\n"
    }
    if (order.total_amount == null) {
        errors = errors + "Please select total amount \n";
    }
    if (order.supplier_id == null) {
        errors = errors + "Please select supplier \n";
    }
    if (order.orders_status_id == null) {
        errors = errors + "Please select status \n";
    }
    if (order.orderHasProductList.length == 0) {
        errors = errors + "Please select products \n";
    }
    return errors;
}

const buttonOrderSubmit = () => {
    console.log(order);
    console.log("order object eka");
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/orders/insert", "POST", order);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshOrderTable();
                refreshOrderForm();
                $("#modalOrderForm").modal("hide");
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

    console.log(order);
    console.log(oldOrder);
    
    if (order != null && oldOrder !== null) {
        if (order.required_date != oldOrder.required_date) {
            updates = updates + "Required date - " + oldOrder.required_date + " to " + order.required_date + "\n";
        }
        if (order.totalamount != oldOrder.totalamount) {
            updates = updates + "Total amount - " + oldOrder.totalamount + " to " + order.totalamount + "\n";
        }
        if (order.supplier_id.name != oldOrder.supplier_id.name) {
            updates = updates + "Supplier - " + oldOrder.supplier_id.name + " to " + order.supplier_id.name + "\n";
        }
        if (order.orders_status_id.name != oldOrder.orders_status_id.name) {
            updates = updates + "Status - " + oldOrder.orders_status_id.name + " to " + order.orders_status_id.name + "\n";
        }
        if (order.note != oldOrder.note) {
            updates = updates + "Note - " + oldOrder.note + " to " + order.note + "\n";
        }
        if (order.orderHasProductList != oldOrder.orderHasProductList) {
            updates = updates + "Product List - " + oldOrder.orderHasProductList.length + " to " + order.orderHasProductList.length + "\n";
        }
        //check inner form updates
        if (order.orderHasProductList.length != oldOrder.orderHasProductList.length) {
            updates = updates + "Products List changeged\n";
        } else {
            let equalCount = 0;
            for(const oldoproduct of oldOrder.orderHasProductList){
                for(const newoproduct of order.orderHasProductList){
                    if (oldoproduct.product_id.id == newoproduct.product_id.id) {
                        equalCount = equalCount + 1;
                    }
                }
            }

            if (equalCount != order.orderHasProductList.length) {
                updates = updates + "Products List changeged\n";
            }else{
                for(const oldoproduct of oldOrder.orderHasProductList){
                    for(const newoproduct of order.orderHasProductList){
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

const buttonOrderUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ order.orderno +"?\n"+ updates);
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/orders/update", "PUT", order);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshOrderTable();
                    refreshOrderForm();
                    $("#modalOrderForm").modal("hide");
                } else {
                    window.alert("Failed to update" + putResponce);
                    refreshOrderInnerForm();
                }
            }
        }
    } else {
        window.alert("Form has following errors..\n" + errors)
    }
}

//Add new record ************************************************************************************************************************************************************************************

const buttonAddNew = () => {
    refreshOrderForm();
    $("#modalOrderFormLabel").text("Add New Order");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();

    $("#buttonItemUpdate").hide();

   
}


// inner form ***************************************************************************************************************************************************************************************

// function for check item ext in the inner table
const checkProductExt = () => {
    let selectedProduct = JSON.parse(selectItem.value);
    let extIndex = order.orderHasProductList.map(oproduct=>oproduct.product_id.id).indexOf(selectedProduct.id);

    if (extIndex > -1) {
        window.alert(" Product Added already");
        refreshOrderInnerForm();
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


// filter products by select supplier dropdown
const filterProductBySupplier = () => {
    let selectItems = getServiceRequest('/product/bysupplier/' + JSON.parse(selectsupplier.value).id);
    fillDataIntoSelect(selectItem,"Select Product",selectItems,"name"); 
}

const refreshOrderInnerForm = () =>{
    orderHasProduct = new Object();

    selectItem.disabled = "";

    textUnitPrice.value = "";
    textUnitPrice.disabled = "disabled";
    textQTY.value = "";
    textLinePrice.value = "";
    textLinePrice.disabled = "disabled";
    


    setDefault([selectItem, textUnitPrice, textQTY, textLinePrice]);

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
        {propertyName: getProductImage, dataType: "function"},
        {propertyName: getProductName, dataType: "function"},
        {propertyName: "quantity", dataType: "string"},
        {propertyName: "unitPrice", dataType: "decimal"},
        {propertyName: "lineprice", dataType: "decimal"}
    ];

    fillDataIntoInnerTable(tableOrderItemBody, order.orderHasProductList, propertyList, orderInnerFormRefill, orderInnerFormDelete);


    //auto load total amount
    let totalAmount = 0.00;
    for (const orderproduct of order.orderHasProductList) {
        totalAmount = parseFloat (totalAmount) + parseFloat(orderproduct.lineprice);
    };

    if (totalAmount != 0.00) {
        texttotalamount.value = totalAmount.toFixed(2);
        order.total_amount = texttotalamount.value;
        texttotalamount.style.border = "1px solid lightgreen"
    };

    $("#buttonItemSubmit").show();
    $("#buttonItemUpdate").hide();

}


const getProductImage = (dataOb) => {  
    return dataOb.product_id.image;
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

    refreshOrderInnerForm();
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
        let extIndex = order.orderHasProductList.map(orderproduct=>orderproduct.product_id.id).indexOf(ob.product_id.id);
        if (extIndex != -1) {
            order.orderHasProductList.splice(extIndex,1);
        }
        refreshOrderInnerForm();
    }
}

const buttonOrderItemSubmit = () => {
    console.log(orderHasProduct);

    order.orderHasProductList.push(orderHasProduct);
    refreshOrderInnerForm();
}

const buttonOrderItemUpdate = () => {
    console.log(orderHasProduct);

    if (orderHasProduct.quantity != oldOlorderHasProduct.quantity) {
        order.orderHasProductList[innerFormIndex] = orderHasProduct;
        refreshOrderInnerForm();
    }

}



