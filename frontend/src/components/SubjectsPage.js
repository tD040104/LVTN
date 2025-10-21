// src/components/SubjectsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { subjects as localSubjects } from '../data/subjects';
import SubjectCard from './SubjectCard';
import Quiz from './Quiz';
import SearchAndFilter from './SearchAndFilter';
import './SubjectsPage.css';


const SubjectsPage = ({ onSubjectSelect = null, onBack }) => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [modalQuizSubject, setModalQuizSubject] = useState(null);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Gọi API lấy danh sách môn học từ backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subjects');
        console.log('✅ Dữ liệu môn học:', res.data);
        if (res.data && res.data.length > 0) {
          setSubjects(res.data);
        } else {
          console.warn('No subjects from backend, falling back to local data');
          setSubjects(localSubjects);
        }
      } catch (err) {
        console.error('❌ Lỗi khi tải môn học:', err);
        // fallback to local data so UI remains usable
        setSubjects(localSubjects);
        setError('Không thể tải danh sách môn học từ server, đang hiển thị dữ liệu mẫu.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // 🔸 Mock dữ liệu category & độ khó
  const getSubjectCategory = (subject) => {
    if (subject.name.includes('Toán')) return 'math';
    if (['Vật lý', 'Hóa học', 'Sinh học'].includes(subject.name)) return 'science';
    return 'other';
  };

  const getSubjectDifficulty = (subject) => {
    const map = { 'Toán học': 'beginner', 'Vật lý': 'intermediate', 'Hóa học': 'intermediate', 'Sinh học': 'advanced' };
    return map[subject.name] || 'beginner';
  };

  // 🔸 Bộ lọc danh mục & độ khó
  const categories = [
    { id: 'all', name: 'Tất cả môn học', count: subjects.length },
    { id: 'math', name: 'Toán học', count: subjects.filter(s => s.name.includes('Toán')).length },
    { id: 'science', name: 'Khoa học', count: subjects.filter(s => ['Vật lý', 'Hóa học', 'Sinh học'].includes(s.name)).length }
  ];

  const difficultyLevels = [
    { id: 'all', name: 'Tất cả cấp độ', color: '#667eea' },
    { id: 'beginner', name: 'Cơ bản', color: '#4CAF50' },
    { id: 'intermediate', name: 'Trung bình', color: '#FF9800' },
    { id: 'advanced', name: 'Nâng cao', color: '#f44336' }
  ];

  // 🔸 Áp dụng bộ lọc & sắp xếp
  const filteredAndSortedSubjects = (filteredSubjects.length > 0 ? filteredSubjects : subjects)
    .filter(subject => {
      const categoryMatch = selectedCategory === 'all' || getSubjectCategory(subject) === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || getSubjectDifficulty(subject) === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleSearch = (term) => setSearchTerm(term);

  // 🔹 Loading
  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  // 🔹 Lỗi
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="subjects-page">
      <div className="subjects-header">
        {onBack && (
          <button className="back-btn" onClick={onBack}>← Quay lại</button>
        )}
        <div className="header-content">
          <h1>📚 Môn học</h1>
          <p>Khám phá và chọn môn học phù hợp với bạn</p>
        </div>
      </div>

      <div className="subjects-content">
        <div className="subjects-sidebar">
          <div className="sidebar-section">
            <h3>Danh mục</h3>
            <div className="category-list">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Cấp độ</h3>
            <div className="difficulty-list">
              {difficultyLevels.map(level => (
                <button
                  key={level.id}
                  className={`difficulty-item ${selectedDifficulty === level.id ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty(level.id)}
                >
                  <div className="difficulty-dot" style={{ backgroundColor: level.color }}></div>
                  <span>{level.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="subjects-main">
          <div className="search-section">
            <SearchAndFilter
              subjects={subjects}
              onFilteredSubjects={setFilteredSubjects}
              onSearch={handleSearch}
            />
          </div>

          <div className="subjects-grid">
            {filteredAndSortedSubjects.length > 0 ? (
              filteredAndSortedSubjects.map(subject => (
                <SubjectCard
                  key={subject._id || subject.id}
                  subject={subject}
                  onSelect={(subjectItem, action) => {
                    // Guard: only call onSubjectSelect if it's a function
                    if (action === "study") {
                      if (typeof onSubjectSelect === 'function') {
                        onSubjectSelect(subjectItem);
                      } else {
                        // If no handler provided, navigate to the subject detail route
                        navigate(`/subject/${subjectItem._id || subjectItem.id}`);
                      }
                    }
                    if (action === "quiz") {
                      // open quiz modal in-place
                      setModalQuizSubject(subjectItem);
                    }
                  }}
                />
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">⚠️</div>
                <h3>Chưa có dữ liệu môn học để hiển thị.</h3>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalQuizSubject && (
        <Quiz
          subject={modalQuizSubject}
          onClose={() => setModalQuizSubject(null)}
          onComplete={() => setModalQuizSubject(null)}
        />
      )}
    </div>
  );
};

export default SubjectsPage;
