/**
 * Test Script for Sending Interactive WhatsApp Messages (Buttons)
 * 
 * Usage:
 * 1. Update the TEST_PHONE_NUMBER variable below.
 * 2. Run the script: node test-interactive.js
 */

const { sendInteractiveButtons } = require('../src/services/whatsappService');

// ==========================================
// CONFIGURATION
// ==========================================

// The phone number to send the message TO.
const TEST_PHONE_NUMBER = '919356610789'; 

// The message body
const BODY_TEXT = 'Please choose your preferred language:';

// The buttons (Max 3 allowed by WhatsApp)
const BUTTONS = [
  { id: 'LANG_EN', title: 'English' },
  { id: 'LANG_HI', title: 'Hindi' }
];

// ==========================================
// EXECUTION
// ==========================================

async function runTest() {
  console.log('🚀 Starting Interactive Message Test...');
  console.log(`📱 To: ${TEST_PHONE_NUMBER}`);
  console.log(`💬 Body: "${BODY_TEXT}"`);
  console.log(`🔘 Buttons: ${JSON.stringify(BUTTONS.map(b => b.title))}`);
  console.log('-----------------------------------');

  try {
    const response = await sendInteractiveButtons(TEST_PHONE_NUMBER, BODY_TEXT, BUTTONS);
    
    console.log('\n✅ Interactive message sent successfully!');
    console.log('Response ID:', response.messages?.[0]?.id);
    
  } catch (error) {
    console.error('\n❌ Failed to send message.');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

runTest();
