// Test file to simulate sending a WhatsApp message to your webhook
async function sendFakeMessage() {
  const url = 'http://localhost:3000/webhook'; // Your webhook URL
  
  // This is the same data structure WhatsApp sends to your webhook
  const payload = {
    object: "whatsapp_business_account",
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: "15551470849", // Fake sender number
            id: "wamid.test12345",
            type: "text",
            text: { 
                body: "Water is very dirty." // <--- Put your test message here
            }
          }]
        }
      }]
    }]
  };

  console.log("📨 Sending fake WhatsApp message to server...");

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.status === 200) {
      console.log("✅ Server received message successfully!");
      console.log("🚀 Check your server logs for the AI response.");
    } else {
      console.log("❌ Server Error:", response.status);
    }
  } catch (error) {
    console.log("❌ Error: Server might be down.", error.message);
  }
}

sendFakeMessage();