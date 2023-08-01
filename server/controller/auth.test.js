jest.setTimeout(30000);

const { authRegister } = require('./auth');
const User = require('../models/user');

describe('authRegister', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'admin@admin.com',
        username: 'admin',
        password: 'password'
      },
      flash: jest.fn()
    };
    res = {
      render: jest.fn(),
      redirect: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should redirect to /auth/login after successful registration', async () => {
    User.findOne = jest.fn().mockReturnValue(null);
    User.prototype.save = jest.fn();

    await authRegister(req, res, next);

    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/auth/login');
    expect(req.flash).toHaveBeenCalledWith(
      'success',
      `${req.body.email} registered succesfully! You can now login!`
    );
  });

  it('should redirect to /auth/register if email already exists', async () => {
    User.findOne = jest.fn().mockReturnValue({ email: req.body.email });

    await authRegister(req, res, next);

    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.prototype.save).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/auth/register');
    expect(req.flash).toHaveBeenCalledWith('warning', 'Email already exists');
  });

})