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
  it.each([
    ["", "", "Username and password required!"],
    ["okokok", "", "Username and password required!"],
    ["", "okokok", "Username and password required!"],
    ["usr3", "password3", "Minimum 5 characters in username"],
    ["username3", "pas3", "Minimum 5 characters in password"],
    ["usr3", "pas3", "Minimum 5 characters in username"],
    ["%", "%", "Minimum 5 characters in username"],
    ["username1", "!@#$%^&*{}", "Illegal characters is password"],
    ["!@#$%^&*{}", "!@#$%^&*{}", "Illegal characters is username"],
    ["!@#$%^&*{}", "password1", "Illegal characters is username"],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "Too long username",
    ],
    [
      "username1",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "Too long password",
    ],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "password1",
      "Too long username",
    ],
  ])(
    "validate user inputs, and provides error messages",
    async (username, password, error_message) => {
      render(<LoginPage />);

      fireEvent.change(screen.getByTestId("username-input"), {
        target: { value: username },
      });

      fireEvent.change(screen.getByTestId("password-input"), {
        target: { value: password },
      });

      expect(screen.queryByTestId("error-label")).not.toBeInTheDocument();

      const submitButton = screen.queryByTestId("submit-login-button");
      fireEvent.click(submitButton);

      expect(screen.getByTestId("error-label")).toBeInTheDocument();

      expect(screen.getByText(error_message)).toBeInTheDocument();
    }
  );

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

describe("user logs in successfully and redirects", () => {
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
