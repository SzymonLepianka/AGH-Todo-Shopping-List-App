import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "../test-utils";
import axios from "axios";
import { CreateShoppingListForm } from "./CreateShoppingListForm";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_URL } from "../api/config";
jest.mock("axios");

const createdShoppingList = {
  completed: false,
  date: "2022-12-27",
  name: "123454321",
  shoppingListId: "9e677c7d-9e72-49f9-8533-b40dfde14929",
  userId: "5d7a4d24-5df9-41be-874c-39bb9f4b69c0",
  __v: 0,
  _id: "63b8412668baf3605e8a52cb",
};

describe("CreateShoppingListForm render Page", () => {
  it("renders the CreateShoppingListForm page", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateShoppingListForm />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("name-label")).toBeInTheDocument();
  });

  it("render 2 input components", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateShoppingListForm />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("name-label")).toBeInTheDocument();
    expect(screen.getByTestId("date-label")).toBeInTheDocument();

    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("date-input")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateShoppingListForm />
      </QueryClientProvider>
    );
    expect(
      screen.getByRole("button", { name: /Create SL/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Create SL")).toBeInTheDocument();
    expect(screen.getByTestId("create-sl-button")).toBeInTheDocument();
  });
});

describe("Form behaviour", () => {
  it.each([
    ["", ""],
    ["sl_name", ""],
    ["", "2022-12-12"],
    ["usr3", "pas3"],
    ["%", "%"],
    ["sl_name", "!@#$%^&*{}"],
    ["!@#$%^&*{}", "!@#$%^&*{}"],
    ["!@#$%^&*{}", "2022-12-12"],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ],
    [
      "sl_name",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "2022-12-12",
    ],
  ])("validate incorrect user inputs", async (name, date) => {
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: createdShoppingList })
    );
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateShoppingListForm />
      </QueryClientProvider>
    );
    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: name },
    });

    fireEvent.change(screen.getByTestId("date-input"), {
      target: { value: date },
    });

    const submitButton = screen.queryByTestId("create-sl-button");
    fireEvent.click(submitButton);

    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it("should submit when form inputs contain text", async () => {
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: createdShoppingList })
    );
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateShoppingListForm />
      </QueryClientProvider>
    );
    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "shaquille" },
    });
    fireEvent.change(screen.getByTestId("date-input"), {
      target: { value: "2022-12-12" },
    });
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: { token: "user_token" } })
    );
    fireEvent.submit(screen.getByTestId("create-sl-form"));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/shoppingLists`,
        { completed: false, date: "2022-12-12", name: "shaquille" },
        {
          headers: {
            Authorization: "Bearer my-token",
            "Content-Type": "application/json",
          },
        }
      );
    });
  });
});

describe("user create shopping list successfully", () => {
  it("allows the user to create shopping list successfully", async () => {
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: createdShoppingList })
    );
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateShoppingListForm />
      </QueryClientProvider>
    );
    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "shaquille" },
    });
    fireEvent.change(screen.getByTestId("date-input"), {
      target: { value: "2022-12-12" },
    });
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: { token: "user_token" } })
    );
    fireEvent.submit(screen.getByTestId("create-sl-form"));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/shoppingLists`,
        { completed: false, date: "2022-12-12", name: "shaquille" },
        {
          headers: {
            Authorization: "Bearer my-token",
            "Content-Type": "application/json",
          },
        }
      );
    });
  });
});
