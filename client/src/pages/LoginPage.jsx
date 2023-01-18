import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { loginRequest } from "../api/loginRequest";
import { TokenContext } from "../App";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useContext(TokenContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError("Username and password required!");
      return;
    }

    if (username.length > 50) {
      setError("Too long username");
      return;
    }

    if (password.length > 50) {
      setError("Too long password");
      return;
    }

    if (username.length < 5) {
      setError("Minimum 5 characters in username");
      return;
    }
    if (password.length < 5) {
      setError("Minimum 5 characters in password");
      return;
    }

    const illegalRegexExp = /.*[!,%&*].*/;
    if (illegalRegexExp.test(username)) {
      setError("Illegal characters is username");
      return;
    }
    if (illegalRegexExp.test(password)) {
      setError("Illegal characters is password");
      return;
    }

    loginRequest(username, password)
      .then(({ token }) => {
        setToken(token);
        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div>
      <h1 data-testid="loginpage-title-label">Login</h1>
      {error && (
        <div style={{ color: "red" }}>
          <label data-testid="error-label">{error}</label>
        </div>
      )}
      <form data-testid="login-form" onSubmit={handleLogin}>
        <label data-testid="username-label">{`Username: `}</label>
        <input
          type="text"
          value={username}
          data-testid="username-input"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br></br>
        <label data-testid="password-label">{`Password: `}</label>
        <input
          type="password"
          value={password}
          data-testid="password-input"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br></br>
        <button data-testid="submit-login-button">Submit</button>
      </form>
    </div>
  );
};
