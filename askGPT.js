const { getTomorrowGames } = require('./db/cosmosService');
const { askGpt4_1, getMatchPrompt } = require('./gpt/gptService');
const { promptIntro, promptExpectedOutput } = require('./const');

console.log('AA');

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
