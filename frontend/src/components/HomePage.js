import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectDetail from './SubjectDetail';
import AIAssistant from './AIAssistant';
import Quiz from './Quiz';
import Achievements from './Achievements';
import Settings from './Settings';
import Auth from './Auth';
import HomePageContent from './HomePageContent';
import { subjects, quizQuestions, userProfile } from '../data/subjects';
import AuthContext from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSubjectDetail, setShowSubjectDetail] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user: currentUser, setUser, isLoggedIn, setIsLoggedIn, setShowAuth: setGlobalShowAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => setShowProfile(true);
  const handleAchievementsClick = () => setShowAchievements(true);
  const handleSettingsClick = () => setShowSettings(true);

  const handleUpdateUser = (newUserData) => {
    setCurrentUser(prev => ({ ...prev, ...newUserData }));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setGlobalShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(userProfile);
    setIsLoggedIn(false);
    setShowProfile(false);
  };

  const closeModals = () => {
    setShowAIAssistant(false);
    setShowQuiz(false);
    setShowProfile(false);
    setShowSubjectDetail(false);
    setShowAchievements(false);
    setShowSettings(false);
    setShowAuth(false);
    setSelectedSubject(null);
  };

  const handleSubjectSelect = (subject) => {
  setSelectedSubject(subject);
  setShowSubjectDetail(true);
};

  const handleQuizStart = (subject) => {
    setSelectedSubject(subject);
    setShowQuiz(true);
  };

  const handleQuizComplete = (score, total) => {
    console.log(`Quiz completed: ${score}/${total}`);
  };

  // Home page now relies on router for navigation; just render the home content
  return (
    <div className="home-page">
      <main className="main-content">
        <HomePageContent
          user={currentUser}
          onSubjectSelect={() => navigate('/subjects')}
          onQuizStart={() => navigate('/quiz')}
          onAchievementsClick={handleAchievementsClick}
        />
      </main>

      {showAIAssistant && selectedSubject && (
        <AIAssistant subject={selectedSubject} onClose={closeModals} />
      )}

      {showQuiz && selectedSubject && (
        <Quiz
          subject={selectedSubject}
          onClose={closeModals}
          onComplete={handleQuizComplete}
        />
      )}

      {showSubjectDetail && selectedSubject && (
        <SubjectDetail
          subject={selectedSubject}
          onBack={closeModals}
          onStartQuiz={handleQuizStart}
          onOpenAI={(subject) => {
            setSelectedSubject(subject);
            setShowAIAssistant(true);
            setShowSubjectDetail(false);
          }}
        />
      )}

      {showAchievements && <Achievements user={currentUser} onClose={closeModals} />}
      {showSettings && <Settings user={currentUser} onClose={closeModals} onUpdateUser={handleUpdateUser} />}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-content">
            <div className="profile-header">
              <h2>Hồ sơ cá nhân</h2>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>
            <div className="profile-info">
              <div className="profile-avatar">{currentUser.avatar}</div>
              <h3>{currentUser.name}</h3>
              <p>{currentUser.email}</p>
              <p>Level: {currentUser.level}</p>
              <p>Điểm: {currentUser.points}</p>
              <div className="profile-actions">
                <button onClick={() => { setShowProfile(false); setShowAchievements(true); }} className="btn btn-primary">🏆 Thành tích</button>
                <button onClick={() => { setShowProfile(false); setShowSettings(true); }} className="btn btn-secondary">⚙️ Cài đặt</button>
                <button onClick={handleLogout} className="btn btn-danger">🚪 Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAuth && <Auth onLogin={handleLogin} onClose={closeModals} />}
    </div>
  );
};

export default HomePage;
