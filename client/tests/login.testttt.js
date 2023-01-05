// import React from "react";
// import { render, screen } from "@testing-library/react";

// import App from "../src/App";

// describe("App", () => {
//   it("renders App component", () => {
//     render(<App />);

//     // screen.getByText("Search:");
//     expect(screen.getByText("Search:")).toBeInTheDocument();
//   });
// });

// describe("Login render Page", () => {
//   it("renders the Login page", () => {
//     const { getByText } = render(<Login />);
//     expect(getByText(/login/i)).toBeInTheDocument();
//   });

//   it("render 2 input components", () => {
//     const { getByLabelText } = render(<Login />);
//     expect(getByLabelText(/username/i)).toBeInTheDocument();
//     expect(getByLabelText(/password/i)).toBeInTheDocument();
//   });

//   it("renders a submit button", () => {
//     const { getByText } = render(<Login />);
//     expect(getByText("Submit")).toBeInTheDocument();
//   });
// });
