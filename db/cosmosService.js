import dotenv from 'dotenv';
import { TableClient } from '@azure/data-tables';
import {GAME_TABLE_NAME, PREDICTION_TABLE_NAME} from '../const.js';

dotenv.config();

const connectionString = process.env.COSMOS_TABLE_PRIMARY_CONNECTION_STRING;

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
    const client = getTableClient(GAME_TABLE_NAME);

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
    const client = getTableClient(PREDICTION_TABLE_NAME);

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

function getTomorrowDateStr() {
    const now = new Date();
    now.setDate(now.getDate() + 1);

    return now.toISOString().split('T')[0];
}

async function getTomorrowGames() {
    const client = getTableClient(GAME_TABLE_NAME);
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

export { insertGame, insertPrediction, getTomorrowGames };
