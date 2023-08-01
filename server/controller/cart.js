const Product = require('../models/product');
const Order = require('../models/order');
const { Schema } = require('mongoose');


//add the product in the cart
exports.addToCart = (req, res, next) => {
    req.user.addToCart(req.body.id)
    // console.log(req.body.id)
        .then(() => {
            res.redirect('/user/cart');
        }).catch(err => console.log(err));
}

//get the cart and populate it with the items in the products information
exports.getCart = async (req, res, next) => {
    const items = await Product.find()
    req.user
        .populate('cart.items.productId')
        .then(user => {
            // console.log(user.cart.items);
            cart = user.cart.items
            // res.send(cart)
            console.log(req.user)
            res.render('cart', { items, cart: user.cart});
        })
        .catch(err => console.log(err));
}

//delete a specific product from the cart
exports.deleteInCart = (req, res, next) => {
    const productId = req.body.id; // the id of the product to be removed

    req.user.removeFromCart(productId)
        .then(() => {
            res.redirect('/user/cart');
        }).catch(err => console.log(err));

}

//clear the cart
exports.clearCart = (req, res, next) => {
    req.user.clearCart()
        .then(() => {
            res.redirect('/user/cart');
        }).catch(err => console.log(err));

}
