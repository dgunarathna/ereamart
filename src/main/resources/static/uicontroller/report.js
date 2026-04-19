window.addEventListener("load", () => {
  console.log("browser load Event");

  let currentYear = new Date();
  let currentMonth = currentYear.getMonth() + 1; // [0-11]
  if (currentMonth < 10) currentMonth = '0' + currentMonth;

  let currentDay = currentYear.getDate(); // [1-31]
  if (currentDay < 10) currentDay = '0' + currentDay;

  dateStart.value = currentYear.getFullYear() - 10 + "-" + currentMonth + "-" + currentDay;
  dateEnd.value = currentYear.getFullYear() + "-" + currentMonth + "-" + currentDay;

  selectType.value = "Monthly";
  console.log(dateEnd, dateStart, selectType);

  generateOrderReport();
  generateInvoiceReport();
  generateIncomeExpenseReport();
  generateStockAvailabilityReport();
  generateSupplierSpendingReport();
  generateExpenseCategoryReport();
  generateLowStockReport();
  generateExpiringStockReport();
  generateStockByManufacturerReport();
  generateCustomerLoyaltyReport();
  generateBestSellingProductsReport();

  // genearateOrderReport('orderReport', 'bar');
  // genearateOrderReport('salesReport', 'line');

});

const refreshAllReports = () => {
    generateOrderReport();
    generateInvoiceReport();
    generateIncomeExpenseReport();
    generateStockAvailabilityReport();
    generateSupplierSpendingReport();
    generateExpenseCategoryReport();
    generateLowStockReport();
    generateExpiringStockReport();
    generateStockByManufacturerReport();
    generateCustomerLoyaltyReport();
    generateBestSellingProductsReport();
}

//Purchasing & Suppliers
const generateOrderReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportpayment/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let reportDataList = new Array();
  let data = new Array();
  let lable = new Array();

  for (const index in dataList) {
    let object = new Object();
    object.month = dataList[index][0];
    object.amount = dataList[index][1];
    reportDataList.push(object);

    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  // table
  // string > string, date, number
  // function > object, array, boolean

  let propertyList = [
    { propertyName: "month", dataType: "string" },
    { propertyName: "amount", dataType: "decimal" },
  ];

  //   $('#tablePayement').DataTable().destroy();
  //   fillDataIntoReportTable(tableBodyPayement, reportDataList, propertyList); 
  //   new DataTable('#tablePayement', {
  //                 destroy: true,
  //         info: false,
  //         paging: false,
  //         searching: false
  // });

  //chart
  const ctx = document.getElementById('orderReport');

  if (Chart.getChart('orderReport') != undefined) {
    Chart.getChart('orderReport').destroy();
  }


  new Chart(ctx, {
    type: "line",
    data: {
      labels: lable,
      datasets: [{
        label: '',
        data: data,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          grid: {
            display: false
          }
        }
      }
    }
  });
}
const generateSupplierSpendingReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportsupplierspending/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('supplierSpending');

  if (Chart.getChart('supplierSpending') != undefined) {
    Chart.getChart('supplierSpending').destroy();
  }


  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: lable,
      datasets: [
        {
          label: 'Quantity',
          data: data,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          beginAtZero: true,
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}

//Inventory & Products
const generateStockAvailabilityReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportstockavailability/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('stockAvailability');

  if (Chart.getChart('stockAvailability') != undefined) {
    Chart.getChart('stockAvailability').destroy();
  }


  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: lable,
      datasets: [
        {
          label: 'Quantity',
          data: data,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          beginAtZero: true,
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}
const generateLowStockReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportlowstock/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('lowStock');

  if (Chart.getChart('lowStock') != undefined) {
    Chart.getChart('lowStock').destroy();
  }


  new Chart(ctx, {
    type: "bar",
    data: {
      labels: lable,
      datasets: [
        {
          label: 'Quantity',
          data: data,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}
const generateExpiringStockReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportexpiringstock/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('expiringStock');

  if (Chart.getChart('expiringStock') != undefined) {
    Chart.getChart('expiringStock').destroy();
  }


  new Chart(ctx, {
    type: "pie",
    data: {
      labels: lable,
      datasets: [
        {
          label: 'Quantity',
          data: data,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}
const generateStockByManufacturerReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportstockbymanufacturer/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('stockByManufacturer');

  if (Chart.getChart('stockByManufacturer') != undefined) {
    Chart.getChart('stockByManufacturer').destroy();
  }


  new Chart(ctx, {
    type: "bar",
    data: {
      labels: lable,
      datasets: [
        {
          label: 'Quantity',
          data: data,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}

//Sales & Revenue
const generateInvoiceReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportinvoice/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let reportDataList = new Array();
  let data = new Array();
  let lable = new Array();

  for (const index in dataList) {
    let object = new Object();
    object.month = dataList[index][0];
    object.amount = dataList[index][1];
    reportDataList.push(object);

    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('invoiceReport');

  if (Chart.getChart('invoiceReport') != undefined) {
    Chart.getChart('invoiceReport').destroy();
  }


  new Chart(ctx, {
    type: "bar",
    data: {
      labels: lable,
      datasets: [{
        label: '',
        data: data,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          grid: {
            display: false
          }
        }
      }
    }
  });
}
const generateCustomerLoyaltyReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportcustomerloyalty/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('customerLoyalty');

  if (Chart.getChart('customerLoyalty') != undefined) {
    Chart.getChart('customerLoyalty').destroy();
  }


  new Chart(ctx, {
    type: "pie",
    data: {
      labels: lable,
      datasets: [
        {
          label: 'Quantity',
          data: data,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          beginAtZero: true,
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}
const generateBestSellingProductsReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportbestsellingproducts/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('bestSellingProducts');

  if (Chart.getChart('bestSellingProducts') != undefined) {
    Chart.getChart('bestSellingProducts').destroy();
  }


  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: lable,
      datasets: [
        {
          label: 'Quantity',
          data: data,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          beginAtZero: true,
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}


//Finance & Expenses
const generateIncomeExpenseReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportincomeexpense/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let incomeData = new Array();
  let expenseData = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    incomeData.push(dataList[index][1]);
    expenseData.push(dataList[index][2]);
  }

  //chart
  const ctx = document.getElementById('incomeExpenceReport');

  if (Chart.getChart('incomeExpenceReport') != undefined) {
    Chart.getChart('incomeExpenceReport').destroy();
  }


  new Chart(ctx, {
    type: "line",
    data: {
      labels: lable,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
        },
        {
          label: 'Expenses',
          data: expenseData,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}
const generateExpenseCategoryReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportincomeexpense/category/bytime?startdate=" + dateStart.value + "&enddate=" + dateEnd.value + "&type=" + selectType.value);

  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  //chart
  const ctx = document.getElementById('incomeExpenceCategory');

  if (Chart.getChart('incomeExpenceCategory') != undefined) {
    Chart.getChart('incomeExpenceCategory').destroy();
  }


  new Chart(ctx, {
    type: "pie",
    data: {
      labels: lable,
      datasets: [
        {
          label: '',
          data: data,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      }
    }
  });
}

//print
const printChart = (chartname, chartid, table) => {

  const ctx = document.getElementById(chartid)
  const tableid = document.getElementById(table)

  let newWindow = window.open();
  let printView =
    "<head>"
    + "<title>www.ereamart.com</title>"
    + "<link href='/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet'/>"
    + "<link rel='stylesheet' href='/css/main.css'>"
    + "</head>"
    + "<body>"
    + "<h6 class='mb-4'>" + chartname + "</h6>"
    + "<div class='col-12'><img src='" + ctx.toDataURL() + "'/></div>"
    + "<div class='col-12'>" + tableid.outerHTML + "</div>"
    + "</body>";

  newWindow.document.write(printView);

  setTimeout(() => {
    newWindow.stop();
    newWindow.print();
    newWindow.close();
  }, 500);
}
