import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  
    res.render('home');
  });
  
  router.get('/songs/filter', (req, res) => {
    // your code to render the 'Search for a Song' page
  });
  
  router.get('/songs/add', (req, res) => {
    // your code to render the 'Add a Song' page
  });
  