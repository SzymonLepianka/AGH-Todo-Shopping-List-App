import "cypress-each";
const faker = require("faker");

/// <reference types="cypress" />
describe("Login page", () => {
  it("rendering login page", () => {
    // wejdź na stronę główną
    cy.visit("/");

    // powinno zostać wykonane przekierowanie
    cy.url().should("include", "/login");

    // widoczne są następujące elementy, o odpowiedniej treści
    cy.get('[data-testid="loginpage-title-label"]')
      .should("be.visible")
      .contains("Login");
    cy.get('[data-testid="login-form"]').should("be.visible");
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
    cy.get('[data-testid="submit-login-button"]').should("be.visible");

    // nie ma komunikatu o błędzie
    cy.get('[data-testid="error-label"]').should("not.exist");
  });
  it.each([["test_user", "test_pass"]])(
    "succesfully logging",
    (username, password) => {
      // wejdź na stronę
      cy.visit("/");

      // kontrola przekierowania
      cy.url().should("include", "/login");

      // wypełnienie formularza
      cy.get('[data-testid="username-input"]').type(username);
      cy.get('[data-testid="password-input"]').type(password);

      // pola zostały wypełnione
      cy.get('[data-testid="username-input"]').should("have.value", username);
      cy.get('[data-testid="password-input"]').should("have.value", password);

      // logowanie
      cy.get('[data-testid="submit-login-button"]').click();

      // powinno zostać wykonane przekierowanie na stronę główną
      cy.url().should("eq", "http://localhost:3000/");
      cy.get('[data-testid="slpage-title-label"]')
        .should("be.visible")
        .contains("Shopping List App");
    }
  );

  it.each([
    ["", "", "Username and password required!"],
    ["test_user", "", "Username and password required!"],
    ["", "test_pass", "Username and password required!"],
    ["usr3", "test_pass", "Minimum 5 characters in username"],
    ["test_user", "pas3", "Minimum 5 characters in password"],
    ["usr3", "pas3", "Minimum 5 characters in username"],
    ["%", "%", "Minimum 5 characters in username"],
    ["test_user", "!@#$%^&*{}", "Illegal characters is password"],
    ["!@#$%^&*{}", "!@#$%^&*{}", "Illegal characters is username"],
    ["!@#$%^&*{}", "test_pass", "Illegal characters is username"],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "Too long username",
    ],
    [
      "test_user",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "Too long password",
    ],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "test_pass",
      "Too long username",
    ],
    [
      faker.internet.userName(),
      faker.internet.password(),
      "Request failed with status code 401",
    ],
    [
      "test_user",
      faker.internet.password(),
      "Request failed with status code 401",
    ],
    [
      faker.internet.userName(),
      "test_pass",
      "Request failed with status code 401",
    ],
  ])("logging with wrong data", (username, password, error_message) => {
    // wejdź na stronę
    cy.visit("/");

    // kontrola przekierowania
    cy.url().should("include", "/login");

    // wypełnienie formularza
    if (username !== "")
      cy.get('[data-testid="username-input"]').type(username);
    if (password !== "")
      cy.get('[data-testid="password-input"]').type(password);

    // pola zostały wypełnione
    cy.get('[data-testid="username-input"]').should("have.value", username);
    cy.get('[data-testid="password-input"]').should("have.value", password);

    // logowanie
    cy.get('[data-testid="submit-login-button"]').click();

    // nie powinno zostać wykonane przekierowanie na stronę główną
    cy.url().should("eq", "http://localhost:3000/login");

    // komunikat o błędzie
    cy.get('[data-testid="error-label"]')
      .should("be.visible")
      .contains(error_message);
  });
});
