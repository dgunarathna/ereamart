window.addEventListener("load", () => {
    console.log("browser load Event");
    // refreshitembody();
    refreshProductTable();
});

const refreshProductTable = () => {
    let products = [
        { id: 1, availableqty: 15, totalqty: 150, saleprice: "66.27", expiredate: "2025-03-12", manufacturedate: "2025-03-12", batchno: "654684849", grn_id: { id: 1, grnno: "GRN001", invoicenumber: "INV001", receiveddate: "2025-03-12", totalamount: 150.75, discountrate: "66.27%", netamount: 50.75, note: "Note 1", order_id: { id: 1, orderno: "PO001" }, status_id: { id: 1, name: "Active" }}, product_id: { id: 1, name: "Munchi busicut" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 1, regno: "REG001", brn: "BRN001", fullname: "Kells", email: "jane.smith@gmail.com", mobileno: "0723456789", address: "45 Green St City", note: "Sample note 1", bank: "Bank 1", branch: "Branch 1", accno: "1234567890", status: "Inactive"}},
        { id: 2, availableqty: 20, totalqty: 200, saleprice: "75.00", expiredate: "2025-03-11", manufacturedate: "2025-03-11", batchno: "316486484", grn_id: { id: 2, grnno: "GRN002", invoicenumber: "INV002", receiveddate: "2025-03-11", totalamount: 200.50, discountrate: "100%", netamount: 0.00, note: "Note 2", order_id: { id: 2, orderno: "PO002" }, status_id: { id: 2, name: "Received" } }, product_id: { id: 2, name: "Cake" }, status_id: { id: 2, name: "Received" }, supplier_id: { id: 2, regno: "REG002", brn: "BRN002", fullname: "Food City", email: "john.doe@gmail.com", mobileno: "0712345678", address: "12 Blue Rd Town", note: "Sample note 2", bank: "Bank 2", branch: "Branch 2", accno: "0987654321", status: "Active"}},
        { id: 3, availableqty: 50, totalqty: 500, saleprice: "90.00", expiredate: "2025-03-10", manufacturedate: "2025-03-10", batchno: "654686546", grn_id: { id: 3, grnno: "GRN003", invoicenumber: "INV003", receiveddate: "2025-03-10", totalamount: 500.00, discountrate: "90%", netamount: 50.00, note: "Note 3", order_id: { id: 3, orderno: "PO003" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 3, name: "Meat" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 3, regno: "REG003", brn: "BRN003", fullname: "Sathosa", email: "emma.brown@gmail.com", mobileno: "0776543210", address: "78 Yellow Ave Village", note: "Sample note 3", bank: "Bank 3", branch: "Branch 3", accno: "1122334455", status: "Inactive"}},
        { id: 4, availableqty: 32, totalqty: 320, saleprice: "62.44", expiredate: "2025-03-09", manufacturedate: "2025-03-09", batchno: "6516865", grn_id: { id: 4, grnno: "GRN004", invoicenumber: "INV004", receiveddate: "2025-03-09", totalamount: 320.25, discountrate: "62.44%", netamount: 120.25, note: "Note 4", order_id: { id: 4, orderno: "PO004" }, status_id: { id: 2, name: "Received" } }, product_id: { id: 4, name: "Oil" }, status_id: { id: 2, name: "Received" }, supplier_id: { id: 4, regno: "REG004", brn: "BRN004", fullname: "Glowmark", email: "michael.lee@gmail.com", mobileno: "0756789012", address: "34 Red St Metro", note: "Sample note 4", bank: "Bank 4", branch: "Branch 4", accno: "5566778899", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
        { id: 5, availableqty: 9, totalqty: 99, saleprice: "50.00", expiredate: "2025-03-08", manufacturedate: "2025-03-08", batchno: "2416616", grn_id: { id: 5, grnno: "GRN005", invoicenumber: "INV005", receiveddate: "2025-03-08", totalamount: 99.99, discountrate: "50%", netamount: 49.99, note: "Note 5", order_id: { id: 5, orderno: "PO005" }, status_id: { id: 1, name: "Active" } }, product_id: { id: 5, name: "Gas" }, status_id: { id: 1, name: "Active" }, supplier_id: { id: 5, regno: "REG005", brn: "BRN005", fullname: "Laughf", email: "sophia.white@gmail.com", mobileno: "0765432109", address: "90 Purple Lane Suburb", note: "Sample note 5", bank: "Bank 5", branch: "Branch 5", accno: "6677889900", status: "Active"}},
      ];     

    const container = document.getElementById("product-container");
    fillDataIntoCards(container, products, addToCart, itemview);
};

const addToCart = (dataOb, index) => {
    console.log("Added to cart:", dataOb, index);
    const cartitems = dataOb;
};


const itemview = (ob, index) => {
    console.log("View", ob, index);

    $("#modalExpensesForm").modal("show");
}

// Generate product cards
const fillDataIntoCards = (container, dataList, addFunction, viewFunction) => {
    container.innerHTML = ""; // Clear existing content

    dataList.forEach((dataOb, index) => {
        let colDiv = document.createElement("div");
        colDiv.classList.add("col-lg-2", "col-md-4", "col-sm-6");

        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card", "bg-transparent");

        let img = document.createElement("img");
        img.src = dataOb.productimage || "/images/product/product.png"; // Default image
        img.classList.add("card-img-top");
        img.alt = dataOb.productname;

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let seller = document.createElement("small");
        seller.classList.add("card-text", "text-success");
        seller.innerText = dataOb.supplier_id.fullname;

        let title = document.createElement("h6");
        title.classList.add("card-title");
        title.innerText = dataOb.product_id.name;

        let price = document.createElement("h5");
        price.classList.add("card-text");
        price.innerText = dataOb.saleprice;
        
        let avaibaleqty = document.createElement("p");
        avaibaleqty.classList.add("card-text");
        // avaibaleqty.innerText = "Left " + dataOb.availableqty;

        let button = document.createElement("a");
        button.href = "#";
        button.classList.add("btn", "btn-primary", "w-100");
        button.innerText = "Add to cart";
        button.onclick = (event) => {
            event.preventDefault();
            addFunction(dataOb, index);
        };
        
        img.onclick = (event) => {
            event.preventDefault();
            viewFunction(dataOb, index);
        };

        // Append elements
        cardBody.appendChild(seller);
        cardBody.appendChild(title);
        cardBody.appendChild(price);
        cardBody.appendChild(avaibaleqty);
        cardBody.appendChild(button);
        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        container.appendChild(colDiv);
    });
};

