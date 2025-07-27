window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshExpensesTable();
    refreshExpensesForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshExpensesTable = () => {

    let expenses = getServiceRequest('/expense/alldata');

    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "bill_no", dataType: "string"},
        {propertyName: "expensesreceipt", dataType: "string"},
        {propertyName: getSupplierName, dataType: "function"},
        {propertyName: "payment_method", dataType: "string"},
        {propertyName: "date", dataType: "string"},
        {propertyName: "total_due_amount", dataType: "string"},
        {propertyName: "paid_amount", dataType: "string"},
        {propertyName: "balance_amount", dataType: "string"},
    ];

    fillDataIntoTable(tableExpensesBody, expenses, propertyList, expensesFormRefill);
}

const getSupplierName = (dataOb) => {
    return dataOb.supplier_id.name;
}

//form *********************************************************************************************************************************************************************************************

const refreshExpensesForm = () => {
    expenses = new Object();

    formExpenses.reset();

    setDefault([billNo, expensesReceipt, selectSupplier, selectPaymentMethord, textTotalDue, textTotalPaid, textTotalBalance, expensesDate]);

    let supliers = getServiceRequest('/supplier/alldata');

    fillDataIntoSelect(selectSupplier,"Select Status",supliers,"name");

}

const expensesFormRefill = (ob, index) => {
    refreshExpensesForm();
    console.log("Edit", ob, index);

    billNo.value = ob.bill_no;
    expensesReceipt.value = ob.expensesreceipt;
    selectSupplier.value = JSON.stringify(ob.supplier_id);
    selectPaymentMethord.value = ob.payment_method;
    textTotalDue.value = ob.total_due_amount;
    textTotalPaid.value = ob.paid_amount;
    textTotalBalance.value = ob.balance_amount;
    expensesDate.value = ob.date;

    expenses = JSON.parse(JSON.stringify(ob));
    oldExpenses = JSON.parse(JSON.stringify(ob));

    $("#modalExpensesForm").modal("show");
    $("#modalExpensesFormLabel").text(ob.billno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}

const buttonExpensesDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.billno + "?");
    if (userConfirm == true) {
        let deleteResponce = getHTTPServiceRequest("/expenses/delete", "DELETE", ob);
        if (deleteResponce == "OK") {
            window.alert("Delete Successfully");
            refreshExpensesTable();
            $("#modalExpensesForm").modal("hide"); 
        }else{
            window.alert("Faild to Delete\n" + errors)
        }
    }
}

const buttonExpensesPrint = (ob, index) => {
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
            +"<h5 class='mb-4'>"+ ob.billno + " Details</h5>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Bill no </th><td>"+ ob.billno +"</td></tr>" 
                +"<tr><th> expensesReceipt </th><td>"+ ob.expensesreceipt +"</td></tr>" 
                +"<tr><th> Supplier </th><td>"+ ob.supplier_id.name +"</td></tr>" 
                +"<tr><th> Payment Method </th><td>"+ ob.payment_method +"</td></tr>" 
                +"<tr><th> Total Due Amount </th><td>"+ ob.totaldueamount +"</td></tr>" 
                +"<tr><th> Paid Amount </th><td>"+ ob.paidamount +"</td></tr>" 
                +"<tr><th> Balance Amount </th><td>"+ ob.balanceamount +"</td></tr>" 
                +"<tr><th> Date </th><td>"+ ob.date +"</td></tr>"
            +"</tbody>" 
            +"</table>" 
        +"</div>" 
    +"</body>";

    newWindow.document.write(printView);
    
    setTimeout(()=>{
        newWindow.stop();
        newWindow.print();
        newWindow.close();
        $("#modalExpensesForm").modal("hide"); 
    }, 500);
}

const checkFormError = ()=>{
    let errors = "";
    if (expenses.bill_no == null) {
        errors = errors + "Please Enter Bill no\n"
    }
    if (expenses.supplier_id == null) {
        errors = errors + "Please Select Supplier\n"
    }
    if (expenses.payment_method == null) {
        errors = errors + "Please Enter Payment Method\n"
    }
    if (expenses.total_due_amount == null) {
        errors = errors + "Please Enter Total Due Amount\n"
    }
    if (expenses.paid_amount == null) {
        errors = errors + "Please Enter Paid Amount\n"
    }
    if (expenses.balance_amount == null) {
        errors = errors + "Please Enter Balance Amount\n"
    }
    if (expenses.date == null) {
        errors = errors + "Please Enter Date\n"
    }
    return errors;
}

const buttonExpensesSubmit = () => {
    console.log(expenses);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ expenses.bill_no +"?");
        if (userConfirm == true) {
            let postResponce = getHTTPServiceRequest("/expenses/insert", "POST", expenses);
            if (postResponce == "OK") {
                window.alert("Save Successfully");
                refreshExpensesTable();
                refreshExpensesForm();
                $("#modalExpensesForm").modal("hide");
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

    console.log(expenses);
    console.log(oldExpenses);
    
    if (expenses != null && oldExpenses !== null) {
        if (expenses.bill_no != oldExpenses.bill_no) {
            updates = updates + "Bill no - " + oldExpenses.bill_no + " to " + expenses.bill_no + "\n";
        }
        if (expenses.expensesreceipt != oldExpenses.expensesreceipt) {
            updates = updates + "expensesReceipt - " + oldExpenses.expensesreceipt + " to " + expenses.expensesreceipt + "\n";
        }
        if (expenses.supplier_id.name != oldExpenses.supplier_id.name) {
            updates = updates + "Supplier - " + oldExpenses.supplier_id.name + " to " + expenses.supplier_id.name + "\n";
        }
        if (expenses.payment_method != oldExpenses.payment_method) {
            updates = updates + "Payment Method - " + oldExpenses.payment_method + " to " + expenses.payment_method + "\n";
        }
        if (expenses.total_due_amount != oldExpenses.total_due_amount) {
            updates = updates + "Total Due Amount - " + oldExpenses.total_due_amount + " to " + expenses.total_due_amount + "\n";
        }
        if (expenses.paid_amount != oldExpenses.paid_amount) {
            updates = updates + "Paid Amount - " + oldExpenses.paid_amount + " to " + expenses.paid_amount + "\n";
        }
        if (expenses.balance_amount != oldExpenses.balance_amount) {
            updates = updates + "Balance Amount - " + oldExpenses.balance_amount + " to " + expenses.balance_amount + "\n";
        }
        if (expenses.date != oldExpenses.date) {
            updates = updates + "Date - " + oldExpenses.date + " to " + expenses.date + "\n";
        }
    }
    return updates;
}

const buttonExpensesUpdate = () => {
    let errors = checkFormError();
    if (errors == "") {
        let updates = checkFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update "+ expenses.billno +"?\n" + updates);
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/expenses/update", "PUT", expenses);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    refreshExpensesTable();
                    refreshExpensesForm();
                    $("#modalExpensesForm").modal("hide");
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
    refreshExpensesForm();
    $("#modalExpensesFormLabel").text("Add New Expenses");

    $("#buttonSubmit").show();
    $("#buttonClear").show();

    $("#buttonDelete").hide();
    $("#buttonPrint").hide();
    $("#buttonUpdate").hide();
}
