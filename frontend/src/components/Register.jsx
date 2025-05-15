import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Registration logic goes here (usually an API call)
    console.log({ name, email, address, password, role });

    // After successful registration, redirect to login page
    navigate('/login');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select onChange={(e) => setRole(e.target.value)} value={role}>
          <option value="user">Normal User</option>
          <option value="store-owner">Store Owner</option>
          <option value="admin">System Administrator</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
