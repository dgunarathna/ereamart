window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshProductTable();
    refreshProductForm();
    refreshProductManufactureForm();
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
        {propertyName: "rop", dataType: "string"},
        {propertyName: "roq", dataType: "string"},
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

    setDefault([selectCategory, selectDepartment, textProductName, textManufacture, textBrand, textSize, selectUnit, textROP, textROQ, selectStatus]);

    let departments = getServiceRequest('/productdepartment/alldata');
    fillDataIntoSelect(selectDepartment,"Select Department",departments,"name");

    // Initialize categories as empty - will be populated when department is selected
    fillDataIntoSelect(selectCategory,"Select Category",[],"name");
    
    let status = getServiceRequest('/productstatus/alldata');
    fillDataIntoSelect(selectStatus,"Select Status",status,"name");
    selectStatus.value = JSON.stringify(status[0]); // set default values
    product.productstatus_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen"

    // initialize unit
    product.unit = null;

    let manufactures = getServiceRequest('/productmanufacture/alldata');
    fillDataIntoSelect(textManufacture,"Select Manufacture",manufactures,"name");

    let brands = getServiceRequest('/productbrand/alldata');
    fillDataIntoSelect(textBrand,"Select Brand",brands,"name");

    let items = getServiceRequest('/productitem/alldata');
    fillDataIntoSelect(selectProduct,"Select product",items,"name");

    // let brandsbycategory = getServiceRequest('/productbrands/bycategory/'+ category.id);
    // fillDataIntoSelect(textBrand,"Select Brand",brandsbycategory,"name");

    textProductName.disabled = "disabled";
}


// Common function to update product.name
let textSizeElement   = document.querySelector("#textSize");
let textBrandElement  = document.querySelector("#textBrand");
let selectProductElement = document.querySelector("#selectProduct");
let selectUnitElement = document.querySelector("#selectUnit");

function updateProductName() {
    try {
        if (!textBrandElement || !textBrandElement.value || textBrandElement.value === "") return;
        if (!selectProductElement || !selectProductElement.value || selectProductElement.value === "") return;
        
        let brand = JSON.parse(textBrandElement.value);
        let item  = JSON.parse(selectProductElement.value);
        let size  = textSizeElement ? textSizeElement.value : "";
        let unit  = (selectUnitElement && selectUnitElement.value) ? selectUnitElement.value : "";
        // Build name parts, skip empty parts to avoid extra spaces
        let parts = [brand.name, item.name];
        if (size && size.trim() !== "") parts.push(size.trim());
        if (unit && unit.trim() !== "") parts.push(unit.trim());

        textProductName.value = parts.join(" ");
        if (product) product.name = textProductName.value;
    } catch (e) {
        console.error("Error updating product name:", e);
        // Don't update name if parsing fails
    }
}

textSizeElement.addEventListener("input", updateProductName);
textBrandElement.addEventListener("change", updateProductName);
selectProductElement.addEventListener("change", updateProductName);
if (selectUnitElement) {
    selectUnitElement.addEventListener("change", ()=>{
        // selectStaticElementValidator will set product.unit via onchange attribute; keep product in-sync and regenerate name
        if (product) product.unit = selectUnitElement.value ? selectUnitElement.value : null;
        updateProductName();
    });
}

// filter categories by select department dropdown
function filterProductByDepartment() {
    let selectDepartment = document.getElementById("selectDepartment");
    let selectCategory = document.getElementById("selectCategory");
    
    if (selectDepartment && selectDepartment.value && selectDepartment.value !== "") {
        try {
            let departmentData = JSON.parse(selectDepartment.value);
            if (departmentData && departmentData.id) {
                let categoriesByDepartment = getServiceRequest('/productcategory/bydepartment?departmentid=' + departmentData.id);
                fillDataIntoSelect(selectCategory,"Select Category",categoriesByDepartment,"name");
                // Clear the category selection when department changes
                if (product) product.productcategory_id = null;
                if (selectCategory) selectCategory.style.border = "1px solid #ced4da";
            }
        } catch (e) {
            console.error("Error parsing department data:", e);
            // If parsing fails, clear categories
            if (selectCategory) fillDataIntoSelect(selectCategory,"Select Category",[],"name");
            if (product) product.productcategory_id = null;
        }
    } else {
        // If no department selected, clear categories
        if (selectCategory) fillDataIntoSelect(selectCategory,"Select Category",[],"name");
        if (product) product.productcategory_id = null;
    }
}





const productFormRefill = (ob, index) => {
    refreshProductForm();
    console.log("Edit", ob, index);

    // set photo 
    if (ob.image != null) {
        imgproductPhotoPreview.src = atob(ob.image);
    } else {
        imgproductPhotoPreview.src = "/images/default.png";
    }

    selectDepartment.value = JSON.stringify(ob.productcategory_id.productdepartment_id);
    // Load categories for the selected department before setting category value
    let categoriesByDepartment = getServiceRequest('/productcategory/bydepartment?departmentid=' + ob.productcategory_id.productdepartment_id.id);
    fillDataIntoSelect(selectCategory,"Select Category",categoriesByDepartment,"name");
    selectCategory.value = JSON.stringify(ob.productcategory_id);
    textProductName.value = ob.name;
    textManufacture.value = JSON.stringify(ob.productmanufacture_id);
    textBrand.value = JSON.stringify(ob.productbrand_id);
    selectProduct.value = JSON.stringify(ob.productitem_id);
    textSize.value = ob.size;
    if (selectUnit) {
        selectUnit.value = ob.unit ? ob.unit : "";
        // ensure product object has unit and product name reflects it
        if (product) product.unit = ob.unit ? ob.unit : null;
    }
    // regenerate product name after populating brand/product/size/unit
    try { updateProductName(); } catch(e) { /* ignore if elements not ready */ }
    textROQ.value = ob.roq;
    textROP.value = ob.rop;
    selectStatus.value = JSON.stringify(ob.productstatus_id);

    if (ob.productstatus_id.name == "Unavailable") {
        buttonDelete.disabled = "disabled";
        buttonUpdate.disabled = "disabled";
        selectStatus.disabled = "disabled";
    }

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
                +"<tr><th> Brand </th><td>"+ ob.productbrand_id.name +"</td></tr>" 
                +"<tr><th> Size </th><td>"+ ob.size +"</td></tr>" 
                +"<tr><th> ROP </th><td>"+ ob.rop +"</td></tr>" 
                +"<tr><th> Discount </th><td>"+ ob.roq +"</td></tr>" 
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
    if (product.roq == null) {
        errors = errors + "Please enter roq\n";
    }
    if (product.rop == null) {
        errors = errors + "Please enter rop \n";
    }
    if (product.productstatus_id == null) {
        errors = errors + "Please Select Status \n";
    }
    if (product.name == null) {
        errors = errors + "Please Enter product name \n";
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
            updates = updates + "Product image - " + oldProduct.image + " to " + product.image + "\n";
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
        if (product.rop != oldProduct.rop) {
            updates = updates + "ROP - " + oldProduct.rop + " to " + product.rop + "\n";
        }  
        if (product.roq != oldProduct.roq) {
            updates = updates + "ROQ - " + oldProduct.roq + " to " + product.roq + "\n";
        }
        if (product.size != oldProduct.size) {  
            updates = updates + "Size - " + oldProduct.size + " to " + product.size + "\n";
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
            let userConfirm = window.confirm("Are you sure to update "+ product.name +"? \n"  + updates);
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

    
    selectDepartment.disabled = "";

}





// Manufacture form ************************************************************************************************************************************************************************************


const refreshProductManufactureForm = () => {
    
    productmanufacture = new Object();
    formProduct.reset();

    setDefault([textManufacture]);
}

const checkProductManufactureFormError = ()=>{
    let errors = "";
    if (productmanufacture.name == null) {
        errors = errors + "Please Enter manufacture name\n"
    }
    return errors;
}


const buttonProductManufactureSubmit = () => {
    console.log(productmanufacture);

    let errors = checkProductManufactureFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ productmanufacture.name +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/productmanufacture/insert", "POST", productmanufacture);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                $("#modalAddManufactureForm").modal("hide");
                refreshProductManufactureForm();
                refreshProductForm();
                $("#modalProductForm").modal("show");
            }else{
                window.alert("Faild to submit\n" + postResponce);
            }
        }
    }else{
        window.alert("Form has following errors\n" + errors);
    }
}