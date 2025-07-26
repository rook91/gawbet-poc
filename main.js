const { insertGame } = require('./cosmosService.js');

const games = [{
  RowKey: "game280725_1",
  GameHome: "GKS Katowice",
  GameAway: "Zagłębie Lubin",
  GameDate: "2025-07-28",
  GameTime: "19:00",
  PartitionKey: "PL_Ekstraklasa"
}];

(async () => {
  let successCount = 0;
  let failureCount = 0;

  for (const game of games) {
    const result = await insertGame(game);
    result ? successCount++ : failureCount++;
  }

  console.log(`\n✅ Done! Inserted ${successCount} games. Failed: ${failureCount}.`);
})();
