import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

  const Header = ({ user, onProfileClick, onAchievementsClick, onSettingsClick, onLoginClick, onLogout, isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">🎓</span>
          <h1>AI Study Assistant</h1>
        </div>
        
        <nav className="nav">
          <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
            Trang chủ
          </button>
          <button className={`nav-link ${location.pathname === '/subjects' ? 'active' : ''}`} onClick={() => navigate('/subjects')}>
            Môn học
          </button>
          <button className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`} onClick={() => navigate('/quiz')}>
            Kiểm tra
          </button>
          <button className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`} onClick={() => navigate('/progress')}>
            Tiến độ
          </button>
        </nav>
        
        <div className="user-section">
          {isLoggedIn && (user || (() => {
            try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
          })()) ? (
            <>
              <div className="user-info">
                <span className="user-avatar">{(user && user.avatar) || (() => { try { const r = localStorage.getItem('user'); return r ? JSON.parse(r).avatar : '👤'; } catch (e) { return '👤'; } })()}</span>
                <span className="user-name">{(user && user.name) || (() => { try { const r = localStorage.getItem('user'); return r ? JSON.parse(r).name : 'Người dùng'; } catch (e) { return 'Người dùng'; } })()}</span>
                <span className="user-points">{(user && user.points) || (() => { try { const r = localStorage.getItem('user'); return r ? JSON.parse(r).points : 0; } catch (e) { return 0; } })()} điểm</span>
              </div>
              <div className="user-actions">
                <button className="achievements-btn" onClick={onAchievementsClick}>🏆</button>
                <button className="settings-btn" onClick={onSettingsClick}>⚙️</button>
                <button className="profile-btn" onClick={onProfileClick}>Hồ sơ</button>
                <button className="logout-btn" onClick={onLogout}>Đăng xuất</button>
              </div>
            </>
          ) : (
            <div style={{ marginLeft: '12px' }}>
              <button className="login-btn small" onClick={onLoginClick} title="Đăng nhập / Đăng ký">
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
