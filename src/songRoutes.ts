import express, { Request, Response } from 'express';
import Song from './models/Song';

const router = express.Router();

// Create a new song
router.post('/', async (req: Request, res: Response) => {
    try {
        const song = new Song(req.body);
        await song.save();
        res.status(201).send(song);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a song
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);

        if (!song) {
            return res.status(404).send();
        }

        res.send(song);
    } catch (error) {
        res.status(500).send();
    }
});

//CAREFUL- Route to delete all songs
router.delete('/deleteAll', async (req: Request, res: Response) => {
  try {
    await Song.deleteMany({});
    res.status(200).send('All songs deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});


// Edit a song
router.put('/:id', async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'lyrics', 'language', 'theme', 'youtube_link', 'singer_ids', 'spotify_link', 'original_artist'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!song) {
            return res.status(404).send();
        }

        res.send(song);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all songs
router.get('/', async (req: Request, res: Response) => {
    try {
        const songs = await Song.find({});
        res.send(songs);
    } catch (error) {
        res.status(500).send();
    }
});

// Render the form for adding a song
router.get('/add', (req: Request, res: Response) => {
    res.render('addSong'); // Renders addSong.ejs
});

// New routes for song filtering
router.get('/filter', async (req: Request, res: Response) => {
    try {
        const singerOrTypes = await Song.distinct('singerOrType');
        const themes = await Song.distinct('theme');
        res.render('filterSongs', { singerOrTypes, themes});
    } catch (error) {
        res.status(500).send();
    }
});


//Submission success route
router.get('/success', (req: Request, res: Response) => {
    res.render('success'); // Renders success.ejs
  });


//detailed routes to server detailed info about a song when given a song ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
      const song = await Song.findById(req.params.id);
      if (song) {
        res.render('songDetail', { song });
      } else {
        res.status(404).send('Song not found');
      }
    } catch (error) {
      res.status(500).send();
    }
  });


router.post('/filter', async (req: Request, res: Response) => {
    const { title, language, original_artist, singerOrType, theme } = req.body;

    const filterOptions: { [key: string]: any } = {};
    if (title) filterOptions['title'] = title;
    if (language) filterOptions['language'] = language;
    if (original_artist) filterOptions['original_artist'] = original_artist;
    if (singerOrType) filterOptions['singerOrType'] = singerOrType;
    if (theme) filterOptions['theme'] = theme;

    try {
        const songs = await Song.find(filterOptions);
        res.render('filteredSongsList', { songs });
    } catch (error) {
        res.status(500).send();
    }
});





export default router;