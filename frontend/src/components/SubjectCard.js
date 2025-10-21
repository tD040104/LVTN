import React from "react";
import "./SubjectCard.css";

const SubjectCard = ({ subject, onSelect = () => {} }) => {
  const progress = subject.progress || 0;
  const completedChapters = subject.completedChapters || 0;
  const totalChapters = subject.chapters?.length || 0;

  return (
      <div
        className="subject-card"
        style={{ "--subject-color": subject.color }}
        onClick={() => onSelect(subject)}
      >
      <div className="subject-header">
        <div className="subject-icon" style={{ backgroundColor: subject.color }}>
          {subject.icon}
        </div>
        <div className="subject-info">
          <h3 className="subject-name">{subject.name}</h3>
          <p className="subject-description">{subject.description}</p>
        </div>
      </div>

      <div className="subject-stats">
        <div className="stat">
          <span className="stat-label">Chương</span>
          <span className="stat-value">
            {completedChapters}/{totalChapters}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Tiến độ</span>
          <span className="stat-value">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="subject-actions">
        <button className="study-btn" onClick={(e) => {
          e.stopPropagation(); // ✅ tránh kích hoạt onClick của thẻ cha
          onSelect(subject, "study"); // ✅ truyền type hành động
        }}>
          Học ngay
        </button>

        <button className="quiz-btn" onClick={(e) => {
          e.stopPropagation();
          onSelect(subject, "quiz"); // ✅ truyền type hành động
        }}>
          Kiểm tra
        </button>
      </div>

    </div>
  );
};

export default SubjectCard;
