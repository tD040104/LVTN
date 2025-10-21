import React, { useState, useEffect } from 'react';
import './SearchAndFilter.css';

const SearchAndFilter = ({ subjects, onFilteredSubjects, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedProgress, setSelectedProgress] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const levels = [
    { id: 'all', name: 'Tất cả cấp độ' },
    { id: 'beginner', name: 'Cơ bản' },
    { id: 'intermediate', name: 'Trung bình' },
    { id: 'advanced', name: 'Nâng cao' }
  ];

  const progressOptions = [
    { id: 'all', name: 'Tất cả tiến độ' },
    { id: 'not-started', name: 'Chưa bắt đầu' },
    { id: 'in-progress', name: 'Đang học' },
    { id: 'completed', name: 'Hoàn thành' }
  ];

  const sortOptions = [
    { id: 'name', name: 'Tên môn học' },
    { id: 'progress', name: 'Tiến độ' },
    { id: 'recent', name: 'Gần đây' },
    { id: 'difficulty', name: 'Độ khó' }
  ];

  useEffect(() => {
    let filtered = [...subjects];

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.chapters.some(chapter =>
          chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.topics.some(topic =>
            topic.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }

    // Lọc theo cấp độ (giả lập)
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(subject => {
        // Giả lập cấp độ dựa trên ID môn học
        const levelMap = {
          'beginner': [1, 2], // Toán, Vật lý
          'intermediate': [3], // Hóa học
          'advanced': [4] // Sinh học
        };
        return levelMap[selectedLevel]?.includes(subject.id);
      });
    }

    // Lọc theo tiến độ
    if (selectedProgress !== 'all') {
      filtered = filtered.filter(subject => {
        const progress = subject.progress || 0;
        switch (selectedProgress) {
          case 'not-started':
            return progress === 0;
          case 'in-progress':
            return progress > 0 && progress < 100;
          case 'completed':
            return progress === 100;
          default:
            return true;
        }
      });
    }

    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'recent':
          return b.lastStudied?.localeCompare(a.lastStudied) || 0;
        case 'difficulty':
          return a.id - b.id; // Giả lập độ khó theo ID
        default:
          return 0;
      }
    });

    onFilteredSubjects(filtered);
  }, [searchTerm, selectedLevel, selectedProgress, sortBy, subjects, onFilteredSubjects]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevel('all');
    setSelectedProgress('all');
    setSortBy('name');
  };

  return (
    <div className="search-filter-container">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Tìm kiếm môn học, chương, chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <span className="search-icon">🔍</span>
            </button>
          </div>
        </form>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Cấp độ:</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            {levels.map(level => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Tiến độ:</label>
          <select
            value={selectedProgress}
            onChange={(e) => setSelectedProgress(e.target.value)}
            className="filter-select"
          >
            {progressOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sắp xếp:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          <span>🗑️</span> Xóa bộ lọc
        </button>
      </div>

      <div className="search-results-info">
        <span className="results-count">
          Tìm thấy {subjects.length} môn học
        </span>
        {searchTerm && (
          <span className="search-term">
            cho từ khóa: "<strong>{searchTerm}</strong>"
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
