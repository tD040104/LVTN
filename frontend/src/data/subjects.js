// src/data/subjects.js

export const subjects = [
    {
      id: 1,
      name: "Toán học",
      description: "Các bài học về số học, đại số, hình học.",
      chapters: ["Số học", "Đại số", "Hình học"],
    },
    {
      id: 2,
      name: "Vật lý",
      description: "Các bài học về cơ học, điện học, quang học.",
      chapters: ["Cơ học", "Điện học", "Quang học"],
    },
    {
      id: 3,
      name: "Tin học",
      description: "Các bài học về lập trình, hệ điều hành và mạng.",
      chapters: ["Lập trình", "Hệ điều hành", "Mạng máy tính"],
    },
  ];
  
  export const quizQuestions = {
    1: [
      { question: "2 + 2 = ?", options: ["3", "4", "5"], answer: "4" },
      { question: "Căn bậc hai của 9 là?", options: ["2", "3", "4"], answer: "3" },
    ],
    2: [
      { question: "Lực hấp dẫn do ai phát hiện?", options: ["Newton", "Einstein"], answer: "Newton" },
    ],
    3: [
      { question: "HTML là viết tắt của?", options: ["HyperText Markup Language", "HighText Machine Language"], answer: "HyperText Markup Language" },
    ],
  };
  
  export const userProfile = {
    name: "Ngô Công Tuyến",
    email: "tuyen@example.com",
    level: 5,
    points: 1500,
    avatar: "👨‍🎓",
    studyProgress: {
      1: { completedChapters: ["Số học"] },
      2: { completedChapters: [] },
      3: { completedChapters: [] },
    },
  };
  