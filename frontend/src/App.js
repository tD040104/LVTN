import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import SubjectsPage from './components/SubjectsPage';
import QuizPage from './components/QuizPage';
import ProgressPage from './components/ProgressPage';
import SubjectDetail from './components/SubjectDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfilePage from './components/ProfilePage';
import { userProfile } from './data/subjects';
import Auth from './components/Auth';
import AuthContext from './contexts/AuthContext';

const AppInner = () => {
  const navigate = useNavigate();
  // global auth state
  // Initialize auth from localStorage so login persists across refresh
  const stored = (() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  })();
  const [user, setUser] = useState(stored || userProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(!!stored);
  const [showAuth, setShowAuth] = useState(false);

  // theme: prefer user.preferences.theme -> localStorage.theme -> light
  const initialTheme = (stored && stored.preferences && stored.preferences.theme) || localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(initialTheme);

  // apply theme to document root
  React.useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }, [theme]);

  const handleProfile = () => {
    // Navigate to profile page
    navigate('/profile');
  };
  const handleAchievements = () => navigate('/progress');
  const handleSettings = () => navigate('/');
  const handleLogin = () => setShowAuth(true);

  const handleLogout = () => {
    setUser(userProfile);
    setIsLoggedIn(false);
    try { localStorage.removeItem('user'); } catch (e) {}
    // navigate to home after logout
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, showAuth, setShowAuth, theme, setTheme }}>
      <Header
        user={user}
        onProfileClick={handleProfile}
        onAchievementsClick={handleAchievements}
        onSettingsClick={handleSettings}
        onLoginClick={handleLogin}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />

      {showAuth && <Auth onLogin={(u) => { setUser(u); setIsLoggedIn(true); setShowAuth(false); try { localStorage.setItem('user', JSON.stringify(u)); } catch (e) {} }} onClose={() => setShowAuth(false)} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subject/:id" element={<SubjectDetail />} />
      </Routes>

      <Footer />
    </AuthContext.Provider>
  );
};

const App = () => (
  <Router>
    <AppInner />
  </Router>
);

export default App;
