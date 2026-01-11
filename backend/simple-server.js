const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../ucums-angular-complete')));

// Mock data for demonstration
const mockUsers = [
  { _id: '1', name: 'Admin User', email: 'admin@ucums.edu', role: 'admin' },
  { _id: '2', name: 'John Student', email: 'john@ucums.edu', role: 'student' },
  { _id: '3', name: 'Jane Lecturer', email: 'jane@ucums.edu', role: 'lecturer' }
];

const mockArticles = [
  { _id: '1', title: 'Getting Started with UCUMS', content: 'Learn how to use the University Content Management System effectively.', published: true },
  { _id: '2', title: 'Course Registration Guide', content: 'Step-by-step guide for registering your courses this semester.', published: true },
  { _id: '3', title: 'Academic Calendar 2026', content: 'Important dates and deadlines for the academic year.', published: true }
];

const mockCourses = [
  { _id: '1', code: 'CS101', name: 'Introduction to Programming', students: 15 },
  { _id: '2', code: 'CS201', name: 'Data Structures', students: 12 },
  { _id: '3', code: 'CS301', name: 'Advanced Algorithms', students: 8 },
  { _id: '4', code: 'CS401', name: 'Machine Learning', students: 10 }
];

// Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@ucums.edu' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock_jwt_token',
      user: mockUsers[0]
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.get('/api/users', (req, res) => {
  res.json(mockUsers);
});

app.get('/api/articles', (req, res) => {
  res.json(mockArticles);
});

app.get('/api/courses', (req, res) => {
  res.json(mockCourses);
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalUsers: mockUsers.length,
    totalArticles: mockArticles.length,
    totalCourses: mockCourses.length,
    activeUsers: mockUsers.length
  });
});

// Serve the HTML frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../ucums-angular-complete/ucums.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
});
