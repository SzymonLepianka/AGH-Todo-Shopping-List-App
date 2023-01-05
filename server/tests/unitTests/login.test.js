const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../src/app.js");

require("dotenv").config();

const userPayload_1 = {
  username: "username1",
  password: "password1",
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

describe("login", () => {
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

  describe("login route", () => {
    describe("given the username is empty", () => {
      it("should return a 400", async () => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app)
          .post("/login")
          .send({ username: "", password: userPayload_1.password });
        expect(resLogin.statusCode).toBe(400);
        expect(resLogin.text).toEqual("Empty username");
        expect(resLogin.body).toEqual({});
      });
    });

    describe("given the username param is missing", () => {
      it("should return a 400", async () => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app)
          .post("/login")
          .send({ password: userPayload_1.password });
        expect(resLogin.statusCode).toBe(400);
        expect(resLogin.text).toEqual("Empty username");
        expect(resLogin.body).toEqual({});
      });
    });

    describe("given the username param is missing and password param is missing", () => {
      it("should return a 400", async () => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app).post("/login").send();
        expect(resLogin.statusCode).toBe(400);
        expect(resLogin.body).toEqual({});
      });
    });

    describe("given the password is empty", () => {
      it("should return a 400", async () => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app)
          .post("/login")
          .send({ password: "", username: userPayload_1.username });
        expect(resLogin.statusCode).toBe(400);
        expect(resLogin.text).toEqual("Empty password");
        expect(resLogin.body).toEqual({});
      });
    });

    describe("given the username is empty and password is empty", () => {
      it("should return a 400", async () => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app)
          .post("/login")
          .send({ password: "", username: "" });
        expect(resLogin.statusCode).toBe(400);
        expect(resLogin.body).toEqual({});
      });
    });

    describe("given the password param is missing", () => {
      it("should return a 400", async () => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app)
          .post("/login")
          .send({ username: userPayload_1.username });
        expect(resLogin.statusCode).toBe(400);
        expect(resLogin.text).toEqual("Empty password");
        expect(resLogin.body).toEqual({});
      });
    });

    describe("given the username and password are correct (to login)", () => {
      it("should return a 200", async () => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app).post("/login").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resLogin.statusCode).toBe(200);
        expect(typeof resLogin.body.token).toBe("string");

        // weryfikacja tokenu
        jwt.verify(resLogin.body.token, process.env.SECRET, (err, decoded) => {
          expect(err).toBeNull();
        });
      });
    });

    describe("given the username is valid and password is invalid (to login)", () => {
      it.each([
        [""],
        ["pass3"],
        ["D2pIv0ZrK"],
        ["%"],
        ["!@#$%^&*{}"],
        [
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        ],
      ])("should not return a 200", async (password) => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app)
          .post("/login")
          .send({ username: userPayload_1.username, password: password });
        expect(resLogin.statusCode).not.toBe(200);
      });
    });

    describe("given the username is invalid and password is valid (to login)", () => {
      it.each([
        [""],
        ["user3"],
        ["D2pIv0ZrK"],
        ["%"],
        ["!@#$%^&*{}"],
        [
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        ],
      ])("should not return a 200", async (username) => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app)
          .post("/login")
          .send({ username: username, password: userPayload_1.password });
        expect(resLogin.statusCode).not.toBe(200);
      });
    });

    describe("given the username is invalid and password is invalid (to login)", () => {
      it.each([
        ["", ""],
        ["user3", "pass3"],
        ["D2pIv0ZrK", "D2pI;lkjv0ZrK"],
        ["%", "!"],
        ["!@#$%^&*{}", "(*&^%$#@"],
        [
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ],
      ])("should not return a 200", async (username, password) => {
        // rejestracja użytkownika
        const resReqister = await supertest(app).post("/register").send({
          username: userPayload_1.username,
          password: userPayload_1.password,
        });
        expect(resReqister.statusCode).toBe(201);
        expect(resReqister.text).toBe("Created!");

        // logowanie użytkownika
        const resLogin = await supertest(app)
          .post("/login")
          .send({ username: username, password: password });
        expect(resLogin.statusCode).not.toBe(200);
      });
    });
  });
});
