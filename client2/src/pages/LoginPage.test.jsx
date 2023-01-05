import { fireEvent, screen, waitFor } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { render } from "../test-utils";
import axios from "axios";
import * as router from "react-router";
jest.mock("axios");

const navigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

describe("Login render Page", () => {
  it("renders the Login page", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("loginpage-title-label")).toBeInTheDocument(); // expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("render 2 input components", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("username-label")).toBeInTheDocument();
    expect(screen.getByTestId("password-label")).toBeInTheDocument();

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByTestId("submit-login-button")).toBeInTheDocument();
  });
});

describe("Form behaviour", () => {
  it("validate user inputs, and provides error messages", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "" },
    });

    expect(screen.queryByTestId("error-label")).not.toBeInTheDocument();

    const submitButton = screen.queryByTestId("submit-login-button");
    fireEvent.click(submitButton);

    expect(screen.getByTestId("error-label")).toBeInTheDocument();

    expect(
      screen.getByText("Username and password required!")
    ).toBeInTheDocument();
  });

  it("should submit when form inputs contain text", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "shaquille" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "oatmeal" },
    });
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: { token: "user_token" } })
    );
    fireEvent.submit(screen.getByTestId("login-form"));

    expect(
      screen.queryByText("Username and password required!")
    ).not.toBeInTheDocument();
  });
});

describe("user logs in successfully and token added to localstorage", () => {
  it("allows the user to login successfully", async () => {
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: { token: "user_token" } })
    );

    // Render the Login component
    //   await act(async () =>
    render(<LoginPage />);
    //   );

    // fill out the form
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "shaquille" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "oatmeal" },
    });

    // Submit the form
    const submitButton = screen.queryByTestId("submit-login-button");

    // await act(async () => {
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/");
    });
    // });
  });
});
