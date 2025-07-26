// cosmosService.js
const { TableClient } = require('@azure/data-tables');
const secrets = require('./secrets/PrimaryConnectionString.json');

const connectionString = secrets.COSMOS_TABLE_PRIMARY_CONNECTION_STRING;

function getTableClient(tableName) {
    return TableClient.fromConnectionString(connectionString, tableName);
}

function isValidGameEntity(entity) {
    const requiredFields = [
        'RowKey',
        'PartitionKey',
        'GameHome',
        'GameAway',
        'GameDate',
        'GameTime'
    ];

    const missing = requiredFields.filter(field => !(field in entity));

    if (missing.length > 0) {
        console.error(`❌ Invalid game object. Missing fields: ${missing.join(', ')}`);
        return false;
    }

    return true;
}

async function insertGame(game) {
    const client = getTableClient('Game');

    if (!isValidGameEntity(game)) {
        console.error(`❌ Skipping insert — invalid game entity (${game.RowKey || 'unknown'})`);
        return false;
    }

    try {
        await client.createEntity(game);

        console.log(`✅ Game inserted: ${game.GameHome} vs ${game.GameAway} on ${game.GameDate}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to insert game (${game.RowKey}):`, error.message);
        return false;
    }
}

function isValidPredictionEntity(entity) {
    const requiredFields = [
        'PartitionKey',
        'RowKey',
        'ChatGPT4oScore',
        'ChatGPT4oPrediction',
        'predictzScore',
        'predictzPrediction',
        'forebetScore',
        'forebetPrediction',
        'PredictedScore',
        'PredictedResult',
        'BetType'
    ];

    const missing = requiredFields.filter(field => !(field in entity));

    if (missing.length > 0) {
        console.error(`❌ Invalid prediction object. Missing fields: ${missing.join(', ')}`);
        return false;
    }

    return true;
}

async function insertPrediction(pred) {
    const client = getTableClient('Prediction');

    if (!isValidPredictionEntity(pred)) {
        console.error(`❌ Skipping insert — invalid prediction entity (${pred.RowKey || 'unknown'})`);
        return false;
    }

    try {
        await client.createEntity(pred);

        console.log(`✅ Prediction inserted for game: ${pred.PartitionKey}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to insert prediction (${pred.RowKey}):`, error.message);
        return false;
    }
}

module.exports = { insertGame, insertPrediction };
