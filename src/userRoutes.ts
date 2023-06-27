import { Router, Request, Response } from 'express';
import User from './models/User';

// Import the session module
import session from 'express-session';

// Add this new interface
interface CustomSession extends session.Session {
  userId?: string;
  role?: string;
}

const router = Router();

const secretKey = 'ReallySecureKey';

router.post('/register', async (req, res) => {
  const { username, password, role, key } = req.body;

  try {
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // Check if the role is "admin" and if a valid secret key is provided
    if (role === 'admin' && key !== secretKey) {
      return res.status(400).send('Invalid secret key');
    }

    const user = new User({
      username,
      password,
      role,
    });

    await user.save();
    res.send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Render the registration form
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) return res.status(400).send('Invalid username or password');

  // Store the user's id and role in the session
  const session = req.session as CustomSession;
  session.userId = user.id;
  session.role = user.role;

  res.redirect('../views/home');
});

// Render the login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send('Error retrieving users');
  }
});

export default router;
