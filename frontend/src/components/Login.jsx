import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Here, implement login functionality and role-based redirection
    // For now, hardcoding user role for demo
    const userRole = 'admin'; // This can be 'admin', 'user', or 'store-owner'

    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else if (userRole === 'user') {
      navigate('/user-dashboard');
    } else if (userRole === 'store-owner') {
      navigate('/store-owner-dashboard');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
