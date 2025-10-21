import React, { useState } from 'react';
import './Achievements.css';

const Achievements = ({ user, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🏆' },
    { id: 'study', name: 'Học tập', icon: '📚' },
    { id: 'quiz', name: 'Kiểm tra', icon: '📝' },
    { id: 'ai', name: 'AI Trợ giảng', icon: '🤖' },
    { id: 'streak', name: 'Chuỗi ngày', icon: '🔥' }
  ];

  const allAchievements = [
    {
      id: 1,
      title: "Học sinh chăm chỉ",
      description: "Hoàn thành 10 bài học",
      icon: "📚",
      category: "study",
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      points: 100,
      rarity: "common"
    },
    {
      id: 2,
      title: "Thiên tài toán học",
      description: "Đạt điểm tối đa 5 bài kiểm tra toán",
      icon: "🧮",
      category: "quiz",
      unlocked: true,
      progress: 5,
      maxProgress: 5,
      points: 200,
      rarity: "rare"
    },
    {
      id: 3,
      title: "Nhà khoa học tương lai",
      description: "Hoàn thành 20 câu hỏi vật lý",
      icon: "🔬",
      category: "quiz",
      unlocked: false,
      progress: 12,
      maxProgress: 20,
      points: 300,
      rarity: "epic"
    },
    {
      id: 4,
      title: "AI Explorer",
      description: "Sử dụng AI trợ giảng 50 lần",
      icon: "🤖",
      category: "ai",
      unlocked: false,
      progress: 23,
      maxProgress: 50,
      points: 150,
      rarity: "common"
    },
    {
      id: 5,
      title: "Học liên tục 7 ngày",
      description: "Học tập liên tục trong 7 ngày",
      icon: "🔥",
      category: "streak",
      unlocked: false,
      progress: 3,
      maxProgress: 7,
      points: 500,
      rarity: "legendary"
    },
    {
      id: 6,
      title: "Master of All",
      description: "Hoàn thành tất cả môn học",
      icon: "👑",
      category: "study",
      unlocked: false,
      progress: 2,
      maxProgress: 4,
      points: 1000,
      rarity: "legendary"
    },
    {
      id: 7,
      title: "Perfect Score",
      description: "Đạt điểm tối đa 10 bài kiểm tra",
      icon: "💯",
      category: "quiz",
      unlocked: false,
      progress: 3,
      maxProgress: 10,
      points: 400,
      rarity: "epic"
    },
    {
      id: 8,
      title: "AI Master",
      description: "Đặt 100 câu hỏi cho AI",
      icon: "🧠",
      category: "ai",
      unlocked: false,
      progress: 15,
      maxProgress: 100,
      points: 250,
      rarity: "rare"
    }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? allAchievements 
    : allAchievements.filter(achievement => achievement.category === selectedCategory);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#95a5a6';
      case 'rare': return '#3498db';
      case 'epic': return '#9b59b6';
      case 'legendary': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getRarityName = (rarity) => {
    switch (rarity) {
      case 'common': return 'Thường';
      case 'rare': return 'Hiếm';
      case 'epic': return 'Epic';
      case 'legendary': return 'Huyền thoại';
      default: return 'Thường';
    }
  };

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalPoints = allAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="achievements-overlay">
      <div className="achievements-container">
        <div className="achievements-header">
          <div className="header-info">
            <h2>🏆 Thành tích & Huy hiệu</h2>
            <p>Khám phá và mở khóa các thành tích mới</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="achievements-stats">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <span className="stat-number">{unlockedCount}</span>
              <span className="stat-label">Thành tích đã mở khóa</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-number">{totalPoints}</span>
              <span className="stat-label">Tổng điểm thưởng</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-number">{Math.round((unlockedCount / allAchievements.length) * 100)}%</span>
              <span className="stat-label">Tỷ lệ hoàn thành</span>
            </div>
          </div>
        </div>

        <div className="achievements-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="achievements-grid">
          {filteredAchievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              style={{ '--rarity-color': getRarityColor(achievement.rarity) }}
            >
              <div className="achievement-header">
                <div className="achievement-icon">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-rarity">
                  {getRarityName(achievement.rarity)}
                </div>
              </div>
              
              <div className="achievement-content">
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">{achievement.description}</p>
                
                <div className="achievement-progress">
                  <div className="progress-info">
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                    <span>{achievement.points} điểm</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                        backgroundColor: achievement.unlocked ? getRarityColor(achievement.rarity) : '#ddd'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {achievement.unlocked && (
                <div className="achievement-badge">
                  <span>✓ Đã mở khóa</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="achievements-footer">
          <div className="motivation-text">
            <h3>💪 Tiếp tục học tập để mở khóa thêm nhiều thành tích!</h3>
            <p>Mỗi thành tích đều là một bước tiến trong hành trình học tập của bạn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
