import React, { useState, useEffect } from 'react';
import './ProgressPage.css';
import axios from 'axios';
import { userProfile } from '../data/subjects';

const ProgressPage = ({ user, onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [apiUser, setApiUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const periods = [
    { id: 'week', name: 'Tuần này', days: 7 },
    { id: 'month', name: 'Tháng này', days: 30 },
    { id: 'year', name: 'Năm nay', days: 365 }
  ];

  const [subjectsMap, setSubjectsMap] = useState({});
  // Mock data for progress
  const progressData = {
    week: {
      studyTime: 12,
      completedLessons: 8,
      quizzesTaken: 5,
      averageScore: 85,
      streak: 3,
      subjects: [
        { name: 'Toán học', time: 4, progress: 75 },
        { name: 'Vật lý', time: 3, progress: 60 },
        { name: 'Hóa học', time: 3, progress: 45 },
        { name: 'Sinh học', time: 2, progress: 30 }
      ]
    },
    month: {
      studyTime: 45,
      completedLessons: 32,
      quizzesTaken: 18,
      averageScore: 82,
      streak: 7,
      subjects: [
        { name: 'Toán học', time: 15, progress: 80 },
        { name: 'Vật lý', time: 12, progress: 70 },
        { name: 'Hóa học', time: 10, progress: 55 },
        { name: 'Sinh học', time: 8, progress: 40 }
      ]
    },
    year: {
      studyTime: 520,
      completedLessons: 380,
      quizzesTaken: 200,
      averageScore: 84,
      streak: 15,
      subjects: [
        { name: 'Toán học', time: 180, progress: 90 },
        { name: 'Vật lý', time: 150, progress: 85 },
        { name: 'Hóa học', time: 120, progress: 75 },
        { name: 'Sinh học', time: 70, progress: 60 }
      ]
    }
  };

  const currentData = progressData[selectedPeriod];

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    return '💪';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#8BC34A';
    if (score >= 70) return '#FFC107';
    return '#FF9800';
  };

  const userSafe = apiUser || user || userProfile;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        let u = user;
        if (!u) {
          const raw = localStorage.getItem('user');
          u = raw ? JSON.parse(raw) : null;
        }
        if (u && u._id) {
          const res = await axios.get(`http://localhost:5000/users/${u._id}`);
          setApiUser(res.data);
        }
      } catch (err) {
        console.warn('Không thể tải user từ server:', err?.message || err);
      } finally {
        setLoadingUser(false);
      }
          // fetch subjects map for display names
          try {
            const sres = await axios.get('http://localhost:5000/api/subjects');
            const map = {};
            (sres.data || []).forEach(s => { map[String(s._id)] = s.name; });
            setSubjectsMap(map);
          } catch (e) {
            console.warn('Không thể tải danh sách môn:', e?.message || e);
          }
    };
    fetchUser();
  }, [user]);

  return (
    <div className="progress-page">
      <div className="progress-header">
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            ← Quay lại
  // compute stats from apiUser.studyProgress if available
          </button>
        )}
        <div className="header-content">
          <h1>📊 Tiến độ học tập</h1>
          <p>Theo dõi hành trình học tập của bạn</p>
        </div>
      </div>

      <div className="progress-content">
        <div className="period-selector">
          {periods.map(period => (
            <button
              key={period.id}
              className={`period-btn ${selectedPeriod === period.id ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period.id)}
            >
              {period.name}
            </button>
          ))}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>{currentData.studyTime}h</h3>
              <p>Thời gian học</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>{currentData.completedLessons}</h3>
              <p>Bài học hoàn thành</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>{currentData.quizzesTaken}</h3>
              <p>Bài kiểm tra</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3 style={{ color: getScoreColor(currentData.averageScore) }}>
                {currentData.averageScore}%
              </h3>
              <p>Điểm trung bình</p>
            </div>
          </div>

          <div className="stat-card streak-card">
            <div className="stat-icon">{getStreakEmoji(currentData.streak)}</div>
            <div className="stat-content">
              <h3>{currentData.streak} ngày</h3>
              <p>Chuỗi học tập</p>
            </div>
          </div>
        </div>

        <div className="subjects-progress">
          <h2>Tiến độ theo môn học</h2>
          <div className="subjects-list">
            {currentData.subjects.map((subject, index) => (
              <div key={index} className="subject-progress-card">
                <div className="subject-header">
                  <h3>{subject.name}</h3>
                  <span className="time-spent">{subject.time}h</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                <div className="progress-info">
                  <span>{subject.progress}% hoàn thành</span>
                  <span>{subject.time}h học tập</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="achievements-preview">
          <h2>Thành tích gần đây</h2>
          <div className="achievements-list">
            {userSafe.achievements && userSafe.achievements.length > 0 ? (
              userSafe.achievements.slice(0, 3).map(achievement => (
                <div key={achievement.id} className="achievement-preview">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                  </div>
                  <div className="achievement-points">+{achievement.points}</div>
                </div>
              ))
            ) : (
              <div className="no-achievements">Chưa có thành tích nào</div>
            )}
          </div>
        </div>

        <div className="study-tips">
          <h2>💡 Mẹo cải thiện tiến độ</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>🎯 Đặt mục tiêu hàng ngày</h4>
              <p>Học ít nhất 1 giờ mỗi ngày để duy trì chuỗi học tập</p>
            </div>
            <div className="tip-card">
              <h4>⏰ Học vào giờ cố định</h4>
              <p>Tạo thói quen học tập vào cùng một thời điểm mỗi ngày</p>
            </div>
            <div className="tip-card">
              <h4>📊 Theo dõi tiến độ</h4>
              <p>Kiểm tra tiến độ thường xuyên để điều chỉnh kế hoạch</p>
            </div>
            <div className="tip-card">
              <h4>🏆 Đặt thử thách</h4>
              <p>Tạo các thử thách nhỏ để tăng động lực học tập</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
