const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const sinon = require('sinon');
const isLoggedIn = require('../src/middleware/isLoggedIn');
const request = require("supertest");

var token;
  
const app = require('../src/app.js');
require("dotenv").config();
  
beforeEach(async () => { 

  /* Connecting to the database before each test. */
  await mongoose.connect(process.env.MONGO_URI);

  /* Creating a new user, logging in and saving the token */
  await request(app).post("/register").send({ username: "test_user5", password: "test_pass" });
  const res = await request(app).post("/login").send({ username: "test_user5", password: "test_pass" });
  token = JSON.parse(res.text).token
});

afterEach(async () => {

  /* Closing database connection after each test. */
  await mongoose.connection.close();
});

describe("GET /shoppingLists", () => {
  it("should return user's all shopping lists", async () => {
    const res = await request(app).get("/shoppingLists").set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});