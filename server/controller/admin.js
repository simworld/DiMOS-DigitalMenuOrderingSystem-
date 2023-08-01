const User = require('../models/user');
const Orders = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');


// rende the menu page with items and pagination
exports.renderMenu = async (req, res, next) => {
  try {
    const limit = 4
    const page = + req.query.page || 1

    const count = await Product.count()
    const items = await Product
    .find()
    .sort({ 'createdAt': -1 })
    .limit(limit *1)
    .skip((page -1)* limit)

    // console.log(items)
    // res.send(users);
    res.render('menu', { 
      items: items,
      page: page,
      nextPage: page + 1,
      previousPage: page -1,
      hasPreviousPage: page > 1,
      hasNextPage: (limit * page) < count,
      totalPages: Math.ceil((count/ limit))

    
    });
    // res.send(items)
  } catch (error) {
    next(error);
  }
};

// render the manage-users page with users and pagination
exports.users = async (req, res, next) => {
  try{

      const limit = 3
      const page = + req.query.page || 1

      const count = await User.count()
      const users = await User
      .find()
      .sort({ 'createdAt': -1 })
      .limit(limit *1)
      .skip((page -1)* limit)
      // res.send(users);
      // res.send(users);
      res.render('manage-users', { 
        users: users, 
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
}


// render profile page with person
exports.user = async (req, res, next) => {
  try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid id');
        res.redirect('/admin/users');
        return;
      }
      const person = await User.findById(id);
      res.render('profile', { person });
    } catch (error) {
      next(error);
    }

}


// update the role of a user in the database
exports.updateRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;

    // Checking for id and roles in req.body
    if (!id || !role) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }

    // Check for valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      return res.redirect('back');
    }

    // Check for Valid role
    const rolesArray = Object.values(roles);
    if (!rolesArray.includes(role)) {
      req.flash('error', 'Invalid role');
      return res.redirect('back');
    }

    // Admin cannot change his role to CLIENT
    if (req.user.id === id) {
      req.flash(
        'error',
        'Unable to change the role! Please ask to another admin.'
      );
      return res.redirect('back');
    }

    const user = await User.findByIdAndUpdate(id,{ role },{ new: true, runValidators: true });

    req.flash('info', `The role for ${user.email} has been updated to ${user.role}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
};


// render the dashboard page with orders, items, and users
exports.dashboard = async (req, res, next) => {
  try {
    const arr = []
    const orders = await Orders.find();
    const items = await Product.find();
    const users = await User.find();

    // res.send(orders);
    for(var i=0; i<orders.length; i++){
      arr.push(orders[i])
    }
    // console.log(arr)
    res.render('dashboard', { orders: orders, arr:arr, items:items, users:users });
  } catch (error) {
    next(error);
  }
};

// render order-details page with order
exports.orderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      res.redirect('/admin/orders');
      return;
    }
    const order = await Orders.findById(id);
    console.log(order)

    res.render('order-details', { order });
  } catch (error) {
    next(error);
  }
};


