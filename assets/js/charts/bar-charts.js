function totOrdMonth(data){

// create an object with month+year and the count of the orders per month
let dataOrder = {}
data.forEach((value, index) => {
  let data = new Date(value.createdAt).getMonth()+1 + "/" + new Date(value.createdAt).getFullYear()
  let countOrders = 1
  let totalAmount = parseFloat(value.total)

  if (!dataOrder[data]) {
  
    dataOrder[data] = {
      data,
      total: 1,
      amount: totalAmount
    }
  } 
  else {
    let { total, amount } = dataOrder[data]
    dataOrder[data].total = total + 1
    dataOrder[data].amount = amount + totalAmount
    
  }
});

const sortedDataOrder = Object.values(dataOrder).sort((a, b) => {
  const dateA = new Date(a.data);
  const dateB = new Date(b.data);
  return dateA - dateB;
});


new Chart(document.getElementById("totOrdMonth"), {
    type: 'bar',
    data: {
    //   labels :['<%- JSON.stringify(arr); %>'],
        labels: Object.values(sortedDataOrder).map(({ data }) => data),
        datasets: [
        {
            label: "Orders",
            backgroundColor: colors,
            // backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: Object.values(sortedDataOrder).map(({ total }) => total),
            amountData: Object.values(sortedDataOrder).map(({ amount }) => amount.toFixed(2)),
        }
        ]
    },
    options: {
        legend: { display: false },
        title: {
        display: true,
        fontSize: 16,
        text: 'Total Orders Per Month'
        },
        scales:{
        yAxes: [{
            stacked: false,
            scaleLabel: {
        display: true,
        labelString: 'Total Number of Orders'
    },
            ticks: {
            beginAtZero: true,
            },
        }]
        },
        onClick: function(evt) {
            var chart = this;
            var activeBars = chart.getElementAtEvent(evt);
            if (activeBars.length > 0) {
                var clickedIndex = activeBars[0]._index;
                var amountData = chart.config.data.datasets[activeBars[0]._datasetIndex].amountData;
                var amount = amountData[clickedIndex];
                alert("Total amount of purchase orders for " + chart.data.labels[clickedIndex] + ": €" + amount);
            }
        }
    }
});

}

function totPurCust(data){
var labelsData2 = [];
var tot2 = [];

let obj = {}
data.forEach((value, index) => {
  let email = value.user.email
  let totOrders = parseInt(value.total)
  if (!obj[email]) {
    obj[email] = {
      email,
      total: totOrders
    }
  } else {
    let { total } = obj[email]
    obj[email].total = total + totOrders
  }
});

let finalArray = Object.values(obj)

finalArray.sort((a, b) => b.total - a.total); // Sort by total purchase amount in descending order

for (var i = 0; i < finalArray.length; i++) {
  labelsData2.push(finalArray[i].email);
  tot2.push(finalArray[i].total)
  colors.push(dynamicColors());
}

// Take the top 10 elements
labelsData2 = labelsData2.slice(0, 10);
tot2 = tot2.slice(0, 10);

var arr_int = tot2.map(function (x){
  return parseInt(x, 10)
})

new Chart(document.getElementById("totalPurCust"), {
    type: 'horizontalBar', // change the chart type
    data: {
      labels: labelsData2,
      datasets: [{
        label: "Amount",
        backgroundColor: colors,
        data: tot2
      }]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        fontSize: 16,
        text: 'Total Purchase Orders Per Customer (Top 10)'
      },
      scales:{
        xAxes: [{ // change to xAxes
          stacked: false,
          ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
              return '€' + value.toFixed(2);
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Total Amount (€)'
          }
        }]
      }
    }
  });
// new Chart(document.getElementById("totalPurCust"), {
//   type: 'bar',
//   data: {
//     labels: labelsData2,
//     datasets: [{
//       label: "Amount",
//       backgroundColor: colors,
//       data: tot2
//     }]
//   },
//   options: {
//     legend: { display: false },
//     title: {
//       display: true,
//       text: 'Total Purchase Orders Per Customer (Top 10)'
//     },
//     scales:{
//       yAxes: [{
//         stacked: false,
//         ticks: {
//           beginAtZero: true,
//           callback: function(value, index, values) {
//             return '€' + value.toFixed(2);
//           }
//         },
//         scaleLabel: {
//           display: true,
//           labelString: 'Total Amount (€)'
//         }
//       }]
//     }
//   }
// });


    
}

function lastFiveOrd(data){
    var labelsData = [];

for(var i = 0; i < data.length; i++){
    labelsData.push(data[i].user.email);
    tot.push(data[i].total)
    colors.push(dynamicColors());
}
    
    
last5Order = labelsData.slice(-5)
last5Tot = tot.slice(-5)


new Chart(document.getElementById("lastFiveOrder"), {
    type: 'bar',
    data: {
    labels: last5Order,
    datasets: [
        {
        label: "Total Amount",
        backgroundColor: colors,
        data: last5Tot
        }
    ]
    },
    options: {
    legend: { display: false },
    title: {
        display: true,
        fontSize: 16,
        text: 'Last Five Orders'
    },
    scales:{
        yAxes: [{
        stacked: false,
        ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
            return '€' + value.toFixed(2);
            }
        },
        scaleLabel: {
            display: true,
            labelString: 'Total Amount (€)'
        }
        }]
    }
    }
});
    
}