import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './ExamInterface.css';

const ExamInterface = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  useEffect(() => {
    let timer;
    if (examStarted && timeRemaining > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeRemaining, isSubmitted]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      // Fetch exam details and questions
      const [examResponse, questionsResponse] = await Promise.all([
        axios.get(`/api/student/exam/${examId}`),
        axios.get(`/api/student/exam/${examId}/questions`)
      ]);
      
      setExam(examResponse.data);
      setQuestions(questionsResponse.data || []);
      setTimeRemaining(examResponse.data.duration * 60); // Convert minutes to seconds
    } catch (error) {
      console.error('Error fetching exam data:', error);
      setError('Failed to load exam data');
      // Mock data for development
      setExam({
        id: examId,
        title: 'Mathematics Final Exam',
        subject: 'Mathematics',
        duration: 120,
        totalMarks: 100,
        instructions: 'Please read all questions carefully before answering. You have 2 hours to complete this exam.',
        startTime: '2024-01-20T10:00:00Z',
        endTime: '2024-01-20T12:00:00Z'
      });
      
      setQuestions([
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the derivative of x²?',
          options: ['2x', 'x', '2', 'x²'],
          marks: 2
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'What is the integral of 2x?',
          options: ['x²', 'x² + C', '2x² + C', '2'],
          marks: 3
        },
        {
          id: 3,
          type: 'short-answer',
          question: 'Solve the equation: 2x + 5 = 13',
          marks: 5
        },
        {
          id: 4,
          type: 'essay',
          question: 'Explain the concept of limits in calculus with examples.',
          marks: 10
        }
      ]);
      
      setTimeRemaining(120 * 60); // 2 hours in seconds
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleAutoSubmit = () => {
    submitExam(true);
  };

  const submitExam = async (autoSubmit = false) => {
    try {
      setLoading(true);
      
      const submissionData = {
        examId: examId,
        answers: answers,
        submittedAt: new Date().toISOString(),
        autoSubmit: autoSubmit
      };

      await axios.post(`/api/student/exam/${examId}/submit`, submissionData);
      
      setIsSubmitted(true);
      setShowConfirmDialog(false);
      
      // Redirect to results page after 3 seconds
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 3000);
      
    } catch (error) {
      setError('Failed to submit exam');
      setLoading(false);
    }
  };

  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(questionId => 
      answers[questionId] && answers[questionId].toString().trim() !== ''
    ).length;
  };

  const renderQuestion = (question) => {
    const answer = answers[question.id] || '';

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="question-content">
            <h3>Question {currentQuestion + 1}</h3>
            <p className="question-text">{question.question}</p>
            <p className="marks">Marks: {question.marks}</p>
            <div className="options">
              {question.options.map((option, index) => (
                <label key={index} className="option">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answer === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'short-answer':
        return (
          <div className="question-content">
            <h3>Question {currentQuestion + 1}</h3>
            <p className="question-text">{question.question}</p>
            <p className="marks">Marks: {question.marks}</p>
            <textarea
              className="short-answer"
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer here..."
              rows="4"
            />
          </div>
        );

      case 'essay':
        return (
          <div className="question-content">
            <h3>Question {currentQuestion + 1}</h3>
            <p className="question-text">{question.question}</p>
            <p className="marks">Marks: {question.marks}</p>
            <textarea
              className="essay-answer"
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Write your detailed answer here..."
              rows="10"
            />
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (loading && !exam) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading exam...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/student-dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="submission-success">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h2>Exam Submitted Successfully!</h2>
          <p>Your answers have been recorded and will be reviewed.</p>
          <p>You will be redirected to the dashboard shortly...</p>
          <div className="submission-stats">
            <p><strong>Questions Answered:</strong> {getAnsweredCount()} / {questions.length}</p>
            <p><strong>Submitted At:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="exam-instructions">
        <div className="instructions-container">
          <div className="exam-header">
            <h1>{exam.title}</h1>
            <div className="exam-details">
              <p><strong>Subject:</strong> {exam.subject}</p>
              <p><strong>Duration:</strong> {exam.duration} minutes</p>
              <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
              <p><strong>Questions:</strong> {questions.length}</p>
            </div>
          </div>

          <div className="instructions-content">
            <h3>Instructions</h3>
            <div className="instructions-text">
              <p>{exam.instructions}</p>
              <ul>
                <li>Read all questions carefully before answering</li>
                <li>You can navigate between questions using the navigation panel</li>
                <li>Make sure to save your answers before moving to the next question</li>
                <li>The timer will start once you begin the exam</li>
                <li>The exam will auto-submit when time runs out</li>
                <li>Ensure you have a stable internet connection</li>
              </ul>
            </div>
          </div>

          <div className="start-exam-section">
            <button className="start-exam-btn" onClick={handleStartExam}>
              Start Exam
            </button>
            <p className="warning-text">
              ⚠️ Once you start the exam, the timer cannot be paused
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-interface">
      {/* Header with Timer and Progress */}
      <header className="exam-header">
        <div className="header-left">
          <h2>{exam.title}</h2>
          <p>Student: {user?.name}</p>
        </div>
        <div className="header-center">
          <div className="progress-info">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className={`timer ${timeRemaining <= 300 ? 'warning' : ''}`}>
            <span className="timer-icon">⏰</span>
            <span className="timer-text">{formatTime(timeRemaining)}</span>
          </div>
          <button className="submit-btn" onClick={handleSubmitClick}>
            Submit Exam
          </button>
        </div>
      </header>

      <div className="exam-content">
        {/* Question Navigation Sidebar */}
        <aside className="question-nav">
          <h4>Questions</h4>
          <div className="question-grid">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`question-nav-btn ${
                  index === currentQuestion ? 'active' : ''
                } ${
                  answers[questions[index]?.id] ? 'answered' : ''
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="answered-count">
            <p>Answered: {getAnsweredCount()} / {questions.length}</p>
          </div>
        </aside>

        {/* Main Question Area */}
        <main className="question-area">
          {questions[currentQuestion] && renderQuestion(questions[currentQuestion])}
          
          <div className="question-navigation">
            <button 
              className="nav-btn prev"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            <button 
              className="nav-btn next"
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1}
            >
              Next →
            </button>
          </div>
        </main>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="confirmation-dialog">
            <h3>Submit Exam?</h3>
            <p>Are you sure you want to submit your exam? This action cannot be undone.</p>
            <div className="dialog-stats">
              <p><strong>Questions Answered:</strong> {getAnsweredCount()} / {questions.length}</p>
              <p><strong>Time Remaining:</strong> {formatTime(timeRemaining)}</p>
            </div>
            <div className="dialog-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={() => submitExam(false)}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;