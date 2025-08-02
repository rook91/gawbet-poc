# gawbet-poc


1. Go to https://www.oddsportal.com/matches/ and click on the "Tomorrow" tab.
2. Open the Developer Tools Console in your browser and run the `extractDatafromOddsPortal` code from the [const.js](const.js) file.
3. Send a **PUT** request to the `/games` endpoint to save the new games in the database.
4. Send a **GET** request to the `/ask-gpt` endpoint to receive predictions for the upcoming matches.
