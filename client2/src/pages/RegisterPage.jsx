import React, { useState } from "react";
import registerRequest from "../api/registerRequest";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNetPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (newUsername === "" || newPassword === "") {
      setError("Username and password required!");
      return;
    }

    if (newUsername.length > 50) {
      setError("Too long username");
      return;
    }

    if (newPassword.length > 50) {
      setError("Too long password");
      return;
    }

    if (newUsername.length < 5) {
      setError("Minimum 5 characters in username");
      return;
    }
    if (newPassword.length < 5) {
      setError("Minimum 5 characters in password");
      return;
    }

    const illegalRegexExp = /.*[!,%&*].*/;
    if (illegalRegexExp.test(newUsername)) {
      setError("Illegal characters is username");
      return;
    }
    if (illegalRegexExp.test(newPassword)) {
      setError("Illegal characters is password");
      return;
    }

    registerRequest(newUsername, newPassword)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div>
      <h1 data-testid="registerpage-title-label">Register</h1>
      {error && (
        <div style={{ color: "red" }}>
          <label data-testid="error-label">{error}</label>
        </div>
      )}
      <form data-testid="register-form" onSubmit={handleRegister}>
        <label data-testid="username-label">{`Username: `}</label>
        <input
          type="text"
          value={newUsername}
          data-testid="username-input"
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <br></br>
        <label data-testid="password-label">{`Password: `}</label>
        <input
          type="password"
          value={newPassword}
          data-testid="password-input"
          onChange={(e) => setNetPassword(e.target.value)}
        />
        <br></br>
        <button data-testid="submit-register-button">Submit register</button>
      </form>
    </div>
  );
};
