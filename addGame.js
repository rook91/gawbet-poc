const { insertGame } = require('./db/cosmosService');

const games = [{
  RowKey: "game010825_1",
  GameHome: "Zagłębie Lubin",
  GameAway: "Korona Kielce",
  GameDate: "2025-08-01",
  GameTime: "18:00",
  PartitionKey: "PL_Ekstraklasa"
},{
  RowKey: "game010825_2",
  GameHome: "Wisła Płock",
  GameAway: "Piast Gliwice",
  GameDate: "2025-08-01",
  GameTime: "20:30",
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
