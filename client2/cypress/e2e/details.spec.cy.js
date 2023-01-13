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

const testTodo = {
  todo_name: faker.internet.userName(),
  todo_amount: faker.datatype.float(),
  todo_grammage: "kg",
};

/// <reference types="cypress" />
describe("TodoPage (details)", () => {
  it("rendering todo page", () => {
    // zaloguj się
    cy.visit("/login");
    cy.get('[data-testid="username-input"]').type(testUserData.username);
    cy.get('[data-testid="password-input"]').type(testUserData.password);
    cy.get('[data-testid="submit-login-button"]').click();
    cy.url().should("eq", "http://localhost:3000/");

    cy.get('[data-testid="shopping-lists"]')
      .children()
      .then(($shopping_lists_before_add) => {
        // liczba list użytkownika przed dodaniem
        const listsLengthBeforeAdding = $shopping_lists_before_add.length;

        // dodaj nową listę
        cy.get('[data-testid="name-input"]').type(testShoppingList.sl_name);
        cy.get('[data-testid="date-input"]').type(testShoppingList.sl_date);
        cy.get('[data-testid="create-sl-button"]').click();

        // kliknij przejście do szczegółów listy zakupów
        cy.get('[data-testid="shoppingList-details-button"]')
          .eq(listsLengthBeforeAdding)
          .click();

        // powinno zostać wykonane przekierowanie
        cy.url().should("contains", "http://localhost:3000/details");

        // widoczne są następujące elementy, o odpowiedniej treści
        cy.get('[data-testid="todo-page-title-label"]')
          .should("be.visible")
          .contains("Todo App");
        cy.get('[data-testid="todos"]').should("be.empty");
        cy.get('[data-testid="create-todo"]').should("be.visible");
        cy.get('[data-testid="create-todo-form"]').should("be.visible");
        cy.get('[data-testid="todo-name-label"]')
          .should("be.visible")
          .contains("Nazwa: ");
        cy.get('[data-testid="todo-name-input"]')
          .should("be.visible")
          .should("have.value", "");
        cy.get('[data-testid="todo-amount-label"]')
          .should("be.visible")
          .contains("Ilość: ");
        cy.get('[data-testid="todo-amount-input"]')
          .should("be.visible")
          .should("have.value", "0");
        cy.get('[data-testid="todo-grammage-label"]')
          .should("be.visible")
          .contains("Gramatura: ");
        cy.get('[data-testid="todo-grammage-input"]')
          .should("be.visible")
          .should("have.value", "");
        cy.get('[data-testid="create-todo-button"]').should("be.visible");
      });
  });

  it.each([
    ["chleb", 1.23, "szt"],
    ["mleko", 6, "szt"],
    ["woda", 456, "l"],
    ["ser", 1, "kg"],
    ["own_todo_name", 0.7, "m"],
  ])(
    "succesfully creating new todo",
    (todo_name, todo_amount, todo_grammage) => {
      // zaloguj się
      cy.visit("/login");
      cy.get('[data-testid="username-input"]').type(testUserData.username);
      cy.get('[data-testid="password-input"]').type(testUserData.password);
      cy.get('[data-testid="submit-login-button"]').click();
      cy.url().should("eq", "http://localhost:3000/");

      cy.get('[data-testid="shopping-lists"]')
        .children()
        .then(($shopping_lists_before_add) => {
          // liczba list użytkownika przed dodaniem
          const listsLengthBeforeAdding = $shopping_lists_before_add.length;

          // dodaj nową listę
          cy.get('[data-testid="name-input"]').type(testShoppingList.sl_name);
          cy.get('[data-testid="date-input"]').type(testShoppingList.sl_date);
          cy.get('[data-testid="create-sl-button"]').click();

          // kliknij przejście do szczegółów listy zakupów
          cy.get('[data-testid="shoppingList-details-button"]')
            .eq(listsLengthBeforeAdding)
            .click();

          // wypełnienie formularza
          cy.get('[data-testid="todo-name-input"]').type(todo_name);
          if (todo_name === "chleb") {
            cy.get("#react-select-3-option-0").click();
          } else if (todo_name === "mleko") {
            cy.get("#react-select-3-option-1").click();
          } else if (todo_name === "woda") {
            cy.get("#react-select-3-option-2").click();
          } else if (todo_name === "ser") {
            cy.get("#react-select-3-option-3").click();
          } else {
            cy.get("#react-select-3-option-4").click();
          }
          cy.get('[data-testid="todo-amount-input"]').clear().type(todo_amount);
          cy.get('[data-testid="todo-grammage-input"]').type(todo_grammage);
          if (todo_grammage === "szt") {
            cy.get("#react-select-5-option-0").click();
          } else if (todo_grammage === "kg") {
            cy.get("#react-select-5-option-1").click();
          } else if (todo_grammage === "l") {
            cy.get("#react-select-5-option-2").click();
          } else {
            cy.get("#react-select-5-option-3").click();
          }

          // pola zostały wypełnione
          cy.get('[data-testid="todo-name-input"]').then(($el) => {
            expect($el[0].textContent).equal(todo_name);
          });
          cy.get('[data-testid="todo-amount-input"]').should(
            "have.value",
            todo_amount
          );
          cy.get('[data-testid="todo-grammage-input"]')
            .then(($el) => {
              return $el[0].textContent;
            })
            .should("contain", todo_grammage);

          // stwórz przedmiot
          cy.get('[data-testid="create-todo-button"]').click();

          // nowy przedmiot powinien zostać dodany i widoczny
          cy.get('[data-testid="todos"]').should("be.visible");
          cy.get('[data-testid="completed-todo-input"]')
            .last()
            .should("be.visible")
            .should("not.be.checked");
          cy.get('[data-testid="uncrossed-todo-name-label"]')
            .last()
            .should("contain", todo_name);
          cy.get('[data-testid="amount-todo-label"]')
            .last()
            .should("contain", todo_amount);
          cy.get('[data-testid="grammage-todo-label"]')
            .last()
            .should("contain", todo_grammage);
          cy.get('[data-testid="delete-todo-button"]')
            .last()
            .should("be.visible");
        });
    }
  );
  it.each([
    ["", 456, "l"],
    ["todo_name1", "", "l"],
    ["todo_name2", 12345, ""],
    ["todo_name3", "", ""],
    ["", 456, ""],
    ["", "", "l"],
    ["", "", ""],
    ["todo_name4", 0, "kg"],
    [
      "todo_nametodo_nametodo_nametodo_nametodo_nametodo_nametodo_name",
      1.25,
      "kg",
    ],
    ["todo_na!,%&*me", 1.25, "kg"],
    ["todo_na!*me", 1, "l"],
    ["todo_na,me", 34, "m"],
    ["todo_na%me", 0.012, "szt"],
    ["todo_na&me", 4.6, "kg"],
    ["todo_na*me", 2.7, "l"],
  ])(
    "attempting to create a new todo using illegal data",
    (todo_name, todo_amount, todo_grammage) => {
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

          // dodaj nową listę
          cy.get('[data-testid="name-input"]').type(testShoppingList.sl_name);
          cy.get('[data-testid="date-input"]').type(testShoppingList.sl_date);
          cy.get('[data-testid="create-sl-button"]').click();

          // kliknij przejście do szczegółów listy zakupów
          cy.get('[data-testid="shoppingList-details-button"]')
            .eq(listsLengthBeforeAdding)
            .click();

          // stwórz przedmiot
          if (todo_name !== "") {
            cy.get('[data-testid="todo-name-input"]').type(todo_name);
            if (todo_name === "chleb") {
              cy.get("#react-select-3-option-0").click();
            } else if (todo_name === "mleko") {
              cy.get("#react-select-3-option-1").click();
            } else if (todo_name === "woda") {
              cy.get("#react-select-3-option-2").click();
            } else if (todo_name === "ser") {
              cy.get("#react-select-3-option-3").click();
            } else {
              cy.get("#react-select-3-option-4").click();
            }
          }
          if (todo_amount !== "")
            cy.get('[data-testid="todo-amount-input"]')
              .clear()
              .type(todo_amount);
          if (todo_grammage !== "") {
            cy.get('[data-testid="todo-grammage-input"]').type(todo_grammage);
            if (todo_grammage === "szt") {
              cy.get("#react-select-5-option-0").click();
            } else if (todo_grammage === "kg") {
              cy.get("#react-select-5-option-1").click();
            } else if (todo_grammage === "l") {
              cy.get("#react-select-5-option-2").click();
            } else {
              cy.get("#react-select-5-option-3").click();
            }
          }
          cy.get('[data-testid="create-todo-button"]').click();

          // nowy przedmiot nie powinien zostać dodany i nie być widoczny
          cy.get('[data-testid="todos"]').should("not.be.visible");
          cy.get('[data-testid="completed-todo-input"]').should("not.exist");
          cy.get('[data-testid="uncrossed-todo-name-label"]').should(
            "not.exist"
          );
          cy.get('[data-testid="amount-todo-label"]').should("not.exist");
          cy.get('[data-testid="grammage-todo-label"]').should("not.exist");
          cy.get('[data-testid="delete-todo-button"]').should("not.exist");
        });
    }
  );

  it("succesfully updating completing todo", () => {
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

        // dodaj nową listę
        cy.get('[data-testid="name-input"]').type(testShoppingList.sl_name);
        cy.get('[data-testid="date-input"]').type(testShoppingList.sl_date);
        cy.get('[data-testid="create-sl-button"]').click();

        // kliknij przejście do szczegółów listy zakupów
        cy.get('[data-testid="shoppingList-details-button"]')
          .eq(listsLengthBeforeAdding)
          .click();

        // stwórz przedmiot
        cy.get('[data-testid="todo-name-input"]').type(testTodo.todo_name);
        if (testTodo.todo_name === "chleb") {
          cy.get("#react-select-3-option-0").click();
        } else if (testTodo.todo_name === "mleko") {
          cy.get("#react-select-3-option-1").click();
        } else if (testTodo.todo_name === "woda") {
          cy.get("#react-select-3-option-2").click();
        } else if (testTodo.todo_name === "ser") {
          cy.get("#react-select-3-option-3").click();
        } else {
          cy.get("#react-select-3-option-4").click();
        }
        cy.get('[data-testid="todo-amount-input"]')
          .clear()
          .type(testTodo.todo_amount);
        cy.get('[data-testid="todo-grammage-input"]').type(
          testTodo.todo_grammage
        );
        if (testTodo.todo_grammage === "szt") {
          cy.get("#react-select-5-option-0").click();
        } else if (testTodo.todo_grammage === "kg") {
          cy.get("#react-select-5-option-1").click();
        } else if (testTodo.todo_grammage === "l") {
          cy.get("#react-select-5-option-2").click();
        } else {
          cy.get("#react-select-5-option-3").click();
        }
        cy.get('[data-testid="create-todo-button"]').click();

        // aktualizacja wykonania przedmiotu
        cy.get('[data-testid="completed-todo-input"]').check();

        // lista powinna być wykonana (nazwa przekreślona)
        cy.get('[data-testid="completed-todo-input"]').should("be.checked");
        cy.get('[data-testid="crossed-todo-name-label"]')
          .should("be.visible")
          .contains(testTodo.todo_name);
        cy.get('[data-testid="uncrossed-todo-name-label"]').should("not.exist");

        // wejdź ponownie na strone i sprawdź wykonanie przedmiotu
        cy.visit("/login");
        cy.get('[data-testid="username-input"]').type(testUserData.username);
        cy.get('[data-testid="password-input"]').type(testUserData.password);
        cy.get('[data-testid="submit-login-button"]').click();
        cy.get('[data-testid="shoppingList-details-button"]')
          .eq(listsLengthBeforeAdding)
          .click();
        cy.get('[data-testid="completed-todo-input"]').should("be.checked");

        // aktualizacja wykonania listy zakupów
        cy.get('[data-testid="completed-todo-input"]').uncheck();

        // lista powinna być niewykonana (nieprzekreślona)
        cy.get('[data-testid="completed-todo-input"]').should("not.be.checked");
        cy.get('[data-testid="uncrossed-todo-name-label"]')
          .should("be.visible")
          .contains(testTodo.todo_name);
        cy.get('[data-testid="crossed-todo-name-label"]').should("not.exist");

        // wejdź ponownie na strone i sprawdź wykonanie listy
        cy.visit("/login");
        cy.get('[data-testid="username-input"]').type(testUserData.username);
        cy.get('[data-testid="password-input"]').type(testUserData.password);
        cy.get('[data-testid="submit-login-button"]').click();
        cy.get('[data-testid="shoppingList-details-button"]')
          .eq(listsLengthBeforeAdding)
          .click();
        cy.get('[data-testid="completed-todo-input"]').should("not.be.checked");
        cy.get('[data-testid="uncrossed-todo-name-label"]')
          .should("be.visible")
          .contains(testTodo.todo_name);
        cy.get('[data-testid="crossed-todo-name-label"]').should("not.exist");
      });
  });

  it("succesfully deleting todo", () => {
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

        // dodaj nową listę
        cy.get('[data-testid="name-input"]').type(testShoppingList.sl_name);
        cy.get('[data-testid="date-input"]').type(testShoppingList.sl_date);
        cy.get('[data-testid="create-sl-button"]').click();

        // kliknij przejście do szczegółów listy zakupów
        cy.get('[data-testid="shoppingList-details-button"]')
          .eq(listsLengthBeforeAdding)
          .click();

        // stwórz przedmiot
        cy.get('[data-testid="todo-name-input"]').type(testTodo.todo_name);
        if (testTodo.todo_name === "chleb") {
          cy.get("#react-select-3-option-0").click();
        } else if (testTodo.todo_name === "mleko") {
          cy.get("#react-select-3-option-1").click();
        } else if (testTodo.todo_name === "woda") {
          cy.get("#react-select-3-option-2").click();
        } else if (testTodo.todo_name === "ser") {
          cy.get("#react-select-3-option-3").click();
        } else {
          cy.get("#react-select-3-option-4").click();
        }
        cy.get('[data-testid="todo-amount-input"]')
          .clear()
          .type(testTodo.todo_amount);
        cy.get('[data-testid="todo-grammage-input"]').type(
          testTodo.todo_grammage
        );
        if (testTodo.todo_grammage === "szt") {
          cy.get("#react-select-5-option-0").click();
        } else if (testTodo.todo_grammage === "kg") {
          cy.get("#react-select-5-option-1").click();
        } else if (testTodo.todo_grammage === "l") {
          cy.get("#react-select-5-option-2").click();
        } else {
          cy.get("#react-select-5-option-3").click();
        }
        cy.get('[data-testid="create-todo-button"]').click();
      });

    // usunięcie przedmiotu
    cy.get('[data-testid="delete-todo-button"]').click();

    // przedmiot nie jest wyświetlany
    cy.get('[data-testid="todos"]').should("be.empty");
  });
});
