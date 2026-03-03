/**
 * Test Script for Sending WhatsApp Messages
 * 
 * Usage:
 * 1. Update the TEST_PHONE_NUMBER and TEST_MESSAGE variables below.
 * 2. Run the script: node test-message.js
 */

const { sendMessage } = require('../src/services/whatsappService');

// ==========================================
// CONFIGURATION
// ==========================================

// The phone number to send the message TO.
// Must be in international format without '+' (e.g., '919876543210' for India)
// NOTE: In development mode, this number must be verified in your Meta App Dashboard.
const TEST_PHONE_NUMBER = '916206680090'; 

// The message to send
const TEST_MESSAGE = 'Hello! This is a test message from your Grievance Bot server. 🚀';

// ==========================================
// EXECUTION
// ==========================================

async function runTest() {
  console.log('🚀 Starting WhatsApp Message Test...');
  console.log(`📱 To: ${TEST_PHONE_NUMBER}`);
  console.log(`💬 Message: "${TEST_MESSAGE}"`);
  console.log('-----------------------------------');

  try {
    const response = await sendMessage(TEST_PHONE_NUMBER, TEST_MESSAGE);
    
    console.log('\n✅ Message sent successfully!');
    console.log('Response ID:', response.messages?.[0]?.id);
    console.log('Full Response:', JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('\n❌ Failed to send message.');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Meta API.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
}

runTest();
