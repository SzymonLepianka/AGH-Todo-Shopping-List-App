const mockingoose = require("mockingoose");
const request = require("supertest");
const app = require('../../src/app.js');
const ShoppingListModel = require("../../src/models/ShoppingListModel");
const UserModel = require("../../src/models/UserModel");

require("dotenv").config();

describe("GET /shoppingLists", () => {
  it("should return user's all shopping lists", async () => {
    const _shoppingList = [{
        _id: '6373b7e9b8895882ca32cbc6',
        shoppingListId: "9b56fa7b-8966-46ba-b027-cb9fdd6d280c",
        name: "test_list_5",
        date: "2022-11-19",
        completed: false,
        userId: "9d7074c8-e1d4-4fee-b19c-aa15a068860c"
      },
      {
        _id: '6373b7e9b8895882ca32cbc6',
        shoppingListId: "9b56fa7b-8966-46ba-b027-cb9fdd6d280d",
        name: "test_list_5",
        date: "2022-11-19",
        completed: false,
        userId: "9d7074c8-e1d4-4fee-b19c-aa15a068860c"
      }
    ]

    const _user = {
      _id: "636e778131e7d0c403f5c48f",
      userId: "9d7074c8-e1d4-4fee-b19c-aa15a068860c",
      username: "user3",
      password: "pass3"
    }

    mockingoose(ShoppingListModel).toReturn(_shoppingList)
    mockingoose(UserModel).toReturn(_user)

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZDcwNzRjOC1lMWQ0LTRmZWUtYjE5Yy1hYTE1YTA2ODg2MGMiLCJpYXQiOjE2Njg1Mjg3Mjl9.5gzskICfVMOv1uCXVkFQE3v1qP2odtHvg_L_YaJmU04"

    await request(app).get("/shoppingLists").set('Authorization', `Bearer ${token}`).then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(_shoppingList);
      expect(res.body).toHaveLength(2);
    })
  });
});