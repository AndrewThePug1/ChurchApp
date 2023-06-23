import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
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


const Song = mongoose.model('Song', SongSchema);

export default Song;