import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';    // Import global styles
import App from './App';  // Import the root component of the app
import { AuthProvider } from './context/AuthContext';

// Get the root element from the HTML file
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the DOM at the 'root' element
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
