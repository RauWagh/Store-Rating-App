// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    // Fetch users, stores, and ratings data
    const fetchData = async () => {
      const usersRes = await axios.get('/api/users');
      const storesRes = await axios.get('/api/stores');
      const ratingsRes = await axios.get('/api/ratings');
      setUsers(usersRes.data);
      setStores(storesRes.data);
      setRatings(ratingsRes.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Users: {users.length}</p>
      <p>Total Stores: {stores.length}</p>
      <p>Total Ratings: {ratings.length}</p>
      
      <h3>Users List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.email} - {user.role}</li>
        ))}
      </ul>

      <h3>Stores List</h3>
      <ul>
        {stores.map((store) => (
          <li key={store.id}>{store.name} - {store.address} - {store.rating}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
