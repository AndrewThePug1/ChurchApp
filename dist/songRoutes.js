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
const Song_1 = __importDefault(require("./models/Song"));
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
//CAREFUL- Route to delete all songs
router.delete('/deleteAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Song_1.default.deleteMany({});
        res.status(200).send('All songs deleted');
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Edit a song
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'lyrics', 'language', 'theme', 'youtube_link', 'singer_ids', 'spotify_link', 'original_artist'];
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
// New routes for song filtering
router.get('/filter', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const singerOrTypes = yield Song_1.default.distinct('singerOrType');
        const themes = yield Song_1.default.distinct('theme');
        res.render('filterSongs', { singerOrTypes, themes });
    }
    catch (error) {
        res.status(500).send();
    }
}));
//Submission success route
router.get('/success', (req, res) => {
    res.render('success'); // Renders success.ejs
});
//detailed routes to server detailed info about a song when given a song ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_1.default.findById(req.params.id);
        if (song) {
            res.render('songDetail', { song });
        }
        else {
            res.status(404).send('Song not found');
        }
    }
    catch (error) {
        res.status(500).send();
    }
}));
router.post('/filter', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, language, original_artist, singerOrType, theme } = req.body;
    const filterOptions = {};
    if (title)
        filterOptions['title'] = title;
    if (language)
        filterOptions['language'] = language;
    if (original_artist)
        filterOptions['original_artist'] = original_artist;
    if (singerOrType)
        filterOptions['singerOrType'] = singerOrType;
    if (theme)
        filterOptions['theme'] = theme;
    try {
        const songs = yield Song_1.default.find(filterOptions);
        res.render('filteredSongsList', { songs });
    }
    catch (error) {
        res.status(500).send();
    }
}));
exports.default = router;
