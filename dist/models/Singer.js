"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SingerSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    phone_number: String,
    email: String,
});
const Singer = mongoose_1.default.model('Singer', SingerSchema);
exports.default = Singer;
