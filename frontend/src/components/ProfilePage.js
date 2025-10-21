import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import axios from 'axios';

const ProfilePage = () => {
  const { user, setUser, setIsLoggedIn, setTheme } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const [subjectsMap, setSubjectsMap] = useState({});
  const [error, setError] = useState(null);
  const [passError, setPassError] = useState(null);
  const [passSuccess, setPassSuccess] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: '',
    level: '',
    phone: '',
    website: '',
    address: { street: '', city: '', state: '', zip: '' },
    notifications: { email: true, push: true, studyReminder: true, achievement: true },
    preferences: { theme: 'light', language: 'vi', aiAssistant: true, autoSave: true, showProgress: true },
    privacy: { showProfile: true, showProgress: true, allowMessages: true }
  });
  const avatars = ['👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🤖', '👾', '🎭'];
  const levels = ['Sinh viên','Học sinh','Giáo viên','Nghiên cứu sinh'];
  const navigate = useNavigate();

  const fetchData = async () => {
    setError(null);
    try {
      setLoading(true);
      // refresh user from backend if possible
      let fresh = currentUser;
      if (user && user._id) {
        const res = await axios.get(`http://localhost:5000/users/${user._id}`);
        fresh = res.data;
        setCurrentUser(fresh);
        // also update global user and localStorage
        if (setUser) setUser(fresh);
        try { localStorage.setItem('user', JSON.stringify(fresh)); } catch (e) {}
      }

      // fetch subjects map
      try {
        const sres = await axios.get('http://localhost:5000/api/subjects');
        const map = {};
        (sres.data || []).forEach(s => { map[String(s._id)] = s.name; });
        setSubjectsMap(map);
      } catch (e) {
        console.warn('Không thể tải danh sách môn:', e?.message || e);
      }
    } catch (err) {
      console.error('Lỗi khi tải hồ sơ:', err);
      setError('Không thể tải hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debug: log context user and localStorage
    try { console.log('[ProfilePage] context user:', user); } catch (e) {}
    try { console.log('[ProfilePage] localStorage user:', localStorage.getItem('user')); } catch (e) {}

    // if context user is missing, try to read from localStorage first
    if (!user) {
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw);
          setCurrentUser(parsed);
        }
      } catch (e) {
        console.warn('Error parsing localStorage user', e);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    try { localStorage.removeItem('user'); } catch (e) {}
    if (setUser) setUser(null);
    if (setIsLoggedIn) setIsLoggedIn(false);
    navigate('/');
  };

  const startEdit = () => {
    setForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      avatar: currentUser.avatar || '',
      level: currentUser.level || ''
      , phone: currentUser.phone || ''
      , website: currentUser.website || ''
      , address: currentUser.address || { street: '', city: '', state: '', zip: '' }
      , notifications: currentUser.notifications || { email: true, push: true, studyReminder: true, achievement: true }
      , preferences: currentUser.preferences || { theme: 'light', language: 'vi', aiAssistant: true, autoSave: true, showProgress: true }
      , privacy: currentUser.privacy || { showProfile: true, showProgress: true, allowMessages: true }
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPassError(null);
    setPassSuccess(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // support nested address fields
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, address: { ...(prev.address || {}), [key]: value } }));
      return;
    }

    // support nested toggles path like preferences.theme or notifications.email
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setForm(prev => ({ ...prev, [section]: { ...(prev[section] || {}), [field]: e.target.type === 'checkbox' ? e.target.checked : value } }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  // when theme selection changes, apply immediately
  useEffect(() => {
    if (form && form.preferences && form.preferences.theme && setTheme) {
      setTheme(form.preferences.theme);
    }
  }, [form.preferences?.theme]);

  const saveProfile = async () => {
    if (!currentUser || !currentUser._id) return;
    try {
      setLoading(true);
      // send a flattened payload for allowed fields; backend allows specific keys
      const payload = {
        name: form.name,
        email: form.email,
        avatar: form.avatar,
        level: form.level,
        phone: form.phone,
        website: form.website,
        address: form.address
      };
      const res = await axios.patch(`http://localhost:5000/api/users/${currentUser._id}`, payload);
      setCurrentUser(res.data);
      if (setUser) setUser(res.data);
      try { localStorage.setItem('user', JSON.stringify(res.data)); } catch (e) {}
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      setError('Không thể cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setPassError(null);
    setPassSuccess(null);
    if (!currentUser || !currentUser._id) return setPassError('Không xác định người dùng');
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) return setPassError('Vui lòng điền đầy đủ');
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) return setPassError('Mật khẩu mới không khớp');
    if (passwordForm.newPassword.length < 8) return setPassError('Mật khẩu mới phải ít nhất 8 ký tự');

    try {
      setChangingPassword(true);
      const res = await axios.patch(`http://localhost:5000/api/users/${currentUser._id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPassSuccess('Đổi mật khẩu thành công');
      // update local user in case backend returned user
      if (res.data && res.data.user) {
        setCurrentUser(res.data.user);
        if (setUser) setUser(res.data.user);
        try { localStorage.setItem('user', JSON.stringify(res.data.user)); } catch (e) {}
      }
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      console.error('Change password failed', err);
      const msg = err?.response?.data?.error || err?.message || 'Lỗi khi đổi mật khẩu';
      setPassError(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <div className="profile-page"><div className="profile-card">Đang tải hồ sơ...</div></div>;

  if (error) return <div className="profile-page"><div className="profile-card">{error}</div></div>;

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Không tìm thấy hồ sơ</h2>
          <p>Vui lòng đăng nhập để xem hồ sơ.</p>
        </div>
      </div>
    );
  }

  const sp = currentUser.studyProgress || {};

  return (
    <div className="profile-page">
      <div className="profile-card profile-grid">
        <aside className="sidebar">
          <div className="sidebar-inner">
            <div className="avatar-large big">{currentUser.avatar || '👤'}</div>
            <h3 className="sidebar-name">{currentUser.name || 'Người dùng'}</h3>
            <p className="sidebar-email">{currentUser.email || ''}</p>
            <div className="about">
              <h4>About</h4>
              <p>Chào! Tôi là {currentUser.name || 'người dùng'}. Đây là trang hồ sơ của tôi.</p>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="form-header">
            <h2>Personal Details</h2>
            <div className="header-actions">
              {!editing ? (
                <button className="edit-btn" onClick={startEdit}>Edit</button>
              ) : (
                <>
                  <button className="edit-btn" onClick={saveProfile} disabled={loading}>Update</button>
                  <button className="logout-btn" onClick={cancelEdit}>Cancel</button>
                </>
              )}
            </div>
          </div>

          <div className="two-col">
            <div className="col">
              <label>Full Name</label>
              <input name="name" value={editing ? form.name : (currentUser.name || '')} onChange={handleFormChange} readOnly={!editing} />
            </div>

            <div className="col">
              <label>Email</label>
              <input name="email" value={editing ? form.email : (currentUser.email || '')} onChange={handleFormChange} readOnly={!editing} />

              <div className="avatar-level-row">
                <div className="avatar-field">
                  <label>Avatar</label>
                  {editing ? (
                    <div className="avatar-selection">
                      {avatars.map(a => (
                        <button key={a} type="button" className={`avatar-option ${form.avatar === a ? 'selected' : ''}`} onClick={() => setForm(prev => ({ ...prev, avatar: a }))}>
                          {a}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input name="avatar" value={(currentUser.avatar || '')} readOnly />
                  )}
                </div>

                <div className="level-field">
                  <label>Cấp độ</label>
                  {editing ? (
                    <select name="level" value={form.level} onChange={handleFormChange} className="form-select">
                      {levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  ) : (
                    <input name="level" value={(currentUser.level || '')} readOnly />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications / Preferences / Privacy sections (from Settings) */}
          <div className="settings-sections">
            <h3>Thông báo</h3>
            {editing ? (
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info"><h4>Email thông báo</h4><p>Nhận thông báo qua email</p></div>
                  <label className="toggle-switch"><input type="checkbox" name="notifications.email" checked={!!form.notifications.email} onChange={handleFormChange} /><span className="slider"></span></label>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info"><h4>Thông báo đẩy</h4><p>Nhận thông báo trên thiết bị</p></div>
                  <label className="toggle-switch"><input type="checkbox" name="notifications.push" checked={!!form.notifications.push} onChange={handleFormChange} /><span className="slider"></span></label>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info"><h4>Nhắc nhở học tập</h4><p>Nhắc nhở thời gian học tập hàng ngày</p></div>
                  <label className="toggle-switch"><input type="checkbox" name="notifications.studyReminder" checked={!!form.notifications.studyReminder} onChange={handleFormChange} /><span className="slider"></span></label>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info"><h4>Thông báo thành tích</h4><p>Thông báo khi đạt thành tích mới</p></div>
                  <label className="toggle-switch"><input type="checkbox" name="notifications.achievement" checked={!!form.notifications.achievement} onChange={handleFormChange} /><span className="slider"></span></label>
                </div>
              </div>
            ) : (
              <div className="toggle-summary">
                <p>Email: {currentUser.notifications?.email ? 'Bật' : 'Tắt'}</p>
                <p>Push: {currentUser.notifications?.push ? 'Bật' : 'Tắt'}</p>
              </div>
            )}

            <h3>Tùy chọn</h3>
            {editing ? (
              <div className="form-group">
                <label>Chủ đề</label>
                <select name="preferences.theme" value={form.preferences.theme} onChange={handleFormChange} className="form-select">
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                  <option value="blue">Xanh dương</option>
                  <option value="green">Xanh lá</option>
                </select>
              </div>
            ) : (
              <p>Theme: {currentUser.preferences?.theme || 'light'}</p>
            )}

            <h3>Quyền riêng tư</h3>
            {editing ? (
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info"><h4>Hiển thị hồ sơ</h4><p>Cho phép người khác xem hồ sơ của bạn</p></div>
                  <label className="toggle-switch"><input type="checkbox" name="privacy.showProfile" checked={!!form.privacy.showProfile} onChange={handleFormChange} /><span className="slider"></span></label>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info"><h4>Hiển thị tiến độ</h4><p>Cho phép người khác xem tiến độ học tập</p></div>
                  <label className="toggle-switch"><input type="checkbox" name="privacy.showProgress" checked={!!form.privacy.showProgress} onChange={handleFormChange} /><span className="slider"></span></label>
                </div>
              </div>
            ) : (
              <p>Show profile: {currentUser.privacy?.showProfile ? 'Bật' : 'Tắt'}</p>
            )}
          </div>

          {/* Change password section */}
          <div className="password-section">
            <h3>Đổi mật khẩu</h3>
            <div className="password-form">
              <label>Mật khẩu hiện tại</label>
              <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChangeInput} />

              <label>Mật khẩu mới</label>
              <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChangeInput} />

              <label>Xác nhận mật khẩu mới</label>
              <input type="password" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChangeInput} />

              {passError && <div className="form-error">{passError}</div>}
              {passSuccess && <div className="form-success">{passSuccess}</div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="edit-btn" onClick={changePassword} disabled={changingPassword}>{changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}</button>
                <button className="logout-btn" onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })}>Clear</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
