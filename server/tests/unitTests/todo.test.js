const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../src/app.js");

require("dotenv").config();

// const shopping_list_id_1 = new mongoose.Types.ObjectId().toString();
const shoppingListPayload_1 = {
  name: "test_list_name_1",
  date: "2022-11-01",
};

// const shopping_list_id_2 = new mongoose.Types.ObjectId().toString();
const shoppingListPayload_2 = {
  name: "test_list_2",
  date: "2022-11-02",
};

// const shopping_list_id_3 = new mongoose.Types.ObjectId().toString();
const shoppingListPayload_3 = {
  name: "test_list_3",
  date: "2022-11-03",
};

const todoPayload_1 = {
  name: "test_todo_name_1",
  amount: "123",
  grammage: "ml",
};

const todoPayload_2 = {
  name: "test_todo_name_2",
  amount: "45.6",
  grammage: "kg",
};

const todoPayload_3 = {
  name: "test_todo_name_3",
  amount: "67.89",
  grammage: "m",
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

describe("todo", () => {
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

  describe("create todo route", () => {
    describe("given the user is not logged in (to create todo)", () => {
      it("should return a 401", async () => {
        const res = await supertest(app).post("/todos");
        expect(res.statusCode).toBe(401);
        expect(res.text).toEqual("invalid credentials");
      });
    });

    describe("given the user is logged in (to create todo)", () => {
      it("should return a 200 and create the todo", async () => {
        // token autoryzacyjny użytkownika, który będzie dodany do requestów
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        // dodanie listy zakupów użytownika
        const shoppingList1 = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send(shoppingListPayload_1);

        // dodanie przedmiotu do listy zakupów
        const { statusCode, body } = await supertest(app)
          .post("/todos")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: todoPayload_1.name,
            amount: todoPayload_1.amount,
            grammage: todoPayload_1.grammage,
            shoppingListId: shoppingList1.body.shoppingListId,
          });

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          name: todoPayload_1.name,
          amount: todoPayload_1.amount,
          grammage: todoPayload_1.grammage,
          completed: false,
          shoppingListId: shoppingList1.body.shoppingListId,
        });

        // pobranie wszystkich przedmiotów z listy zakupów
        const resGet = await supertest(app)
          .get(`/todos/${shoppingList1.body.shoppingListId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body.length).toBe(1);
      });

      it("should return a 400 (missing name param) and not create todo", async () => {
        // token autoryzacyjny użytkownika, który będzie dodany do requestów
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        // dodanie listy zakupów użytownika
        const shoppingList1 = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send(shoppingListPayload_1);

        // dodanie przedmiotu do listy zakupów
        const resPost = await supertest(app)
          .post("/todos")
          .set("Authorization", `Bearer ${token}`)
          .send({
            amount: todoPayload_1.amount,
            grammage: todoPayload_1.grammage,
            shoppingListId: shoppingList1.body.shoppingListId,
          });

        expect(resPost.statusCode).toBe(400);
        expect(resPost.text).toEqual("Missing name param");
        expect(resPost.body).toEqual({});

        // pobranie wszystkich przedmiotów z listy zakupów
        const resGet = await supertest(app)
          .get(`/todos/${shoppingList1.body.shoppingListId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toEqual([]);
      });

      it("should return a 400 (missing amount param) and not create todo", async () => {
        // token autoryzacyjny użytkownika, który będzie dodany do requestów
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        // dodanie listy zakupów użytownika
        const shoppingList1 = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send(shoppingListPayload_1);

        // dodanie przedmiotu do listy zakupów
        const resPost = await supertest(app)
          .post("/todos")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: todoPayload_1.name,
            grammage: todoPayload_1.grammage,
            shoppingListId: shoppingList1.body.shoppingListId,
          });

        expect(resPost.statusCode).toBe(400);
        expect(resPost.text).toEqual("Missing amount param");
        expect(resPost.body).toEqual({});

        // pobranie wszystkich przedmiotów z listy zakupów
        const resGet = await supertest(app)
          .get(`/todos/${shoppingList1.body.shoppingListId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toEqual([]);
      });

      it("should return a 400 (missing grammage param) and not create todo", async () => {
        // token autoryzacyjny użytkownika, który będzie dodany do requestów
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        // dodanie listy zakupów użytownika
        const shoppingList1 = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send(shoppingListPayload_1);

        // dodanie przedmiotu do listy zakupów
        const resPost = await supertest(app)
          .post("/todos")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: todoPayload_1.name,
            amount: todoPayload_1.amount,
            shoppingListId: shoppingList1.body.shoppingListId,
          });

        expect(resPost.statusCode).toBe(400);
        expect(resPost.text).toEqual("Missing grammage param");
        expect(resPost.body).toEqual({});

        // pobranie wszystkich przedmiotów z listy zakupów
        const resGet = await supertest(app)
          .get(`/todos/${shoppingList1.body.shoppingListId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toEqual([]);
      });

      it("should return a 400 (missing shoppingListId param) and not create todo", async () => {
        // token autoryzacyjny użytkownika, który będzie dodany do requestów
        const token = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        // dodanie listy zakupów użytownika
        const shoppingList1 = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token}`)
          .send(shoppingListPayload_1);

        // dodanie przedmiotu do listy zakupów
        const resPost = await supertest(app)
          .post("/todos")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: todoPayload_1.name,
            amount: todoPayload_1.amount,
            grammage: todoPayload_1.grammage,
          });

        expect(resPost.statusCode).toBe(400);
        expect(resPost.text).toEqual("Missing shoppingListId param");
        expect(resPost.body).toEqual({});

        // pobranie wszystkich przedmiotów z listy zakupów
        const resGet = await supertest(app)
          .get(`/todos/${shoppingList1.body.shoppingListId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toEqual([]);
      });

      it.each([["63911197da116998ae2e8cd6"], ["123"]])(
        "should return a 400 (shopping list doesn't exist) and not create todo",
        async (shopping_list_id) => {
          // token autoryzacyjny użytkownika, który będzie dodany do requestów
          const token = jwt.sign(
            {
              userId: userPayload_1.userId,
            },
            process.env.SECRET
          );

          // dodanie przedmiotu do listy zakupów
          const resPost = await supertest(app)
            .post("/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
              name: todoPayload_1.name,
              amount: todoPayload_1.amount,
              grammage: todoPayload_1.grammage,
              shoppingListId: shopping_list_id,
            });

          expect(resPost.statusCode).toBe(400);
          expect(resPost.body).toEqual({});
        }
      );

      it("should return a 401 (user is not shopping list owner) and not create todo", async () => {
        // token autoryzacyjny użytkownika(1), który będzie dodany do requestów
        const token1 = jwt.sign(
          {
            userId: userPayload_1.userId,
          },
          process.env.SECRET
        );

        // token autoryzacyjny użytkownika(2), który będzie właścicielem listy
        const token2 = jwt.sign(
          {
            userId: userPayload_2.userId,
          },
          process.env.SECRET
        );

        // dodanie listy zakupów użytownika
        const shoppingList2 = await supertest(app)
          .post("/shoppingLists")
          .set("Authorization", `Bearer ${token2}`)
          .send(shoppingListPayload_2);

        // dodanie przedmiotu do listy zakupów
        const resPost = await supertest(app)
          .post("/todos")
          .set("Authorization", `Bearer ${token1}`)
          .send({
            name: todoPayload_1.name,
            amount: todoPayload_1.amount,
            grammage: todoPayload_1.grammage,
            shoppingListId: shoppingList2.body.shoppingListId,
          });

        expect(resPost.statusCode).toBe(401);
        expect(resPost.text).toEqual(
          "Shopping list doesn't belong to this user"
        );
        expect(resPost.body).toEqual({});

        // pobranie wszystkich przedmiotów z listy zakupów
        const resGet = await supertest(app)
          .get(`/todos/${shoppingList2.body.shoppingListId}`)
          .set("Authorization", `Bearer ${token2}`);

        expect(resGet.statusCode).toBe(200);
        expect(resGet.body).toEqual([]);
      });
    });
  });

  describe("get todos route", () => {
    describe("given the user is not logged in (to read todos)", () => {
      it("should return a 401", async () => {
        const res = await supertest(app).get(`/todos/1`);
        expect(res.statusCode).toBe(401);
        expect(res.text).toEqual("invalid credentials");
      });
    });

    describe("given the user is logged in (to read todos)", () => {
      describe("given the shopping list doesn't exist", () => {
        it.each([["63911197da116998ae2e8cd6"], ["123"]])(
          "should return a 400 (shopping list doesn't exist) and empty body",
          async (shopping_list_id) => {
            // token autoryzacyjny użytkownika, który będzie dodany do requestów
            const token = jwt.sign(
              {
                userId: userPayload_1.userId,
              },
              process.env.SECRET
            );

            // pobranie przedmiotów z listy zakupów użytkownika (która nie istnieje)
            const resGet = await supertest(app)
              .get(`/todos/${shopping_list_id}`)
              .set("Authorization", `Bearer ${token}`);

            // użytkownik powinien posiadać 0 list zakupów
            expect(resGet.statusCode).toBe(400);
            expect(resGet.text).toEqual("Shopping list doesn't exist");
          }
        );
      });
      describe("given the user has shoppingList(s)", () => {
        it.each([[[todoPayload_1]], [[todoPayload_1, todoPayload_3]]])(
          "should return a 200 status and the todos",
          async (user_todos) => {
            // token autoryzacyjny użytkownika, który będzie dodany do requestów
            const token = jwt.sign(
              {
                userId: userPayload_1.userId,
              },
              process.env.SECRET
            );

            // dodanie listy zakupów użytownika
            const shoppingList1 = await supertest(app)
              .post("/shoppingLists")
              .set("Authorization", `Bearer ${token}`)
              .send(shoppingListPayload_1);

            // dodanie przedmiotów do listy zakupów użytownika
            let added_user_todos = [];
            for (const todo of user_todos) {
              const res = await supertest(app)
                .post("/todos")
                .set("Authorization", `Bearer ${token}`)
                .send({
                  name: todo.name,
                  amount: todo.amount,
                  grammage: todo.grammage,
                  shoppingListId: shoppingList1.body.shoppingListId,
                });
              added_user_todos = [...added_user_todos, res.body];
            }

            // pobranie wszystkich przedmiotów z listy zakupów użytkownika
            const resGet = await supertest(app)
              .get(`/todos/${shoppingList1.body.shoppingListId}`)
              .set("Authorization", `Bearer ${token}`);

            // użytkownik powinien posiadać dodane listy zakupów
            expect(resGet.statusCode).toBe(200);
            expect(resGet.body.length).toBe(added_user_todos.length);
            added_user_todos.forEach((todo) => {
              expect(resGet.body).toContainEqual(todo);
            });
          }
        );
      });
      describe("given the user isn't owner of shoppingList", () => {
        it("should return a 401 status and empty body", async () => {
          // token autoryzacyjny użytkownika(1), który będzie dodany do requestów
          const token1 = jwt.sign(
            {
              userId: userPayload_1.userId,
            },
            process.env.SECRET
          );

          // token autoryzacyjny użytkownika(2), który będzie właścicielem listy
          const token2 = jwt.sign(
            {
              userId: userPayload_2.userId,
            },
            process.env.SECRET
          );

          // dodanie listy zakupów użytownika
          const shoppingList2 = await supertest(app)
            .post("/shoppingLists")
            .set("Authorization", `Bearer ${token2}`)
            .send(shoppingListPayload_2);

          // dodanie przedmiotu do listy zakupów (przez właściciela)
          const resPost = await supertest(app)
            .post("/todos")
            .set("Authorization", `Bearer ${token2}`)
            .send({
              name: todoPayload_2.name,
              amount: todoPayload_2.amount,
              grammage: todoPayload_2.grammage,
              shoppingListId: shoppingList2.body.shoppingListId,
            });

          expect(resPost.statusCode).toBe(200);

          // pobranie wszystkich przedmiotów z listy zakupów przez użytkownika który nie jest właścicielem
          const resGet = await supertest(app)
            .get(`/todos/${shoppingList2.body.shoppingListId}`)
            .set("Authorization", `Bearer ${token1}`);

          expect(resGet.statusCode).toBe(401);
          expect(resGet.text).toEqual(
            "Shopping list doesn't belong to this user"
          );
          expect(resGet.body).toEqual({});
        });
      });
    });
  });

  //TODO tu skończyłem

  describe("update todos route", () => {
    describe("given the user is not logged in (to update todos)", () => {
      it("should return a 401", async () => {
        const res = await supertest(app).put(`/todos/1`);
        expect(res.statusCode).toBe(401);
        expect(res.text).toEqual("invalid credentials");
      });
    });

    describe("given the user is logged in (to update todos)", () => {
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
