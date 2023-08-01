const mongoose = require('mongoose');
const Product = require('../models/product');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const { roles } = require('../utils/constants');



const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [roles.admin, roles.client],
        default: roles.client,
      },
    cart: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
        totalPrice: Number
    },
},
{timestamps: true
});


userSchema.methods.addToCart = async function(productId) {

    //find the index of the item to add
    const product = await Product.findById(productId);
    if (product) {

        //get the cart of the user
        const cart = this.cart;

        //check if the product is already present in the cart
        const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product._id).trim());

        //if the product is in the cart the quantity is increased by 1
        if (isExisting >= 0) {
            cart.items[isExisting].qty += 1;
        //if it is not in the cart, the product is added with the quantity of 1
        } else {
            cart.items.push({ productId: product._id, qty: 1 });
        }

        //if the totalPrice is not initialised, it is set to 0
        if (!cart.totalPrice) {
            cart.totalPrice = 0;
        }

        //the totalPrice is increased with the price of the product added
        cart.totalPrice += product.price;
        return this.save();
    }

};

userSchema.methods.removeFromCart = async function(productId, quantity = 1) {
    const cart = this.cart;
    
    //find the index of the item to add
    const index = cart.items.findIndex(item => item.productId.equals(productId));
  
    if (index === -1) {
      return;
    }

    //get the product and item from the database
    const product = await Product.findById(productId);
    const item = cart.items[index];
  
    //calculates the quantity and price to remove
    const quantityToRemove = Math.min(quantity, item.qty);
    const priceToRemove = product.price * quantityToRemove;
  
    //updates the item and cart quantities and prices
    item.qty -= quantityToRemove;
    cart.totalQty -= quantityToRemove;
    cart.totalPrice -= priceToRemove;
  
    //if the item has a quantity of 0, remove it from the cart
    if (item.qty === 0) {
      cart.items.splice(index, 1);
    }

    return this.save();
};
  
userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};

userSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        // create the admin profile
        if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
          this.role = roles.admin;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
});
  
userSchema.methods.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw createHttpError.InternalServerError(error.message);
    }
};

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema);


