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
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
mongoose_1.default
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('connected with db'))
    .catch((error) => {
    console.log(error);
});
const schema = new mongoose_1.default.Schema({
    plot: String,
    title: String,
    poster: String,
});
const Movie = mongoose_1.default.model('movie', schema);
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.query;
        const agg = [
            {
                $search: {
                    autocomplete: {
                        query: title,
                        path: 'title',
                        fuzzy: {
                            maxEdits: 2,
                        },
                    },
                },
            },
            {
                $limit: 5,
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    poster: 1,
                    plot: 1,
                },
            },
        ];
        const response = yield Movie.aggregate(agg);
        return res.json(response);
    }
    catch (error) {
        console.log(error);
        return res.json([]);
    }
}));
exports.default = router;
