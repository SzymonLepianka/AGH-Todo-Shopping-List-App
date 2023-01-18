import "cypress-each";
import Moment from "moment";
const faker = require("faker");

const testUserData = {
  username: "test_user",
  password: "test_pass",
};

const testShoppingList = {
  sl_name: faker.internet.userName(),
  sl_date: Moment(faker.date.future()).format("YYYY-MM-DD"),
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
  it.each([
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "2022-12-12",
    ],
    ["x", "2045-12-21"],
    ["", "2023-01-01"],
    ["sl_name", ""],
    ["", ""],
    ["!@#$%^&*{}", "2012-12-12"],
  ])(
    "attempting to create a new list using illegal data",
    (sl_name, sl_date) => {
      // zaloguj się
      cy.visit("/login");
      cy.get('[data-testid="username-input"]').type(testUserData.username);
      cy.get('[data-testid="password-input"]').type(testUserData.password);
      cy.get('[data-testid="submit-login-button"]').click();

      // wypełnienie formularza
      if (sl_name !== "") cy.get('[data-testid="name-input"]').type(sl_name);
      if (sl_date !== "") cy.get('[data-testid="date-input"]').type(sl_date);

      // pola zostały wypełnione
      cy.get('[data-testid="name-input"]').should("have.value", sl_name);
      cy.get('[data-testid="date-input"]').should("have.value", sl_date);

      cy.get('[data-testid="shopping-lists"]')
        .children()
        .then(($shopping_lists_before_add) => {
          // liczba list użytkownika przed dodaniem
          const listsLengthBeforeAdding = $shopping_lists_before_add.length;

          // stwórz listę zakupów
          cy.get('[data-testid="create-sl-button"]').click();

          // nowa lista nie powinna zostać dodana i nie być widoczna
          cy.get('[data-testid="shopping-lists"]').should("be.visible");
          cy.get('[data-testid="shoppingList-name-input"]')
            .last()
            .should("not.have.value", sl_name);
          cy.get('[data-testid="shoppingList-date-content"]')
            .last()
            .should("not.have.text", sl_date);
          cy.get('[data-testid="shopping-lists"]')
            .children()
            .then(($shopping_lists_after_add) => {
              // liczba list użytkownika po dodaniu
              const listsLengthAfterAdding = $shopping_lists_after_add.length;

              // liczba list się nie zmieniła
              expect(listsLengthBeforeAdding).equal(listsLengthAfterAdding);
            });
        });
    }
  );
  it.each([
    [
      faker.internet.userName(),
      Moment(faker.date.future()).format("YYYY-MM-DD"),
    ],
  ])("succesfully deleting shopping list", (sl_name, sl_date) => {
    // zaloguj się
    cy.visit("/login");
    cy.get('[data-testid="username-input"]').type(testUserData.username);
    cy.get('[data-testid="password-input"]').type(testUserData.password);
    cy.get('[data-testid="submit-login-button"]').click();

    cy.get('[data-testid="shopping-lists"]')
      .children()
      .then(($shopping_lists_before_add) => {
        // liczba list użytkownika przed dodaniem
        const listsLengthBeforeAdding = $shopping_lists_before_add.length;

        // stwórz nową listę zakupów
        cy.get('[data-testid="name-input"]').type(sl_name);
        cy.get('[data-testid="date-input"]').type(sl_date);
        cy.get('[data-testid="create-sl-button"]').click();

        // kontrola dodania listy (powinna być widoczna)
        cy.get('[data-testid="shopping-lists"]').should("be.visible");
        cy.get('[data-testid="shoppingList-name-input"]')
          .last()
          .should("have.value", sl_name);
        cy.get('[data-testid="shoppingList-date-content"]')
          .last()
          .contains(sl_date);

        cy.get('[data-testid="shopping-lists"]')
          .children()
          .then(($shopping_lists_after_add) => {
            // liczba list użytkownika po dodaniu
            const listsLengthAfterAdding = $shopping_lists_after_add.length;
            expect(listsLengthBeforeAdding).equal(listsLengthAfterAdding - 1);

            // usunięcie listy
            cy.get('[data-testid="shoppingList-delete-button"]')
              .eq(listsLengthAfterAdding - 1)
              .click();

            // liczba list użytkownika po usunięciu jest taka sama jak przez dodaniem
            cy.get('[data-testid="shopping-lists"]')
              .children()
              .should("have.length", listsLengthBeforeAdding);
          });
      });
  });
  it.each([
    [
      faker.internet.userName(),
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "!,%&*",
    ],
  ])(
    "succesfully updating shopping list",
    (sl_new_name, sl_long_name, sl_illegal_name) => {
      // zaloguj się
      cy.visit("/login");
      cy.get('[data-testid="username-input"]').type(testUserData.username);
      cy.get('[data-testid="password-input"]').type(testUserData.password);
      cy.get('[data-testid="submit-login-button"]').click();
      cy.get('[data-testid="shoppingList-name-input"]').then(
        ($shopping_lists_before_add) => {
          // liczba list użytkownika przed dodaniem
          const listsLengthBeforeAdding = $shopping_lists_before_add.length;

          // stwórz nową listę zakupów
          cy.get('[data-testid="name-input"]').type(testShoppingList.sl_name);
          cy.get('[data-testid="date-input"]').type(testShoppingList.sl_date);
          cy.get('[data-testid="create-sl-button"]').click();

          // aktualizacja nazwy listy zakupów
          cy.get('[data-testid="shoppingList-name-input"]')
            .eq(listsLengthBeforeAdding)
            .type(sl_new_name)
            .then(() => {
              cy.wait(800).then(() => {
                // wejdź ponownie na strone i sprawdź nazwę
                cy.visit("/login");
                cy.get('[data-testid="username-input"]').type(
                  testUserData.username
                );
                cy.get('[data-testid="password-input"]').type(
                  testUserData.password
                );
                cy.get('[data-testid="submit-login-button"]').click();
                cy.get('[data-testid="shoppingList-name-input"]')
                  .eq(listsLengthBeforeAdding)
                  .should("have.value", testShoppingList.sl_name + sl_new_name);

                // usuwaj nazwę za pomocą backspace
                cy.get('[data-testid="shoppingList-name-input"]')
                  .eq(listsLengthBeforeAdding)
                  .then(($input) => {
                    const inputLength = $input.val().length;
                    const backspaceString = Array(inputLength + 1).join(
                      "{backspace}"
                    );
                    cy.get('[data-testid="shoppingList-name-input"]')
                      .eq(listsLengthBeforeAdding)
                      .type(backspaceString);
                  })
                  .then(() => {
                    cy.get('[data-testid="shoppingList-name-input"]')
                      .eq(listsLengthBeforeAdding)
                      .then(($inputAfterBackspace) => {
                        const inputLengthAfterBackspace =
                          $inputAfterBackspace.val().length;
                        expect(inputLengthAfterBackspace).equal(2);

                        // dodaj nielegalną nazwę
                        cy.get('[data-testid="shoppingList-name-input"]')
                          .eq(listsLengthBeforeAdding)
                          .type(sl_illegal_name)
                          .then(() => {
                            cy.wait(800).then(() => {
                              // wejdź ponownie na strone i sprawdź nazwę
                              cy.visit("/login");
                              cy.get('[data-testid="username-input"]').type(
                                testUserData.username
                              );
                              cy.get('[data-testid="password-input"]').type(
                                testUserData.password
                              );
                              cy.get(
                                '[data-testid="submit-login-button"]'
                              ).click();
                              cy.get('[data-testid="shoppingList-name-input"]')
                                .eq(listsLengthBeforeAdding)
                                .then(($inputAfterIllegalName) => {
                                  const inputLengthAfterIllegalName =
                                    $inputAfterIllegalName.val().length;
                                  expect(inputLengthAfterIllegalName).equal(2);

                                  // dodaj za długą nazwę
                                  cy.get(
                                    '[data-testid="shoppingList-name-input"]'
                                  )
                                    .eq(listsLengthBeforeAdding)
                                    .type(sl_long_name)
                                    .then(() => {
                                      cy.wait(800).then(() => {
                                        // wejdź ponownie na strone i sprawdź nazwę
                                        cy.visit("/login");
                                        cy.get(
                                          '[data-testid="username-input"]'
                                        ).type(testUserData.username);
                                        cy.get(
                                          '[data-testid="password-input"]'
                                        ).type(testUserData.password);
                                        cy.get(
                                          '[data-testid="submit-login-button"]'
                                        ).click();
                                        cy.get(
                                          '[data-testid="shoppingList-name-input"]'
                                        )
                                          .eq(listsLengthBeforeAdding)
                                          .then(($inputAfterLongName) => {
                                            const inputLengthAfterLongName =
                                              $inputAfterLongName.val().length;
                                            expect(
                                              inputLengthAfterLongName
                                            ).equal(50);
                                          });
                                      });
                                    });
                                });
                            });
                          });
                      });
                  });
              });
            });
        }
      );
    }
  );
  it("succesfully updating completing shopping list", () => {
    // zaloguj się
    cy.visit("/login");
    cy.get('[data-testid="username-input"]').type(testUserData.username);
    cy.get('[data-testid="password-input"]').type(testUserData.password);
    cy.get('[data-testid="submit-login-button"]').click();

    cy.get('[data-testid="shoppingList-name-input"]').then(
      ($shopping_lists_before_add) => {
        // liczba list użytkownika przed dodaniem
        const listsLengthBeforeAdding = $shopping_lists_before_add.length;

        // stwórz nową listę zakupów
        cy.get('[data-testid="name-input"]').type(testShoppingList.sl_name);
        cy.get('[data-testid="date-input"]').type(testShoppingList.sl_date);
        cy.get('[data-testid="create-sl-button"]').click();

        // aktualizacja wykonania listy zakupów
        cy.get('[data-testid="shoppingList-completed-input"]')
          .eq(listsLengthBeforeAdding)
          .check();

        // lista powinna być wykonana
        cy.get('[data-testid="shoppingList-completed-input"]')
          .eq(listsLengthBeforeAdding)
          .should("be.checked");

        // wejdź ponownie na strone i sprawdź wykonanie listy
        cy.visit("/login");
        cy.get('[data-testid="username-input"]').type(testUserData.username);
        cy.get('[data-testid="password-input"]').type(testUserData.password);
        cy.get('[data-testid="submit-login-button"]').click();
        cy.get('[data-testid="shoppingList-completed-input"]')
          .eq(listsLengthBeforeAdding)
          .should("be.checked");

        // aktualizacja wykonania listy zakupów
        cy.get('[data-testid="shoppingList-completed-input"]')
          .eq(listsLengthBeforeAdding)
          .uncheck();

        // lista powinna być niewykonana
        cy.get('[data-testid="shoppingList-completed-input"]')
          .eq(listsLengthBeforeAdding)
          .should("not.be.checked");

        // wejdź ponownie na strone i sprawdź wykonanie listy
        cy.visit("/login");
        cy.get('[data-testid="username-input"]').type(testUserData.username);
        cy.get('[data-testid="password-input"]').type(testUserData.password);
        cy.get('[data-testid="submit-login-button"]').click();
        cy.get('[data-testid="shoppingList-completed-input"]')
          .eq(listsLengthBeforeAdding)
          .should("not.be.checked");
      }
    );
  });
});
