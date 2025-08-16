window.addEventListener("load", () => {
  console.log("browser load Event");
  genearateOrderReport('orderReport', 'bar');
  genearateOrderReport('salesReport', 'polarArea');
  genearateOrderReport('topCategories', 'pie');
  genearateOrderReport('topProducts', 'line');
  

});




const genearateOrderReport = (chartid, type) => {

  let dataList = getServiceRequest("/reportpayment/bymonth");

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
  const ctx = document.getElementById(chartid);

  if (Chart.getChart(chartid) != undefined) {
    Chart.getChart(chartid).destroy();
  }


  new Chart(ctx, {
    type: type,
    data: {
      labels: lable,
      datasets: [{
        label: '',
        data: data,
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
      legend: {
        display: false
      }
    },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      }
    }
  });
}

