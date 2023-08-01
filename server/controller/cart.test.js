const mongoose = require('mongoose');
const { getAllProducts, getProductDetail, addToCart, getCart, deleteInCart, clearCart } = require('../controller/cart');
const User = require('../models/user');
const Product = require('../models/product');
const connectDB = require('../database/connection');

// Mock the Product model
jest.mock('../models/product');
jest.mock('../models/user');

require("dotenv").config();

const app = require('../../app');

describe('Products Controller', () => {
  let res;
  const next = jest.fn();
  const prodData = {
    // _id: 'prod123',
    title: 'Test Product',
    price: 10,
    description: 'This is a test product'
  };

beforeAll(async () => {

await connectDB()
});

// Close the database connection after all tests have finished
afterAll(async () => {
  await mongoose.connection.close();
});
  beforeEach(() => {
    // Mock the response object
    res = {
      render: jest.fn(),
      redirect: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should add the product to the user cart and redirect to the new order page', async () => {
      const req = {
        user: {
          addToCart: jest.fn().mockResolvedValueOnce()
        },
        body: {
          id: 'testProduct'
        }
      };

      await addToCart(req, res, next);

      expect(req.user.addToCart).toHaveBeenCalledWith('testProduct');
      expect(res.redirect).toHaveBeenCalledWith('/user/cart');
    });

  });

  describe('deleteInCart', () => {
    it('should remove the product from the user cart and redirect to the cart page', async () => {
      const req = {
        user: {
          removeFromCart: jest.fn().mockResolvedValueOnce()
        },
        body: {
          id: 'testProduct'
        }
      };
  
      await deleteInCart(req, res, next);
  
      expect(req.user.removeFromCart).toHaveBeenCalledWith('testProduct');
      expect(res.redirect).toHaveBeenCalledWith('/user/cart');
    });
  });

  describe('clearCart', () => {
    it('should clear the user cart and redirect to the cart page', async () => {
      const req = {
        user: {
          clearCart: jest.fn().mockResolvedValueOnce()
        }
      };

      const res = {
        redirect: jest.fn()
      };

      await clearCart(req, res, jest.fn());

      expect(req.user.clearCart).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/user/cart');
    });
  });
  
});



