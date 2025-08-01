import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [examForm, setExamForm] = useState({
    title: '',
    subject: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    totalMarks: '',
    instructions: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch teacher's exams and submissions
      const [examsResponse, submissionsResponse] = await Promise.all([
        axios.get('/api/teacher/exams'),
        axios.get('/api/teacher/submissions')
      ]);
      
      setExams(examsResponse.data || []);
      setSubmissions(submissionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      // Mock data for development
      setExams([
        {
          id: 1,
          title: 'Mathematics Final Exam',
          subject: 'Mathematics',
          date: '2024-01-20',
          startTime: '10:00',
          endTime: '12:00',
          duration: 120,
          totalMarks: 100,
          status: 'published',
          studentsEnrolled: 45,
          submissions: 38,
          createdAt: '2024-01-15T09:00:00Z'
        },
        {
          id: 2,
          title: 'Physics Quiz',
          subject: 'Physics',
          date: '2024-01-22',
          startTime: '14:00',
          endTime: '15:00',
          duration: 60,
          totalMarks: 50,
          status: 'published',
          studentsEnrolled: 42,
          submissions: 0,
          createdAt: '2024-01-16T10:00:00Z'
        },
        {
          id: 3,
          title: 'Chemistry Lab Assessment',
          subject: 'Chemistry',
          date: '2024-01-25',
          startTime: '09:00',
          endTime: '10:30',
          duration: 90,
          totalMarks: 75,
          status: 'draft',
          studentsEnrolled: 0,
          submissions: 0,
          createdAt: '2024-01-17T11:00:00Z'
        }
      ]);
      
      setSubmissions([
        {
          id: 1,
          examId: 1,
          examTitle: 'Mathematics Final Exam',
          studentName: 'John Doe',
          studentId: 'ST001',
          submittedAt: '2024-01-18T11:45:00Z',
          score: 85,
          totalMarks: 100,
          status: 'graded',
          timeSpent: 115
        },
        {
          id: 2,
          examId: 1,
          examTitle: 'Mathematics Final Exam',
          studentName: 'Jane Smith',
          studentId: 'ST002',
          submittedAt: '2024-01-18T11:30:00Z',
          score: 92,
          totalMarks: 100,
          status: 'graded',
          timeSpent: 105
        },
        {
          id: 3,
          examId: 1,
          examTitle: 'Mathematics Final Exam',
          studentName: 'Mike Johnson',
          studentId: 'ST003',
          submittedAt: '2024-01-18T11:55:00Z',
          score: null,
          totalMarks: 100,
          status: 'pending',
          timeSpent: 120
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      if (!examForm.title || !examForm.subject || !examForm.date || !examForm.startTime || !examForm.endTime) {
        setError('Please fill in all required fields');
        return;
      }

      const newExam = {
        ...examForm,
        id: Date.now(), // Temporary ID
        status: 'draft',
        studentsEnrolled: 0,
        submissions: 0,
        createdAt: new Date().toISOString()
      };

      if (editingExam) {
        // Update existing exam
        setExams(exams.map(exam => exam.id === editingExam.id ? { ...newExam, id: editingExam.id } : exam));
        setEditingExam(null);
      } else {
        // Create new exam
        setExams([...exams, newExam]);
      }

      // Reset form
      setExamForm({
        title: '',
        subject: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        duration: '',
        totalMarks: '',
        instructions: ''
      });
      setShowCreateForm(false);
      setError('');
    } catch (error) {
      setError('Failed to create exam');
    }
  };

  const handleEditExam = (exam) => {
    setExamForm({
      title: exam.title,
      subject: exam.subject,
      description: exam.description || '',
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration.toString(),
      totalMarks: exam.totalMarks.toString(),
      instructions: exam.instructions || ''
    });
    setEditingExam(exam);
    setShowCreateForm(true);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        setExams(exams.filter(exam => exam.id !== examId));
      } catch (error) {
        setError('Failed to delete exam');
      }
    }
  };

  const handlePublishExam = async (examId) => {
    try {
      setExams(exams.map(exam => 
        exam.id === examId ? { ...exam, status: 'published' } : exam
      ));
    } catch (error) {
      setError('Failed to publish exam');
    }
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

  const getExamStats = () => {
    const totalExams = exams.length;
    const publishedExams = exams.filter(exam => exam.status === 'published').length;
    const totalSubmissions = submissions.length;
    const avgScore = submissions.filter(s => s.score !== null).length > 0 
      ? submissions.filter(s => s.score !== null).reduce((sum, s) => sum + s.score, 0) / submissions.filter(s => s.score !== null).length 
      : 0;
    
    return { totalExams, publishedExams, totalSubmissions, avgScore };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const stats = getExamStats();

  return (
    <div className="teacher-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">👨‍🏫</div>
            <div className="user-details">
              <h2>Welcome, {user?.name || 'Teacher'}</h2>
              <p className="user-role">Teacher Dashboard</p>
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
          📝 Manage Exams
        </button>
        <button 
          className={`nav-tab ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          📈 View Submissions
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
                  <h3>{stats.totalExams}</h3>
                  <p>Total Exams</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.publishedExams}</h3>
                  <p>Published Exams</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalSubmissions}</h3>
                  <p>Total Submissions</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{Math.round(stats.avgScore)}%</h3>
                  <p>Average Score</p>
                </div>
              </div>
            </div>

            <div className="recent-activity-section">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {submissions.slice(0, 5).map(submission => (
                  <div key={submission.id} className="activity-item">
                    <div className="activity-info">
                      <h5>{submission.studentName} submitted {submission.examTitle}</h5>
                      <p>Submitted on {formatDateTime(submission.submittedAt)}</p>
                    </div>
                    <div className="activity-status">
                      <span className={`status ${submission.status}`}>
                        {submission.status}
                      </span>
                      {submission.score !== null && (
                        <span className="score">{submission.score}/{submission.totalMarks}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="exams-management">
            <div className="exams-header">
              <h3>Manage Exams</h3>
              <button 
                className="create-exam-btn"
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingExam(null);
                  setExamForm({
                    title: '',
                    subject: '',
                    description: '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    duration: '',
                    totalMarks: '',
                    instructions: ''
                  });
                }}
              >
                + Create New Exam
              </button>
            </div>

            {showCreateForm && (
              <div className="exam-form-container">
                <form onSubmit={handleCreateExam} className="exam-form">
                  <div className="form-header">
                    <h4>{editingExam ? 'Edit Exam' : 'Create New Exam'}</h4>
                    <button 
                      type="button" 
                      className="close-btn"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingExam(null);
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Exam Title *</label>
                      <input
                        type="text"
                        value={examForm.title}
                        onChange={(e) => setExamForm({...examForm, title: e.target.value})}
                        placeholder="Enter exam title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Subject *</label>
                      <input
                        type="text"
                        value={examForm.subject}
                        onChange={(e) => setExamForm({...examForm, subject: e.target.value})}
                        placeholder="Enter subject"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={examForm.date}
                        onChange={(e) => setExamForm({...examForm, date: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Start Time *</label>
                      <input
                        type="time"
                        value={examForm.startTime}
                        onChange={(e) => setExamForm({...examForm, startTime: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>End Time *</label>
                      <input
                        type="time"
                        value={examForm.endTime}
                        onChange={(e) => setExamForm({...examForm, endTime: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        value={examForm.duration}
                        onChange={(e) => setExamForm({...examForm, duration: e.target.value})}
                        placeholder="120"
                      />
                    </div>

                    <div className="form-group">
                      <label>Total Marks</label>
                      <input
                        type="number"
                        value={examForm.totalMarks}
                        onChange={(e) => setExamForm({...examForm, totalMarks: e.target.value})}
                        placeholder="100"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={examForm.description}
                        onChange={(e) => setExamForm({...examForm, description: e.target.value})}
                        placeholder="Enter exam description"
                        rows="3"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Instructions</label>
                      <textarea
                        value={examForm.instructions}
                        onChange={(e) => setExamForm({...examForm, instructions: e.target.value})}
                        placeholder="Enter exam instructions"
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {editingExam ? 'Update Exam' : 'Create Exam'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="exams-list">
              {exams.map(exam => (
                <div key={exam.id} className={`exam-card ${exam.status}`}>
                  <div className="exam-header">
                    <div className="exam-title">
                      <h4>{exam.title}</h4>
                      <span className="exam-subject">{exam.subject}</span>
                    </div>
                    <div className="exam-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditExam(exam)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        🗑️
                      </button>
                      {exam.status === 'draft' && (
                        <button 
                          className="publish-btn"
                          onClick={() => handlePublishExam(exam.id)}
                        >
                          📤 Publish
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="exam-details">
                    <p><strong>Date:</strong> {exam.date}</p>
                    <p><strong>Time:</strong> {exam.startTime} - {exam.endTime}</p>
                    <p><strong>Duration:</strong> {exam.duration} minutes</p>
                    <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status ${exam.status}`}>{exam.status}</span>
                    </p>
                  </div>

                  <div className="exam-stats">
                    <div className="stat">
                      <span className="label">Enrolled:</span>
                      <span className="value">{exam.studentsEnrolled}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Submissions:</span>
                      <span className="value">{exam.submissions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="submissions-list">
            <h3>Student Submissions</h3>
            <div className="submissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Exam</th>
                    <th>Submitted At</th>
                    <th>Time Spent</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(submission => (
                    <tr key={submission.id}>
                      <td>
                        <div className="student-info">
                          <div className="student-name">{submission.studentName}</div>
                          <div className="student-id">{submission.studentId}</div>
                        </div>
                      </td>
                      <td>{submission.examTitle}</td>
                      <td>{formatDateTime(submission.submittedAt)}</td>
                      <td>{submission.timeSpent} min</td>
                      <td>
                        {submission.score !== null ? (
                          <span className="score">{submission.score}/{submission.totalMarks}</span>
                        ) : (
                          <span className="pending">-</span>
                        )}
                      </td>
                      <td>
                        <span className={`status ${submission.status}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn">View</button>
                        {submission.status === 'pending' && (
                          <button className="grade-btn">Grade</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;