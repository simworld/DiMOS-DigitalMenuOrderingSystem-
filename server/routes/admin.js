// const User = require('../models/user');
// const Product = require('../models/product')
// const Orders = require('../models/order')
const router = require('express').Router();
const mongoose = require('mongoose');
const itemsController =  require('../controller/items');
const services = require('../services/render');
const ordersController = require('../controller/orders');
const adminController = require ('../controller/admin');

//Users API
/**
 * @description Update the user's role
 * @method POST 
 * @route /update-role
 */
router.post ('/update-role', adminController.updateRole)

/**
 * @description Get all the users
 * @method GET 
 * @route /users
 */
router.get('/users', adminController.users)

/**
 * @description Get a specific user's profile information by ID parameter
 * @method GET 
 * @route /user/:id
 */
router.get('/user/:id', adminController.user)


//Orders API
/**
 * @description Delete a specific order
 * @method DELETE 
 * @route /orders/:id
 */
router.delete('/orders/:id', ordersController.delete);

/**
 * @description Render the orders page showing the active orders
 * @method GET 
 * @route /orders
 */
router.get('/orders', ordersController.renderActiveOrders)


/**
 * @description Render the past-orders page to show the orders completed
 * @method GET 
 * @route /past-orders
 */
router.get('/past-orders', ordersController.renderPastOrders)

/**
 * @description Get the details for a specific order
 * @method GET 
 * @route /orders/:id
 */
router.get('/orders/:id', adminController.orderDetails)

/**
 * @description Render the dashboard page
 * @method GET 
 * @route /dashboard
 */
router.get("/dashboard", adminController.dashboard)

/**
 * @description Change the status of the order
 * @method PUT 
 * @route /orders/:id
 */
router.put('/orders/:id', ordersController.updateStatus);


//Items API
/**
 * @description Render the menu page showing the products in the menu
 * @method GET 
 * @route /menu
 */
router.get('/menu', adminController.renderMenu)

/**
 * @description Get a list of all the items
 * @method GET 
 * @route /items
 */
router.get('/items', itemsController.findItem);

/**
 * @description Get the details of a specific item
 * @method GET 
 * @route /items/:id
 */
router.get('/items/:id', itemsController.findItem);

/**
 * @description Create a new item
 * @method POST 
 * @route /items
 */
router.post('/items', itemsController.createItem);

/**
 * @description Render the page to edit a specific item
 * @method GET 
 * @route /edit-item/:id
 */
router.get('/edit-item/:id', itemsController.editItem)

/**
 * @description Update the details of the item
 * @method POST 
 * @route /edit-product
 */
router.post('/edit-product', itemsController.updateItem);

/**
 * @description Render the new-item page to add a new item
 * @method GET 
 * @route /new-item
 */
router.get('/new-item', services.new_item)

/**
 * @description Delete an item
 * @method POST 
 * @route /delete
 */
router.post('/delete', itemsController.deleteItem);

/**
 * @description Download all the orders
 * @method GET 
 * @route /download
 */
router.get('/download', ordersController.downloadOrders);


module.exports = router;


