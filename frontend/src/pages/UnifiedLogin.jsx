import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UnifiedLogin.css';

const UnifiedLogin = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user, error, setError } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const roleRedirects = {
        student: '/student-dashboard',
        teacher: '/teacher-dashboard',
        admin: '/admin-dashboard',
        proctor: '/proctor-dashboard'
      };
      navigate(roleRedirects[user.role] || '/login');
    }
  }, [user, navigate]);

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access your exams and view results',
      icon: '🎓',
      color: 'blue'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Create and manage exams',
      icon: '👨‍🏫',
      color: 'green'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage users and platform operations',
      icon: '👨‍💼',
      color: 'red'
    },
    {
      id: 'proctor',
      title: 'Proctor',
      description: 'Monitor ongoing examinations',
      icon: '👀',
      color: 'purple'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(formData, selectedRole);
      // Navigation will be handled by useEffect after successful login
    } catch (err) {
      // Error is already set in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="unified-login">
      <div className="login-container">
        <div className="login-header">
          <h1>Online Examination System</h1>
          <p>Select your role to continue</p>
        </div>

        {!selectedRole ? (
          <div className="role-selection">
            <div className="roles-grid">
              {roles.map(role => (
                <div
                  key={role.id}
                  className={`role-card ${role.color}`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="role-icon">{role.icon}</div>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="login-form-container">
            <div className="selected-role">
              <button 
                className="back-btn"
                onClick={() => setSelectedRole('')}
              >
                ← Back
              </button>
              <div className={`role-indicator ${selectedRole}`}>
                <span className="role-icon">
                  {roles.find(r => r.id === selectedRole)?.icon}
                </span>
                <span className="role-title">
                  {roles.find(r => r.id === selectedRole)?.title} Login
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`login-btn ${selectedRole}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="login-help">
                <a href="#forgot-password">Forgot Password?</a>
              </div>
            </form>
          </div>
        )}

        <footer className="login-footer">
          <p>&copy; 2024 Online Examination System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default UnifiedLogin;