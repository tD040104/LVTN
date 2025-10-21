import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ user, onClose, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    level: user.level,
    notifications: {
      email: true,
      push: true,
      studyReminder: true,
      achievement: true
    },
    preferences: {
      theme: 'light',
      language: 'vi',
      aiAssistant: true,
      autoSave: true,
      showProgress: true
    },
    privacy: {
      showProfile: true,
      showProgress: true,
      allowMessages: true
    }
  });

  const tabs = [
    { id: 'profile', name: 'Hồ sơ', icon: '👤' },
    { id: 'notifications', name: 'Thông báo', icon: '🔔' },
    { id: 'preferences', name: 'Tùy chọn', icon: '⚙️' },
    { id: 'privacy', name: 'Quyền riêng tư', icon: '🔒' },
    { id: 'about', name: 'Giới thiệu', icon: 'ℹ️' }
  ];

  const avatars = ['👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🤖', '👾', '🎭'];

  const themes = [
    { id: 'light', name: 'Sáng', preview: '#ffffff' },
    { id: 'dark', name: 'Tối', preview: '#1a1a1a' },
    { id: 'blue', name: 'Xanh dương', preview: '#e3f2fd' },
    { id: 'green', name: 'Xanh lá', preview: '#e8f5e8' }
  ];

  const languages = [
    { id: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'ja', name: '日本語', flag: '🇯🇵' },
    { id: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdateUser(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      level: user.level,
      notifications: {
        email: true,
        push: true,
        studyReminder: true,
        achievement: true
      },
      preferences: {
        theme: 'light',
        language: 'vi',
        aiAssistant: true,
        autoSave: true,
        showProgress: true
      },
      privacy: {
        showProfile: true,
        showProgress: true,
        allowMessages: true
      }
    });
  };

  const renderProfileTab = () => (
    <div className="settings-content">
      <h3>Thông tin cá nhân</h3>
      
      <div className="form-group">
        <label>Avatar</label>
        <div className="avatar-selection">
          {avatars.map(avatar => (
            <button
              key={avatar}
              className={`avatar-option ${formData.avatar === avatar ? 'selected' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, avatar }))}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Tên</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Cấp độ</label>
        <select
          value={formData.level}
          onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
          className="form-select"
        >
          <option value="Sinh viên">Sinh viên</option>
          <option value="Học sinh">Học sinh</option>
          <option value="Giáo viên">Giáo viên</option>
          <option value="Nghiên cứu sinh">Nghiên cứu sinh</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-content">
      <h3>Cài đặt thông báo</h3>
      
      <div className="toggle-group">
        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Email thông báo</h4>
            <p>Nhận thông báo qua email</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.notifications.email}
              onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Thông báo đẩy</h4>
            <p>Nhận thông báo trên thiết bị</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.notifications.push}
              onChange={(e) => handleInputChange('notifications', 'push', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Nhắc nhở học tập</h4>
            <p>Nhắc nhở thời gian học tập hàng ngày</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.notifications.studyReminder}
              onChange={(e) => handleInputChange('notifications', 'studyReminder', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Thông báo thành tích</h4>
            <p>Thông báo khi đạt thành tích mới</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.notifications.achievement}
              onChange={(e) => handleInputChange('notifications', 'achievement', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="settings-content">
      <h3>Tùy chọn giao diện</h3>
      
      <div className="form-group">
        <label>Chủ đề</label>
        <div className="theme-selection">
          {themes.map(theme => (
            <button
              key={theme.id}
              className={`theme-option ${formData.preferences.theme === theme.id ? 'selected' : ''}`}
              onClick={() => handleInputChange('preferences', 'theme', theme.id)}
            >
              <div 
                className="theme-preview" 
                style={{ backgroundColor: theme.preview }}
              ></div>
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Ngôn ngữ</label>
        <div className="language-selection">
          {languages.map(lang => (
            <button
              key={lang.id}
              className={`language-option ${formData.preferences.language === lang.id ? 'selected' : ''}`}
              onClick={() => handleInputChange('preferences', 'language', lang.id)}
            >
              <span className="flag">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toggle-group">
        <div className="toggle-item">
          <div className="toggle-info">
            <h4>AI Trợ giảng</h4>
            <p>Bật/tắt AI trợ giảng</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.preferences.aiAssistant}
              onChange={(e) => handleInputChange('preferences', 'aiAssistant', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Tự động lưu</h4>
            <p>Tự động lưu tiến độ học tập</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.preferences.autoSave}
              onChange={(e) => handleInputChange('preferences', 'autoSave', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Hiển thị tiến độ</h4>
            <p>Hiển thị thanh tiến độ trên giao diện</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.preferences.showProgress}
              onChange={(e) => handleInputChange('preferences', 'showProgress', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-content">
      <h3>Cài đặt quyền riêng tư</h3>
      
      <div className="toggle-group">
        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Hiển thị hồ sơ</h4>
            <p>Cho phép người khác xem hồ sơ của bạn</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.privacy.showProfile}
              onChange={(e) => handleInputChange('privacy', 'showProfile', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Hiển thị tiến độ</h4>
            <p>Cho phép người khác xem tiến độ học tập</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.privacy.showProgress}
              onChange={(e) => handleInputChange('privacy', 'showProgress', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Cho phép tin nhắn</h4>
            <p>Cho phép người khác gửi tin nhắn cho bạn</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.privacy.allowMessages}
              onChange={(e) => handleInputChange('privacy', 'allowMessages', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div className="settings-content">
      <h3>Giới thiệu ứng dụng</h3>
      
      <div className="about-info">
        <div className="app-logo">
          <span className="logo-icon">🎓</span>
          <h4>AI Study Assistant</h4>
        </div>
        
        <div className="app-details">
          <p><strong>Phiên bản:</strong> 1.0.0</p>
          <p><strong>Phát triển bởi:</strong> AI Study Team</p>
          <p><strong>Ngày phát hành:</strong> 2024</p>
          <p><strong>Mô tả:</strong> Ứng dụng học tập thông minh với AI trợ giảng</p>
        </div>

        <div className="features-list">
          <h4>Tính năng chính:</h4>
          <ul>
            <li>🤖 AI Trợ giảng thông minh</li>
            <li>📝 Hệ thống kiểm tra trắc nghiệm</li>
            <li>📊 Theo dõi tiến độ học tập</li>
            <li>🏆 Hệ thống thành tích và huy hiệu</li>
            <li>🔍 Tìm kiếm và lọc nội dung</li>
            <li>⚙️ Tùy chỉnh giao diện</li>
          </ul>
        </div>

        <div className="contact-info">
          <h4>Liên hệ hỗ trợ:</h4>
          <p>📧 Email: support@aistudy.com</p>
          <p>📞 Hotline: 1900-1234</p>
          <p>🌐 Website: www.aistudy.com</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <div className="settings-header">
          <h2>⚙️ Cài đặt</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-body">
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="settings-main">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'privacy' && renderPrivacyTab()}
            {activeTab === 'about' && renderAboutTab()}
          </div>
        </div>

        <div className="settings-footer">
          <button className="reset-btn" onClick={handleReset}>
            🔄 Đặt lại
          </button>
          <button className="save-btn" onClick={handleSave}>
            💾 Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
