require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Sends a prompt to GPT and returns the response content.
 * @param {string} prompt - The question or message you want to ask.
 * @param {string} model - Optional: default to gpt-4o
 */
async function askGpt4_1(prompt, model = 'gpt-4.1') {
  try {
    const chat = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'I want a prediction for an upcoming football match' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = chat.choices[0].message.content;
    return reply;
  } catch (err) {
    console.error('❌ GPT request failed:', err.message);
    return null;
  }
}


function getMatchPrompt(home, away) {
  return matchPrompt = `### Match Details:

* **League:**  Poland Ekstraklasa
* **Fixture:** ${home} - ${away}

---`
};

module.exports = { askGpt4_1, getMatchPrompt };
