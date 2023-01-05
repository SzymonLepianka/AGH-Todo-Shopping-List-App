import React, { useState } from 'react';
import registerRequest from '../api/registerRequest';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNetPassword] = useState('');
  const [error, setError] = useState('');
    const navigate = useNavigate();
    
  const handleRegister = (e) => {
    e.preventDefault();
    registerRequest(newUsername, newPassword)
      .then(() => {
        navigate('/login');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div>
      <h1>Register</h1>
      <div style={{ color: 'red' }}>{error}</div>
      <form onSubmit={handleRegister}>
        {`Username: `}
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <br></br>
        {`Password: `}
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNetPassword(e.target.value)}
        />
        <br></br>
        <button>Register</button>
      </form>
    </div>
  );
};