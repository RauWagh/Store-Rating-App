import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to the Store Rating Platform</h1>
      <p>
        Please login to continue or sign up to become a part of our community.
      </p>
      
      <div>
        {/* Button to navigate to Login Page */}
        <Link to="/login">
          <button style={{ padding: '10px 20px', margin: '10px' }}>Login</button>
        </Link>
        {/* Button to navigate to Registration Page */}
        <Link to="/register">
          <button style={{ padding: '10px 20px', margin: '10px' }}>Sign Up</button>
        </Link>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>About the Platform</h2>
        <p>
          Our platform allows users to rate and review stores. Store owners can view the ratings they receive, and administrators can manage users and stores.
        </p>
      </div>
    </div>
  );
};

export default Home;
