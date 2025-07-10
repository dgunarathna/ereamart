window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshProductTable();
    refreshProductForm();
});


//table *********************************************************************************************************************************************************************************************

const refreshProductTable = () => {
    let products = getServiceRequest('/product/alldata');

    // string > string, date, number
    // function > object, array, boolean
    // decimal >

    let propertyList = [
        {propertyName: "image", dataType: "string"},
        {propertyName: "name", dataType: "string"},
        {propertyName: "description", dataType: "string"},
        {propertyName: getBrand, dataType: "string"},
        {propertyName: "weight", dataType: "string"},
        {propertyName: "size", dataType: "string"},
        {propertyName: "discount_rate", dataType: "decimal"},
        {propertyName: "profit_rate", dataType: "decimal"},
        {propertyName: "code", dataType: "string"},
        {propertyName: getManufacture, dataType: "function"},
        {propertyName: getCategory, dataType: "function"},
        {propertyName: getDepartment, dataType: "function"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableProductBody, products, propertyList, productFormRefill);
}

const getManufacture = (dataOb) => {
    return dataOb.productmanufacture_id.name;
}

const getStatus = (dataOb) => {
    if (dataOb.productstatus_id.name == "Available") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.productstatus_id.name + "</p>";
    } if (dataOb.productstatus_id.name == "Unavailable") {
        return "<p class='badge bg-warning w-100 my-auto'>" + dataOb.productstatus_id.name + "</p>";
    }
}

const getCategory = (dataOb) => {
    return dataOb.productcategory_id.name;
}

const getDepartment = (dataOb) => {
    return dataOb.productcategory_id.productdepartment_id.name;
}

const getBrand = (dataOb) => {
    return dataOb.productbrand_id.name;
}


//form *********************************************************************************************************************************************************************************************

const refreshProductForm = () => {
    product = new Object();

    formProduct.reset();

    setDefault([selectCategory, selectDepartment, productimage, textProductName, textDescription, textManufacture, textBrand, textWeight, textSize, textDiscountRate, textProfitRate, textBarcode, selectStatus]);

    let category = getServiceRequest('/productcategory/alldata');
    fillDataIntoSelect(selectCategory,"Select Category",category,"name");

    let departments = getServiceRequest('/productdepartment/alldata');
    fillDataIntoSelect(selectDepartment,"Select Department",departments,"name");

    // let departmentsbycategories = getServiceRequest('/productdepartment/bycategory?categoryid=' + category.id);
    // fillDataIntoSelect(selectDepartment,"Select Department",departmentsbycategories,"name");
    
    let status = getServiceRequest('/productstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select Status",status,"name");
    selectStatus.value = JSON.stringify(status[0]); // set default values
    product.status = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen"

    let manufactures = getServiceRequest('/productmanufacture/alldata');
    fillDataIntoSelect(textManufacture,"Select Manufacture",manufactures,"name");

    let brands = getServiceRequest('/productbrand/alldata');
    fillDataIntoSelect(textBrand,"Select Brand",brands,"name");

    // let brandsbycategory = getServiceRequest('/productbrands/bycategory/'+ category.id);
    // fillDataIntoSelect(textBrand,"Select Brand",brandsbycategory,"name");
}

const productFormRefill = (ob, index) => {
    refreshProductForm();
    console.log("Edit", ob, index);

    selectCategory.value = JSON.stringify(ob.productcategory_id);
    selectDepartment.value = JSON.stringify(ob.productcategory_id.productdepartment_id);
    productimage.value = ob.image;
    textProductName.value = ob.name;
    textDescription.value = ob.description;
    textManufacture.value = JSON.stringify(ob.productmanufacture_id);
    textBrand.value = JSON.stringify(ob.productbrand_id);
    textWeight.value = ob.weight;
    textSize.value = ob.size;
    textDiscountRate.value = ob.discount_rate;
    textProfitRate.value = ob.profit_rate;
    textBarcode.value = ob.code;
    selectStatus.value = JSON.stringify(ob.productstatus_id);

    product = JSON.parse(JSON.stringify(ob));
    oldProduct = JSON.parse(JSON.stringify(ob));

    $("#modalProductForm").modal("show");
    $("#modalProductFormLabel").text(ob.productname);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}

const buttonProductDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.productname + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/product/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshProductTable();
            $("#modalProductForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonProductPrint = (ob, index) => {
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
            +"<h5 class='mb-4'>"+ ob.name + " Details</h5>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Image </th><td>"+ ob.productimage +"</td></tr>" 
                +"<tr><th> Name </th><td>"+ ob.productname +"</td></tr>" 
                +"<tr><th> Description </th><td>"+ ob.productdescription +"</td></tr>" 
                +"<tr><th> Brand </th><td>"+ ob.brand +"</td></tr>" 
                +"<tr><th> Weight </th><td>"+ ob.weight +"</td></tr>" 
                +"<tr><th> Size </th><td>"+ ob.size +"</td></tr>" 
                +"<tr><th> Discount </th><td>"+ ob.discountrate +"</td></tr>" 
                +"<tr><th> Profit </th><td>"+ ob.profitrate +"</td></tr>" 
                +"<tr><th> Barcode </th><td>"+ ob.barcode +"</td></tr>" 
                +"<tr><th> Manufacture </th><td>"+ ob.manufacture_id.name +"</td></tr>" 
                +"<tr><th> Category </th><td>"+ ob.category_id.name +"</td></tr>" 
                +"<tr><th> Department </th><td>"+ ob.department_id.name +"</td></tr> "
                +"<tr><th> Status </th><td>"+ ob.status_id.name +"</td></tr> "
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalProductForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (product.category_id == null) {
        errors = errors + "Please Enter category\n"
    }
    // if (product.department_id == null) {
    //     errors = errors + "Please Enter department\n"
    // }
    if (product.manufacture_id == null) {
        errors = errors + "Please select manufacture \n";
    }
    if (product.brand == null) {
        errors = errors + "Please Select brand \n";
    }
    if (product.weight == null) {
        errors = errors + "Please select weight \n";
    }
    if (product.size == null) {
        errors = errors + "Please enter size \n";
    }
    if (product.discountrate == null) {
        errors = errors + "Please enter discount rate \n";
    }
    if (product.profitrate == null) {
        errors = errors + "Please enter profit rate \n";
    }
    if (product.barcode == null) {
        errors = errors + "Please Select barcode \n";
    }
    if (product.status_id == null) {
        errors = errors + "Please Select Status \n";
    }
    if (product.productname == null) {
        errors = errors + "Please Enter product name \n";
    }
    // if (product.productimage == null) {
    //     errors = errors + "Please Enter product image \n";
    // }
    if (product.productdescription == null) {
        errors = errors + "Please Enter description\n";
    }
    return errors;
}

const buttonProductSubmit = () => {
    console.log(product);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ product.productname +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/product/insert", "POST", product);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshProductTable();
                refreshProductForm();
                $("#modalProductForm").modal("hide");
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

    console.log(product);
    console.log(oldProduct);
    
    if (product != null && oldProduct !== null) {
        if (product.category_id.name != oldProduct.category_id.name) {
            updates = updates + "Category - " + oldProduct.category_id.name + " to " + product.category_id.name + "\n";
        }
        if (product.manufacture_id.name != oldProduct.manufacture_id.name) {
            updates = updates + "Manufacture - " + oldProduct.manufacture_id.name + " to " + product.manufacture_id.name + "\n";
        }
        if (product.brand != oldProduct.brand) {
            updates = updates + "Brand - " + oldProduct.brand + " to " + product.brand + "\n";
        }
        if (product.weight != oldProduct.weight) {
            updates = updates + "Weight - " + oldProduct.weight + " to " + product.weight + "\n";
        }
        if (product.size != oldProduct.size) {
            updates = updates + "Size - " + oldProduct.size + " to " + product.size + "\n";
        }
        if (product.discountrate != oldProduct.discountrate) {
            updates = updates + "Discount Rate - " + oldProduct.discountrate + " to " + product.discountrate + "\n";
        }
        if (product.profitrate != oldProduct.profitrate) {
            updates = updates + "Profit Rate - " + oldProduct.profitrate + " to " + product.profitrate + "\n";
        }
        if (product.barcode != oldProduct.barcode) {
            updates = updates + "Barcode - " + oldProduct.barcode + " to " + product.barcode + "\n";
        }
        if (product.status_id.name != oldProduct.status_id.name) {
            updates = updates + "Status - " + oldProduct.status_id.name + " to " + product.status_id.name + "\n";
        }
        if (product.productname != oldProduct.productname) {
            updates = updates + "Product name - " + oldProduct.productname + " to " + product.productname + "\n";
        }
        if (product.productimage != oldProduct.productimage) {
            updates = updates + "Product image - " + oldProduct.productimage + " to " + product.productimage + "\n";
        }
        if (product.productdescription != oldProduct.productdescription) {
            updates = updates + "Product description - " + oldProduct.productdescription + " to " + product.productdescription + "\n";
        }
    }
    return updates;
}

const buttonProductUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ product.productname +"? \n");
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/product/update", "PUT", product);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshProductTable();
                    refreshProductForm();
                    $("#modalProductForm").modal("hide");
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
    refreshProductForm();
    $("#modalProductFormLabel").text("Add New Product");

    // selectDepartment.disabled = true;

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}