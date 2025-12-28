window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshIncomeTable();
    refreshIncomeForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshIncomeTable = () => {

    let incomes = getServiceRequest('/income/alldata');


    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "income_number", dataType: "string"},
        {propertyName: "receiptimage", dataType: "image-array" },
        {propertyName: getInvoice, dataType: "function"},
        {propertyName: "payment_methord", dataType: "string"},
        {propertyName: "date", dataType: "string"},
        {propertyName: "total_amount", dataType: "decimal"},
        {propertyName: getStatus, dataType: "function"},
    ];

    fillDataIntoTable(tableIncomeBody, incomes, propertyList, incomeFormRefill);
    $('#tableIncome').DataTable.DataTable().destroy()({
        info: false,
        paging: false,
        searching: false
        });

}

const getInvoice = (dataOb) => {
    return dataOb.invoice_id.invoice_code;
}

const getStatus = (dataOb) => {
    if (dataOb.income_status_id.name == "Complete") {
        return "<p class='badge bg-success text-light w-100 my-auto'>" + dataOb.income_status_id.name + "</p>";
    } if (dataOb.income_status_id.name == "Delete") {
        return "<p class='badge bg-danger w-100 my-auto'>" + dataOb.income_status_id.name + "</p>";
    }
}


//form *********************************************************************************************************************************************************************************************

const refreshIncomeForm = () => {
    income = new Object();

    formIncome.reset();

    fileReceiptPhoto.value = "";
    imgReceiptPhotoPreview.src = "/images/default.png";

    setDefault([ selectInvoiceNo, selectPaymentMethord, incomeDate, textTotal,]);

    let invoices = getServiceRequest('/invoice/alldata');
    fillDataIntoSelect(selectInvoiceNo,"Select invoice",invoices,"invoice_code");

    // Customer selection removed for Income

    let status = getServiceRequest('/incomestatus/alldata');
    fillDataIntoSelect(selectStatus,"Select status",status,"name");
    selectStatus.value = JSON.stringify(status[0]);
    income.income_status_id = JSON.parse(selectStatus.value);
    selectStatus.style.border = "1px solid lightgreen"
}


const filterinvoicedata = () => {
    let invoiceDetails = getServiceRequest('/details/getbyinvoice/' + JSON.parse(selectInvoiceNo.value).id);

    textTotal.value = invoiceDetails.total_amount;
    income.total_amount = invoiceDetails.total_amount;
    textTotal.style.border = "1px solid lightgreen";

    incomeDate.value = invoiceDetails.added_datetime.split('T')[0];
    income.date = invoiceDetails.added_datetime.split('T')[0];
    incomeDate.style.border = "1px solid lightgreen";
}


const incomeFormRefill = (ob, index) => {
    refreshIncomeForm();
    console.log("Edit", ob, index);

    // set photo 
    if (ob.image != null) {
        imgReceiptPhotoPreview.src = atob(ob.image);
    } else {
        imgReceiptPhotoPreview.src = "/images/default.png";
    }

    selectInvoiceNo.value = JSON.stringify(ob.invoice_id);
    selectPaymentMethord.value = ob.payment_methord;
    incomeDate.value = ob.date;
    textTotal.value = ob.total_amount;
    selectStatus.value = JSON.stringify(ob.income_status_id);

    if (ob.income_status_id.name == "Delete") {
        buttonDelete.disabled = "disabled";
        buttonUpdate.disabled = "disabled";
        selectStatus.disabled = "disabled";
    }

    income = JSON.parse(JSON.stringify(ob));
    oldIncome = JSON.parse(JSON.stringify(ob));

    $("#modalIncomeForm").modal("show");
    $("#modalIncomeFormLabel").text(ob.income_number);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}

const buttonIncomeDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.income_number + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/income/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshIncomeTable();
            $("#modalIncomeForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonIncomePrint = (ob, index) => {
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
                +"<tr><th> Income no </th><td>"+ ob.income_number +"</td></tr>" 
                +"<tr><th> Receipt </th><td>"+ ob.receiptimage +"</td></tr>" 
                +"<tr><th> Invoice no </th><td>"+ ob.invoice_id.invoice_code +"</td></tr>" 
                
                +"<tr><th> Payment Method </th><td>"+ ob.payment_methord +"</td></tr>" 
                +"<tr><th> Date </th><td>"+ ob.date +"</td></tr>" 
                +"<tr><th> Total Amount </th><td>"+ ob.total_amount +"</td></tr>" 
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalIncomeForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    // Customer is not required for Income anymore
    if (income.payment_methord == null) {
        errors = errors + "Please Enter Payment Method\n"
    }
    if (income.date == null) {
        errors = errors + "Please Enter Date\n"
    }
    if (income.total_amount == null) {
        errors = errors + "Please Enter Total Amount\n"
    }
    return errors;
}

const buttonIncomeSubmit = () => {
    console.log(income);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ income.income_number +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/income/insert", "POST", income);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshIncomeTable();
                refreshIncomeForm();
                $("#modalIncomeForm").modal("hide");
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

    console.log(income);
    console.log(oldIncome);
    
    if (income != null && oldIncome !== null) {
        if (income.income_number != oldIncome.income_number) {
            updates = updates + "Income no - " + oldIncome.income_number + " to " + income.income_number + "\n";
        }
        if (income.incomereceipt != oldIncome.incomereceipt) {
            updates = updates + "Receipt - " + oldIncome.incomereceipt + " to " + income.incomereceipt + "\n";
        }
        if (income.invoice_id.invoice_code != oldIncome.invoice_id.invoice_code) {
            updates = updates + "Invoice no - " + oldIncome.invoice_id.invoice_code + " to " + income.invoice_id.invoice_code + "\n";
        }
        // Customer removed: skip comparison
        if (income.payment_methord != oldIncome.payment_methord) {
            updates = updates + "Payment Method - " + oldIncome.payment_methord + " to " + income.payment_methord + "\n";
        }
        if (income.date != oldIncome.date) {
            updates = updates + "Date - " + oldIncome.date + " to " + income.date + "\n";
        }
        if (income.total_amount != oldIncome.total_amount) {
            updates = updates + "Total Amount - " + oldIncome.total_amount + " to " + income.total_amount + "\n";
        }
        if (income.income_status_id.name != oldIncome.income_status_id.name) {
            updates = updates + "Status - " + oldIncome.income_status_id.name + " to " + income.income_status_id.name + "\n";
        }
    }
    return updates;
}

const buttonIncomeUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ income.incomeno +"?\n" + updates);
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/income/update", "PUT", income);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshIncomeTable();
                    refreshIncomeForm();
                    $("#modalIncomeForm").modal("hide");
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
    refreshIncomeForm();
    $("#modalIncomeFormLabel").text("Add New Income");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}