const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  order_id: {
    type: Number,
    unique: true,
    default: Date.now 
  },
    user: {
      username: {
        type: String,
        required: true,
        sparse: true
    },
        email: {
            type: String,
            required: true,
            sparse: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    cart:[
      {
        productId: {
          title: String,
          price: Number,
          description: String,
        },
        qty: {
          type: String
        },
      },
  ],
    status: {
      type: String,
      required: true
    },
    total: {
      type: String,
      required: true
    },
},
  {timestamps: true
});



module.exports = mongoose.model('Order', orderSchema);