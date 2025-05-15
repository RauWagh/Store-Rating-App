import React, { useState } from 'react';

const RatingForm = ({ storeId }) => {
  const [rating, setRating] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send rating data to backend API
    console.log(`Store ${storeId} rating submitted: ${rating}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Rate this store: </label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
      <button type="submit">Submit Rating</button>
    </form>
  );
};

export default RatingForm;
