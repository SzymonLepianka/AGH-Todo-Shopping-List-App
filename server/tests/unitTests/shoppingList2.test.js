const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../src/app.js");

require("dotenv").config();

const shoppingListPayload_1 = {
  name: "test_list_1",
  date: "2022-11-01",
};

const shoppingListPayload_2 = {
  name: "test_list_2",
  date: "2022-11-02",
};

const shoppingListPayload_3 = {
  name: "test_list_3",
  date: "2022-11-03",
};

const user_id_1 = new mongoose.Types.ObjectId().toString();
const userPayload_1 = {
  _id: user_id_1,
  userId: "9d7074c8-e1d4-4fee-b19c-aaaaaaaaaaaa",
  username: "user1",
  password: "pass1",
};

const user_id_2 = new mongoose.Types.ObjectId().toString();
const userPayload_2 = {
  _id: user_id_2,
  userId: "9d7074c8-e1d4-4fee-b19c-bbbbbbbbbbbb",
  username: "user2",
  password: "pass2",
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

describe("shoppingList", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("create shoppingList route", () => {
    describe("given the user is not logged in (to create shoppingList)", () => {
      it("should return a 401", async () => {
        const res = await supertest(app).post("/shoppingLists");
        expect(res.statusCode).toBe(401);
        expect(res.text).toEqual("invalid credentials");
      });
    });

    describe("given the user is logged in (to create shoppingList)", () => {
      it("should return a 200 and create the shoppinglist", async () => {
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        const { statusCode, body } = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send(shoppingListPayload_2);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          shoppingListId: expect.any(String),
          name: shoppingListPayload_2.name,
          date: shoppingListPayload_2.date,
          completed: false,
          userId: userPayload_1.userId,
        });
      });

      it("should return a 400 (missing date param) and not create shoppingList", async () => {
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        const resPost = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send({ name: "test_list_1" });

        expect(resPost.statusCode).toBe(400);
        expect(resPost.text).toEqual("Missing date param");
        expect(resPost.body).toEqual({});

        const resGet = await supertest(app)
          .get(`/shoppingLists`)
          .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toEqual([]);
      });

      it("should return a 400 (missing name param) and not create shoppingList", async () => {
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        const resPost = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send({ date: "2022-11-01", namee: "testname" });

        expect(resPost.statusCode).toBe(400);
        expect(resPost.text).toEqual("Missing name param");
        expect(resPost.body).toEqual({});

        const resGet = await supertest(app)
          .get(`/shoppingLists`)
          .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toEqual([]);
      });

      it("should return a 400 (bad date format) and not create shoppingList", async () => {
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        const resPost = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send({ date: "2022-11-01111", name: "testname" });

        expect(resPost.statusCode).toBe(400);
        expect(resPost.text).toEqual("Bad date format (expected YYYY-MM-DD)");
        expect(resPost.body).toEqual({});

        const resGet = await supertest(app)
          .get(`/shoppingLists`)
          .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toEqual([]);
      });
    });
  });

  describe("get shoppingList route", () => {
    describe("given the user is not logged in (to read shoppingLists)", () => {
      it("should return a 401", async () => {
        const res = await supertest(app).get(`/shoppingLists`);
        expect(res.statusCode).toBe(401);
        expect(res.text).toEqual("invalid credentials");
      });
    });

    describe("given the user is logged in (to read shoppingLists)", () => {
      describe("given the user has no shopping lists", () => {
        it("should return a 200 status and the shoppingListId", async () => {
          // token autoryzacyjny użytkownika, który będzie dodany do requestów
          const token = jwt.sign(
            {
              userId: userPayload_1.userId,
            },
            process.env.SECRET
          );

          // pobranie wszystkich list zakupów użytkownika
          const resGet = await supertest(app)
            .get(`/shoppingLists`)
            .set("Authorization", `Bearer ${token}`);

          // użytkownik powinien posiadać 0 list zakupów
          expect(resGet.statusCode).toBe(200);
          expect(resGet.body.length).toBe(0);
          expect(resGet.body).toStrictEqual([]);
        });
      });
      describe("given the user has shoppingList(s)", () => {
        it.each([
          [[shoppingListPayload_1]],
          [[shoppingListPayload_1, shoppingListPayload_3]],
        ])(
          "should return a 200 status and the shoppingList(s)",
          async (user_shopping_lists) => {
            // token autoryzacyjny użytkownika, który będzie dodany do requestów
            const token = jwt.sign(
              {
                userId: userPayload_1.userId,
              },
              process.env.SECRET
            );

            // dodanie list zakupów użytownika
            let added_user_shopping_lists = [];
            for (const sl of user_shopping_lists) {
              const res = await supertest(app)
                .post("/shoppingLists")
                .set("Authorization", `Bearer ${token}`)
                .send(sl);
              added_user_shopping_lists = [
                ...added_user_shopping_lists,
                res.body,
              ];
            }

            // pobranie wszystkich list zakupów użytkownika
            const resGet = await supertest(app)
              .get(`/shoppingLists`)
              .set("Authorization", `Bearer ${token}`);

            // użytkownik powinien posiadać dodane listy zakupów
            expect(resGet.statusCode).toBe(200);
            expect(resGet.body.length).toBe(added_user_shopping_lists.length);
            added_user_shopping_lists.forEach((sl) => {
              expect(resGet.body).toContainEqual(sl);
            });
          }
        );

        it.each([
          [[shoppingListPayload_1]],
          [[shoppingListPayload_1, shoppingListPayload_3]],
        ])(
          "should return a 200 status and only user's shoppingList",
          async (user_shopping_lists) => {
            // token autoryzacyjny użytkownika, który będzie dodany do requestów
            const token = jwt.sign(
              {
                userId: userPayload_1.userId,
              },
              process.env.SECRET
            );

            // token autoryzacyjny użytkownika(2), który również posiada listę zakupów
            const token2 = jwt.sign(
              {
                userId: userPayload_2.userId,
              },
              process.env.SECRET
            );

            // dodanie list zakupów użytownika
            let added_user_shopping_lists = [];
            for (const sl of user_shopping_lists) {
              const res = await supertest(app)
                .post("/shoppingLists")
                .set("Authorization", `Bearer ${token}`)
                .send(sl);
              added_user_shopping_lists = [
                ...added_user_shopping_lists,
                res.body,
              ];
            }

            // dodanie listy zakupów użytownika(2)
            const shoppingList2 = await supertest(app)
              .post("/shoppingLists")
              .set("Authorization", `Bearer ${token2}`)
              .send(shoppingListPayload_2);

            // pobranie wszystkich list zakupów użytkownika
            const resGet = await supertest(app)
              .get(`/shoppingLists`)
              .set("Authorization", `Bearer ${token}`);

            // użytkownik powinien posiadać dodane listy zakupów
            expect(resGet.statusCode).toBe(200);
            expect(resGet.body.length).toBe(added_user_shopping_lists.length);
            added_user_shopping_lists.forEach((sl) => {
              expect(resGet.body).toContainEqual(sl);
            });
          }
        );
      });
    });
  });

  describe("update shoppingList route", () => {
    describe("given the user is not logged in (to update shoppingList)", () => {
      it("should return a 401", async () => {
        const res = await supertest(app).put(`/shoppingLists/1`);
        expect(res.statusCode).toBe(401);
        expect(res.text).toEqual("invalid credentials");
      });
    });

    describe("given the user is logged in (to update shoppingList)", () => {
      describe("given the shopping list id doesn't exist", () => {
        it.each([["63911197da116998ae2e8cd6"], ["123"]])(
          "should return a 400",
          async (sl_id) => {
            // token autoryzacyjny użytkownika, który będzie dodany do requestów
            const token = jwt.sign(
              {
                userId: userPayload_1.userId,
              },
              process.env.SECRET
            );

            // aktualizacja listy, która nie istnieje, przez użytkownika
            const resPut = await supertest(app)
              .put(`/shoppingLists/${sl_id}`)
              .set("Authorization", `Bearer ${token}`);

            expect(resPut.statusCode).toBe(400);
          }
        );
      });
      describe("given the user isn't the owner of the shopping list", () => {
        it("should return a 401", async () => {
          // token autoryzacyjny użytkownika(1), który będzie dodany do requestów
          const token = jwt.sign(
            {
              userId: userPayload_1.userId,
            },
            process.env.SECRET
          );

          // token autoryzacyjny użytkownika(2), który będzie właścicielem listy zakupów
          const token2 = jwt.sign(
            {
              userId: userPayload_2.userId,
            },
            process.env.SECRET
          );

          // dodanie listy zakupów użytownika(2)
          const shoppingList2 = await supertest(app)
            .post("/shoppingLists")
            .set("Authorization", `Bearer ${token2}`)
            .send(shoppingListPayload_2);

          // aktualizacja listy użytkownika(2) przez użytkownika(1)
          const resPut = await supertest(app)
            .put(`/shoppingLists/${shoppingList2.body._id}`)
            .set("Authorization", `Bearer ${token}`);

          expect(resPut.statusCode).toBe(401);
          expect(resPut.text).toEqual(
            "Shopping list doesn't belong to this user"
          );
        });
      });
      describe("given the user is the owner of the shopping list", () => {
        it("should return a 200 status and the shoppingList(s)", async () => {
          // token autoryzacyjny użytkownika, który będzie dodany do requestów
          const token = jwt.sign(
            {
              userId: userPayload_1.userId,
            },
            process.env.SECRET
          );

          // dodanie listy zakupów użytownika
          const shoppingList = await supertest(app)
            .post("/shoppingLists")
            .set("Authorization", `Bearer ${token}`)
            .send(shoppingListPayload_1);

          // aktualizacja listy użytkownika
          const resPut = await supertest(app)
            .put(`/shoppingLists/${shoppingList.body._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ completed: true, name: "other_name" });

          expect(resPut.statusCode).toBe(200);
          expect(resPut.body).toEqual({
            __v: 0,
            _id: shoppingList.body._id,
            shoppingListId: shoppingList.body.shoppingListId,
            name: "other_name",
            date: shoppingList.body.date,
            completed: true,
            userId: shoppingList.body.userId,
          });
        });
      });
    });
  });
  describe("delete shoppingList route", () => {
    describe("given the user is not logged in (to delete shoppingList)", () => {
      it("should return a 401", async () => {
        const res = await supertest(app).delete(`/shoppingLists/1`);
        expect(res.statusCode).toBe(401);
        expect(res.text).toEqual("invalid credentials");
      });
    });

    describe("given the user is logged in (to delete shoppingList)", () => {
      describe("given the shopping list id doesn't exist", () => {
        it.each([["63911197da116998ae2e8cd6"], ["123"]])(
          "should return a 400",
          async (sl_id) => {
            // token autoryzacyjny użytkownika, który będzie dodany do requestów
            const token = jwt.sign(
              {
                userId: userPayload_1.userId,
              },
              process.env.SECRET
            );

            // próba usunięcia listy, która nie istnieje, przez użytkownika
            const resDelete = await supertest(app)
              .delete(`/shoppingLists/${sl_id}`)
              .set("Authorization", `Bearer ${token}`);

            expect(resDelete.statusCode).toBe(400);
          }
        );
      });
      describe("given the user isn't the owner of the shopping list", () => {
        it("should return a 401", async () => {
          // token autoryzacyjny użytkownika(1), który będzie dodany do requestów
          const token = jwt.sign(
            {
              userId: userPayload_1.userId,
            },
            process.env.SECRET
          );

          // token autoryzacyjny użytkownika(2), który będzie właścicielem listy zakupów
          const token2 = jwt.sign(
            {
              userId: userPayload_2.userId,
            },
            process.env.SECRET
          );

          // dodanie listy zakupów użytownika(2)
          const shoppingList2 = await supertest(app)
            .post("/shoppingLists")
            .set("Authorization", `Bearer ${token2}`)
            .send(shoppingListPayload_2);

          // próba usunięcia listy użytkownika(2) przez użytkownika(1)
          const resDelete = await supertest(app)
            .delete(`/shoppingLists/${shoppingList2.body._id}`)
            .set("Authorization", `Bearer ${token}`);

          expect(resDelete.statusCode).toBe(401);
          expect(resDelete.text).toEqual(
            "Shopping list doesn't belong to this user"
          );
        });
      });
      describe("given the user is the owner of the shopping list", () => {
        it("should return a 200 status and the shoppingList(s)", async () => {
          // token autoryzacyjny użytkownika, który będzie dodany do requestów
          const token = jwt.sign(
            {
              userId: userPayload_1.userId,
            },
            process.env.SECRET
          );

          // dodanie listy zakupów użytownika
          const shoppingList = await supertest(app)
            .post("/shoppingLists")
            .set("Authorization", `Bearer ${token}`)
            .send(shoppingListPayload_1);

          // usunięcie listy użytkownika
          const resDelete = await supertest(app)
            .delete(`/shoppingLists/${shoppingList.body._id}`)
            .set("Authorization", `Bearer ${token}`);

          // pobranie wszystkich list użytkownika
          const resGet = await supertest(app)
            .get(`/shoppingLists`)
            .set("Authorization", `Bearer ${token}`);

          expect(resGet.statusCode).toBe(200);
          expect(resGet.body).toEqual([]);

          expect(resDelete.statusCode).toBe(200);
          expect(resDelete.body).toEqual({
            __v: 0,
            _id: shoppingList.body._id,
            shoppingListId: shoppingList.body.shoppingListId,
            name: shoppingList.body.name,
            date: shoppingList.body.date,
            completed: false,
            userId: shoppingList.body.userId,
          });
        });
      });
    });
  });
});
