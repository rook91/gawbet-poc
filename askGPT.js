const { TableClient } = require('@azure/data-tables');
const { askGpt4_1, getMatchPrompt } = require('./gptService');
const secrets = require('./secrets/secrets.json');
const { promptIntro, promptExpectedOutput } = require('./const');

const connectionString = secrets.COSMOS_TABLE_PRIMARY_CONNECTION_STRING;
const gameTableName = 'Game';

function getTomorrowDateStr() {
  const now = new Date();
  now.setDate(now.getDate() + 1);

  return now.toISOString().split('T')[0];
}

function getTableClient(tableName) {
  return TableClient.fromConnectionString(connectionString, tableName);
}

async function getTomorrowGames() {
  const client = getTableClient(gameTableName);
  const tomorrow = getTomorrowDateStr();

  const entities = client.listEntities();

  const games = [];
  for await (const game of entities) {
    if (game.GameDate === tomorrow) {
      games.push(game);
    }
  }

  return games;
}

(async () => {
  const games = await getTomorrowGames();

  if (games.length === 0) {
    console.log('ℹ️ Brak meczów zaplanowanych na jutro.');
    return;
  }

  console.log(`✅ Znaleziono ${games.length} mecz(e) na jutro.`);

  for (const game of games) {
    const prompt = `${promptIntro}${getMatchPrompt(game.GameHome, game.GameAway)}${promptExpectedOutput}`
    const response = await askGpt4_1(prompt);
    if (response) {
      console.log(response);
    } else {
      console.log('❌ Brak odpowiedzi od GPT.');
    }
  }
})();
