import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "../test-utils";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_URL } from "../api/config";
import { ShoppingList } from "./ShoppingList";
import * as router from "react-router";

jest.mock("axios");

const navigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

const shoppingList = {
  completed: false,
  date: "2022-12-27",
  name: "123454321",
  shoppingListId: "9e677c7d-9e72-49f9-8533-b40dfde14929",
  userId: "5d7a4d24-5df9-41be-874c-39bb9f4b69c0",
  __v: 0,
  _id: "63b8412668baf3605e8a52cb",
};

const completedShoppingList = {
  completed: true,
  date: "2022-12-27",
  name: "123454321",
  shoppingListId: "9e677c7d-9e72-49f9-8533-b40dfde14929",
  userId: "5d7a4d24-5df9-41be-874c-39bb9f4b69c0",
  __v: 0,
  _id: "63b8412668baf3605e8a52cb",
};

describe("ShoppingList render Page", () => {
  it("renders the ShoppingList page", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ShoppingList shoppingList={shoppingList} />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("shoppingList-name-label")).toBeInTheDocument();
  });

  it("render 2 input components and 3 labels", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ShoppingList shoppingList={shoppingList} />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("shoppingList-name-label")).toBeInTheDocument();
    expect(screen.getByTestId("shoppingList-date-label")).toBeInTheDocument();
    expect(screen.getByTestId("shoppingList-date-content")).toBeInTheDocument();

    expect(
      screen.getByTestId("shoppingList-completed-input")
    ).toBeInTheDocument();
    expect(screen.getByTestId("shoppingList-name-input")).toBeInTheDocument();
  });

  it("renders a delete and details buttons", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ShoppingList shoppingList={shoppingList} />
      </QueryClientProvider>
    );
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(
      screen.getByTestId("shoppingList-delete-button")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Szczegóły/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Szczegóły")).toBeInTheDocument();
    expect(
      screen.getByTestId("shoppingList-details-button")
    ).toBeInTheDocument();
  });
});

describe("Form behaviour", () => {
  it("completing / uncompleting shopping list", async () => {
    axios.put.mockImplementation(() =>
      Promise.resolve({ status: 200, data: completedShoppingList })
    );
    const queryClient = new QueryClient();

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ShoppingList shoppingList={shoppingList} />
      </QueryClientProvider>
    );

    const checkbox = getByTestId("shoppingList-completed-input");
    expect(checkbox.checked).toEqual(shoppingList.completed);

    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `${API_URL}/shoppingLists/${shoppingList._id}`,
        {
          completed: completedShoppingList.completed,
          name: completedShoppingList.name,
        },
        {
          headers: {
            Authorization: "Bearer null",
            "Content-Type": "application/json",
          },
        }
      );
    });
  });
  it.each([
    [""],
    ["t"],
    ["#@$%^&&^^$#%"],
    ["!@#$%^&*{}"],
    ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
  ])("changing shopping list name to illegal name", async (sl_name) => {
    axios.put.mockImplementation(() =>
      Promise.resolve({ status: 200, data: completedShoppingList })
    );
    const queryClient = new QueryClient();

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ShoppingList shoppingList={shoppingList} />
      </QueryClientProvider>
    );

    fireEvent.change(getByTestId("shoppingList-name-input"), {
      target: { value: sl_name },
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(0);
    });
  });
  it.each([["qwertyuio"], ["asdfghjkfghdf"], ["name"]])(
    "changing shopping list name to legal name",
    async (sl_name) => {
      axios.put.mockImplementation(() =>
        Promise.resolve({ status: 200, data: completedShoppingList })
      );
      const queryClient = new QueryClient();

      const { getByTestId } = render(
        <QueryClientProvider client={queryClient}>
          <ShoppingList shoppingList={shoppingList} />
        </QueryClientProvider>
      );

      fireEvent.change(getByTestId("shoppingList-name-input"), {
        target: { value: sl_name },
      });

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          `${API_URL}/shoppingLists/${shoppingList._id}`,
          {
            completed: shoppingList.completed,
            name: sl_name,
          },
          {
            headers: {
              Authorization: "Bearer null",
              "Content-Type": "application/json",
            },
          }
        );
      });
    }
  );
  it("deleting shopping list by clicking button", async () => {
    axios.delete.mockImplementation(() =>
      Promise.resolve({ status: 200, data: shoppingList })
    );
    const queryClient = new QueryClient();

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ShoppingList shoppingList={shoppingList} />
      </QueryClientProvider>
    );
    const deleteButton = getByTestId("shoppingList-delete-button");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `${API_URL}/shoppingLists/${shoppingList._id}`,
        {
          headers: {
            Authorization: "Bearer null",
            "Content-Type": "application/json",
          },
        }
      );
    });
  });
  it("redirecting do details page after clicking button", async () => {
    const queryClient = new QueryClient();

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <ShoppingList shoppingList={shoppingList} />
      </QueryClientProvider>
    );
    const detailsButton = getByTestId("shoppingList-details-button");
    fireEvent.click(detailsButton);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        `/details/${shoppingList.shoppingListId}`
      );
    });
  });
});
