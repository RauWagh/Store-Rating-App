import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    // Fetching stores, users, and ratings data from the API
    const fetchAdminData = async () => {
      const storesResponse = await fetch('/api/admin/stores');
      const storesData = await storesResponse.json();
      setStores(storesData);

      const usersResponse = await fetch('/api/admin/users');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      const ratingsResponse = await fetch('/api/admin/ratings');
      const ratingsData = await ratingsResponse.json();
      setRatings(ratingsData);
    };

    fetchAdminData();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <h3>Stores</h3>
        <ul>
          {stores.map((store) => (
            <li key={store.id}>
              <h4>{store.name}</h4>
              <p>{store.address}</p>
              <p>Rating: {store.rating}</p>
            </li>
          ))}
        </ul>

        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>Role: {user.role}</p>
            </li>
          ))}
        </ul>

        <h3>Ratings</h3>
        <ul>
          {ratings.map((rating) => (
            <li key={rating.id}>
              <p>Store: {rating.storeName}</p>
              <p>User: {rating.userName}</p>
              <p>Rating: {rating.rating}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
