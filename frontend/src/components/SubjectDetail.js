import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SubjectDetail.css';

const SubjectDetail = ({ subject: propSubject, onBack: propOnBack, onStartQuiz: propOnStartQuiz, onOpenAI: propOnOpenAI }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(new Set());

  const params = useParams();
  const navigate = useNavigate();

  // If subject prop not provided, load from params (route mode)
  const [subject, setSubject] = useState(propSubject || null);
  const [loading, setLoading] = useState(!propSubject);
  const [error, setError] = useState(null);

  // Callbacks: prefer props, otherwise fallback to navigation-based defaults
  // Prefer prop callbacks when provided; otherwise default to history back
  const onBack = propOnBack ?? (() => navigate(-1));
  const onStartQuiz = propOnStartQuiz ?? (() => navigate('/quiz'));
  const onOpenAI = propOnOpenAI ?? (() => {});

  React.useEffect(() => {
    const fetchSubject = async (id) => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/subjects/${id}`);
        setSubject(res.data);
      } catch (err) {
        console.error('Error fetching subject:', err);
        setError('Không thể tải thông tin môn học.');
      } finally {
        setLoading(false);
      }
    };

    if (!propSubject) {
      const idParam = params?.id;
      if (idParam) {
        fetchSubject(idParam);
      } else {
        setError('Không có ID môn học');
        setLoading(false);
      }
    }
  }, [propSubject, params]);

  if (loading) return <div className="loading">Đang tải môn học...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!subject) return (
    <div style={{ padding: 20 }}>
      <h2>Không tìm thấy môn học</h2>
      <button onClick={() => navigate('/subjects')}>Quay lại danh sách môn học</button>
    </div>
  );

  // Normalize chapters so SubjectDetail can accept simple string arrays
  const chapters = (subject?.chapters || []).map((ch, i) => {
    if (typeof ch === 'string') {
      return {
        id: `${subject?._id ?? subject?.id ?? 's'}-${i}`,
        title: ch,
        description: '',
        topics: []
      };
    }
    // assume already an object with id/title/description/topics
    return ch;
  });

  const handleTopicComplete = (topicIndex) => {
    const newCompleted = new Set(completedTopics);
    if (completedTopics.has(topicIndex)) {
      newCompleted.delete(topicIndex);
    } else {
      newCompleted.add(topicIndex);
    }
    setCompletedTopics(newCompleted);
  };

  const getChapterProgress = (chapter) => {
    const topics = chapter.topics || [];
    const totalTopics = topics.length;
    if (totalTopics === 0) return 0;
    const completedCount = topics.filter((_, index) => 
      completedTopics.has(`${chapter.id}-${index}`)
    ).length;
    return (completedCount / totalTopics) * 100;
  };

  const getOverallProgress = () => {
    const totalTopics = chapters.reduce((sum, chapter) => sum + (chapter.topics ? chapter.topics.length : 0), 0);
    if (totalTopics === 0) return 0;
    const completedCount = completedTopics.size;
    return (completedCount / totalTopics) * 100;
  };

  return (
    <div className="subject-detail">
      <div className="subject-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <div className="subject-info">
          <div className="subject-icon" style={{ backgroundColor: subject.color }}>
            {subject.icon}
          </div>
          <div>
            <h1>{subject.name}</h1>
            <p>{subject.description}</p>
            <div className="progress-info">
              <span>Tiến độ tổng thể: {Math.round(getOverallProgress())}%</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getOverallProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="subject-actions">
          <button className="ai-btn" onClick={() => onOpenAI(subject)}>
            <span>🤖</span> AI Trợ giảng
          </button>
          <button className="quiz-btn" onClick={() => onStartQuiz(subject)}>
            <span>📝</span> Kiểm tra
          </button>
        </div>
      </div>

      <div className="subject-content">
        <div className="chapters-section">
          <h2>Danh sách chương</h2>
          <div className="chapters-list">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="chapter-card">
                <div className="chapter-header">
                  <div className="chapter-info">
                    <h3>Chương {chapterIndex + 1}: {chapter.title}</h3>
                    <p>{chapter.description}</p>
                  </div>
                  <div className="chapter-progress">
                    <span>{Math.round(getChapterProgress(chapter))}%</span>
                    <div className="progress-circle">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path
                          className="circle-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="circle"
                          strokeDasharray={`${getChapterProgress(chapter)}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="topics-list">
                  {(chapter.topics || []).map((topic, topicIndex) => {
                    const topicKey = `${chapter.id}-${topicIndex}`;
                    const isCompleted = completedTopics.has(topicKey);
                    const topicText = typeof topic === 'string' ? topic : topic.title || '';

                    return (
                      <div 
                        key={topicKey}
                        className={`topic-item ${isCompleted ? 'completed' : ''}`}
                        onClick={() => handleTopicComplete(topicKey)}
                      >
                        <div className="topic-checkbox">
                          {isCompleted ? '✓' : '○'}
                        </div>
                        <div className="topic-content">
                          <h4>{topicText}</h4>
                          <div className="topic-actions">
                            <button className="study-btn">Học</button>
                            <button className="practice-btn">Luyện tập</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="study-tips">
          <h3>💡 Mẹo học tập</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>📚 Đọc kỹ lý thuyết</h4>
              <p>Đọc và hiểu rõ các khái niệm cơ bản trước khi làm bài tập</p>
            </div>
            <div className="tip-card">
              <h4>✏️ Luyện tập thường xuyên</h4>
              <p>Làm nhiều bài tập để nắm vững kiến thức</p>
            </div>
            <div className="tip-card">
              <h4>🤖 Sử dụng AI trợ giảng</h4>
              <p>Đặt câu hỏi khi gặp khó khăn để được giải thích chi tiết</p>
            </div>
            <div className="tip-card">
              <h4>📊 Theo dõi tiến độ</h4>
              <p>Kiểm tra tiến độ học tập để điều chỉnh kế hoạch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
