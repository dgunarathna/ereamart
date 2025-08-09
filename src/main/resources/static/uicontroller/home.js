window.addEventListener("load", () => {
    console.log("browser load Event");
    // refreshitembody();
    refreshProductTable();
});

const refreshProductTable = () => {
    let products = getServiceRequest('/inventory/alldata');    
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
        img.src = dataOb.product_id.image || "/images/default.png"; // Default image
        img.classList.add("card-img-top");
        img.alt = dataOb.productname;

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let seller = document.createElement("small");
        seller.classList.add("card-text", "text-success");
        seller.innerText = dataOb.grn_id.orders_id.supplier_id.name;

        let title = document.createElement("h6");
        title.classList.add("card-title");
        title.innerText = dataOb.product_id.name;

        let price = document.createElement("h5");
        price.classList.add("card-text");
        price.innerText = dataOb.sales_price;
        
        let avaibaleqty = document.createElement("p");
        avaibaleqty.classList.add("card-text");
        avaibaleqty.innerText = "Left " + dataOb.available_qty;

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

