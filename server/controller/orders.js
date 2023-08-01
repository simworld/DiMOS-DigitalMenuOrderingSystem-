var Order = require('../models/order');
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');


// retrieve orders for admin and for the authenticated user
exports.find = async (req, res) => {
        const id = req.user.id;
        const role = req.user.role;
        // console.log(user)
        
        if (role === 'ADMIN'){
            Order.find().sort({ 'createdAt': -1 })
            .then(orders=>{
                if(!orders){
                    res.status(404).send({message:`Order with ${id} not found!`})
                }else{
                    res.render('history', {orders, role});
                    // res.send(orders)
                }
            })
            .catch(err=>{
                res.status(500).send({message:"Error retrieving order with id:" + id })
            })
        } else {
            const count = await Order.count({"user.userId": id})
            const limit = 6
            const page = + req.query.page || 1
            await Order.find({"user.userId": id})
            .sort({ 'createdAt': -1 })
            .limit(limit *1)
            .skip((page -1)* limit)
            .then(orders=>{
                if(!orders){
                    res.status(404).send({message:`Order with ${id} not found!`})
                }else{
                    res.render('history', {orders, role,page: page,
                        nextPage: page + 1,
                        previousPage: page -1,
                        hasPreviousPage: page > 1,
                        hasNextPage: (limit * page) < count,
                        totalPages: Math.ceil((count/ limit)) });
                    // res.send(orders)
                }
            })
            .catch(err=>{
                res.status(500).send({message:"Error retrieving order with id:" + id })
            })
        }
        
}

// retrive the status of an order
exports.orderStatus = async (req, res, next) => {
    if (req.params.id) {
        const id = req.params.id;
        const userId = req.user.id;
        try {
            const order = await Order.findOne({ "_id": id, "user.userId": userId });
            if (!order) {
                res.status(404).send({ message: `Order with ID ${id} not found!` });
            } else {
                res.render('order-status', { order });
            }
        } catch (err) {
            res.status(500).send({ message: `Error retrieving order with ID ${id}: ${err.message}` });
        }
    } else {
        try {
            const orders = await Order.find();
            res.send(orders);
        } catch (err) {
            res.status(500).send({ message: `Error retrieving orders: ${err.message}` });
        }
    }
}

// update the status of the order
exports.updateStatus = (req, res) => {
    if(!req.body){
        return res
        .status(400)
        .send({message:"Data cannot be empty"})
    }

    const id = req.params.id
    Order.findByIdAndUpdate(id, req.body, {useFindAndModify:false})
        .then(data=>{
            if(!data){
                res.status(404).send({message:`Cannot update the order with ${id}. Order not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err=> {
            res.status(500).send({message:"Error occured while updating order"})
        })
}

// delete an order with a specific ID
exports.delete = (req, res) => {
    const id = req.params.id;
    // const id = req.body.id;

    Order.findByIdAndDelete(id)
        .then(data =>{
            if(!data){
                res.status(404).send({message:`Cannot delete order with ${id}`})
            }else{
                res.send({
                    message:"item deleted"
                })
                // res.redirect(req.get('referer'));
            }
        })
        .catch(err=> {
            res.status(500).send({message:"Could not delete order with id:" +id});
        });
}

// submit the new order 
exports.postOrder = (req, res, next) => {
    
    let order;
    req.user
        .populate('cart.items.productId')
        .then(user => {
            console.log(user.cart)
            order = new Order({
                user: {
                    username: req.user.username,
                    email: req.user.email,
                    userId: req.user
                },
                cart: user.cart.items,
                total: user.cart.totalPrice,
                status: "Pending",
            });
            // console.log(order._id)
            return order.save();
        })
        .then(() => {

            req.user.clearCart()

            res.redirect(`/user/order-status/${order._id}`); 
        })
        .catch(err => console.log(err));
}

// render the past-orders page with orders and pagination
exports.renderPastOrders = async (req, res, next) => {
const limit = 6
const page = + req.query.page || 1

const count = await Order.count({
    "status" : { "$in": ["Completed"] },
})
try {
    const orders = await Order.find({
    "status" : { "$in": ["Completed"] },
})
    .sort({ 'createdAt': -1 })
    .limit(limit *1)
    .skip((page -1)* limit)
    console.log(orders)
    // res.send(users);
    res.render('past-orders', {             
    orders: orders,
    page: page,
    nextPage: page + 1,
    previousPage: page -1,
    hasPreviousPage: page > 1,
    hasNextPage: (limit * page) < count,
    totalPages: Math.ceil((count/ limit))
    })
} catch (error) {
    next(error);
}
};

// render the orders page with orders and pagination
exports.renderActiveOrders = async (req, res, next) => {
try {
    // let page = req.params.page >= 1 ? req.params.page :1;
    // const {page = 1, limit = 6} = req.query;
    const limit = 4
    const page = + req.query.page || 1
    // const page = parseInt(req.query.page)
    // const count = await Orders.count({status:"Pending"});

    const count = await Order.count({
    "status" : { "$in": ["Pending", "Accepted"] },
})

    // if(req.params.id){

    const orders = await Order.find({
        "status" : { "$in": ["Pending", "Accepted"] },
    })
    .sort({ 'createdAt': -1 })
    .limit(limit *1)
    .skip((page -1)* limit)

    // console.log(orders)
    // res.send(users);

    res.render('orders', { 
        orders: orders,
        page: page,
        nextPage: page + 1,
        previousPage: page -1,
        hasPreviousPage: page > 1,
        hasNextPage: (limit * page) < count,
        totalPages: Math.ceil((count/ limit))
        });
 
} catch (error) {
    next(error);
}
};

// download all the orders to excel file
exports.downloadOrders = async (req, res, next) => {
//   const orders = await Order.find({}).sort({ createdAt: -1 });
const orders = await Order.find({ status: 'Completed' }).sort({ createdAt: -1 });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  worksheet.columns = [
    { header: 'Order ID', key: 'order_id', width: 15 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  orders.forEach((order) => {
    worksheet.addRow({
      order_id: order.order_id,
      email: order.user.email,
      date: order.createdAt.toLocaleDateString('en-GB'),
      status: order.status,
      total: `€${order.total}`,
    });
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + 'DiMOS-orders.xlsx',
  );

  await workbook.xlsx.write(res);
  res.end();
};
