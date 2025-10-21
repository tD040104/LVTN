// Backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Middleware log HTTP

// ======================
// 🔌 KẾT NỐI MONGODB
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ======================
// 🧠 SCHEMAS
// ======================

// USER SCHEMA
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  level: { type: String },
  points: { type: Number, default: 0 },
  achievements: { type: Array, default: [] },
  studyProgress: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

// SUBJECT SCHEMA
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  color: String,
});
const Subject = mongoose.model("Subject", subjectSchema);

// QUESTION SCHEMA
const questionSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true }, // đáp án đúng (text)
  explanation: String,
});
const Question = mongoose.model("Question", questionSchema);

// ======================
// 📡 API ROUTES
// ======================

// TRANG CHỦ BACKEND
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to AI Study Assistant Backend!",
    server: "online",
    mongoStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
  });
});

// TEST BACKEND
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "✅ Backend is working correctly!" });
});

// KIỂM TRA TÌNH TRẠNG SERVER
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ======================
// 👤 USER ROUTES
// ======================

// Lấy toàn bộ user
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
});

// Lấy user theo ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user", details: err.message });
  }
});

// Tìm kiếm user theo tên
app.get("/users/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Missing 'name' query parameter" });
    const users = await User.find({ name: new RegExp(name, "i") });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to search users", details: err.message });
  }
});

// Tạo user mới
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Name and email are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
});

// Auth: register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, avatar, level } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, avatar, level });
    await user.save();
    const u = user.toObject();
    delete u.password;
    res.status(201).json(u);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register', details: err.message });
  }
});

// Auth: login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password || '');
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const u = { ...user };
    delete u.password;
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Update user progress for a subject
app.post('/api/users/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectId, score, total } = req.body;
    if (!subjectId) return res.status(400).json({ error: 'Missing subjectId' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Ensure studyProgress object
    if (!user.studyProgress) user.studyProgress = {};

    const sId = String(subjectId);
    const prev = user.studyProgress[sId] || { attempts: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, lastScore: 0, lastAttempt: null };

    const attempts = prev.attempts + 1;
    const totalCorrect = (prev.totalCorrect || 0) + (Number(score) || 0);
    const totalQuestions = (prev.totalQuestions || 0) + (Number(total) || 0);
    const lastScore = Number(score) || 0;
    const bestScore = Math.max(prev.bestScore || 0, lastScore);

    user.studyProgress[sId] = {
      attempts,
      totalCorrect,
      totalQuestions,
      lastScore,
      bestScore,
      lastAttempt: new Date()
    };

    // Optionally update points: + score or simple increment
    user.points = (user.points || 0) + (Number(score) || 0);

    await user.save();

    const u = user.toObject();
    delete u.password;
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress', details: err.message });
  }
});

// Update user profile (partial)
app.patch('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ['name', 'email', 'avatar', 'level', 'phone', 'website', 'address'];
    const updates = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }

    if (!Object.keys(updates).length) return res.status(400).json({ error: 'No valid fields to update' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // If email is being changed, ensure uniqueness
    if (updates.email && updates.email !== user.email) {
      const existing = await User.findOne({ email: updates.email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    Object.assign(user, updates);
    await user.save();

    const u = user.toObject();
    delete u.password;
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});

// Đổi mật khẩu người dùng
app.patch('/api/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing currentPassword or newPassword' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // If user has no password set (e.g. created by oauth or seed), disallow without migration
    if (!user.password) return res.status(400).json({ error: 'No password set for this user' });

    const match = await bcrypt.compare(currentPassword, user.password || '');
    if (!match) return res.status(401).json({ error: 'Current password is incorrect' });

    // basic validation for new password length
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    const u = user.toObject();
    delete u.password;
    res.json({ message: 'Password updated', user: u });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password', details: err.message });
  }
});

// ======================
// 📘 SUBJECT & QUIZ ROUTES
// ======================

// Lấy tất cả môn học
app.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách môn học", details: err.message });
  }
});

// Lấy môn học theo ID
app.get('/api/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) return res.status(404).json({ error: 'Môn học không tồn tại' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy môn học', details: err.message });
  }
});

// Lấy câu hỏi theo môn học (ID)
app.get("/api/quiz/:subjectId", async (req, res) => {
  try {
    const { subjectId } = req.params;
    // Fetch questions for this subject and sort by creation time to assign stable sequence
    // Be tolerant: subjectId in DB might be stored as ObjectId or as a string; try both
    let query;
    try {
      const objId = mongoose.Types.ObjectId(subjectId);
      query = { $or: [{ subjectId }, { subjectId: objId }] };
    } catch (e) {
      // not a valid ObjectId, fall back to matching the raw value
      query = { subjectId };
    }

    // debug: log query attempts
    console.log('[quiz] subjectId param:', subjectId);
    console.log('[quiz] running query:', JSON.stringify(query));
    const questions = await Question.find(query).sort({ createdAt: 1 }).lean();
    console.log('[quiz] matched questions count:', (questions || []).length);

    if (!questions || !questions.length) {
      // helpful debug message
      return res.status(404).json({ error: "Không tìm thấy câu hỏi cho môn học này", debug: { subjectId, query } });
    }

    // Add a per-subject incremental sequence number (seq) starting at 1
    const questionsWithSeq = questions.map((q, index) => ({
      ...q,
      seq: index + 1
    }));

    res.json(questionsWithSeq);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy câu hỏi", details: err.message });
  }
});

// Lấy tất cả câu hỏi (dùng cho list view)
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: 1 }).lean();
    const withSeq = questions.map((q, i) => ({ ...q, seq: i + 1 }));
    res.json(withSeq);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách câu hỏi', details: err.message });
  }
});

// ======================
// 🚀 KHỞI ĐỘNG SERVER
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const now = new Date();
  console.log("=======================================");
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  console.log(`⏰ Started at: ${now.toLocaleTimeString()} ${now.toLocaleDateString()}`);
  console.log("=======================================");
});
