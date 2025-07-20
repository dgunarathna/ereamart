window.addEventListener("load", () => {
  console.log("browser load Event");
  genarateReport("myChart", 'bar', '/reportpayment/bymonth');
  genarateReport("myCharttt", 'line', '/reportpayment/bymonth');
  genarateReport("myChartt", 'line', '/reportpayment/bymonth');
  refreshPayementTable();
});

const genarateReport = (chartid, charttype, url) => {

  let id = chartid;
  let service = url;
  let type = charttype;

  let dataList = getServiceRequest(service);

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
  const ctx = document.getElementById(id);

  if (Chart.getChart(id) != undefined) {
    Chart.getChart(id).destroy();
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
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

const refreshPayementTable = ()=>{
  let dataList = getServiceRequest('/reportpayment/bymonth');

  let reportDataList = new Array();

  for(const index in dataList){
    let object = new Object();
    object.month = dataList[index][0];
    object.amount = dataList[index][1];
    reportDataList.push(object);
  }

      // string > string, date, number
    // function > object, array, boolean
    let propertyList = [
        { propertyName: "month", dataType: "string" },
        { propertyName: "amount", dataType: "decimal" },
    ];

    fillDataIntoTable(tableBodyPayement, reportDataList, propertyList, employeeFormRefill);  

}

const employeeFormRefill = (ob, index)=>{

}

const printChart = (chartid) => {

  let id = chartid;
  const ctx = document.getElementById(id)
  let newWindow = window.open();
  let printView =
    "<head>"
    + "<title>www.ereamart.com</title>"
    + "<link href='/bootstrap-5.2.3/css/bootstrap.min.css' rel='stylesheet'/>"
    + "<link rel='stylesheet' href='/css/main.css'>"
    + "</head>"
    + "<body>"
    + "<h5 class='mb-4'>" + "Top Seelling prosucts " + " Details</h5>"
    + "<img src='" + ctx.toDataURL() + "'/>;"
    + "</body>";

  newWindow.document.write(printView);

  setTimeout(() => {
    newWindow.stop();
    newWindow.print();
    newWindow.close();
    $("#modalEmployeeForm").modal("hide");
  }, 500);
}