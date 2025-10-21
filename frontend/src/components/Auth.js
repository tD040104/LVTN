import React, { useState } from 'react';
import './Auth.css';
import axios from 'axios';

const Auth = ({ onLogin, onClose, showRegister = false }) => {
  const [isLogin, setIsLogin] = useState(!showRegister);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '👨‍🎓',
    level: 'Sinh viên'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const avatars = ['👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🤖', '👾', '🎭'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Tên là bắt buộc';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        onLogin(res.data);
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          avatar: formData.avatar,
          level: formData.level
        });
        onLogin(res.data);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ form: error.response?.data?.error || 'Lỗi đăng nhập/đăng ký' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Mock Google sign-in for dev: create a simple user object
      await new Promise(r => setTimeout(r, 800));
      const demo = {
        _id: `local-${Date.now()}`,
        name: 'Google User',
        email: `google.user.${Date.now()}@example.com`,
        avatar: '🟢',
        level: 'Sinh viên',
        points: 0,
        achievements: [],
        studyProgress: {}
      };
      onLogin(demo);
    } catch (err) {
      console.error('Google sign-in mock failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar: '👨‍🎓',
      level: 'Sinh viên'
    });
    setErrors({});
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="auth-content">
          <div className="auth-tabs">
            <button 
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Đăng nhập
            </button>
            <button 
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label>Tên đầy đủ</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Nhập tên của bạn"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Nhập email của bạn"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Nhập mật khẩu"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                <div className="form-group">
                  <label>Avatar</label>
                  <div className="avatar-selection">
                    {avatars.map(avatar => (
                      <button
                        key={avatar}
                        type="button"
                        className={`avatar-option ${formData.avatar === avatar ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Cấp độ</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Sinh viên">Sinh viên</option>
                    <option value="Học sinh">Học sinh</option>
                    <option value="Giáo viên">Giáo viên</option>
                    <option value="Nghiên cứu sinh">Nghiên cứu sinh</option>
                  </select>
                </div>
              </>
            )}

            {errors.form && (
              <div className="auth-error" style={{ color: 'var(--danger, #f44336)', padding: '0.75rem 1rem' }}>
                {errors.form}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                isLogin ? 'Đăng nhập' : 'Đăng ký'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button 
                type="button" 
                className="switch-btn"
                onClick={switchMode}
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
            <div className="social-signin">
              <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
                Đăng nhập với Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
