import React from "react";
import { screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { render, render2 } from "../test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_URL } from "../api/config";
import { TodoPage } from "./TodoPage";

jest.mock("axios");

jest.mock("../components/TodoItem", () => ({
  TodoItem: () => <div data-testid="mock-todo-item" />,
}));

describe("TodoPage", () => {
  it("renders the title label and loading spinner while data is loading", async () => {
    axios.get.mockImplementation(() => new Promise(() => {}));

    render2(<TodoPage />);

    expect(screen.getByTestId("todo-page-title-label").textContent).toBe(
      "Todo App"
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("create-todo-form")).toBeTruthy();
    expect(screen.queryByTestId("mock-todo-item")).not.toBeInTheDocument();
  });

  it("renders the todo items and create todo item form when data is not loading", async () => {
    const todos = [
      { _id: "1", name: "TODO 1" },
      { _id: "2", name: "TODO 2" },
    ];
    axios.get.mockImplementation(() =>
      Promise.resolve({ status: 200, data: todos })
    );
    render2(<TodoPage />);

    expect(screen.getByTestId("todo-page-title-label").textContent).toBe(
      "Todo App"
    );
    expect(await screen.findAllByTestId("mock-todo-item")).toHaveLength(2);
    expect(screen.getByTestId("create-todo-form")).toBeTruthy();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("Test that the readTodosRequest function is called with the correct token when the useQuery hook is invoked", async () => {
    const todos = [
      { _id: "1", name: "TODO 1" },
      { _id: "2", name: "TODO 2" },
    ];
    const token = "my-token";

    axios.get.mockImplementation(() =>
      Promise.resolve({ status: 200, data: todos })
    );
    render2(<TodoPage />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/todos/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    });
  });

  it.each([
    [[], 0],
    [
      [
        { _id: "1", name: "TODO 1" },
        { _id: "2", name: "TODO 2" },
        { _id: "3", name: "TODO 3" },
      ],
      3,
    ],
    [
      [
        { _id: "1", name: "TODO 1" },
        { _id: "2", name: "TODO 2" },
        { _id: "3", name: "TODO 3" },
        { _id: "4", name: "TODO 3" },
        { _id: "5", name: "TODO 3" },
        { _id: "6", name: "TODO 3" },
        { _id: "7", name: "TODO 3" },
        { _id: "8", name: "TODO 3" },
        { _id: "9", name: "TODO 3" },
        { _id: "10", name: "TODO 3" },
        { _id: "11", name: "TODO 3" },
      ],
      11,
    ],
  ])(
    "renders the correct number of TodoItem components",
    async (todos, len) => {
      axios.get.mockImplementation(() =>
        Promise.resolve({ status: 200, data: todos })
      );
      render2(<TodoPage />);

      if (len === 0) {
        expect(screen.queryByTestId("mock-todo-item")).not.toBeInTheDocument();
      } else {
        expect(await screen.findAllByTestId("mock-todo-item")).toHaveLength(
          todos.length
        );
      }
    }
  );
  it("only renders the ClipLoader if isLoading is true", async () => {
    const todos = [{ _id: "1", name: "Todo 1" }];
    const queryClient = new QueryClient();
    axios.get.mockImplementation(() =>
      Promise.resolve({ status: 200, data: todos })
    );
    render(
      <QueryClientProvider client={queryClient}>
        <TodoPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });
});
