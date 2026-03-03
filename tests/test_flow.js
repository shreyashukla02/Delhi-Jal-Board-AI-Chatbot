const axios = require('axios');

const URL = 'http://localhost:3000/webhook';
const MY_NUMBER = "916206680090";

async function sendUserMessage(text) {
  console.log(`\n👤 [USER SAYS]: "${text}"`);

  const payload = {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: MY_NUMBER,
            id: "test_" + Date.now(),
            type: "text",
            text: { body: text },
            interactive: text.startsWith("MENU_") || text.startsWith("LANG_") 
              ? { button_reply: { id: text, title: "Button" } } 
              : undefined
          }]
        }
      }]
    }]
  };

  try {
    await axios.post(URL, payload);
    // 👇👇 TIME BADHA DIYA (4 Seconds) 👇👇
    console.log("   (Waiting for Bot to think...)");
    await new Promise(r => setTimeout(r, 4000)); 
  } catch (err) {
    console.log("Error:", err.message);
  }
}

async function runSimulation() {
  console.log("🚀 STARTING AI CHAT SIMULATION...\n");

  await sendUserMessage("Reset");
  await sendUserMessage("Hi");
  
  // Language Select
  await sendUserMessage("LANG_EN"); 

  // Select AI Option (Iske baad bot mode switch karega)
  await sendUserMessage("MENU_AI");

  // 5. Adhura Jawab
  await sendUserMessage("Dirty water is coming.");

  // 6. Complete Details (Ab isme Mobile Number bhi daal do)
  // 👇👇 UPDATE THIS LINE 👇👇
  await sendUserMessage("My name is Rohit, Mobile is 9876543210, and I live in Rohini Sector 16.");

  console.log("\n✅ SIMULATION FINISHED. Check logs above.");
}

runSimulation();