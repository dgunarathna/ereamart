window.addEventListener("load", () => {
  console.log("Dashboard Functional Intelligence Loading...");

  // 4 Primary Metrics
  genearateDailyRevenue();
  genearateDailyExpenses();
  genearateNetProfit();
  genearateInventoryValue();

  // 7 Analytical Charts
  genearateRevenueTrend();
  genearateSalesByCategory();
  genearateTopCustomers();
  genearateInventoryHealth();
  genearateBestSellers();
  genearateExpenseDistribution();
  genearateIncomeExpenseAnalysis();
  

});

// --- 4 Primary Metrics ---

const genearateDailyRevenue = () => {
  let data = getServiceRequest("/dashboard/daily-revenue");
  if (data) {
    document.getElementById('valueRevenue').innerText = 'Rs. ' + parseFloat(data).toLocaleString();
  }
}

const genearateDailyExpenses = () => {
  let data = getServiceRequest("/dashboard/daily-expenses");
  if (data) {
    document.getElementById('valueExpenses').innerText = 'Rs. ' + parseFloat(data).toLocaleString();
  }
}

const genearateNetProfit = () => {
  let data = getServiceRequest("/dashboard/daily-profit");
  if (data) {
    document.getElementById('valueProfit').innerText = 'Rs. ' + parseFloat(data).toLocaleString();
  }
}

const genearateInventoryValue = () => {
  let data = getServiceRequest("/dashboard/inventory-value");
  if (data) {
    document.getElementById('valueInventory').innerText = 'Rs. ' + parseFloat(data).toLocaleString();
  }
}


// --- 7 Analytical Charts (Exactly like report.js) ---

const genearateRevenueTrend = () => {
  let dataList = getServiceRequest("/dashboard/revenue-trend");
  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  const ctx = document.getElementById('chartRevenueTrend');
  if (Chart.getChart('chartRevenueTrend') != undefined) {
    Chart.getChart('chartRevenueTrend').destroy();
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
        x: { grid: { display: false } },
        y: { display: true, grid: { display: false } }
      }
    }
  });
}

const genearateSalesByCategory = () => {
  let dataList = getServiceRequest("/dashboard/sales-category");
  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  const ctx = document.getElementById('chartSalesCategory');
  if (Chart.getChart('chartSalesCategory') != undefined) {
    Chart.getChart('chartSalesCategory').destroy();
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: lable,
      datasets: [{
        label: '',
        data: data,
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
        x: { grid: { display: false } },
        y: { display: true, grid: { display: false } }
      }
    }
  });
}

const genearateTopCustomers = () => {
  let dataList = getServiceRequest("/dashboard/top-customers");
  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  const ctx = document.getElementById('chartTopCustomers');
  if (Chart.getChart('chartTopCustomers') != undefined) {
    Chart.getChart('chartTopCustomers').destroy();
  }

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: lable,
      datasets: [{
        label: '',
        data: data,
      }]
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

const genearateInventoryHealth = () => {
  let dataList = getServiceRequest("/dashboard/inventory-status");
  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  const ctx = document.getElementById('chartInventoryHealth');
  if (Chart.getChart('chartInventoryHealth') != undefined) {
    Chart.getChart('chartInventoryHealth').destroy();
  }

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: lable,
      datasets: [{
        label: '',
        data: data,
      }]
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

const genearateBestSellers = () => {
  let dataList = getServiceRequest("/dashboard/best-sellers");
  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  const ctx = document.getElementById('chartBestSellers');
  if (Chart.getChart('chartBestSellers') != undefined) {
    Chart.getChart('chartBestSellers').destroy();
  }

  new Chart(ctx, {
    type: "pie",
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
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } }
      }
    }
  });
}

const genearateExpenseDistribution = () => {
  let dataList = getServiceRequest("/dashboard/expense-distribution");
  let lable = new Array();
  let data = new Array();

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    data.push(dataList[index][1]);
  }

  const ctx = document.getElementById('chartExpenseDistribution');
  if (Chart.getChart('chartExpenseDistribution') != undefined) {
    Chart.getChart('chartExpenseDistribution').destroy();
  }

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: lable,
      datasets: [{
        label: '',
        data: data,
      }]
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

const genearateIncomeExpenseAnalysis = () => {
  let dataList = getServiceRequest("/dashboard/income-expense-trend");
  let lable = new Array();
  let incomeData = new Array();
  let expenseData = new Array();

  // Destroy existing datatable before updating content
  $('#tableSummary').DataTable().destroy();

  let tableBody = document.getElementById('tableSummaryBody');
  if (tableBody) tableBody.innerHTML = '';

  for (const index in dataList) {
    lable.push(dataList[index][0]);
    incomeData.push(dataList[index][1]);
    expenseData.push(dataList[index][2]);

    if (tableBody) {
      let row = `<tr>
                <td>${dataList[index][0]}</td>
                <td class="text-end">Rs. ${parseFloat(dataList[index][1]).toLocaleString()}</td>
                <td class="text-end">Rs. ${parseFloat(dataList[index][2]).toLocaleString()}</td>
            </tr>`;
      tableBody.innerHTML += row;
    }
  }

  // Initialize new datatable
  new DataTable('#tableSummary', {
    destroy: true,
    info: false,
    paging: false,
    searching: false
  });

  const ctx = document.getElementById('chartIncomeExpenseTrend');
  if (Chart.getChart('chartIncomeExpenseTrend') != undefined) {
    Chart.getChart('chartIncomeExpenseTrend').destroy();
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: lable,
      datasets: [
        {
          label: '',
          data: incomeData,
          borderWidth: 1
        },
        {
          label: '',
          data: expenseData,
          borderWidth: 1
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
        x: { grid: { display: false } },
        y: { display: true, grid: { display: false } }
      }
    }
  });
}