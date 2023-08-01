function orderStatus(data) {
  const statusCounts = {
    Completed: 0,
    Accepted: 0,
    Pending: 0,
  };

  data.forEach((order) => {
    statusCounts[order.status]++;
  });

  const xValues = Object.keys(statusCounts);
  const yValues = Object.values(statusCounts);
  const barColors = ["#049c2a", "#fed201", "#dc143c"];

  new Chart("orderStatus", {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Orders Status",
      },
    },
  });
}


function mostOrdered(data) {
  const mostOrdered = {};
  const labelProd = [];
  const valProd = [];
  const barColors = [];

  data.forEach((order) => {
    order.cart.forEach((item) => {
      const prod = item.productId.title;
      const totProd = parseInt(item.qty);
      
      if (!mostOrdered[prod]) {
        mostOrdered[prod] = {
          prod,
          total: totProd
        };
      } else {
        mostOrdered[prod].total += totProd;
      }
    });
  });

  // Sort by total descending and limit to top 6
  const sorted = Object.values(mostOrdered).sort((a, b) => b.total - a.total).slice(0, 6);

  sorted.forEach((x) => {
    labelProd.push(x.prod);
    valProd.push(x.total);
    barColors.push(dynamicColors());
  });

  new Chart("mostOrdered", {
    type: "pie", // Change chart type to pie
    data: {
      labels: labelProd,
      datasets: [
        {
          backgroundColor: barColors,
          data: valProd,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Most Ordered Products - Top 6",
      },
      legend: {
        display: true,
        position: "right",
      },
    },
  });
}


// function mostOrdered(data){
// const mostOrdered = {}

// var labelProd = []
// var valProd = []
// var barColors = [
//     "#049c2a",
//     "#fed201",
//     "#dc143c"
//   ];

// for(var i = 0; i < data.length; i++){
//   for(var y =0; y < data[i].cart.length; y++){
//     let prod = data[i].cart[y].productId.title
//     let totProd = parseInt(data[i].cart[y].qty)

//     if (!mostOrdered[prod]) {
//       mostOrdered[prod] = {
//         prod,
//         total: totProd
//       }
//     } 
//     else {
//       let { total } = mostOrdered[prod]
//       mostOrdered[prod].total = total + totProd}
// }
// }

// let finalMostOrdered = Object.values(mostOrdered)

// finalMostOrdered.forEach(function(el){
//   var chartData = [el.prod, el.total];
//   // console.log(chartData)
// })


// finalMostOrdered.forEach(function(x){
//   labelProd.push(x.prod)
//   valProd.push(x.total)
//   barColors.push(dynamicColors());
// })

// new Chart("mostOrdered", {
//   type: "doughnut",
//   data: {
//     labels: labelProd,
//     datasets: [{
//       backgroundColor: barColors,
//       data: valProd
//     }]
//   },
//   options: {
//     title: {
//       display: true,
//       text: "Most Ordered Products"
//     },
//     legend: {
//       display: true,
//       position: 'right'
//     }
//   }
// });

// }


// function orderStatus (data){

//     var c = []
//     var a = []
//     var p = []
//     // var st = []
//     for(var i = 0; i < data.length; i++){
//         if (data[i].status == "Completed"){
//             c.push(data[i].status)
//         }
//         else if (data[i].status == "Accepted"){
//             a.push(data[i].status)
//             // console.log(a.count)
    
//         }
//         else if (data[i].status == "Pending"){
//             p.push(data[i].status)
//         }
//     //    st.push(data[i].status);
//     //    console.log(st)
//     }
//     // for(var i = 0; i < data.length; i++){
//     //     st.push(data[i].status)
//     // }
//     var xValues = ['Completed', 'Accepted', 'Pending']
//     var yValues = [c.length, a.length, p.length];
//     var barColors = [
//       "#049c2a",
//       "#fed201",
//       "#dc143c"
//     ];
    
//     new Chart("orderStatus", {
//       type: "pie",
//       data: {
//         labels: xValues,
//         datasets: [{
//           backgroundColor: barColors,
//           data: yValues
//         }]
//       },
//       options: {
//         title: {
//           display: true,
//           text: "Orders Status"
//         }
//       }
//     });
// }