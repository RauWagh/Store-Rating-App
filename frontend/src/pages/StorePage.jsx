import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy data for stores (You will fetch this data from the backend)
const storeData = [
  {
    id: 1,
    name: 'Store A',
    address: '123 Main St',
    rating: 4.2,
    ownerId: 3,
  },
  {
    id: 2,
    name: 'Store B',
    address: '456 Elm St',
    rating: 3.8,
    ownerId: 4,
  },
];

const StorePage = ({ userRole, currentUser }) => {
  const [stores, setStores] = useState(storeData);
  const [selectedStore, setSelectedStore] = useState(null);
  const navigate = useNavigate();

  // Effect to fetch stores (you would replace this with an actual API call)
  useEffect(() => {
    // Here, you would fetch the list of stores from your backend
    // For now, we'll use the dummy data
    setStores(storeData);
  }, []);

  const handleStoreClick = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    setSelectedStore(store);
  };

  const handleRatingSubmit = (rating) => {
    // Handle submitting the rating to the backend (this is just a dummy example)
    alert(`Rating submitted: ${rating}`);
  };

  const handleLogout = () => {
    // Handle logout logic
    alert('Logged out!');
    navigate('/');
  };

  return (
    <div>
      <h1>Store Listings</h1>
      {/* Display store listings */}
      <div>
        {stores.map((store) => (
          <div key={store.id} onClick={() => handleStoreClick(store.id)}>
            <h2>{store.name}</h2>
            <p>{store.address}</p>
            <p>Rating: {store.rating}</p>
            {/* Only show "Submit Rating" for Normal Users */}
            {userRole === 'Normal User' && (
              <div>
                <button onClick={() => handleRatingSubmit(1)}>Rate 1</button>
                <button onClick={() => handleRatingSubmit(2)}>Rate 2</button>
                <button onClick={() => handleRatingSubmit(3)}>Rate 3</button>
                <button onClick={() => handleRatingSubmit(4)}>Rate 4</button>
                <button onClick={() => handleRatingSubmit(5)}>Rate 5</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Display selected store details */}
      {selectedStore && userRole === 'Store Owner' && selectedStore.ownerId === currentUser.id && (
        <div>
          <h2>Store Details for {selectedStore.name}</h2>
          <p>Address: {selectedStore.address}</p>
          <p>Average Rating: {selectedStore.rating}</p>
          <h3>Users Who Rated Your Store:</h3>
          {/* Here you would list users who rated the store */}
          <ul>
            {/* Dummy list of users who rated the store */}
            <li>User 1: Rating 4</li>
            <li>User 2: Rating 5</li>
          </ul>
        </div>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default StorePage;
