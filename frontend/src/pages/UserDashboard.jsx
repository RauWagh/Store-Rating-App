import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching stores data from API
    const fetchStores = async () => {
      const response = await fetch('/api/stores'); // Replace with your actual API call
      const data = await response.json();
      setStores(data);
    };
    
    fetchStores();
  }, []);

  const submitRating = (storeId, rating) => {
    // Submit rating logic (this will send the rating to the backend)
    console.log(`Rating ${rating} submitted for Store ID: ${storeId}`);
  };

  return (
    <div>
      <h2>Welcome to Normal User Dashboard</h2>
      <div>
        <h3>Store Listings</h3>
        {stores.length === 0 ? (
          <p>No stores available.</p>
        ) : (
          <ul>
            {stores.map((store) => (
              <li key={store.id}>
                <h4>{store.name}</h4>
                <p>{store.address}</p>
                <p>Overall Rating: {store.rating}</p>
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Submit your rating"
                  onChange={(e) => submitRating(store.id, e.target.value)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
