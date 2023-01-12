import "cypress-each";
import Moment from "moment";
const faker = require("faker");

const testUserData = {
  username: "test_user",
  password: "test_pass",
};

/// <reference types="cypress" />
describe("ShoppingListPage (home)", () => {
  it("rendering shopping list page", () => {
    // zaloguj się
    cy.visit("/login");
    cy.get('[data-testid="username-input"]').type(testUserData.username);
    cy.get('[data-testid="password-input"]').type(testUserData.password);
    cy.get('[data-testid="submit-login-button"]').click();

    // powinna zostać wyświetlona strona główna
    cy.url().should("eq", "http://localhost:3000/");

    // widoczne są następujące elementy, o odpowiedniej treści
    cy.get('[data-testid="slpage-title-label"]')
      .should("be.visible")
      .contains("Shopping List App");
    cy.get('[data-testid="shopping-lists"]').should("be.visible");
    cy.get('[data-testid="create-shopping-list-form"]').should("be.visible");
    cy.get('[data-testid="create-sl-form"]').should("be.visible");
    cy.get('[data-testid="name-label"]')
      .should("be.visible")
      .contains("Nazwa: ");
    cy.get('[data-testid="name-input"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get('[data-testid="date-label"]')
      .should("be.visible")
      .contains("Sugerowana data wykonania: ");
    cy.get('[data-testid="date-input"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get('[data-testid="create-sl-button"]').should("be.visible");
  });

  it.each([
    [
      faker.internet.userName(),
      Moment(faker.date.future()).format("YYYY-MM-DD"),
    ],
  ])("succesfully creating new shopping list", (sl_name, sl_date) => {
    // zaloguj się
    cy.visit("/login");
    cy.get('[data-testid="username-input"]').type(testUserData.username);
    cy.get('[data-testid="password-input"]').type(testUserData.password);
    cy.get('[data-testid="submit-login-button"]').click();

    // wypełnienie formularza
    cy.get('[data-testid="name-input"]').type(sl_name);
    cy.get('[data-testid="date-input"]').type(sl_date);

    // pola zostały wypełnione
    cy.get('[data-testid="name-input"]').should("have.value", sl_name);
    cy.get('[data-testid="date-input"]').should("have.value", sl_date);

    // stwórz listę zakupów
    cy.get('[data-testid="create-sl-button"]').click();

    // nowa lista powinna zostać dodana i widoczna
    cy.get('[data-testid="shopping-lists"]').should("be.visible");
    cy.get('[data-testid="shoppingList-name-input"]')
      .last()
      .should("have.value", sl_name);
    cy.get('[data-testid="shoppingList-date-content"]')
      .last()
      .contains(sl_date);
  });

  // it.each([
  //   ["", "", "Username and password required!"],
  //   ["okokok", "", "Username and password required!"],
  //   ["", "okokok", "Username and password required!"],
  //   ["usr3", "password3", "Minimum 5 characters in username"],
  //   ["username3", "pas3", "Minimum 5 characters in password"],
  //   ["usr3", "pas3", "Minimum 5 characters in username"],
  //   ["%", "%", "Minimum 5 characters in username"],
  //   ["username1", "!@#$%^&*{}", "Illegal characters is password"],
  //   ["!@#$%^&*{}", "!@#$%^&*{}", "Illegal characters is username"],
  //   ["!@#$%^&*{}", "password1", "Illegal characters is username"],
  //   [
  //     "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  //     "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  //     "Too long username",
  //   ],
  //   [
  //     "username1",
  //     "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  //     "Too long password",
  //   ],
  //   [
  //     "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  //     "password1",
  //     "Too long username",
  //   ],
  // ])("registering with wrong data", (username, password, error_message) => {
  //   // wejdź na stronę do rejestracji
  //   cy.visit("/register");
  //   cy.url().should("include", "/register");

  //   // wypełnienie formularza
  //   if (username !== "")
  //     cy.get('[data-testid="username-input"]').type(username);
  //   if (password !== "")
  //     cy.get('[data-testid="password-input"]').type(password);

  //   // pola zostały wypełnione
  //   cy.get('[data-testid="username-input"]').should("have.value", username);
  //   cy.get('[data-testid="password-input"]').should("have.value", password);

  //   // logowanie
  //   cy.get('[data-testid="submit-register-button"]').click();

  //   // nie powinno zostać wykonane przekierowanie na stronę do logowania
  //   cy.url().should("eq", "http://localhost:3000/register");

  //   // komunikat o błędzie
  //   cy.get('[data-testid="error-label"]')
  //     .should("be.visible")
  //     .contains(error_message);
  // });
});
