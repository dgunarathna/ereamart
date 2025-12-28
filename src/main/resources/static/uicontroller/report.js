window.addEventListener("load", () => {
  console.log("browser load Event");

  let currentYear = new Date();
  let currentMonth = currentYear.getMonth() + 1; // [0-11]
    if (currentMonth < 10) currentMonth = '0' + currentMonth;
    
  let currentDay = currentYear.getDate(); // [1-31]
    if (currentDay < 10) currentDay = '0' + currentDay;
  
  dateStart.value = currentYear.getFullYear()-10 + "-" + currentMonth + "-" + currentDay;
  dateEnd.value = currentYear.getFullYear() + "-" + currentMonth + "-" + currentDay;

  selectType.value = "Monthly";
  console.log(dateEnd , dateStart, selectType);

  genearatePayementReport();
  genearateOrderReport('orderReport', 'bar');
  genearateOrderReport('salesReport', 'line');
  

});

const genearatePayementReport = () => {

  let dataList = getServiceRequest("http://localhost:8080/reportpayment/bytime?startdate="+ dateStart.value +"&enddate="+ dateEnd.value +"&type="+ selectType.value);

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

  fillDataIntoReportTable(tableBodyPayement, reportDataList, propertyList); 
  $('#tablePayement').DataTable({
    destroy: true,
        info: false,
        paging: false,
        searching: false
        });

  //chart
  const ctx = document.getElementById('paymentReport');

  if (Chart.getChart('paymentReport') != undefined) {
    Chart.getChart('paymentReport').destroy();
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


const printChart = (chartname, chartid, table) => {

  const ctx = document.getElementById(chartid)
  const tableid =document.getElementById(table)

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
      + "<div class='col-12'>"+ tableid.outerHTML +"</div>"
    + "</body>";

  newWindow.document.write(printView);

  setTimeout(() => {
    newWindow.stop();
    newWindow.print();
    newWindow.close();
  }, 500);
}