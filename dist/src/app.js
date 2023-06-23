"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path")); // Import path module
const express_session_1 = __importDefault(require("express-session"));
const userRoutes_1 = __importDefault(require("./userRoutes")); // Import user routes
const songRoutes_1 = __importDefault(require("./songRoutes")); // Import song routes
const database_1 = require("./database"); // Import the database connection function
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Connect to the database
(0, database_1.connectDB)().catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, './views')); // Set the views directory
// Session middleware setup
app.use((0, express_session_1.default)({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
}));
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Use user routes
app.use('/users', userRoutes_1.default); // Use the user routes with '/users' prefix
// Use song routes
app.use('/songs', songRoutes_1.default); // Use the song routes with '/songs' prefix
// Simple route for testing
app.get('/', (req, res, next) => {
    res.send('Hello, world!');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
