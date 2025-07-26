const { insertGame } = require('./cosmosService.js');

const game = {
  RowKey: "GAME_20250801_LegiaLech",
  GameHome: "Raków Częstochowa",
  GameAway: "Wisła Płock",
  PartitionKey: "PL_Ekstraklasa"
};

insertGame(game).then(success => {
  if (success) {
    console.log('✅ Insert succeeded.');
  } else {
    console.log('❗ Insert failed.');
  }
});
