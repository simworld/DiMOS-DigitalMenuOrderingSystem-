const { body } = require('express-validator');

module.exports = {
  registerValidator: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please Insert A Valid Email Address')
      .normalizeEmail()
      .toLowerCase(),
    body('password')
      .trim()
      .isLength(4)
      .withMessage('Password lenght is too short , min 4 characters required'),
    body('password2').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password Do Not Match!');
      }
      return true;
    }),
  ],
};

