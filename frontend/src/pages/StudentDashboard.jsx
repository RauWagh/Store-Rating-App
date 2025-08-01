import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch student exams and results
      const [examsResponse, resultsResponse] = await Promise.all([
        axios.get('/api/student/exams'),
        axios.get('/api/student/results')
      ]);
      
      setExams(examsResponse.data || []);
      setResults(resultsResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      // Mock data for development
      setExams([
        {
          id: 1,
          title: 'Mathematics Final Exam',
          subject: 'Mathematics',
          duration: 120,
          totalMarks: 100,
          startTime: '2024-01-20T10:00:00Z',
          endTime: '2024-01-20T12:00:00Z',
          status: 'upcoming',
          description: 'Final examination covering all topics from semester'
        },
        {
          id: 2,
          title: 'Physics Quiz',
          subject: 'Physics',
          duration: 60,
          totalMarks: 50,
          startTime: '2024-01-22T14:00:00Z',
          endTime: '2024-01-22T15:00:00Z',
          status: 'upcoming',
          description: 'Quiz on mechanics and thermodynamics'
        },
        {
          id: 3,
          title: 'Chemistry Lab Test',
          subject: 'Chemistry',
          duration: 90,
          totalMarks: 75,
          startTime: '2024-01-18T09:00:00Z',
          endTime: '2024-01-18T10:30:00Z',
          status: 'completed',
          description: 'Practical chemistry laboratory assessment'
        }
      ]);
      
      setResults([
        {
          id: 1,
          examTitle: 'Chemistry Lab Test',
          subject: 'Chemistry',
          marksObtained: 68,
          totalMarks: 75,
          percentage: 90.67,
          grade: 'A',
          submittedAt: '2024-01-18T10:30:00Z',
          status: 'published'
        },
        {
          id: 2,
          examTitle: 'History Essay',
          subject: 'History',
          marksObtained: 42,
          totalMarks: 50,
          percentage: 84,
          grade: 'B+',
          submittedAt: '2024-01-15T16:00:00Z',
          status: 'published'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (examId) => {
    const exam = exams.find(e => e.id === examId);
    const now = new Date();
    const startTime = new Date(exam.startTime);
    
    if (now < startTime) {
      alert('Exam has not started yet');
      return;
    }
    
    navigate(`/exam/${examId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    
    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'active';
    return 'completed';
  };

  const getUpcomingExams = () => {
    return exams.filter(exam => {
      const status = getExamStatus(exam);
      return status === 'upcoming' || status === 'active';
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">🎓</div>
            <div className="user-details">
              <h2>Welcome, {user?.name || 'Student'}</h2>
              <p className="user-role">Student Dashboard</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          📝 My Exams
        </button>
        <button 
          className={`nav-tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          📈 Results
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>{getUpcomingExams().length}</h3>
                  <p>Upcoming Exams</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{results.length}</h3>
                  <p>Completed Exams</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>
                    {results.length > 0 
                      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) 
                      : 0}%
                  </h3>
                  <p>Average Score</p>
                </div>
              </div>
            </div>

            <div className="upcoming-exams-section">
              <h3>Upcoming Exams</h3>
              {getUpcomingExams().length === 0 ? (
                <div className="no-exams">
                  <p>No upcoming exams scheduled</p>
                </div>
              ) : (
                <div className="exams-grid">
                  {getUpcomingExams().slice(0, 3).map(exam => (
                    <div key={exam.id} className="exam-card upcoming">
                      <div className="exam-header">
                        <h4>{exam.title}</h4>
                        <span className="exam-subject">{exam.subject}</span>
                      </div>
                      <div className="exam-details">
                        <p><strong>Start:</strong> {formatDateTime(exam.startTime)}</p>
                        <p><strong>Duration:</strong> {exam.duration} minutes</p>
                        <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
                      </div>
                      <button 
                        className={`start-exam-btn ${getExamStatus(exam) === 'active' ? 'active' : ''}`}
                        onClick={() => handleStartExam(exam.id)}
                        disabled={getExamStatus(exam) !== 'active'}
                      >
                        {getExamStatus(exam) === 'active' ? 'Start Exam' : 'Not Started'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="recent-results-section">
              <h3>Recent Results</h3>
              {results.length === 0 ? (
                <div className="no-results">
                  <p>No results available yet</p>
                </div>
              ) : (
                <div className="results-summary">
                  {results.slice(0, 3).map(result => (
                    <div key={result.id} className="result-item">
                      <div className="result-info">
                        <h5>{result.examTitle}</h5>
                        <p>{result.subject}</p>
                      </div>
                      <div className="result-score">
                        <span className="score">{result.marksObtained}/{result.totalMarks}</span>
                        <span className={`grade grade-${result.grade.replace('+', 'plus').toLowerCase()}`}>
                          {result.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="exams-list">
            <h3>All Exams</h3>
            <div className="exams-grid">
              {exams.map(exam => (
                <div key={exam.id} className={`exam-card ${getExamStatus(exam)}`}>
                  <div className="exam-header">
                    <h4>{exam.title}</h4>
                    <span className="exam-subject">{exam.subject}</span>
                    <span className={`exam-status ${getExamStatus(exam)}`}>
                      {getExamStatus(exam)}
                    </span>
                  </div>
                  <div className="exam-details">
                    <p>{exam.description}</p>
                    <p><strong>Start:</strong> {formatDateTime(exam.startTime)}</p>
                    <p><strong>End:</strong> {formatDateTime(exam.endTime)}</p>
                    <p><strong>Duration:</strong> {exam.duration} minutes</p>
                    <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
                  </div>
                  {getExamStatus(exam) === 'active' && (
                    <button 
                      className="start-exam-btn active"
                      onClick={() => handleStartExam(exam.id)}
                    >
                      Start Exam
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-list">
            <h3>Exam Results</h3>
            {results.length === 0 ? (
              <div className="no-results">
                <p>No results available yet</p>
              </div>
            ) : (
              <div className="results-table">
                <table>
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(result => (
                      <tr key={result.id}>
                        <td>{result.examTitle}</td>
                        <td>{result.subject}</td>
                        <td>{result.marksObtained}/{result.totalMarks}</td>
                        <td>{result.percentage.toFixed(1)}%</td>
                        <td>
                          <span className={`grade grade-${result.grade.replace('+', 'plus').toLowerCase()}`}>
                            {result.grade}
                          </span>
                        </td>
                        <td>{formatDateTime(result.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;