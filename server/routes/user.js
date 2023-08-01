const router = require('express').Router();
const ordersController = require('../controller/orders');
const cartController = require('../controller/cart');
const services = require('../services/render');


/**
 * @description Fetches the user's profile information
 * @method GET
 * @route /profile
 */
router.get('/profile', services.profile);

/**
 * @description Renders the about page
 * @method GET
 * @route /about
 */
router.get('/about', services.about);

/**
 * @description Fetches all orders in the database
 * @method GET
 * @route /orders
 */
router.get('/orders', ordersController.find);

/**
 * @description Fetches the status of a specific order
 * @method GET
 * @route /order-status/:id
 */
router.get('/order-status/:id', ordersController.orderStatus);

/**
 * @description Adds a product to the user's cart
 * @method POST
 * @route /add-to-cart
 */
router.post('/add-to-cart', cartController.addToCart);

/**
 * @description Render the user's cart page with the items in the cart
 * @method GET
 * @route /cart
 */
router.get('/cart', cartController.getCart);

/**
 * @description Removes a product from the user's cart
 * @method POST
 * @route /remove-cart
 */
router.post('/remove-cart', cartController.deleteInCart);


/**
 * @description Clears all items in the user's cart
 * @method POST
 * @route /clear
 */
router.post('/clear', cartController.clearCart);

/**
 * @description Submits a new order
 * @method POST
 * @route /submit
 */
router.post('/submit', ordersController.postOrder)



module.exports = router;


