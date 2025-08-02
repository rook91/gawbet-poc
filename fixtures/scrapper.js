import puppeteer from 'puppeteer';

export async function scrapeOddsPortalGames(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--lang=en-GB'] // UK English
  });

  const page = await browser.newPage();

  // Set Accept-Language to British English
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-GB,en;q=0.9'
  });

  // Force language properties inside the browser context
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'language', { get: () => 'en-GB' });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-GB', 'en'] });
  });

  // Emulate Poland time zone (Europe/Warsaw)
  await page.emulateTimezone('Europe/Warsaw');

  console.log('Navigating to OddsPortal...');
  await page.goto(url, {
    waitUntil: 'networkidle2'
  });

  // Wait for content to load after clicking
  await page.waitForSelector('.eventRow', { timeout: 10000 });

  console.log('Injecting ala2...');
  const data = await page.evaluate(() => {
    const eventRows = document.getElementsByClassName("eventRow");
    const results = [];
    let currentDate = null;
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 4);

    for (let i = 0; i < eventRows.length; i++) {

      const row = eventRows[i];

      // Check for new gameDate
      const dateDiv = row.querySelector('div[data-testid="date-header"]');
      const dateP = dateDiv ? dateDiv.querySelector('div') : null;

      if (dateP) {
        const dateText = dateP.innerText.trim().toLowerCase();

        if (dateText.includes("dziś") || dateText.includes("today")) {
          currentDate = null;
          continue;
        }

        if (dateText.includes("jutro") || dateText.includes("tomorrow")) {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          currentDate = tomorrow.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        } else {
          // Try to parse standard date like "08 Aug 2025"
          const dateParts = dateText.match(/(\d{2}) (\w{3}) (\d{4})/);
          if (dateParts) {
            const [_, day, monthStr, year] = dateParts;
            const months = {
              jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
              jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
              sty: 0, lut: 1, mar: 2, kwi: 3, maj: 4, cze: 5,
              lip: 6, sie: 7, wrz: 8, paz: 9, lis: 10, gru: 11
            };
            const dateObj = new Date(parseInt(year), months[monthStr], parseInt(day));

            if (dateObj > maxDate) {
              currentDate = null; // Too far in future – skip
              continue;
            }

            currentDate = dateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD
          } else {
            currentDate = null; // Could not parse – skip
            continue;
          }
        }
      }

      // If date is invalid/undefined (e.g. during 'today' block), skip event
      if (!currentDate) continue;

      // Find the first <div data-testid="time-item"> and get its <p> child
      const timeDiv = row.querySelector('div[data-testid="time-item"]');
      const timeP = timeDiv ? timeDiv.querySelector('p') : null;
      const gameTime = timeP ? timeP.innerText.trim() : null;

      // Find both <p class="participant-name">
      const teamPs = row.querySelectorAll('p.participant-name');
      const teamHome = teamPs[0] ? teamPs[0].innerText.trim() : null;
      const teamAway = teamPs[1] ? teamPs[1].innerText.trim() : null;

      results.push({
        rowKey: `game030825_${i + 1}`,
        gameTime,
        teamHome,
        teamAway,
        gameDate: currentDate,
        PartitionKey: "gawbet_sierpien_2025"
      });
    }

    return results;

  });

  await browser.close();

  return data;
}
