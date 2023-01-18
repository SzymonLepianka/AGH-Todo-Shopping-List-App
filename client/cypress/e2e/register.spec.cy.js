import "cypress-each";
const faker = require("faker");

/// <reference types="cypress" />
describe("Register page", () => {
  it("rendering login page", () => {
    // wejdź na stronę do rejestracji
    cy.visit("/register");
    cy.url().should("include", "/register");

    // widoczne są następujące elementy, o odpowiedniej treści
    cy.get('[data-testid="registerpage-title-label"]')
      .should("be.visible")
      .contains("Register");
    cy.get('[data-testid="register-form"]').should("be.visible");
    cy.get('[data-testid="username-label"]')
      .should("be.visible")
      .contains("Username: ");
    cy.get('[data-testid="username-input"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get('[data-testid="password-label"]')
      .should("be.visible")
      .contains("Password: ");
    cy.get('[data-testid="password-input"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get('[data-testid="submit-register-button"]').should("be.visible");

    // nie ma komunikatu o błędzie
    cy.get('[data-testid="error-label"]').should("not.exist");
  });
  it.each([[faker.internet.userName(), faker.internet.password()]])(
    "succesfully register",
    (username, password) => {
      // wejdź na stronę do rejestracji
      cy.visit("/register");
      cy.url().should("include", "/register");

      // wypełnienie formularza
      cy.get('[data-testid="username-input"]').type(username);
      cy.get('[data-testid="password-input"]').type(password);

      // pola zostały wypełnione
      cy.get('[data-testid="username-input"]').should("have.value", username);
      cy.get('[data-testid="password-input"]').should("have.value", password);

      // rejestracja
      cy.get('[data-testid="submit-register-button"]').click();

      // powinno zostać wykonane przekierowanie na stronę do logowania
      cy.url().should("eq", "http://localhost:3000/login");
      cy.get('[data-testid="loginpage-title-label"]')
        .should("be.visible")
        .contains("Login");
    }
  );

  it.each([
    ["", "", "Username and password required!"],
    ["okokok", "", "Username and password required!"],
    ["", "okokok", "Username and password required!"],
    ["usr3", "password3", "Minimum 5 characters in username"],
    ["username3", "pas3", "Minimum 5 characters in password"],
    ["usr3", "pas3", "Minimum 5 characters in username"],
    ["%", "%", "Minimum 5 characters in username"],
    ["username1", "!@#$%^&*{}", "Illegal characters is password"],
    ["!@#$%^&*{}", "!@#$%^&*{}", "Illegal characters is username"],
    ["!@#$%^&*{}", "password1", "Illegal characters is username"],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "Too long username",
    ],
    [
      "username1",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "Too long password",
    ],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "password1",
      "Too long username",
    ],
  ])("registering with wrong data", (username, password, error_message) => {
    // wejdź na stronę do rejestracji
    cy.visit("/register");
    cy.url().should("include", "/register");

    // wypełnienie formularza
    if (username !== "")
      cy.get('[data-testid="username-input"]').type(username);
    if (password !== "")
      cy.get('[data-testid="password-input"]').type(password);

    // pola zostały wypełnione
    cy.get('[data-testid="username-input"]').should("have.value", username);
    cy.get('[data-testid="password-input"]').should("have.value", password);

    // logowanie
    cy.get('[data-testid="submit-register-button"]').click();

    // nie powinno zostać wykonane przekierowanie na stronę do logowania
    cy.url().should("eq", "http://localhost:3000/register");

    // komunikat o błędzie
    cy.get('[data-testid="error-label"]')
      .should("be.visible")
      .contains(error_message);
  });
});
