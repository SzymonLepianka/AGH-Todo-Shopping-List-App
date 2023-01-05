import React, { useContext, useState } from 'react';
import loginRequest from '../api/loginRequest';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../App';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useContext(TokenContext);
    const navigate = useNavigate();
    
  const handleLogin = (e) => {
    e.preventDefault();
    loginRequest(username, password)
      .then(({ token }) => {
        setToken(token);
        navigate('/');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <div style={{ color: 'red' }}>{error}</div>
          <form onSubmit={handleLogin}>
              {`Username: `}
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <br></br>
            {`Password: `}
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              />
              <br></br>
           <button>Login</button>
      </form>
    </div>
  );
};