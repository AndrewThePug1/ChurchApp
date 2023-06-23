import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import userRoutes from './userRoutes';
import songRoutes from './songRoutes';
import User from './models/User'; // Import User model

import { connectDB } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB().catch((err) => {
  console.error('Failed to connect to the database', err);
  process.exit(1);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Session middleware setup
app.use(
  session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse urlencoded bodies
app.use(express.urlencoded({ extended: true }));

// Use user routes
app.use('/', userRoutes);

// Use song routes
app.use('/songs', songRoutes);

// Simple route for testing
app.get('/', async (req: Request, res: Response) => {
  const user = await User.findById(req.session.userId);
  res.render('home', { username: user ? user.username : '' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
