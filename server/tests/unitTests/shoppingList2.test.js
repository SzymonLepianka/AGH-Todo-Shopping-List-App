const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const {
  MongoMemoryServer
} = require("mongodb-memory-server");

const app = require('../../src/app.js');

require("dotenv").config();

const user_id = new mongoose.Types.ObjectId().toString();

const shoppingListPayload = {
  name: "test_list_52222222222",
  date: "2022-11-19",
  completed: false,
  userId: "9d7074c8-e1d4-4fee-b19c-aa15a068860c"
};

const userPayload = {
  _id: user_id,
  userId: "9d7074c8-e1d4-4fee-b19c-aa15a068860c",
  username: "user3",
  password: "pass3"
};


describe("shoppingList", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("create shoppingList route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 401", async () => {
        const {
          statusCode
        } = await supertest(app).post("/shoppingLists");
        expect(statusCode).toBe(401);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 and create the shoppinglist", async () => {
        const token = jwt.sign({
          userId: userPayload.userId
        }, process.env.SECRET);

        const {
          statusCode,
          body
        } = await supertest(app)
            
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send(shoppingListPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          shoppingListId: expect.any(String),
          name: shoppingListPayload.name,
          date: shoppingListPayload.date,
          completed: shoppingListPayload.completed,
          userId: shoppingListPayload.userId,
        });
      });
    });
  });
});