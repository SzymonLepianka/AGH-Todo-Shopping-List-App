import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { TokenContext } from "./App";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const AllTheProviders = ({ children }) => {
  const [token, setToken] = useState("my-token");

  return (
    <BrowserRouter>
      <TokenContext.Provider value={[token, setToken]}>
        {children}
      </TokenContext.Provider>
    </BrowserRouter>
  );
};

const AllTheProviders2 = ({ children }) => {
  const [token, setToken] = useState("my-token");
  const queryClient = new QueryClient();

  return (
    <MemoryRouter initialEntries={["/details/1"]}>
      <TokenContext.Provider value={[token, setToken]}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/details/:shoppingListId" element={children} />
          </Routes>
        </QueryClientProvider>
      </TokenContext.Provider>
    </MemoryRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });
const customRender2 = (ui, options) =>
  render(ui, { wrapper: AllTheProviders2, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
export { customRender2 as render2 };
