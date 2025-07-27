import { insertGame } from './db/cosmosService.js';

export async function addGames() {
  let successCount = 0;
  let failureCount = 0;

  for (const game of games) {
    const result = await insertGame(game);
    result ? successCount++ : failureCount++;
  }

  console.log(`\n✅ Done! Inserted ${successCount} games. Failed: ${failureCount}.`);
};
