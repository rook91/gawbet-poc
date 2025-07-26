const { askGPT, getMatchPrompt } = require('./gptService');
const { promptIntro, promptExpectedOutput } = require('./const');

const prompt = `${promptIntro}${getMatchPrompt("Raków Częstochowa", "Wisła Płock")}${promptExpectedOutput}`

console.log(prompt);

askGPT(prompt).then(result => {
  if (result) {
    console.log(result);
  } else {
    console.log('❌ No response from GPT.');
  }
});
