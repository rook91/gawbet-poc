// cosmosService.js
const { TableClient } = require('@azure/data-tables');
const secrets = require('./secrets/PrimaryConnectionSstring.json');

const connectionString = secrets.COSMOS_TABLE_PRIMARY_CONNECTION_STRING;

function getTableClient(tableName) {
  return TableClient.fromConnectionString(connectionString, tableName);
}

async function insertGame(game) {
    const client = getTableClient('Game');
  
    try {
      await client.createEntity({
        PartitionKey: game.Liga,
        RowKey: game.GAME_Id,
        ...game
      });
  
      console.log(`✅ Game inserted: ${game.GameHome} vs ${game.GameAway} on ${game.GameDate}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to insert game (${game.RowKey}):`, error.message);
      return false;
    }
  }

// async function insertPrediction(pred) {
//   const client = getTableClient('Prediction');
//   await client.createEntity({
//     PartitionKey: pred.Game_Id,
//     RowKey: pred.PREDICTION_Id,
//     ...pred
//   });
// }

module.exports = { insertGame };