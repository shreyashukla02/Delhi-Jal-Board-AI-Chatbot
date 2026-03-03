const axios = require('axios');
require('dotenv').config();

async function checkModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("❌ Error: .env file mein GEMINI_API_KEY nahi mili!");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  console.log("🔍 Checking available models for your API Key...");

  try {
    const response = await axios.get(url);
    const models = response.data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent")) // Sirf chat wale models
      .map(m => m.name);
      
    console.log("\n✅ YOUR AVAILABLE MODELS:");
    console.log(models);
    console.log("\n👉 Inme se koi ek naam hume aiService.js mein dalna hoga.");
  } catch (error) {
    console.error("\n❌ Check Failed:", error.response?.data?.error?.message || error.message);
  }
}

checkModels();