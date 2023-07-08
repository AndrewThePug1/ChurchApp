"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Song_1 = __importDefault(require("./models/Song"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const database_1 = __importDefault(require("./database"));
const synonyms_1 = require("synonyms");
const router = express_1.default.Router();
async function findSynonyms(keyword) {
    return new Promise((resolve, reject) => {
        const synonymsList = (0, synonyms_1.words)(keyword) || [];
        const synonyms = synonymsList.flatMap((synonymGroup) => synonymGroup.slice(1));
        resolve(synonyms);
    });
}
//Add sampleSong
//router.post('/add-sample-song', async (req: Request, res: Response) => {
// var newSong = {
//  title: 'Sample Song',
//   lyrics: 'These are sample lyrics for our sample song',
// language: 'English',
// theme: 'Sample Theme',
//  youtube_link: 'https://www.youtube.com',
// spotify_link: 'https://www.spotify.com',
//  original_artist: 'Sample Artist',
// singerOrType: 'Sample Singer Or Type',
//};
// solrClient.update( newSong, function(err: any, result: any) {
// if (err)
//  {
//  console.log(err);
//  return;
//  }
//console.log('Response', result.responseHeader);
//});
//});
// Sensitive endpoint for loading all songs into my SOLR collection
router.get('/load-to-solr', async (req, res) => {
    try {
        // Retrieve all songs from MongoDB
        const songs = await Song_1.default.find({});
        // Iterate over each song and add it to SOLR
        songs.forEach(async (song) => {
            // Convert the Mongoose document to a plain JavaScript object
            let songObject = JSON.parse(JSON.stringify(song));
            songObject.id = songObject._id.toString(); // convert "_id" to "id"
            delete songObject._id; // delete the original "_id"
            console.log('Song object:', JSON.stringify(songObject, null, 2));
            // Update SOLR songs collection when a song is added
            // Pass the songObject within an array as solrClient.update expects an array of documents
            database_1.default.update(songObject, function (err, result) {
                if (err) {
                    console.log(`Error updating song ${song._id} to Solr:`, err);
                }
                else {
                    console.log(`Successfully updated song ${song._id} to Solr`);
                }
            });
        });
        res.status(200).send('Songs are being loaded to Solr. Check server logs for details.');
    }
    catch (error) {
        console.error('Error loading songs to Solr: ', error);
        res.status(500).send('Error loading songs to Solr');
    }
});
router.get('/search-solr', async (req, res) => {
    try {
        const { keywords } = req.query;
        if (keywords && typeof keywords === 'string') {
            const keywordArray = keywords.split(',');
            const solrQuery = keywordArray.map(keyword => `title:${keyword}`).join(' OR ');
            const strQuery = database_1.default.query().q(solrQuery).start(0).rows(10);
            database_1.default.search(strQuery, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.json(result.response.docs);
            });
        }
        else {
            res.status(400).send('Invalid request');
        }
    }
    catch (error) {
        console.error('Error executing Solr search: ', error);
        res.status(500).send('Error executing Solr search');
    }
});
// Add this route to your songRoutes.ts
router.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    try {
        const response = await (0, axios_1.default)({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: qs_1.default.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:3000/songs/callback',
                client_id: '54cb4154731c430a9075589d5a15199f',
                client_secret: 'd22ec0f87d1749fe8b1c92ab42f1b1d4'
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });
        const data = response.data;
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        // You can store the access and refresh tokens in the session or a cookie to be used later.
        // req.session.access_token = access_token;
        // req.session.refresh_token = refresh_token;
    }
    catch (error) {
        console.log('Access token error', error);
        res.send('An error occurred while trying to get the access token');
    }
});
// Create a new song
router.post('/', async (req, res) => {
    try {
        const song = new Song_1.default(req.body);
        await song.save();
        // Update SOLR songs collection when a song is added
        database_1.default.update('songs', song, function (err, result) {
            if (err) {
                console.log('Error updating Solr song collection: ', err);
            }
            else {
                console.log('Solr song collection updated successfully');
            }
        });
        // Retrieve the song details
        const savedSong = await Song_1.default.findById(song._id);
        res.render('success', { song: savedSong }); // Pass the song details to the success template
    }
    catch (error) {
        console.error('Error creating new song: ', error);
        res.status(400).send('Error creating new song');
    }
});
// Delete a song
router.delete('/:id', async (req, res) => {
    try {
        const song = await Song_1.default.findByIdAndDelete(req.params.id);
        if (!song) {
            return res.status(404).send();
        }
        res.send(song);
    }
    catch (error) {
        res.status(500).send();
    }
});
//CAREFUL- Route to delete all songs
router.delete('/deleteAll', async (req, res) => {
    try {
        await Song_1.default.deleteMany({});
        res.status(200).send('All songs deleted');
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Edit a song
router.put('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'lyrics', 'language', 'theme', 'youtube_link', 'singer_ids', 'spotify_link', 'original_artist'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const song = await Song_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!song) {
            return res.status(404).send();
        }
        res.send(song);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
// Get all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song_1.default.find({});
        res.send(songs);
    }
    catch (error) {
        res.status(500).send();
    }
});
// Render the form for adding a song
router.get('/add', (req, res) => {
    res.render('addSong'); // Renders addSong.ejs
});
// New routes for song filtering
router.get('/filter', async (req, res) => {
    try {
        const singerOrTypes = await Song_1.default.distinct('singerOrType');
        const themes = await Song_1.default.distinct('theme');
        res.render('filterSongs', { singerOrTypes, themes });
    }
    catch (error) {
        res.status(500).send();
    }
});
//Submission success route
router.get('/success', (req, res) => {
    res.render('success'); // Renders success.ejs
});
//detailed routes to server detailed info about a song when given a song ID
router.get('/:id', async (req, res) => {
    try {
        const song = await Song_1.default.findById(req.params.id);
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
});
router.post('/filter', async (req, res) => {
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
        const songs = await Song_1.default.find(filterOptions);
        res.render('filteredSongsList', { songs });
    }
    catch (error) {
        res.status(500).send();
    }
});
// Search songs
router.get('/search', async (req, res) => {
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
                },
            },
        ];
        const response = await Song_1.default.aggregate(agg);
        return res.json(response);
    }
    catch (error) {
        console.log('Error occurred during search:', error);
        return res.status(500).json([]);
    }
});
exports.default = router;
