import React, { useContext, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TodoPage } from "./pages/TodoPage";
import { ShoppingListPage } from "./pages/ShoppingListPage";

export const TokenContext = React.createContext(null);

const ProtectedRoute = ({ element }) => {
  const [token] = useContext(TokenContext);
  return token ? element() : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <TokenContext.Provider value={[token, setToken]}>
          <Routes>
            <Route
              path="/"
              element={<ProtectedRoute element={ShoppingListPage} />}
            />
            <Route
              path="/details/:shoppingListId"
              element={<ProtectedRoute element={TodoPage} />}
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Routes>
        </TokenContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
