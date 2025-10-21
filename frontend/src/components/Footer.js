import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Trang chủ', href: '#home' },
    { name: 'Môn học', href: '#subjects' },
    { name: 'Kiểm tra', href: '#quiz' },
    { name: 'Tiến độ', href: '#progress' },
    { name: 'Thành tích', href: '#achievements' }
  ];

  const features = [
    { name: 'AI Trợ giảng', href: '#ai' },
    { name: 'Quiz Trắc nghiệm', href: '#quiz' },
    { name: 'Theo dõi tiến độ', href: '#progress' },
    { name: 'Hệ thống thành tích', href: '#achievements' },
    { name: 'Cá nhân hóa', href: '#personalization' }
  ];

  const support = [
    { name: 'Trung tâm trợ giúp', href: '#help' },
    { name: 'Hướng dẫn sử dụng', href: '#guide' },
    { name: 'Liên hệ hỗ trợ', href: '#contact' },
    { name: 'Báo lỗi', href: '#bug-report' },
    { name: 'Đề xuất tính năng', href: '#feature-request' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'YouTube', icon: '📺', href: '#' }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🎓</span>
              <h3>AI Study Assistant</h3>
            </div>
            <p className="footer-description">
              Nền tảng học tập trực tuyến tích hợp AI trợ giảng, giúp bạn học tập hiệu quả hơn 
              với các tính năng thông minh và cá nhân hóa.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="social-link"
                  title={social.name}
                >
                  <span className="social-icon">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h4>Liên kết nhanh</h4>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Tính năng</h4>
            <ul className="footer-links">
              {features.map((feature, index) => (
                <li key={index}>
                  <a href={feature.href} className="footer-link">
                    {feature.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              {support.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="footer-link">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Liên hệ</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@aistudy.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>1900-1234</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Hà Nội, Việt Nam</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <span>www.aistudy.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} AI Study Assistant. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="footer-legal">
              <a href="#privacy" className="legal-link">Chính sách bảo mật</a>
              <a href="#terms" className="legal-link">Điều khoản sử dụng</a>
              <a href="#cookies" className="legal-link">Chính sách Cookie</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </footer>
  );
};

export default Footer;
