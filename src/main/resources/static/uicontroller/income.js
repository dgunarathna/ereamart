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
        {propertyName: "incomeno", dataType: "string"},
        {propertyName: "incomereceipt", dataType: "string"},
        {propertyName: getInvoice, dataType: "function"},
        {propertyName: getCustomer, dataType: "function"},
        {propertyName: "paymentmethord", dataType: "string"},
        {propertyName: "date", dataType: "string"},
        {propertyName: "totalamount", dataType: "string"},
        {propertyName: "paidamount", dataType: "string"},
        {propertyName: "balanceamount", dataType: "string"},
    ];

    fillDataIntoTable(tableIncomeBody, incomes, propertyList, incomeFormRefill);
}

const getCustomer = (dataOb) => {
    return dataOb.customer_id.fullname;
}

const getInvoice = (dataOb) => {
    return dataOb.invoice_id.name;
}

//form *********************************************************************************************************************************************************************************************

const refreshIncomeForm = () => {
    income = new Object();

    formIncome.reset();

    setDefault([textIncomeNo, incomeReceipt, selectInvoiceNo, selectCustomer, selectPaymentMethord, incomeDate, textTotal, textPaid, textBalance]);

    let invoices = [
        {id:1, name:"INV001"},
        {id:2, name:"INV002"},
        {id:3, name:"INV003"},
        {id:4, name:"INV004"},
        {id:5, name:"INV005"},
    ];
    
    fillDataIntoSelect(selectInvoiceNo,"Select invoice",invoices,"name");

    let customers = [
        {id:1, name:"Jane Smith"},
        {id:2, name:"John Doe"},
        {id:3, name:"Emma Brown"},
        {id:4, name:"Michael Lee"},
        {id:5, name:"Sophia White"},
    ];

    fillDataIntoSelect(selectCustomer,"Select customer",customers,"name");
}

const incomeFormRefill = (ob, index) => {
    refreshIncomeForm();
    console.log("Edit", ob, index);

    textIncomeNo.value = ob.incomeno;
    incomeReceipt.value = ob.incomereceipt;
    selectInvoiceNo.value = JSON.stringify(ob.invoice_id);
    selectCustomer.value = JSON.stringify(ob.customer_id);
    selectPaymentMethord.value = ob.paymentmethord;
    incomeDate.value = ob.date;
    textTotal.value = ob.totalamount;
    textPaid.value = ob.paidamount;
    textBalance.value = ob.balanceamount;

    income = JSON.parse(JSON.stringify(ob));
    oldIncome = JSON.parse(JSON.stringify(ob));

    $("#modalIncomeForm").modal("show");
    $("#modalIncomeFormLabel").text(ob.incomeno);
    $("#buttonSubmit").hide();
    $("#buttonClear").hide();

    $("#buttonDelete").show();
    $("#buttonPrint").show();
    $("#buttonUpdate").show();
}

const buttonIncomeDelete = (ob, index) => {
    console.log("Delete", ob, index);
    let userConfirm = window.confirm("Are you sure to delete " + ob.incomeno + "?");
    if (userConfirm == true) {
        let deleteResponce = "OK";
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
            +"<h5 class='mb-4'>"+ ob.fullname + " Details</h5>"
            +"<table class='table'>"
            +"<tbody>"
                +"<tr><th> Income no </th><td>"+ ob.incomeno +"</td></tr>" 
                +"<tr><th> Receipt </th><td>"+ ob.incomereceipt +"</td></tr>" 
                +"<tr><th> Invoice no </th><td>"+ ob.invoice_id.name +"</td></tr>" 
                +"<tr><th> Customer </th><td>"+ ob.customer_id.fullname  +"</td></tr>" 
                +"<tr><th> Payment Method </th><td>"+ ob.paymentmethord +"</td></tr>" 
                +"<tr><th> Date </th><td>"+ ob.date +"</td></tr>" 
                +"<tr><th> Total Amount </th><td>"+ ob.totalamount +"</td></tr>" 
                +"<tr><th> Paid Amount </th><td>"+ ob.paidamount +"</td></tr>" 
                +"<tr><th> Balance Amount </th><td>"+ ob.balanceamount +"</td></tr>" 
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
    if (income.incomeno == null) {
        errors = errors + "Please Enter Income no\n"
    }
    if (income.incomereceipt == null) {
        errors = errors + "Please Enter Receipt\n"
    }
    if (income.invoice_id == null) {
        errors = errors + "Please Enter Invoice no\n"
    }
    if (income.customer_id == null) {
        errors = errors + "Please Enter Customer\n"
    }
    if (income.paymentmethord == null) {
        errors = errors + "Please Enter Payment Method\n"
    }
    if (income.date == null) {
        errors = errors + "Please Enter Date\n"
    }
    if (income.totalamount == null) {
        errors = errors + "Please Enter Total Amount\n"
    }
    if (income.paidamount == null) {
        errors = errors + "Please Enter Paid Amount\n"
    }
    if (income.balanceamount == null) {
        errors = errors + "Please Enter Balance Amount\n"
    }
    return errors;
}

const buttonIncomeSubmit = () => {
    console.log(income);
    
    let errors = checkFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add "+ income.incomeno +"?");
        if (userConfirm == true) {
            let postResponce = "OK";
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
        if (income.incomeno != oldIncome.incomeno) {
            updates = updates + "Income no - " + oldIncome.incomeno + " to " + income.incomeno + "\n";
        }
        if (income.incomereceipt != oldIncome.incomereceipt) {
            updates = updates + "Receipt - " + oldIncome.incomereceipt + " to " + income.incomereceipt + "\n";
        }
        if (income.invoice_id.name != oldIncome.invoice_id.name) {
            updates = updates + "Invoice no - " + oldIncome.invoice_id.name + " to " + income.invoice_id.name + "\n";
        }
        if (income.customer_id.name != oldIncome.customer_id.name) {
            updates = updates + "Customer - " + oldIncome.customer_id.name + " to " + income.customer_id.name + "\n";
        }
        if (income.paymentmethord != oldIncome.paymentmethord) {
            updates = updates + "Payment Method - " + oldIncome.paymentmethord + " to " + income.paymentmethord + "\n";
        }
        if (income.date != oldIncome.date) {
            updates = updates + "Date - " + oldIncome.date + " to " + income.date + "\n";
        }
        if (income.totaldueamount != oldIncome.totaldueamount) {
            updates = updates + "Total Amount - " + oldIncome.totaldueamount + " to " + income.totaldueamount + "\n";
        }
        if (income.paidamount != oldIncome.paidamount) {
            updates = updates + "Paid Amount - " + oldIncome.paidamount + " to " + income.paidamount + "\n";
        }
        if (income.balanceamount != oldIncome.balanceamount) {
            updates = updates + "Balance Amount - " + oldIncome.balanceamount + " to " + income.balanceamount + "\n";
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
                let putResponce = "OK";
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