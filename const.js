export const chatGPTSystemContent = "I want a prediction for an upcoming football match";

export const promptIntro = `Please follow the rules below **strictly**:

---

#### **Source Requirements:**

1. Use **only sources** which are relevant to the countries from where the clubs come from. 
2. **Do not use any U.S.-based sources** under any circumstances.
3. Check a **minimum of four** independent sources (preferably from different domains).
4. Independently of the 4 country based sources check https://www.predictz.com/predictions/poland/ekstraklasa/
5. Independently of the 4 country based sources check https://www.forebet.com/pl/prognozy-pi%C5%82karskie-polska/ekstraklasa
---

#### **Output Requirements:**
1. Provide **one single final score prediction**, based on the most common or most credible outcome from 4 country sources. 
2. Do not take predictZ into consideration for that.
3. List predictZ and forebet predictions as separate ones
4. In reply I want only json with results as provided with expected output
---
`;

export const promptExpectedOutput = `### **Expected Output Format:**
{
	"ChatGPT4oScore": "2:1",
	"ChatGPT4oPrediction": "1",
	"predictzScore": "2:2",
	"predictzPrediction": "X",
	"forebetScore": "1:2",
	"forebetPrediction": "2",
}`;

export const GAME_TABLE_NAME = 'Game';

export const PREDICTION_TABLE_NAME = 'Prediction';

