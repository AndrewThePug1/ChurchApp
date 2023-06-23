"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const songRoutes_1 = __importDefault(require("./songRoutes"));
const User_1 = __importDefault(require("./models/User")); // Import User model
const database_1 = require("./database");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Connect to the database
(0, database_1.connectDB)().catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '..', 'views'));
// Session middleware setup
app.use((0, express_session_1.default)({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
}));
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Middleware to parse urlencoded bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Use user routes
app.use('/', userRoutes_1.default);
// Use song routes
app.use('/songs', songRoutes_1.default);
// Simple route for testing
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.session.userId);
    res.render('home', { username: user ? user.username : '' });
}));
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
