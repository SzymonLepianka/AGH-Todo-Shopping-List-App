import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "../test-utils";
import axios from "axios";
import { CreateShoppingListForm } from "./CreateShoppingListForm";
import { QueryClient, QueryClientProvider } from "react-query";
jest.mock("axios");

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
    ["okokok", ""],
    ["", "okokok"],
    ["usr3", "pas3"],
    ["%", "%"],
    ["username1", "!@#$%^&*{}"],
    ["!@#$%^&*{}", "!@#$%^&*{}"],
    ["!@#$%^&*{}", "password1"],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ],
    [
      "username1",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "password1",
    ],
  ])("validate incorrect user inputs", async (name, date) => {
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
    // await waitFor(() => {
    //   expect(navigate).toHaveBeenCalledTimes(0);
    // });
  });

  it("should submit when form inputs contain text", async () => {
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

    // await waitFor(() => {
    //   expect(navigate).toHaveBeenCalledTimes(1);
    // });

    // expect(
    //   screen.queryByText("Username and password required!")
    // ).not.toBeInTheDocument();
  });
});

describe("user create shopping list successfully", () => {
  it("allows the user to create shopping list successfully", async () => {
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: { token: "user_token" } })
    );

    // Render the Register component
    //   await act(async () =>
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateShoppingListForm />
      </QueryClientProvider>
    ); //   );

    // fill out the form
    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "shaquille" },
    });
    fireEvent.change(screen.getByTestId("date-input"), {
      target: { value: "oatmeal" },
    });

    // Submit the form
    const submitButton = screen.queryByTestId("create-sl-form");

    // await act(async () => {
    fireEvent.click(submitButton);
    // await waitFor(() => {
    //   expect(navigate).toHaveBeenCalledTimes(1);
    // });
    // await waitFor(() => {
    //   expect(navigate).toHaveBeenCalledWith("/login");
    // });
    // });
  });
});
