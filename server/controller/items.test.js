const Product = require('../models/product');
const { createItem, findItem } = require('../controller/items');


describe('createItem function', () => {
  let req, res;
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };
  });

  it('should create a new item', async () => {
    const req = {
      body: {
        title: 'Test Item',
        price: 10,
        description: 'This is a test product',
      },
    };
    const saveSpy = jest.spyOn(Product.prototype, 'save');
    const product = new Product(req.body);
    saveSpy.mockResolvedValue(product);

    await createItem(req, res);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/admin/new-item');
  });
});


  