import React, { useState } from 'react';
import './AIAssistant.css';

const AIAssistant = ({ subject, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Xin chào! Tôi là AI trợ giảng cho môn ${subject.name}. Tôi có thể giúp bạn:\n\n• Giải thích các khái niệm khó hiểu\n• Tóm tắt bài học\n• Gợi ý bài tập phù hợp\n• Trả lời câu hỏi của bạn\n\nHãy đặt câu hỏi bất kỳ nào bạn muốn!`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, subject);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question, subject) => {
    const responses = {
      'toán học': [
        "Đây là một câu hỏi rất hay về toán học! Để giải quyết vấn đề này, chúng ta cần áp dụng các công thức và phương pháp phù hợp...",
        "Tôi hiểu bạn đang gặp khó khăn với phần này. Hãy để tôi giải thích từng bước một cách chi tiết...",
        "Đây là một khái niệm quan trọng trong toán học. Tôi sẽ tóm tắt lại và đưa ra ví dụ minh họa..."
      ],
      'vật lý': [
        "Câu hỏi này liên quan đến các định luật vật lý cơ bản. Hãy để tôi phân tích và giải thích...",
        "Đây là một hiện tượng vật lý thú vị! Tôi sẽ giúp bạn hiểu rõ hơn về nguyên lý hoạt động...",
        "Để hiểu được vấn đề này, chúng ta cần nắm vững các khái niệm cơ bản về lực và chuyển động..."
      ],
      'hóa học': [
        "Đây là một phản ứng hóa học quan trọng. Tôi sẽ giải thích cơ chế và các yếu tố ảnh hưởng...",
        "Câu hỏi này liên quan đến cấu trúc phân tử. Hãy để tôi phân tích chi tiết...",
        "Để hiểu được vấn đề này, chúng ta cần nắm vững các nguyên tắc cơ bản của hóa học..."
      ],
      'sinh học': [
        "Đây là một quá trình sinh học phức tạp. Tôi sẽ giải thích từng bước một cách dễ hiểu...",
        "Câu hỏi này liên quan đến cấu trúc tế bào. Hãy để tôi phân tích chi tiết...",
        "Để hiểu được vấn đề này, chúng ta cần nắm vững các khái niệm cơ bản về di truyền học..."
      ]
    };

    const subjectKey = subject.name.toLowerCase();
    const possibleResponses = responses[subjectKey] || responses['toán học'];
    return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <div className="ai-info">
          <div className="ai-avatar">🤖</div>
          <div>
            <h3>AI Trợ giảng - {subject.name}</h3>
            <p>Đang hoạt động</p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="ai-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="ai-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Đặt câu hỏi của bạn..."
          rows="3"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="send-btn"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
