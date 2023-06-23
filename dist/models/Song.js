"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SongSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    lyrics: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    theme: String,
    youtube_link: String,
    //singer_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Singer' }],
    spotify_link: String,
    original_artist: String,
    singerOrType: String,
});
const Song = mongoose_1.default.model('Song', SongSchema);
exports.default = Song;
