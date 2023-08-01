function totOrdDay(data){

const dataOrder2 = {}

data.forEach((value) => {

  const data = new Date(value.createdAt).toDateString()

  if (!dataOrder2[data]) {
  
    dataOrder2[data] = {
      data,
      total: 1
    }
  } 
  else {
    dataOrder2[data].total += 1
  }
});

const countArray2 = Object.values(dataOrder2)


// Get the date 15 days ago
const last15Days = new Date();
last15Days.setDate(last15Days.getDate() - 15);

const filteredObjects = Object.values(countArray2).filter(
  (obj) => new Date(obj.data) >= last15Days
);

const sortedObjects = filteredObjects.sort(
  (a, b) => new Date(a.data) - new Date(b.data)
);


//chart total oders per date
new Chart(document.getElementById("totalOrderDay"), {
  type: 'line',
  data: {
    labels: Object.values(sortedObjects).map(({ data }) => data),
    datasets: [
      {
        fill: false,
        label: "Orders",
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: Object.values(sortedObjects).map(({ total }) => total),
      }
    ]
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      fontSize: 16,
      text: 'Total Orders Per Day - Last 15 Days'
    },
    
  scales: {
    xAxes: [{
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
              'day': 'DD/MM/YYYY'
            },
      },
      stacked: true
    }],
    yAxes: [{
    scaleLabel: {
      display: true,
      labelString: 'Total Number of Orders'
    },
    ticks: {
      beginAtZero: true,
      stepSize: 0,
    }
  }]
  }
  }
});
}

function totOrdHour(data){

    let dataOrder3 = {}

    data.forEach((value, index) => {
      let date = new Date(value.createdAt)
      let hour = date.getHours()
    
      if (!dataOrder3[hour]) {
        dataOrder3[hour] = {
          data: `${hour}:00`,
          total: 1
        }
      } else {
        dataOrder3[hour].total++
      }
    });
    
    let ordersPerHour = Object.values(dataOrder3);
    
    new Chart(document.getElementById("totalOrderHour"), {
      type: 'line',
      data: {
        labels: Object.values(ordersPerHour).map(({ data }) => data),
        datasets: [
          {
            fill: false,
            label: "Orders",
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: Object.values(ordersPerHour).map(({ total }) => total),
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          fontSize: 16,
          text: 'Total Orders Per Hour'
        },
        
      scales: {
        xAxes: [{
          stacked: true
        }],
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
      }
      }
    });


}