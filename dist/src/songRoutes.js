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
const Song_1 = __importDefault(require("../dist/models/Song")); // Replace with your actual Song model import
const router = express_1.default.Router();
// Create a new song
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = new Song_1.default(req.body);
        yield song.save();
        res.status(201).send(song);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// Delete a song
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_1.default.findByIdAndDelete(req.params.id);
        if (!song) {
            return res.status(404).send();
        }
        res.send(song);
    }
    catch (error) {
        res.status(500).send();
    }
}));
// Edit a song
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'lyrics', 'singer']; // Replace with actual Song fields
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const song = yield Song_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!song) {
            return res.status(404).send();
        }
        res.send(song);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// Get all songs
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield Song_1.default.find({});
        res.send(songs);
    }
    catch (error) {
        res.status(500).send();
    }
}));
// Render the form for adding a song
router.get('/add', (req, res) => {
    res.render('addSong'); // Renders addSong.ejs
});
exports.default = router;
