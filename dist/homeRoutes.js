"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.render('home');
});
router.get('/songs/filter', (req, res) => {
    // your code to render the 'Search for a Song' page
});
router.get('/songs/add', (req, res) => {
    // your code to render the 'Add a Song' page
});
