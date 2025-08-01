import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UnifiedLogin from './pages/UnifiedLogin';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProctorDashboard from './pages/ProctorDashboard';
import ExamInterface from './pages/ExamInterface';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UnifiedLogin />} />
        <Route path="/login" element={<UnifiedLogin />} />
        
        {/* Protected Routes for Different User Roles */}
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher-dashboard" 
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/proctor-dashboard" 
          element={
            <ProtectedRoute role="proctor">
              <ProctorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/exam/:examId" 
          element={
            <ProtectedRoute role="student">
              <ExamInterface />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
