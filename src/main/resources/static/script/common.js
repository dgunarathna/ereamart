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

// define function for all dropdowns
const fillDataIntoSelectTwo = (parentId, message, dataList, displayPropertyOne, displayPropertyTwo)=>{
    
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
        option.innerText = dataOb[displayPropertyOne] + " - " + dataOb[displayPropertyTwo];
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
  if (!cursor) {
    return;
  }
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
});


const centerActiveMobileTab = () => {
    if (!window.matchMedia('(max-width: 991.98px)').matches) {
        return;
    }

    const tabContainers = document.querySelectorAll('.nav.nav-pills:not(.horizontal_navbar)');

    tabContainers.forEach(container => {
        const activeLink = container.querySelector('.nav-link.active');

        if (!activeLink) {
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const activeRect = activeLink.getBoundingClientRect();
        const scrollOffset = activeRect.left - containerRect.left - ((container.clientWidth - activeLink.clientWidth) / 2);

        container.scrollTo({
            left: container.scrollLeft + scrollOffset,
            behavior: 'auto'
        });
    });
};

const applyMobileBottomNavIcons = () => {
    const bottomNavLinks = document.querySelectorAll('.horizontal_navbar .nav-link');
    const isMobileView = window.matchMedia('(max-width: 991.98px)').matches;

    bottomNavLinks.forEach(link => {
        const savedLabel = link.dataset.mobileLabel || link.textContent.trim();

        if (!isMobileView) {
            if (link.dataset.mobileIconApplied === 'true') {
                link.textContent = savedLabel;
                link.dataset.mobileIconApplied = 'false';
            }
            return;
        }

        const href = link.getAttribute('href');
        const label = savedLabel;
        let iconClass = '';

        if (href === '/dashboard') {
            iconClass = 'fa-solid fa-house';
        } else if (href === '/product') {
            iconClass = 'fa-solid fa-store';
        } else if (href === '/expense') {
            iconClass = 'fa-solid fa-wallet';
        }

        if (!iconClass) {
            return;
        }

        if (link.dataset.mobileIconApplied === 'true') {
            return;
        }

        link.dataset.mobileLabel = label;
        link.dataset.mobileIconApplied = 'true';
        link.setAttribute('aria-label', label);
        link.setAttribute('title', label);
        link.innerHTML = `<i class="${iconClass} mobile-bottom-nav-icon" aria-hidden="true"></i><span class="mobile-bottom-nav-text">${label}</span>`;
    });
};

window.addEventListener('load', () => {
    applyMobileBottomNavIcons();
    centerActiveMobileTab();
    setTimeout(centerActiveMobileTab, 150);
});

window.addEventListener('resize', applyMobileBottomNavIcons);






