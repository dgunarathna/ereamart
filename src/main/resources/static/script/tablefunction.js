//fill table 
const fillDataIntoTable = (tableBodayId, dataList, propertyList, editFunction)=>{
   
    tableBodayId.innerHTML = "";

    dataList.forEach((dataOb,index) => {
        let tr = document.createElement("tr");

        for (const property of propertyList) {
            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            } 
            if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);
            } 
            if (property.dataType == "decimal") {
                td.innerText = parseFloat(dataOb[property.propertyName]).toFixed(2);
            } 
            if (property.dataType == "image-array") {
                let img = document.createElement("img");
                img.style.width = "40px";
                img.style.borderRadius = "4px";
                 if (dataOb[property.propertyName] != null) {
                        img.src = atob(dataOb[property.propertyName]);
                    } else {
                        img.src = "/images/default.png";
                    }
                td.appendChild(img);
            }

            tr.appendChild(td);
        }

        // Table actions
        
        tr.onclick = ()=>{
            console.log("Edit" , dataOb);
            editFunction(dataOb,index);
            window['editOb']= dataOb;
            window['editRowIndex']= index;
        };

        tableBodayId.appendChild(tr);
    });
}

const fillDataIntoInnerTable = (tableBodayId, dataList, propertyList, editFunction, deleteFunction, buttonVisibility = true)=>{
   
    
    tableBodayId.innerHTML = "";

    dataList.forEach((dataOb,index) => {
        let tr = document.createElement("tr");

        for (const property of propertyList) {
            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            } if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);
            } if (property.dataType == "decimal") {
                td.innerText = parseFloat(dataOb[property.propertyName]).toFixed(2);
            }

            tr.appendChild(td);
        }

        // actions

        let tdbuttons = document.createElement("td");

        let buttonEdit = document.createElement("button");
        buttonEdit.className = "btn btn-icon btn-outline-warning d-inline me-1";
        buttonEdit.innerHTML = "<i class='fa-solid fa-pen'></i>";
        tdbuttons.appendChild(buttonEdit);
        buttonEdit.onclick = ()=>{
            console.log("Edit" , dataOb);
            editFunction(dataOb,index);
        };

        let buttonDelete = document.createElement("button");
        buttonDelete.className = "btn btn-icon btn-outline-danger d-inline";
        buttonDelete.innerHTML = "<i class='fa-solid fa-trash'></i>";
        tdbuttons.appendChild(buttonDelete);
        buttonDelete.onclick = ()=>{
            console.log("Delete" , dataOb);
            deleteFunction(dataOb,index);
        };
        
        if (buttonVisibility) {
            tr.appendChild(tdbuttons);
        }

        tableBodayId.appendChild(tr);
    });
}

// datatables jquery 
new DataTable('#tablePrivilege, #tableEmployee, #tableUser, #tableProduct, #tableQuotation, #tableOrder, #tableProduct, #tableGRN, #tableInventory, #tableInvoice, #tableExpenses, #tableIncome, #tableSupplier, #tableCustomer ,  #tableOrderItem , #tabledahboard' , {
    info: false,
    paging: false,
    searching: false,
});