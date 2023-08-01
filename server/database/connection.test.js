jest.setTimeout(30000);

const mongoose = require('mongoose');
const connectDB = require('./connection')
const app = require("../../app");
let server;

require("dotenv").config();

describe('Database Connection', () => {
  beforeAll(async () => {
    await connectDB();
    server = app.listen(3300); // Start the server

  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();

  });

  it('should connect to the database', async () => {
    expect(mongoose.connection.readyState).toEqual(1);
  });
});

