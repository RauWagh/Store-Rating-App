import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user role
    const roleRedirects = {
      student: '/student-dashboard',
      teacher: '/teacher-dashboard',
      admin: '/admin-dashboard',
      proctor: '/proctor-dashboard'
    };
    
    return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;