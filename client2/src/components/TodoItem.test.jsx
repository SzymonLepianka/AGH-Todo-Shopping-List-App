import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { TodoItem } from "./TodoItem";
import axios from "axios";
import { render } from "../test-utils";
import { API_URL } from "../api/config";
import { QueryClient, QueryClientProvider } from "react-query";

jest.mock("axios");

const todo2 = {
  name: "Write unit tests",
  completed: false,
  amount: "10",
  grammage: "kg",
};

describe("TodoItem", () => {
  it("renders the todo name and completion status", () => {
    const todo = {
      name: "Write unit tests",
      completed: false,
      amount: "10",
      grammage: "kg",
    };
    const queryClient = new QueryClient();
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TodoItem todo={todo} />
      </QueryClientProvider>
    );
    const todoLabel = getByTestId("uncrossed-todo-name-label");
    expect(todoLabel).toHaveTextContent("Write unit tests");
    expect(todoLabel).not.toHaveStyle("text-decoration: line-through");

    const checkbox = getByTestId("completed-todo-input");
    expect(checkbox.checked).toBe(false);
  });

  it("crosses out the todo name when it is completed", () => {
    const todo = {
      name: "Write unit tests",
      completed: true,
      amount: "10",
      grammage: "kg",
    };
    const queryClient = new QueryClient();
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TodoItem todo={todo} />
      </QueryClientProvider>
    );

    const checkbox = getByTestId("completed-todo-input");
    expect(checkbox.checked).toBe(true);

    expect(getByTestId("crossed-todo-name-label")).toBeInTheDocument();
  });

  it("displays the amount and grammage of the todo", () => {
    const todo = {
      name: "Write unit tests",
      completed: false,
      amount: "10",
      grammage: "kg",
    };
    const queryClient = new QueryClient();
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TodoItem todo={todo} />
      </QueryClientProvider>
    );
    const amountLabel = getByTestId("amount-todo-label");
    expect(amountLabel).toHaveTextContent("10");
    const grammageLabel = getByTestId("grammage-todo-label");
    expect(grammageLabel).toHaveTextContent("kg");
  });

  it("updates the completion status of the todo when the checkbox is clicked", async () => {
    const todo = {
      name: "Write unit tests",
      completed: false,
      amount: "10",
      grammage: "200",
    };
    axios.put.mockImplementation(() =>
      Promise.resolve({ status: 200, data: todo })
    );
    const queryClient = new QueryClient();
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TodoItem todo={todo} />
      </QueryClientProvider>
    );

    const checkbox = getByTestId("completed-todo-input");
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });

  it("deleting todo by clicking button", async () => {
    axios.delete.mockImplementation(() =>
      Promise.resolve({ status: 200, data: todo2 })
    );
    const queryClient = new QueryClient();

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TodoItem todo={todo2} />
      </QueryClientProvider>
    );
    const deleteButton = getByTestId("delete-todo-button");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `${API_URL}/todos/${todo2._id}`,
        {
          headers: {
            Authorization: "Bearer null",
            "Content-Type": "application/json",
          },
        }
      );
    });
  });
});
