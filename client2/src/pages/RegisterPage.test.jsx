import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "../test-utils";
import axios from "axios";
import * as router from "react-router";
import { RegisterPage } from "./RegisterPage";
jest.mock("axios");

const navigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

describe("Register render Page", () => {
  it("renders the Register page", () => {
    render(<RegisterPage />);
    expect(screen.getByTestId("registerpage-title-label")).toBeInTheDocument();
  });

  it("render 2 input components", () => {
    render(<RegisterPage />);
    expect(screen.getByTestId("username-label")).toBeInTheDocument();
    expect(screen.getByTestId("password-label")).toBeInTheDocument();

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<RegisterPage />);
    expect(
      screen.getByRole("button", { name: /Submit register/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Submit register")).toBeInTheDocument();
    expect(screen.getByTestId("submit-register-button")).toBeInTheDocument();
  });

  it("doesn't render an error label", () => {
    render(<RegisterPage />);
    expect(screen.queryByTestId("error-label")).not.toBeInTheDocument();
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
      render(<RegisterPage />);

      fireEvent.change(screen.getByTestId("username-input"), {
        target: { value: username },
      });

      fireEvent.change(screen.getByTestId("password-input"), {
        target: { value: password },
      });

      expect(screen.queryByTestId("error-label")).not.toBeInTheDocument();

      const submitButton = screen.queryByTestId("submit-register-button");
      fireEvent.click(submitButton);

      expect(screen.getByTestId("error-label")).toBeInTheDocument();

      expect(screen.getByText(error_message)).toBeInTheDocument();
    }
  );

  it("should submit when form inputs contain text", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "shaquille" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "oatmeal" },
    });
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: { token: "user_token" } })
    );
    fireEvent.submit(screen.getByTestId("register-form"));

    expect(screen.queryByTestId("error-label")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Username and password required!")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-label")).not.toBeInTheDocument();
  });
});

describe("user register successfully and redirects", () => {
  it("allows the user to register successfully", async () => {
    axios.post.mockImplementation(() =>
      Promise.resolve({ status: 200, data: { token: "user_token" } })
    );

    // Render the Register component
    render(<RegisterPage />);

    // fill out the form
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "shaquille" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "oatmeal" },
    });

    // Submit the form
    const submitButton = screen.queryByTestId("submit-register-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });
});
