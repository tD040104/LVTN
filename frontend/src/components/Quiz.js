import React, { useState, useEffect } from "react";
import axios from "axios";
import { quizQuestions as localQuizQuestions } from '../data/subjects';
import "./Quiz.css";

const Quiz = ({ subject, onClose, onComplete, user: propUser }) => {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Lấy câu hỏi từ backend (theo subject._id)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        let data = [];

        if (subject?._id) {
          // fetch from backend
          const res = await axios.get(`http://localhost:5000/api/quiz/${subject._id}`);
          data = res.data || [];
        } else if (subject?.id && localQuizQuestions[subject.id]) {
          // fallback to local sample questions by numeric id
          data = localQuizQuestions[subject.id];
        } else {
          // no source for questions
          data = [];
        }

        // Normalize questions: ensure fields { question, options: [], answer: string, explanation }
        const normalized = (data || []).map(q => {
          const options = q.options || q.choices || [];
          let answer = q.answer;

          // support numeric correctAnswer index
          if ((q.correctAnswer || q.correctAnswer === 0) && Array.isArray(options)) {
            const idx = Number(q.correctAnswer);
            answer = options[idx];
          }

          // sometimes backend stores answer as index
          if ((typeof answer === 'number' || typeof answer === 'string') && Array.isArray(options)) {
            if (!isNaN(Number(answer)) && options[Number(answer)]) {
              answer = options[Number(answer)];
            }
          }

          return {
            question: q.question || q.title || '',
            options: options,
            answer: answer,
            explanation: q.explanation || q.explain || '',
            timeLimit: q.timeLimit || q.time || 30,
            raw: q
          };
        });

        if (!normalized.length) {
          setError(`Không có câu hỏi cho môn ${subject?.name || ''}`);
        }

        setQuestionsData(normalized);
      } catch (err) {
        console.error("❌ Lỗi khi tải câu hỏi:", err);
        setError("Không thể tải câu hỏi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subject]);

  const currentQuestion = questionsData[currentQuestionIndex];

  // reset timer when question changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.timeLimit) {
      setTimeLeft(currentQuestion.timeLimit);
    } else {
      setTimeLeft(30);
    }
  }, [currentQuestionIndex, currentQuestion]);

  // ⏰ Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswerSubmit();
    }
  }, [timeLeft, showResult, quizCompleted]);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);

    const currentQ = questionsData[currentQuestionIndex];
    if (currentQ.answer === currentQ.options[selectedAnswer]) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
      const total = questionsData.length;
      if (onComplete) onComplete(score, total);

      // Send progress to backend if we have a logged-in user
      (async () => {
        try {
          let user = propUser;
          if (!user) {
            const raw = localStorage.getItem('user');
            user = raw ? JSON.parse(raw) : null;
          }
          if (user && user._id) {
            const res = await axios.post(`http://localhost:5000/api/users/${user._id}/progress`, {
              subjectId: subject._id || subject.id,
              score,
              total
            });
            // update local stored user (points / studyProgress)
            try { localStorage.setItem('user', JSON.stringify(res.data)); } catch (e) {}
          }
        } catch (err) {
          console.warn('Không thể cập nhật tiến độ:', err?.response?.data || err.message || err);
        }
      })();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questionsData.length) * 100;
    if (percentage >= 80) return "Xuất sắc! 🎉";
    if (percentage >= 60) return "Tốt! 👍";
    if (percentage >= 40) return "Cần cố gắng thêm! 💪";
    return "Hãy ôn tập lại! 📚";
  };

  // ⏳ Hiển thị khi đang tải
  if (loading) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container">
          <h2>Đang tải câu hỏi...</h2>
        </div>
      </div>
    );
  }

  // ⚠️ Hiển thị lỗi hoặc không có câu hỏi
  if (error || !questionsData.length) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container">
          <h2>{error || `Không có câu hỏi cho môn ${subject?.name}`}</h2>
          <button className="close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // 🎯 Kết thúc quiz
  if (quizCompleted) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container">
          <div className="quiz-complete">
            <div className="complete-icon">🎯</div>
            <h2>Hoàn thành bài kiểm tra!</h2>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/{questionsData.length}</span>
              </div>
              <p className="score-message">{getScoreMessage()}</p>
            </div>
            <div className="quiz-actions">
              <button className="restart-btn" onClick={handleRestart}>
                Làm lại
              </button>
              <button className="close-btn" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🎮 Giao diện làm bài
  return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-info">
              <h2>Kiểm tra - {subject.name}</h2>
              <p>
                Câu {currentQuestionIndex + 1} / {questionsData.length}
                {currentQuestion?.raw?.seq && (
                  <> — ID: {currentQuestion.raw.seq}</>
                )}
              </p>
            </div>
          <div className="quiz-timer">
            <span className="timer-icon">⏰</span>
            <span className="timer-text">{timeLeft}s</span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="quiz-progress">
          <div
            className="progress-bar"
            style={{ width: `${((currentQuestionIndex + 1) / questionsData.length) * 100}%` }}
          ></div>
        </div>

        <div className="question-container">
          <h3 className="question-text">{currentQuestion.question}</h3>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  showResult
                    ? option === currentQuestion.answer
                      ? "correct"
                      : index === selectedAnswer && option !== currentQuestion.answer
                      ? "incorrect"
                      : ""
                    : selectedAnswer === index
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          {showResult && currentQuestion.explanation && (
            <div className="result-explanation">
              <h4>Giải thích:</h4>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <div className="quiz-actions">
          {!showResult ? (
            <button
              className="submit-btn"
              onClick={handleAnswerSubmit}
              disabled={selectedAnswer === null}
            >
              Gửi câu trả lời
            </button>
          ) : (
            <button className="next-btn" onClick={handleNextQuestion}>
              {currentQuestionIndex < questionsData.length - 1 ? "Câu tiếp theo" : "Hoàn thành"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
