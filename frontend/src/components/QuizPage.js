import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Quiz from './Quiz';
import axios from 'axios';
import './QuizPage.css';

const QuizPage = ({ subjects = [], quizQuestions = {}, onQuizStart = () => {}, onBack = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const localOnBack = onBack && typeof onBack === 'function' ? onBack : (() => navigate(-1));
  const preselected = location?.state?.subject || null;
  const [selectedSubject, setSelectedSubject] = useState(preselected);
  const [modalQuizSubject, setModalQuizSubject] = useState(preselected);
  const [apiSubjects, setApiSubjects] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const difficulties = [
    { id: 'all', name: 'Tất cả cấp độ', color: '#667eea' },
    { id: 'easy', name: 'Dễ', color: '#4CAF50' },
    { id: 'medium', name: 'Trung bình', color: '#FF9800' },
    { id: 'hard', name: 'Khó', color: '#f44336' }
  ];

  const quizTypes = [
    { id: 'all', name: 'Tất cả loại', icon: '📝' },
    { id: 'multiple', name: 'Trắc nghiệm', icon: '🔘' },
    { id: 'true-false', name: 'Đúng/Sai', icon: '✅' },
    { id: 'fill-blank', name: 'Điền từ', icon: '✏️' }
  ];

  // Fetch all questions to display on the /quiz list page
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingQuestions(true);
        const res = await axios.get('http://localhost:5000/api/questions');
        setAllQuestions(res.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách câu hỏi:', err);
        setQuestionsError('Không thể tải danh sách câu hỏi');
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchAll();
  }, []);

  // If parent didn't provide subjects, try fetch subjects for name lookup
  useEffect(() => {
    const ensureSubjects = async () => {
      if (!Array.isArray(subjects) || subjects.length === 0) {
        try {
          const res = await axios.get('http://localhost:5000/api/subjects');
          setApiSubjects(res.data || []);
        } catch (err) {
          console.warn('Không thể tải subjects từ backend:', err.message || err);
        }
      }
    };
    ensureSubjects();
  }, [subjects]);

  // Nếu đang tải danh sách câu hỏi, hiển thị loading
    if (loadingQuestions) {
    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <button className="back-btn" onClick={localOnBack}>← Quay lại</button>
          <h1>📝 Kiểm tra</h1>
        </div>
        <p>Đang tải danh sách câu hỏi...</p>
      </div>
    );
  }

  // Nếu có lỗi khi tải câu hỏi
  if (questionsError) {
    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <button className="back-btn" onClick={localOnBack}>← Quay lại</button>
          <h1>📝 Kiểm tra</h1>
        </div>
        <p className="error">{questionsError}</p>
      </div>
    );
  }

  const getQuizStats = (subjectId) => {
    const questions = quizQuestions?.[subjectId] || [];
    return {
      total: questions.length,
      completed: questions.length ? Math.floor(Math.random() * questions.length) : 0,
      average: questions.length ? Math.floor(Math.random() * 40) + 60 : 0,
      lastAttempt: '2024-01-15'
    };
  };

  const getSubjectDifficulty = (subjectId) => {
    const difficultiesMap = {
      1: 'easy', // Toán học
      2: 'medium', // Vật lý
      3: 'medium', // Hóa học
      4: 'hard' // Sinh học
    };
    return difficultiesMap[subjectId] || 'easy';
  };

  // Lọc môn học an toàn
  const filteredSubjects = subjects.filter(subject => {
    const difficultyMatch = selectedDifficulty === 'all' || getSubjectDifficulty(subject.id) === selectedDifficulty;
    return difficultyMatch;
  });

  const handleStartQuiz = (subject) => {
    onQuizStart(subject);
  };

  const recentQuizzes = [
    { id: 1, subject: 'Toán học', score: 85, total: 10, date: '2024-01-15', time: '15 phút' },
    { id: 2, subject: 'Vật lý', score: 92, total: 8, date: '2024-01-14', time: '12 phút' },
    { id: 3, subject: 'Hóa học', score: 78, total: 12, date: '2024-01-13', time: '18 phút' }
  ];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
  <button className="back-btn" onClick={localOnBack}>← Quay lại</button>
        <div className="header-content">
          <h1>📝 Kiểm tra</h1>
          <p>Luyện tập và đánh giá kiến thức của bạn</p>
        </div>
      </div>

      <div className="quiz-content">
        <div className="quiz-sidebar">
          <div className="sidebar-section">
            <h3>Bộ lọc</h3>
            <div className="filter-group">
              <label>Môn học</label>
              <select
                value={selectedSubject?.id || 'all'}
                onChange={(e) => {
                  const subjectId = e.target.value;
                  if (subjectId === 'all') {
                    setSelectedSubject(null);
                  } else {
                    setSelectedSubject(subjects.find(s => s.id === parseInt(subjectId)));
                  }
                }}
                className="filter-select"
              >
                <option value="all">Tất cả môn học</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Cấp độ</label>
              <div className="difficulty-list">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty.id}
                    className={`difficulty-item ${selectedDifficulty === difficulty.id ? 'active' : ''}`}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    style={{ '--difficulty-color': difficulty.color }}
                  >
                    <div className="difficulty-dot" style={{ backgroundColor: difficulty.color }}></div>
                    <span>{difficulty.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Loại câu hỏi</label>
              <div className="type-list">
                {quizTypes.map(type => (
                  <button
                    key={type.id}
                    className={`type-item ${selectedType === type.id ? 'active' : ''}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Thống kê</h3>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-info"><span className="stat-number">24</span><span className="stat-label">Bài đã làm</span></div></div>
              <div className="stat-card"><div className="stat-icon">🎯</div><div className="stat-info"><span className="stat-number">87%</span><span className="stat-label">Điểm TB</span></div></div>
              <div className="stat-card"><div className="stat-icon">⏱️</div><div className="stat-info"><span className="stat-number">14</span><span className="stat-label">Phút TB</span></div></div>
            </div>
          </div>
        </div>

        <div className="quiz-main">
          <div className="quiz-grid">
            {filteredSubjects.map(subject => {
              const stats = getQuizStats(subject.id);
              const difficulty = getSubjectDifficulty(subject.id);

              return (
                <div key={subject.id} className="quiz-card">
                  <div className="quiz-card-header">
                    <div className="subject-info">
                      <div className="subject-icon" style={{ backgroundColor: subject.color }}>
                        {subject.icon}
                      </div>
                      <div>
                        <h3>{subject.name}</h3>
                        <p>{subject.description}</p>
                      </div>
                    </div>
                    <div className="difficulty-badge" style={{ backgroundColor: difficulties.find(d => d.id === difficulty)?.color }}>
                      {difficulties.find(d => d.id === difficulty)?.name}
                    </div>
                  </div>

                  <div className="quiz-stats">
                    <div className="stat-item"><span className="stat-label">Tổng câu hỏi</span><span className="stat-value">{stats.total}</span></div>
                    <div className="stat-item"><span className="stat-label">Đã làm</span><span className="stat-value">{stats.completed}</span></div>
                    <div className="stat-item"><span className="stat-label">Điểm TB</span><span className="stat-value">{stats.average}%</span></div>
                  </div>

                  <div className="quiz-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(stats.total ? (stats.completed / stats.total) * 100 : 0)}%` }}></div>
                    </div>
                    <span className="progress-text">{stats.completed}/{stats.total} câu đã làm</span>
                  </div>

                  <div className="quiz-actions">
                    <button className="start-quiz-btn" onClick={() => handleStartQuiz(subject)}>
                      <span>🚀</span> Bắt đầu kiểm tra
                    </button>
                    <button className="practice-btn">
                      <span>💪</span> Luyện tập
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="recent-quizzes">
            <h3>Bài kiểm tra gần đây</h3>
            <div className="recent-list">
              {recentQuizzes.map(quiz => (
                <div key={quiz.id} className="recent-item">
                  <div className="recent-info">
                    <h4>{quiz.subject}</h4>
                    <p>{quiz.date} • {quiz.time}</p>
                  </div>
                  <div className="recent-score">
                    <span className="score">{quiz.score}/{quiz.total}</span>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${(quiz.score / quiz.total) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="question-list-section">
            <h3>Danh sách câu hỏi</h3>
            {allQuestions.length === 0 ? (
              <p>Không có câu hỏi.</p>
            ) : (
              <div className="questions-list">
                {allQuestions.map(q => {
                  const subjectName = (subjects.find && subjects.find(s => String(s._id) === String(q.subjectId))?.name)
                    || (apiSubjects.find && apiSubjects.find(s => String(s._id) === String(q.subjectId))?.name)
                    || q.subjectId;
                  return (
                    <div key={q._id || `${q.subjectId}-${q.seq || Math.random()}`} className="question-row">
                      <div className="question-meta">
                        <strong>#{q.seq || '—'}</strong>
                        <span className="question-text">{q.question}</span>
                        <span className="question-subject">{subjectName}</span>
                        <span className="question-count">{(q.options || []).length} lựa chọn</span>
                      </div>
                      <div className="question-actions">
                        <button className="open-quiz-btn" onClick={() => {
                          // open quiz modal for that subject (prefer provided subjects, otherwise apiSubjects)
                          const subj = (subjects.find && subjects.find(s => String(s._id) === String(q.subjectId)))
                            || (apiSubjects.find && apiSubjects.find(s => String(s._id) === String(q.subjectId)));
                          if (subj) {
                            setModalQuizSubject(subj);
                          } else {
                            alert('Không tìm thấy môn cho câu hỏi này');
                          }
                        }}>Làm bài</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {modalQuizSubject && (
            <Quiz
              subject={modalQuizSubject}
              onClose={() => setModalQuizSubject(null)}
              onComplete={() => setModalQuizSubject(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
