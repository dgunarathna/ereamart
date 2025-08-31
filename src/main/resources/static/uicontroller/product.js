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
        {propertyName: "code", dataType: "string"},
        {propertyName: "image", dataType: "image-array"},
        {propertyName: getManufacture, dataType: "function"},
        {propertyName: getBrand, dataType: "function"},
        {propertyName: getProduct, dataType: "function"},
        {propertyName: "size", dataType: "string"},
        {propertyName: "name", dataType: "string"},
        {propertyName: "description", dataType: "string"},
        {propertyName: "discount_rate", dataType: "decimal"},
        {propertyName: "profit_rate", dataType: "decimal"},
        {propertyName: getCategory, dataType: "function"},
        {propertyName: getDepartment, dataType: "function"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableProductBody, products, propertyList, productFormRefill);
}

const getManufacture = (dataOb) => {
    return dataOb.productmanufacture_id.name;
}
const getProduct = (dataOb) => {
    return dataOb.productitem_id.name;
}

const getStatus = (dataOb) => {
    if (dataOb.productstatus_id.name == "Available") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.productstatus_id.name + "</p>";
    } if (dataOb.productstatus_id.name == "Unavailable") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.productstatus_id.name + "</p>";
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

    fileProductPhoto.value = "";
    imgproductPhotoPreview.src = "/images/default.png";

    setDefault([selectCategory, selectDepartment, textProductName, textDescription, textManufacture, textBrand, textSize, textDiscountRate, textProfitRate, selectStatus]);

    let category = getServiceRequest('/productcategory/alldata');
    fillDataIntoSelect(selectCategory,"Select Category",category,"name");

    let departments = getServiceRequest('/productdepartment/alldata');
    fillDataIntoSelect(selectDepartment,"Select Department",departments,"name");

    // let departmentsbycategories = getServiceRequest('/productdepartment/bycategory?categoryid=' + category.id);
    // fillDataIntoSelect(selectDepartment,"Select Department",departmentsbycategories,"name");
    
    let status = getServiceRequest('/productstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select Status",status,"name");
    selectStatus.value = JSON.stringify(status[0]); // set default values
    product.productstatus_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen"

    let manufactures = getServiceRequest('/productmanufacture/alldata');
    fillDataIntoSelect(textManufacture,"Select Manufacture",manufactures,"name");

    let brands = getServiceRequest('/productbrand/alldata');
    fillDataIntoSelect(textBrand,"Select Brand",brands,"name");

    let items = getServiceRequest('/productitem/alldata');
    fillDataIntoSelect(selectProduct,"Select product",items,"name");

    // let brandsbycategory = getServiceRequest('/productbrands/bycategory/'+ category.id);
    // fillDataIntoSelect(textBrand,"Select Brand",brandsbycategory,"name");

    textProductName.disabled = "disabled";
    selectDepartment.disabled = "disabled";
}


// Common function to update product.name
let textSizeElement   = document.querySelector("#textSize");
let textBrandElement  = document.querySelector("#textBrand");
let selectProductElement = document.querySelector("#selectProduct");

function updateProductName() {
    let brand = JSON.parse(textBrandElement.value);
    let item  = JSON.parse(selectProductElement.value);
    let size  = textSizeElement.value;

    textProductName.value = brand.name + " " + item.name + " " + size;
    product.name = textProductName.value; 
}

textSizeElement.addEventListener("input", updateProductName);
textBrandElement.addEventListener("change", updateProductName);
selectProductElement.addEventListener("change", updateProductName);





const productFormRefill = (ob, index) => {
    refreshProductForm();
    console.log("Edit", ob, index);

    // set photo 
    if (ob.image != null) {
        imgproductPhotoPreview.src = atob(ob.image);
    } else {
        imgproductPhotoPreview.src = "/images/default.png";
    }

    selectCategory.value = JSON.stringify(ob.productcategory_id);
    selectDepartment.value = JSON.stringify(ob.productcategory_id.productdepartment_id);
    textProductName.value = ob.name;
    textDescription.value = ob.description;
    textManufacture.value = JSON.stringify(ob.productmanufacture_id);
    textBrand.value = JSON.stringify(ob.productbrand_id);
    selectProduct.value = JSON.stringify(ob.productitem_id);
    textSize.value = ob.size;
    textDiscountRate.value = ob.discount_rate;
    textProfitRate.value = ob.profit_rate;
    textPrice.value = ob.price;
    selectStatus.value = JSON.stringify(ob.productstatus_id);

    product = JSON.parse(JSON.stringify(ob));
    oldProduct = JSON.parse(JSON.stringify(ob));

    $("#modalProductForm").modal("show");
    $("#modalProductFormLabel").text(ob.code);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}

const buttonProductDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.name + "?");
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
            +"<h6 class='mb-4'>Details</h6>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Product code </th><td>"+ ob.code +"</td></tr>" 
                +"<tr><th> Image </th><td>"+ ob.image +"</td></tr>" 
                +"<tr><th> Name </th><td>"+ ob.name +"</td></tr>" 
                +"<tr><th> Description </th><td>"+ ob.description +"</td></tr>" 
                +"<tr><th> Brand </th><td>"+ ob.productbrand_id.name +"</td></tr>" 
                +"<tr><th> Size </th><td>"+ ob.size +"</td></tr>" 
                +"<tr><th> Price </th><td>"+ ob.price +"</td></tr>" 
                +"<tr><th> Discount </th><td>"+ ob.discount_rate +"</td></tr>" 
                +"<tr><th> Profit </th><td>"+ ob.profit_rate +"</td></tr>" 
                +"<tr><th> Manufacture </th><td>"+ ob.productmanufacture_id.name +"</td></tr>" 
                +"<tr><th> Category </th><td>"+ ob.productcategory_id.name +"</td></tr>" 
                +"<tr><th> Department </th><td>"+ ob.productcategory_id.productdepartment_id.name +"</td></tr> "
                +"<tr><th> Status </th><td>"+ ob.productstatus_id.name +"</td></tr> "
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
    if (product.productcategory_id == null) {
        errors = errors + "Please Enter category\n"
    }
    // if (product.department_id == null) {
    //     errors = errors + "Please Enter department\n"
    // }
    if (product.productmanufacture_id == null) {
        errors = errors + "Please select manufacture \n";
    }
    if (product.productbrand_id == null) {
        errors = errors + "Please Select brand \n";
    }
    if (product.size == null) {
        errors = errors + "Please enter size \n";
    }
    if (product.discount_rate == null) {
        errors = errors + "Please enter discount rate \n";
    }
    if (product.profit_rate == null) {
        errors = errors + "Please enter profit rate \n";
    }
    if (product.productstatus_id == null) {
        errors = errors + "Please Select Status \n";
    }
    if (product.name == null) {
        errors = errors + "Please Enter product name \n";
    }
    if (product.description == null) {
        errors = errors + "Please Enter description\n";
    }
    return errors;
}

const buttonProductSubmit = () => {
    console.log(product);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ product.name +"?");
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
        if (product.image != oldProduct.image) {
            updates = updates + "Product description - " + oldProduct.image + " to " + product.image + "\n";
        }
        if (product.productcategory_id.name != oldProduct.productcategory_id.name) {
            updates = updates + "Category - " + oldProduct.productcategory_id.name + " to " + product.productcategory_id.name + "\n";
        }
        if (product.name != oldProduct.name) {
            updates = updates + "Name - " + oldProduct.name + " to " + product.name + "\n";
        }
        if (product.productmanufacture_id.name != oldProduct.productmanufacture_id.name) {
            updates = updates + "Manufacture - " + oldProduct.productmanufacture_id.name + " to " + product.productmanufacture_id.name + "\n";
        }
        if (product.productitem_id.name != oldProduct.productitem_id.name) {
            updates = updates + "Manufacture - " + oldProduct.productitem_id.name + " to " + product.productitem_id.name + "\n";
        }
        if (product.productbrand_id.name != oldProduct.productbrand_id.name) {
            updates = updates + "Brand - " + oldProduct.productbrand_id.name + " to " + product.productbrand_id.name + "\n";
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
        if (product.productstatus_id.name != oldProduct.productstatus_id.name) {
            updates = updates + "Status - " + oldProduct.productstatus_id.name + " to " + product.productstatus_id.name + "\n";
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
};


const buttonProductUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ product.name +"? \n");
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