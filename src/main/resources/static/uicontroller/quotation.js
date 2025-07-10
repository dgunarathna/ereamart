window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshQuotationTable();
    refreshQuotationForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshQuotationTable = () => {
    let Quotations = [
        { id: 1, Quotationno: "Q001", totalitems: 2, requestddate: "2025-03-12", note: "note 1", supplier_id: { id: 1, name: "Jane Smith" }, status_id: { id: 1, name: "Active" }},
        { id: 2, Quotationno: "Q002", totalitems: 3, requestddate: "2025-03-12", note: "note 2", supplier_id: { id: 2, name: "Michael Johnson" }, status_id: { id: 1, name: "Active" }},
        { id: 3, Quotationno: "Q003", totalitems: 4, requestddate: "2025-03-12", note: "note 3", supplier_id: { id: 3, name: "Emily Davis" }, status_id: { id: 2, name: "Deactive" }},
        { id: 4, Quotationno: "Q004", totalitems: 5, requestddate: "2025-03-12", note: "note 4", supplier_id: { id: 4, name: "Robert Wilson" }, status_id: { id: 1, name: "Active" }},
        { id: 5, Quotationno: "Q005", totalitems: 6, requestddate: "2025-03-12", note: "note 5", supplier_id: { id: 5, name: "Sophia Brown" }, status_id: { id: 2, name: "Deactive" }}
      ];      
    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "Quotationno", dataType: "string"},
        {propertyName: getSupplier, dataType: "function"},
        {propertyName: "totalitems", dataType: "string"},
        {propertyName: "note", dataType: "string"},
        {propertyName: "requestddate", dataType: "string"},
        {propertyName: getStatus, dataType: "function"}
    ];

    fillDataIntoTable(tableQuotationBody, Quotations, propertyList, QuotationFormRefill);

    new DataTable('#', {
        info: false,
        paging: false,
        searching: false,
        scrollCollapse: true,
        scrollY: '100vh'
    });
}

const getSupplier = (dataOb) => {
    return dataOb.supplier_id.name;
}

const getStatus = (dataOb) => {
    if (dataOb.status_id.name == "Active") {
        return "<p class='badge bg-success w-100 my-auto'>" + dataOb.status_id.name + "</p>";
    } if (dataOb.status_id.name == "Deactive") {
        return "<p class='badge bg-dark w-100 my-auto'>" + dataOb.status_id.name + "</p>";
    } 
}

//form *********************************************************************************************************************************************************************************************

const refreshQuotationForm = () => {
    Quotation = new Object();
    qutation.qutationrHasItemList = new Array();

    formQuotation.reset();

    setDefault([selectSupplier, textItems, textDate, selectQuotationStatus, textNote]);
    
    let supliers = [
        {id:1, name:"Jane Smith"},
        {id:2, name:"Michael Johnson"},
        {id:3, name:"Emily Davis"},
        {id:4, name:"Robert Wilson"},
        {id:5, name:"Sophia Brown"},
    ];

    fillDataIntoSelect(selectSupplier,"Select supplier",supliers,"name");

    let QuotationStatus = [
        {id:1, name:"Active"},
        {id:2, name:"Deactive"},
    ];

    fillDataIntoSelect(selectQuotationStatus,"Select Status",QuotationStatus,"name");  

    //inner form ************************************
    refreshQutationInnerForm();

}


const QuotationFormRefill = (ob, index) => {
    refreshQuotationForm();
    console.log("Edit", ob, index);

    selectSupplier.value = JSON.stringify(ob.supplier_id);
    textItems.value = ob.totalitems;
    textDate.value = ob.requestddate;
    textNote.value = ob.note;
    selectQuotationStatus.value = JSON.stringify(ob.status_id);


    Quotation = JSON.parse(JSON.stringify(ob));
    oldQuotation = JSON.parse(JSON.stringify(ob));

    $("#modalQuotationForm").modal("show");
    $("#modalQuotationFormLabel").text(ob.Quotationno);
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
        let deleteResponce = "OK";
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
                +"<tr><th> Request Date </th><td>"+ ob.requestddate +"</td></tr>" 
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
    if (Quotation.supplier_id == null) {
        errors = errors + "Please enter supplier\n"
    }
    if (Quotation.totalitems == null) {
        errors = errors + "Please enter total items\n"
    }
    if (Quotation.requestddate == null) {
        errors = errors + "Please select Date \n";
    }
    if (Quotation.status_id == null) {
        errors = errors + "Please select Status \n";
    }
    if (Quotation.note == null) {
        errors = errors + "Please select Note \n";
    }
    return errors;
}

const buttonQuotationSubmit = () => {
    console.log(Quotation);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ Quotation.Quotationno +"?");
        if (userConfirm == true) {
            let postResponce = "OK";
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

    console.log(Quotation);
    console.log(oldQuotation);
    
    if (Quotation != null && oldQuotation !== null) {
        if (Quotation.supplier_id.name != oldQuotation.supplier_id.name) {
            updates = updates + "Supplier - " + oldQuotation.supplier_id.name + " to " + Quotation.supplier_id.name + "\n";
        }
        if (Quotation.totalitems != oldQuotation.totalitems) {
            updates = updates + "Totalitems - " + oldQuotation.totalitems + " to " + Quotation.totalitems + "\n";
        }
        if (Quotation.requestddate != oldQuotation.requestddate) {
            updates = updates + "Requested Date - " + oldQuotation.requestddate + " to " + Quotation.requestddate + "\n";
        }
        if (Quotation.status_id.name != oldQuotation.status_id.name) {
            updates = updates + "Status - " + oldQuotation.status_id.name + " to " + Quotation.status_id.name + "\n";
        }
        if (Quotation.note != oldQuotation.note) {
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
                let putResponce = "OK";
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
    selectQuotationStatus.setDefault = "Active";

    $("#modalQuotationFormLabel").text("Add New Quotation");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}

// inner form ***************************************************************************************************************************************************************************************

