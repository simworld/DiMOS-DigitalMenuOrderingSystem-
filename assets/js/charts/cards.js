function statCards(dataUser, data){

const totIdOrders = [];

for(var i = 0; i < data.length; i++){
    totIdOrders.push(data[i]._id)
    tot.push(data[i].total)
    colors.push(dynamicColors());
}

for(var i = 0; i < dataUser.length; i++){
    totUsers.push(dataUser[i]);
}


var arr_int = tot.map(function (x){
  return parseInt(x, 10)
})


//data to display in the cards
const sum = arr_int.reduce((partialSum, a) => partialSum + a, 0);
const totOrders = totIdOrders.length
const countUsers = totUsers.length
const avgOrders = sum / totOrders


$("#total").append(sum)
$("#total-orders").append(totOrders)
$("#total-users").append(countUsers)
$("#avg-orders").append(avgOrders.toFixed(2))

}

