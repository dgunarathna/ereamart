const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


// form input reset
const setDefault = (elements) => {
    elements.forEach(element => {
        element.style.border = "1px solid #ced4da";
    });
};


// define function for all dropdowns
const fillDataIntoSelect = (parentId, message, dataList, displayProperty)=>{
    
    parentId.innerHTML = "";
    

    if (message != "") {
        let optionMsg = document.createElement("option");
        optionMsg.value = "";
        optionMsg.selected = "selected";
        optionMsg.disabled = "disabled";
        optionMsg.innerText = message;
        parentId.appendChild(optionMsg); 
    }

    dataList.forEach(dataOb => {
        let option = document.createElement("option");
        option.value = JSON.stringify(dataOb);
        option.innerText = dataOb[displayProperty];
        parentId.appendChild(option);
        
    });
}

//define function for get service request
const getServiceRequest = (url)=>{

    let getServiceResponce = [];

    $.ajax({
        url: url, // The URL to which the request is sent
        type: 'GET', // The HTTP method to use for the request (GET, POST, etc.)
        contentType: 'json',
        async: false,
        success: function(response) {
            // Code to execute if the request succeeds
            console.log('Success:', response);
            getServiceResponce = response;
        },
        error: function(xhr, status, error) {
            // Code to execute if the request fails
            console.log('Error:',url, error);
        }
    });

    return getServiceResponce;
}

//define function for POST PUT DELETE service request
const getHTTPServiceRequest = (url, method, data)=>{

    let getServiceResponce = [];

    $.ajax({
        url: url, // The URL to which the request is sent
        type: method, // The HTTP method to use for the request (GET, POST, etc.)
        contentType: 'application/json',
        data: JSON.stringify(data),
        async: false,
        success: function(response) {
            // Code to execute if the request succeeds
            console.log('Success:', response);
            getServiceResponce = response;
        },
        error: function(xhr, status, error) {
            // Code to execute if the request fails
            console.log('Error:',url, error);
        }
    });

    return getServiceResponce;
}


//cusor effect
var cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
});






