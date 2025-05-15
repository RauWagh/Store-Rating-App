import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StoreList = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Fetch stores from the backend API
    setStores([
      { id: 1, name: 'Coffee Shop', address: '123 Street', rating: 4.5 },
      { id: 2, name: 'Bookstore', address: '456 Avenue', rating: 4.2 },
    ]);
  }, []);

  return (
    <div>
      <h2>Store List</h2>
      <ul>
        {stores.map((store) => (
          <li key={store.id}>
            <Link to={`/store/${store.id}`}>
              {store.name} - {store.rating} stars
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreList;
