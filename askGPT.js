const { askGPT } = require('./gptService');

const prompt = `Please follow the rules below **strictly**:

---

#### **Source Requirements:**

1. Use **only sources** which are relevant to the countries from where the clubs come from
   * **Do not use any U.S.-based sources** under any circumstances.

2. Check a **minimum of four** independent sources (preferably from different domains).

---

#### **Output Requirements:**

1. Begin with a brief **summary** highlighting the general consensus across sources.
2. Provide **one single final score prediction**, based on the most common or most credible outcome.
3. Present a **prediction table** listing each source and its predicted score.

---

### Match Details:

* **League:**  Poland Ekstraklasa
* **Fixture:** Raków Częstochowa - Wisła Płock

---

### **Expected Output Format:**

**Summary:**
Most sources suggest a balanced game, slightly favoring an away win with minimal goals scored.

**Final Score Prediction:**
**Motor Lublin 0-1 Śląsk Wrocław**

**\[Prediction Table]**

| Source   | Predicted Score |
| -------- | --------------- |
| Source 1 | 0-1             |
| Source 2 | 0-1             |
| Source 3 | 1-0             |
| Source 4 | 0-1             |
`;

askGPT(prompt).then(result => {
  if (result) {
    console.log(result);
  } else {
    console.log('❌ No response from GPT.');
  }
});
