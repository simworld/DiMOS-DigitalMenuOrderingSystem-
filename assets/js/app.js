
$("#submit-order").click(function(event){
    alert("Order Submitted!")
})

$(".btn.btn-success.add").click(function(event){
    alert("Added!")
})

$(".btn.btn-success.remove").click(function(event){
    alert("Removed!")
})

// accept button
$(".acceptOrder").click( function(event){
    const socket = io();

    var id = $(this).attr("data-id")
    var sts = $(this).attr("data-status")
    // console.log(sts)

    if (sts == "Pending"){
        var request = {
            "url" : `orders/${id}`,
            "method": "PUT",
            "data": {
                "status" : "Accepted"
            }
        }
        
        $.ajax(request).done(function(response){
            // alert("Order Accepted!");
            console.log("Response: " + response.status)
            //           // emit message to WebSocket server
            // socket.emit('message', "Accepted");
            // location.reload();
            // window.location.href = 'http://localhost:3000/admin/orders'
            socket.emit('message', {
                orderId: id,
                newStatus: "Accepted",
                progress: "70",
                // color: "blue",
                className: "progress-bar progress-bar-striped progress-bar-animated bg-info"

            });
        })
    }
    
    else if (sts == "Accepted"){
        var request = {
            "url" : `orders/${id}`,
            "method": "PUT",
            "data": {
                "status" : "Completed"
            }
        }

        $.ajax(request).done(function(response){
            // alert("Order Completed!");
            console.log("Response: " + response.status)
            // socket.emit('message', "Completed");
            // location.reload();

            socket.emit('message', {
                orderId: id,
                newStatus: "Completed",
                progress: "100",
                // color: "green",
                className: "progress-bar progress-bar-striped bg-success"

            });
        })
    }
    
})

// delete button
$(".deleteOrder").click(function(event){
    var id = $(this).attr("data-id")

    var request = {
        "url" : `orders/${id}`,
        "method": "DELETE",
    }

    if(confirm("Do you want to delete the order?")){
        $.ajax(request).done(function(response){
            alert("Data deleted!");
            location.reload();
        })
    }
})

//for the navbar 
$(function($) {
    let url = window.location.href;
    $('.nav-link').each(function() {
      if (this.href === url) {
        $(this).closest('.nav-link').addClass('active');
      }
    });
});

