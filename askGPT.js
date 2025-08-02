import { getTomorrowGames } from './db/cosmosService.js';
import { askGpt4_1, getMatchPrompt } from './gpt/gptService.js';
import { promptIntro, promptExpectedOutput } from './const.js';

export async function askGPT () {
  const games = await getTomorrowGames();
  const responses = [];

  if (games.length === 0) {
    console.log('ℹ️ Brak meczów zaplanowanych na jutro.');
    return;
  }

  console.log(`✅ Znaleziono ${games.length} mecz(e) na jutro.`);

  for (const game of games) {
    const prompt = `${promptIntro}${getMatchPrompt(game.GameHome, game.GameAway)}${promptExpectedOutput}`
    const response = await askGpt4_1(prompt);
    if (response) {
      const parsedRes = JSON.parse(response);
      parsedRes.RowKey = game.RowKey;
      responses.push(parsedRes);
      console.log(`Dodano analizę od GPT dla ${game.RowKey}`);
    } else {
      console.log('❌ Brak odpowiedzi od GPT.');
    }
  }

  return responses;
};
