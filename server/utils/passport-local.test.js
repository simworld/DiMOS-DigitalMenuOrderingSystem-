jest.setTimeout(30000);

const request = require('supertest');
const app = require('../../app');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const bcrypt = require('bcrypt');

let server;

describe('LocalStrategy', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test', salt);
    const user = new User({
      username: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
    });
    await user.save();

    server = app.listen(3300); // Start the server

  });
  afterAll(async () => {
    // await User.deleteMany({});qq
    server.close(); // Terminate the server
  });
  it('should authenticate user with correct credentials', async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test', salt);
    const req = { body: { email: 'admin@admin.com', password: hashedPassword } };
    const done = jest.fn();

    
    await passport.authenticate('local', (err, user) => {
      expect(err).toBeNull();
      expect(user).toEqual(expect.any(User));
      done();
    })(req, {}, done);
  });

  it('should not authenticate user with incorrect credentials', async () => {
    const req = { body: { email: 'admin@admin.com', password: 'wrongpassword' } };
    const done = jest.fn();
    await passport.authenticate('local', (err, user, info) => {
      expect(err).toBeNull();
      expect(user).toBe(false);
      expect(info.message).toEqual('Wrong Password');
      done();
    })(req, {}, done);
  });

// delete users
//   afterAll(async () => {
//     await User.deleteMany({});
//   });
});




// const request = require('supertest');
// const app = require('../../app');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/user');
// const bcrypt = require('bcrypt');

// let server;

// describe('LocalStrategy', () => {
//   beforeAll(async () => {
//     await User.deleteMany({});
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash('test', salt);
//     const user = new User({
//       username: 'admin',
//       email: 'admin@admin.com',
//       password: hashedPassword,
//     });
//     await user.save();

//     server = app.listen(3000); // Start the server
//   });

//   afterAll(async () => {
//     await User.deleteMany({});
//     server.close(); // Terminate the server
//   });

//   it('should authenticate user with correct credentials', async () => {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash('test', salt);
//     const req = { body: { email: 'admin@admin.com', password: hashedPassword } };
//     const done = jest.fn();

//     await passport.authenticate('local', (err, user) => {
//       expect(err).toBeNull();
//       expect(user).toEqual(expect.any(User));
//       done();
//     })(req, {}, done);
//   });

//   it('should not authenticate user with incorrect credentials', async () => {
//     const req = { body: { email: 'admin@admin.com', password: 'wrongpassword' } };
//     const done = jest.fn();
//     await passport.authenticate('local', (err, user, info) => {
//       expect(err).toBeNull();
//       expect(user).toBe(false);
//       expect(info.message).toEqual('Wrong Password');
//       done();
//     })(req, {}, done);
//   });
// });
