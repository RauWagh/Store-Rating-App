import React, { useState, useEffect } from 'react';

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState({});
  const [userRatings, setUserRatings] = useState([]);

  useEffect(() => {
    // Fetching Store data and user ratings for this store from API
    const fetchStoreData = async () => {
      const response = await fetch('/api/store/owner'); // Replace with actual API endpoint for store data
      const data = await response.json();
      setStoreData(data.store);
      setUserRatings(data.ratings);
    };
    
    fetchStoreData();
  }, []);

  return (
    <div>
      <h2>Store Owner Dashboard</h2>
      <div>
        <h3>{storeData.name}</h3>
        <p>{storeData.address}</p>
        <p>Average Rating: {storeData.averageRating}</p>

        <h4>User Ratings</h4>
        <ul>
          {userRatings.length === 0 ? (
            <p>No ratings yet.</p>
          ) : (
            userRatings.map((rating) => (
              <li key={rating.userId}>
                <p>User: {rating.userName}</p>
                <p>Rating: {rating.rating}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
