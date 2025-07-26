const { insertGame } = require('./cosmosService.js');

const game = {
  RowKey: "GAME_20250801_LegiaLech",
  GameHome: "Raków Częstochowa",
  GameAway: "Wisła Płock",
  GameDate: "2025-07-27",
  GameTime: "14:45",
  PartitionKey: "PL_Ekstraklasa"
};

insertGame(game).then(success => {
  if (success) {
    console.log('✅ Insert succeeded.');
  } else {
    console.log('❗ Insert failed.');
  }
});
