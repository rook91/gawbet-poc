import express from 'express';
import bodyParser from 'body-parser';
import { askGPT } from './askGPT.js';
import { addGames } from './db/addGame.js';
import { scrapeOddsPortalGames } from './fixtures/scrapper.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// 1) Test endpoint
app.get('/test', (req, res) => {
  res.send('hello');
});

// 2) Get Fixtures
app.get('/getFixtures', async (req, res) => {
  const response = await scrapeOddsPortalGames("https://www.oddsportal.com/football/poland/ekstraklasa/");

  if (response) {
    res.json({ response });
  } else {
    res.status(500).json({ error: 'GPT request failed' });
  }
});

// 2) Ask GPT endpoint
app.get('/ask-gpt', async (req, res) => {
  const response = await askGPT();

  if (response) {
    res.json({ response });
  } else {
    res.status(500).json({ error: 'GPT request failed' });
  }
});

// 3) Add games (PUT)
app.put('/games', async (req, res) => {
  const result = await addGames(req.body || []);

  res.json({
    message: `Games inserted.`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
