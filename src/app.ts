import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import userRoutes from './userRoutes';
import songRoutes from './songRoutes';
import User from './models/User'; // Import User model

import { connectDB } from './database';

// Add this new interface
interface CustomSession extends session.Session {
  userId?: string;
  role?: string;
}

const MongoStore = require("connect-mongo")(session);
const app = express();
const PORT = process.env.PORT || 3000;
const ejsMate = require('ejs-mate');
const MongoDBStore = require("connect-mongo")(session);
const dbUrl = 'mongodb+srv://AndrewThePug1:Atlasturtle22!@cluster0.lzrg3yn.mongodb.net/?retryWrites=true&w=majority' || 'mongodb://localhost:27017/songManagement';

// Connect to the database
connectDB(dbUrl).catch((err) => {
  console.error('Failed to connect to the database', err);
  process.exit(1);
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));



const store = new MongoDBStore({
  url: dbUrl,
  secret: 'areallygoodsecret',
  touchAfter: 24 * 60 * 60
});

store.on("error", function(e: Error){
  console.log("SESSION STORE ERROR", e)
})




const sessionConfig = {
  store,
  name: 'session',
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

// Session middleware setup
app.use(session(sessionConfig));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse urlencoded bodies
app.use(express.urlencoded({ extended: true }));

// Use user routes
app.use('/', userRoutes);

// Use song routes
app.use('/songs', songRoutes);


// Render the 'register.ejs' template for the root URL
app.get('/', (req: Request, res: Response) => {
  res.render('register');
});

// Simple route for testing
app.get('/', async (req: Request, res: Response) => {
  const session = req.session as CustomSession;
  const user = await User.findById(session.userId);
  res.render('home', { username: user ? user.username : '' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
