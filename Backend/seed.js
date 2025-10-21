// Seed script to add sample subjects and questions
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const connect = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set. Please create a .env with MONGO_URI.');
  }
  await mongoose.connect(process.env.MONGO_URI);
};

const subjectSchema = new mongoose.Schema({ name: String, description: String, icon: String, color: String });
const Subject = mongoose.model('Subject', subjectSchema);

const questionSchema = new mongoose.Schema({ subjectId: mongoose.Schema.Types.Mixed, question: String, options: [String], answer: mongoose.Schema.Types.Mixed, explanation: String, timeLimit: Number, isActive: Boolean });
const Question = mongoose.model('Question', questionSchema);

const run = async () => {
  try {
    await connect();
    console.log('Connected to MongoDB');

    // Clear existing sample (optional)
    // await Subject.deleteMany({ name: /Lập trình C\+\+/i });

    const subject = await Subject.findOne({ name: 'Lập trình C++' }) || await Subject.create({
      _id: mongoose.Types.ObjectId('68f5e0f5d8a212c9405af0e4'),
      name: 'Lập trình C++',
      description: 'Học cách lập trình hướng đối tượng, quản lý bộ nhớ và giải thuật bằng C++.',
      color: '#007bff',
      icon: '💻'
    });

    console.log('Subject id:', subject._id);

    const qExists = await Question.findOne({ question: /Kiểu dữ liệu nào được dùng để lưu trữ ký tự/i });
    if (!qExists) {
      await Question.create({
        _id: mongoose.Types.ObjectId('68f5e380d8a212c9405af0fb'),
        subjectId: subject._id,
        question: 'Kiểu dữ liệu nào được dùng để lưu trữ ký tự trong C++?',
        options: ['string','char','text','character'],
        answer: 'char',
        explanation: 'Kiểu char dùng để lưu một ký tự đơn trong C++.',
        timeLimit: 30,
        isActive: true
      });
      console.log('Inserted sample question');
    } else {
      console.log('Sample question already exists');
    }

    console.log('Seeding done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
