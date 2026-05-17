const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabase = supabaseClient.createClient(
  'https://rncrlddntskubechxdwq.supabase.co',
  'sb_publishable_OqOtS8IIMezPa-DK259GrQ_WC0c_LQT'
);

app.get('/', (req, res) => {
  res.sendFile('public/home.html', { root: __dirname });
});

app.get('/about', (req, res) => {
  res.sendFile('public/about.html', { root: __dirname });
});

app.get('/exercise', (req, res) => {
  res.sendFile('public/exercise.html', { root: __dirname });
});

app.get('/favorites-page', (req, res) => {
  res.sendFile('public/favorites.html', { root: __dirname });
});

app.get('/favorites', async (req, res) => {
  const { data, error } = await supabase.from('favorites').select();

  if (error) {
    res.status(500).send(error);
  } else {
    res.json(data);
  }
});

app.post('/favorite', async (req, res) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      exercise_id: req.body.exercise_id,
      exercise_name: req.body.exercise_name,
      muscle_group: req.body.muscle_group,
      equipment: req.body.equipment,
      category: req.body.category,
      image_url: req.body.image_url
    })
    .select();

  if (error) {
    res.status(500).send(error);
  } else {
    res.json(data);
  }
});

app.get('/exercises', async (req, res) => {
    const response = await fetch('https://wger.de/api/v2/exerciseinfo/?language=2&limit=100');
    const data = await response.json();
    res.json(data);
  });
app.get('/muscles', async (req, res) => {
    const response = await fetch('https://wger.de/api/v2/muscle/');
    const data = await response.json();
    res.json(data);
  });
  

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});