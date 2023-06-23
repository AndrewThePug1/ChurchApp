import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON bodies
app.use(express.json());


// Simple route for testing

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello, world!');
});

// Start server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:$(PORT)');
});