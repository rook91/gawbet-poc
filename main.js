const { insertGame } = require('./cosmosService.js');

const games = [];

(async () => {
  let successCount = 0;
  let failureCount = 0;

  for (const game of games) {
    const result = await insertGame(game);
    result ? successCount++ : failureCount++;
  }

  console.log(`\n✅ Done! Inserted ${successCount} games. Failed: ${failureCount}.`);
})();
