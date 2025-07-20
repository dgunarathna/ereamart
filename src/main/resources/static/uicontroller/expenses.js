window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshExpensesTable();
    refreshExpensesForm();
});

//table *********************************************************************************************************************************************************************************************
const refreshExpensesTable = () => {
    let expenses = [
        { id: 1, billno: "EXP001", expensesreceipt: "/images/default.png", paymentmethord: "Cash", totaldueamount: 150.75, paidamount: 100.00, balanceamount: 50.75, date: "2025-03-12", supplier_id: { id: 1, name: "Jane Smith" }},
        { id: 2, billno: "EXP002", expensesreceipt: "/images/default.png", paymentmethord: "Card", totaldueamount: 200.50, paidamount: 200.50, balanceamount: 0.00, date: "2025-03-11", supplier_id: { id: 3, name: "Michael Johnson" }},
        { id: 3, billno: "EXP003", expensesreceipt: "/images/default.png", paymentmethord: "Bank", totaldueamount: 500.00, paidamount: 450.00, balanceamount: 50.00, date: "2025-03-10", supplier_id: { id: 2, name: "Emily Davis" }},
        { id: 4, billno: "EXP004", expensesreceipt: "/images/default.png", paymentmethord: "Cash", totaldueamount: 320.25, paidamount: 200.00, balanceamount: 120.25, date: "2025-03-09", supplier_id: { id: 1, name: "Robert Wilson" }},
        { id: 5, billno: "EXP005", expensesreceipt: "/images/default.png", paymentmethord: "Card", totaldueamount: 99.99, paidamount: 50.00, balanceamount: 49.99, date: "2025-03-08", supplier_id: { id: 3, name: "Sophia Brown" }}
      ]
    ;
    // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        {propertyName: "billno", dataType: "string"},
        {propertyName: "expensesreceipt", dataType: "string"},
        {propertyName: getSupplierName, dataType: "function"},
        {propertyName: "paymentmethord", dataType: "string"},
        {propertyName: "date", dataType: "string"},
        {propertyName: "totaldueamount", dataType: "string"},
        {propertyName: "paidamount", dataType: "string"},
        {propertyName: "balanceamount", dataType: "string"},
    ];

    fillDataIntoTable(tableExpensesBody, expenses, propertyList, expensesFormRefill);
}

const getSupplierName = (dataOb) => {
    return dataOb.supplier_id.name;
}

//form *********************************************************************************************************************************************************************************************

const refreshExpensesForm = () => {
    expenses = new Object();
    expenses.expensesHasItemList = new Array();

    formExpenses.reset();

    setDefault([billNo, expensesReceipt, selectSupplier, selectPaymentMethord, textTotalDue, textTotalPaid, textTotalBalance, expensesDate]);

    let supliers = [
        {id: 1, name: "Jane Smith"},
        {id: 3, name: "Michael Johnson"},
        {id: 2, name: "Emily Davis"},
        {id: 1, name: "Robert Wilson"},
        {id: 3, name: "Sophia Brown"},
    ];

    fillDataIntoSelect(selectSupplier,"Select Status",supliers,"name");

    //inner form ************************************
    refreshExpensesInnerForm();
}

const expensesFormRefill = (ob, index) => {
    refreshExpensesForm();
    console.log("Edit", ob, index);

    billNo.value = ob.billno;
    expensesReceipt.value = ob.expensesreceipt;
    selectSupplier.value = JSON.stringify(ob.supplier_id);
    selectPaymentMethord.value = ob.paymentmethord;
    textTotalDue.value = ob.totaldueamount;
    textTotalPaid.value = ob.paidamount;
    textTotalBalance.value = ob.balanceamount;
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
        let deleteResponce = "OK";
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
                +"<tr><th> Payment Method </th><td>"+ ob.paymentmethord +"</td></tr>" 
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
    if (expenses.billno == null) {
        errors = errors + "Please Enter Bill no\n"
    }
    if (expenses.expensesreceipt == null) {
        errors = errors + "Please Enter expensesReceipt\n"
    }
    if (expenses.supplier_id == null) {
        errors = errors + "Please Select Supplier\n"
    }
    if (expenses.paymentmethord == null) {
        errors = errors + "Please Enter Payment Method\n"
    }
    if (expenses.totaldueamount == null) {
        errors = errors + "Please Enter Total Due Amount\n"
    }
    if (expenses.paidamount == null) {
        errors = errors + "Please Enter Paid Amount\n"
    }
    if (expenses.balanceamount == null) {
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
        let userConfirm = window.confirm("Are you sure to add "+ expenses.billno +"?");
        if (userConfirm == true) {
            let postResponce = "OK";
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
        if (expenses.billno != oldExpenses.billno) {
            updates = updates + "Bill no - " + oldExpenses.billno + " to " + expenses.billno + "\n";
        }
        if (expenses.expensesreceipt != oldExpenses.expensesreceipt) {
            updates = updates + "expensesReceipt - " + oldExpenses.expensesreceipt + " to " + expenses.expensesreceipt + "\n";
        }
        if (expenses.supplier_id.name != oldExpenses.supplier_id.name) {
            updates = updates + "Supplier - " + oldExpenses.supplier_id.name + " to " + expenses.supplier_id.name + "\n";
        }
        if (expenses.paymentmethord != oldExpenses.paymentmethord) {
            updates = updates + "Payment Method - " + oldExpenses.paymentmethord + " to " + expenses.paymentmethord + "\n";
        }
        if (expenses.totaldueamount != oldExpenses.totaldueamount) {
            updates = updates + "Total Due Amount - " + oldExpenses.totaldueamount + " to " + expenses.totaldueamount + "\n";
        }
        if (expenses.paidamount != oldExpenses.paidamount) {
            updates = updates + "Paid Amount - " + oldExpenses.paidamount + " to " + expenses.paidamount + "\n";
        }
        if (expenses.balanceamount != oldExpenses.balanceamount) {
            updates = updates + "Balance Amount - " + oldExpenses.balanceamount + " to " + expenses.balanceamount + "\n";
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
                let putResponce = "OK";
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

// inner form ***************************************************************************************************************************************************************************************