const { GoogleGenerativeAI } = require("@google/generative-ai");

// Check API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is MISSING in .env file!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to wait (Sleep)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Robust JSON Cleaner
function cleanAndParseJSON(text) {
  try {
    let clean = text.replace(/```json/g, "").replace(/```/g, "");
    const firstOpen = clean.indexOf("{");
    const lastClose = clean.lastIndexOf("}");
    if (firstOpen !== -1 && lastClose !== -1) {
      clean = clean.substring(firstOpen, lastClose + 1);
      return JSON.parse(clean);
    }
    throw new Error("No JSON structure found");
  } catch (e) {
    console.error("⚠️ JSON PARSE FAILED. Raw Text:", text);
    return null;
  }
}

async function analyzeComplaint(userText, currentData) {
  // 👇 RETRY SETTINGS
  const MAX_RETRIES = 3; 
  const BASE_DELAY = 4000; // 4 seconds wait

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const validCategories = `
      SUB-CATEGORY GROUP: SEWER
      - Sewer Blockage / Overflow / Leakage
      - Missing Manhole Cover
      
      SUB-CATEGORY GROUP: WATER SUPPLY
      - Dirty Water (Contamination)
      - No Water Supply
      - Leakage in Pipeline
      - Low Water Pressure

      SUB-CATEGORY GROUP: TANKER
      - Water Tanker Required
      `;

      const prompt = `
        You are an AI assistant for Delhi Jal Board.
        Analyze User Input and update the Current Data JSON.
        
        STRICT RULES:
        1. Reply in the User's Language (Hindi/English).
        2. Ask for missing fields (Name, Mobile, Address, Issue) ONE BY ONE.
        3. If all fields are present, set "isComplete": true and "nextQuestion" MUST be a summary confirmation (Yes/No).
        4. RETURN ONLY JSON.

        Current Data: ${JSON.stringify(currentData)}
        User Input: "${userText}"

        Example Output JSON:
        {
          "extractedData": { "name": "...", "mobile": "...", "address": "...", "issue": "...", "category": "CRM", "subCategory": "..." },
          "isComplete": false,
          "nextQuestion": "Please tell me your name?"
        }
      `;

      console.log(`🔹 Sending request to Gemini (Attempt ${attempt})...`);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Agar successful hua to yahan se return ho jayega
      return cleanAndParseJSON(text);

    } catch (error) {
      console.error(`❌ Attempt ${attempt} Failed:`, error.message);

      // Check if it is a Rate Limit Error (429) or Overloaded (503)
      const isRateLimit = error.message.includes("429") || error.message.includes("Too Many Requests") || error.message.includes("Resource has been exhausted");
      
      if (isRateLimit && attempt < MAX_RETRIES) {
        // Wait time badhate jao (Exponential Backoff: 4s, 8s, 12s...)
        const waitTime = BASE_DELAY * attempt; 
        console.log(`⏳ Rate Limit Hit. Waiting for ${waitTime / 1000} seconds before retrying...`);
        await sleep(waitTime);
      } else {
        // Agar koi aur error hai, ya retries khatam ho gaye -> Null return karo
        if (attempt === MAX_RETRIES) return null;
      }
    }
  }
}

module.exports = { analyzeComplaint };