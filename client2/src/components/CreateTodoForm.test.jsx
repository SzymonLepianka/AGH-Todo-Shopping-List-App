import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "../test-utils";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";
import { CreateTodoForm } from "./CreateTodoForm";

jest.mock("axios");

const existingShoppingList = {
  completed: false,
  date: "2022-12-27",
  name: "123454321",
  shoppingListId: "9e677c7d-9e72-49f9-8533-b40dfde14929",
  userId: "5d7a4d24-5df9-41be-874c-39bb9f4b69c0",
  __v: 0,
  _id: "63b8412668baf3605e8a52cb",
};

const createdTodo = {
  completed: false,
  date: "2022-12-27",
  name: "123454321",
  shoppingListId: "9e677c7d-9e72-49f9-8533-b40dfde14929",
  userId: "5d7a4d24-5df9-41be-874c-39bb9f4b69c0",
  __v: 0,
  _id: "63b8412668baf3605e8a52cb",
};

describe("CreateTodoForm render Page", () => {
  it("renders the CreateTodoForm page", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateTodoForm shoppingListId={existingShoppingList.shoppingListId} />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("todo-name-label")).toBeInTheDocument();
  });

  it("render 3 input components", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateTodoForm shoppingListId={existingShoppingList.shoppingListId} />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("todo-name-label")).toBeInTheDocument();
    expect(screen.getByTestId("todo-amount-label")).toBeInTheDocument();
    expect(screen.getByTestId("todo-grammage-label")).toBeInTheDocument();

    expect(screen.getByTestId("todo-name-input")).toBeInTheDocument();
    expect(screen.getByText("Select name")).toBeInTheDocument();
    expect(screen.getByText("Select name")).toBeTruthy();

    expect(screen.getByTestId("todo-amount-input")).toBeInTheDocument();
    expect(screen.getByTestId("todo-grammage-input")).toBeInTheDocument();
    expect(screen.getByText("Select grammage")).toBeInTheDocument();
    expect(screen.getByText("Select grammage")).toBeTruthy();
  });

  it("renders a submit button", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateTodoForm shoppingListId={existingShoppingList.shoppingListId} />
      </QueryClientProvider>
    );
    expect(
      screen.getByRole("button", { name: /Create TODO/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Create TODO")).toBeInTheDocument();
    expect(screen.getByTestId("create-todo-button")).toBeInTheDocument();
  });
});

describe("Form behaviour", () => {
  it.each([
    ["", "", ""],
    ["todo_name", "", ""],
    ["", "123", ""],
    ["", "", "gr"],
    ["todo_name", "123", ""],
    ["todo_name", "", "gr"],
    ["", "123", "gr"],
    ["#@$%^&&^^$#%", "123", "gr"],
    ["#@$%^&&^^$#%", "123", "gr"],
    ["todo_name", "asd", "gr"],
    ["todo_name", "123", "qwerty"],
    ["!@#$%^&*{}", "!@#$%^&*{}", "!@#$%^&*{}"],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "123",
      "gr",
    ],
    [
      "todo_name",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "gr",
    ],
    [
      "todo_name",
      "123",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ],
  ])("validate incorrect user inputs", async (name, amount, grammage) => {
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: createdTodo })
    );
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateTodoForm shoppingListId={existingShoppingList.shoppingListId} />
      </QueryClientProvider>
    );

    fireEvent.change(document.getElementById("name-content-input"), {
      target: { value: name },
    });
    fireEvent.change(screen.getByTestId("todo-amount-input"), {
      target: { value: amount },
    });
    fireEvent.change(document.getElementById("grammage-content-input"), {
      target: { value: grammage },
    });

    const submitButton = screen.queryByTestId("create-todo-button");
    fireEvent.click(submitButton);

    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it("should submit when form inputs contain text", async () => {
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: createdTodo })
    );
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateTodoForm shoppingListId={existingShoppingList.shoppingListId} />
      </QueryClientProvider>
    );

    // const nameInputComponent = screen.queryByTestId("todo-name-input");
    // expect(nameInputComponent).toBeDefined();
    // expect(nameInputComponent).not.toBeNull();
    // fireEvent.keyDown(nameInputComponent.firstChild, { key: "ArrowDown" });
    // await screen.findByText("chleb");
    // fireEvent.click(screen.getByText("chleb"));

    fireEvent.change(document.getElementById("name-content-input"), {
      target: { value: "chleb" },
    });
    fireEvent.change(screen.getByTestId("todo-amount-input"), {
      target: { value: 123 },
    });
    fireEvent.change(document.getElementById("grammage-content-input"), {
      target: { value: "kg" },
    });

    fireEvent.submit(screen.getByTestId("create-todo-form"));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1); //TODO fix to 1; przekazane name=''
    });
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${API_URL}/todos`,
    //     {
    //       completed: false,
    //       name: "todo_name",
    //       amount: 123,
    //       grammage: "gr",
    //     },
    //     {
    //       headers: {
    //         Authorization: "Bearer null",
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // });
  });
});
