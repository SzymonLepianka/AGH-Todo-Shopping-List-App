import React from "react";
import { screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { ShoppingListPage } from "./ShoppingListPage";
import { render } from "../test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_URL } from "../api/config";

jest.mock("axios");

jest.mock("../components/ShoppingList", () => ({
  ShoppingList: () => <div data-testid="mock-shopping-list" />,
}));

describe("ShoppingListPage", () => {
  it("renders the title label and loading spinner while data is loading", async () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ShoppingListPage />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("slpage-title-label").textContent).toBe(
      "Shopping List App"
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("create-sl-form")).toBeTruthy();
    expect(screen.queryByTestId("mock-shopping-list")).not.toBeInTheDocument();
  });

  it("renders the shopping lists and create shopping list form when data is not loading", async () => {
    const shoppingLists = [
      { _id: "1", name: "Shopping List 1" },
      { _id: "2", name: "Shopping List 2" },
    ];
    axios.get.mockImplementation(() =>
      Promise.resolve({ status: 200, data: shoppingLists })
    );
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ShoppingListPage />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("slpage-title-label").textContent).toBe(
      "Shopping List App"
    );
    expect(await screen.findAllByTestId("mock-shopping-list")).toHaveLength(2);
    expect(screen.getByTestId("create-sl-form")).toBeTruthy();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("Test that the readShoppingListsRequest function is called with the correct token when the useQuery hook is invoked", async () => {
    const shoppingLists = [
      { _id: "1", name: "Shopping List 1" },
      { _id: "2", name: "Shopping List 2" },
    ];
    const token = "my-token";

    axios.get.mockImplementation(() =>
      Promise.resolve({ status: 200, data: shoppingLists })
    );
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ShoppingListPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/shoppingLists`, {
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
        { _id: "1", name: "Shopping List 1" },
        { _id: "2", name: "Shopping List 2" },
        { _id: "3", name: "Shopping List 3" },
      ],
      3,
    ],
    [
      [
        { _id: "1", name: "Shopping List 1" },
        { _id: "2", name: "Shopping List 2" },
        { _id: "3", name: "Shopping List 3" },
        { _id: "4", name: "Shopping List 3" },
        { _id: "5", name: "Shopping List 3" },
        { _id: "6", name: "Shopping List 3" },
        { _id: "7", name: "Shopping List 3" },
        { _id: "8", name: "Shopping List 3" },
        { _id: "9", name: "Shopping List 3" },
        { _id: "10", name: "Shopping List 3" },
        { _id: "11", name: "Shopping List 3" },
      ],
      11,
    ],
  ])(
    "renders the correct number of ShoppingList components",
    async (shoppingLists, len) => {
      axios.get.mockImplementation(() =>
        Promise.resolve({ status: 200, data: shoppingLists })
      );
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <ShoppingListPage />
        </QueryClientProvider>
      );
      if (len === 0) {
        expect(
          screen.queryByTestId("mock-shopping-list")
        ).not.toBeInTheDocument();
      } else {
        expect(await screen.findAllByTestId("mock-shopping-list")).toHaveLength(
          shoppingLists.length
        );
      }
    }
  );
  it("only renders the ClipLoader if isLoading is true", async () => {
    const shoppingLists = [{ _id: "1", name: "Shopping List 1" }];
    const queryClient = new QueryClient();
    axios.get.mockImplementation(() =>
      Promise.resolve({ status: 200, data: shoppingLists })
    );
    render(
      <QueryClientProvider client={queryClient}>
        <ShoppingListPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });
});
