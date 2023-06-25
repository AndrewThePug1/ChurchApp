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
const express_1 = require("express");
const User_1 = __importDefault(require("./models/User"));
const router = (0, express_1.Router)();
const secretKey = 'ReallySecureKey';
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role, key } = req.body;
    try {
        // Check if the username already exists in the database
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }
        // Check if the role is "admin" and if a valid secret key is provided
        if (role === 'admin' && key !== secretKey) {
            return res.status(400).send('Invalid secret key');
        }
        const user = new User_1.default({
            username,
            password,
            role,
        });
        yield user.save();
        res.send('User registered successfully');
    }
    catch (error) {
        res.status(500).send('Error registering user');
    }
}));
// Render the registration form
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User_1.default.findOne({ username, password });
    if (!user)
        return res.status(400).send('Invalid username or password');
    // Store the user's id and role in the session
    const session = req.session;
    session.userId = user.id;
    session.role = user.role;
    res.send('Logged in successfully');
}));
// Render the login form
router.get('/login', (req, res) => {
    res.render('login');
});
// Get all users
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({});
        res.send(users);
    }
    catch (error) {
        res.status(500).send('Error retrieving users');
    }
}));
exports.default = router;
