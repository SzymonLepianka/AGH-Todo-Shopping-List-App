const mongoose = require("mongoose");
const sinon = require('sinon');
const isLoggedIn = require('../src/middleware/isLoggedIn');
const request = require("supertest");

var app;

/* Connecting to the database before each test. */
beforeEach(async () => {
  sinon.stub(isLoggedIn, 'isLoggedIn')
    .callsFake(function(req, res, next) {
        return next();
    });
  
  app = require('../src/app.js');
  require("dotenv").config();
  await mongoose.connect(process.env.MONGO_URI);
});

// /* Closing database connection after each test. */
// afterEach(async () => {
//   await mongoose.connection.close();
// });

describe("GET /shoppingLists", () => {
  it("should return user's all shopping lists", async () => {
    const res = await request(app).get("/shoppingLists");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});