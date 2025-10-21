import React from 'react';
import './HomePageContent.css';

const HomePageContent = ({ user, onSubjectSelect, onQuizStart, onAchievementsClick }) => {
  const features = [
    {
      icon: '🤖',
      title: 'AI Trợ giảng thông minh',
      description: 'Trò chuyện với AI để được giải thích chi tiết các khái niệm khó hiểu, tóm tắt bài học và gợi ý bài tập phù hợp.',
      color: '#667eea'
    },
    {
      icon: '📝',
      title: 'Hệ thống kiểm tra trắc nghiệm',
      description: 'Luyện tập với các câu hỏi trắc nghiệm được tạo tự động, có timer và giải thích chi tiết cho mỗi câu trả lời.',
      color: '#4CAF50'
    },
    {
      icon: '📊',
      title: 'Theo dõi tiến độ học tập',
      description: 'Xem chi tiết tiến độ học tập, thống kê điểm số và thành tích của bạn một cách trực quan và dễ hiểu.',
      color: '#FF9800'
    },
    {
      icon: '🎯',
      title: 'Cá nhân hóa nội dung',
      description: 'Nội dung học tập được điều chỉnh theo nhu cầu và trình độ cá nhân của từng người học.',
      color: '#9C27B0'
    },
    {
      icon: '🏆',
      title: 'Hệ thống thành tích',
      description: 'Mở khóa các thành tích và huy hiệu khi hoàn thành các thử thách học tập.',
      color: '#FFD700'
    },
    {
      icon: '🔍',
      title: 'Tìm kiếm thông minh',
      description: 'Tìm kiếm nhanh chóng các môn học, chương và chủ đề với bộ lọc đa tiêu chí.',
      color: '#00BCD4'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Sinh viên', icon: '👨‍🎓' },
    { number: '50+', label: 'Môn học', icon: '📚' },
    { number: '10K+', label: 'Câu hỏi', icon: '❓' },
    { number: '95%', label: 'Hài lòng', icon: '⭐' }
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: 'Sinh viên Đại học Bách Khoa',
      content: 'AI trợ giảng giúp tôi hiểu rõ hơn các khái niệm phức tạp. Rất hữu ích!',
      avatar: '👨‍🎓',
      rating: 5
    },
    {
      name: 'Trần Thị B',
      role: 'Học sinh THPT',
      content: 'Hệ thống kiểm tra trắc nghiệm giúp tôi ôn tập hiệu quả hơn rất nhiều.',
      avatar: '👩‍🎓',
      rating: 5
    },
    {
      name: 'Lê Văn C',
      role: 'Sinh viên Đại học Kinh tế',
      content: 'Giao diện đẹp, dễ sử dụng và có nhiều tính năng thú vị.',
      avatar: '👨‍💼',
      rating: 4
    }
  ];

  return (
    <div className="home-content">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-particles"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Học tập thông minh với
              <span className="gradient-text"> AI Study Assistant</span>
            </h1>
            <p className="hero-description">
              Nền tảng học tập trực tuyến tích hợp AI trợ giảng, giúp bạn học tập hiệu quả hơn 
              với các tính năng thông minh và cá nhân hóa.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onSubjectSelect()}>
                <span>🚀</span> Bắt đầu học ngay
              </button>
              <button className="btn-secondary" onClick={() => onQuizStart()}>
                <span>📝</span> Làm bài kiểm tra
              </button>
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="floating-card card-1">
                <div className="card-icon">🤖</div>
                <div className="card-text">AI Trợ giảng</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">📊</div>
                <div className="card-text">Theo dõi tiến độ</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">🏆</div>
                <div className="card-text">Thành tích</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Tính năng nổi bật</h2>
            <p>Khám phá các tính năng giúp bạn học tập hiệu quả hơn</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ '--feature-color': feature.color }}>
                <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>Cách thức hoạt động</h2>
            <p>Chỉ với 3 bước đơn giản để bắt đầu học tập</p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Chọn môn học</h3>
                <p>Chọn môn học bạn muốn học từ danh sách các môn có sẵn</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Học với AI</h3>
                <p>Trò chuyện với AI trợ giảng để hiểu rõ các khái niệm</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Kiểm tra kiến thức</h3>
                <p>Làm bài kiểm tra để đánh giá và củng cố kiến thức</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Phản hồi từ người dùng</h2>
            <p>Những gì sinh viên nói về chúng tôi</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="quote-icon">"</div>
                  <p className="testimonial-text">{testimonial.content}</p>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">⭐</span>
                    ))}
                  </div>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng bắt đầu hành trình học tập?</h2>
            <p>Tham gia cùng hàng nghìn sinh viên đang sử dụng AI Study Assistant</p>
            <div className="cta-actions">
              <button className="btn-primary" onClick={() => onSubjectSelect()}>
                <span>🎓</span> Bắt đầu học ngay
              </button>
              <button className="btn-outline" onClick={() => onAchievementsClick()}>
                <span>🏆</span> Xem thành tích
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageContent;
