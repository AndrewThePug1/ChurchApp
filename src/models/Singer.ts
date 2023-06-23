import mongoose from 'mongoose';

const SingerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_number: String,
  email: String,
});

const Singer = mongoose.model('Singer', SingerSchema);

export default Singer;
