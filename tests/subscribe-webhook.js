/**
 * Script to Subscribe App to Webhook Events
 * 
 * This is required to start receiving webhook events from Meta.
 * It corresponds to the curl command:
 * POST /{waba_id}/subscribed_apps
 */

const axios = require('axios');
const config = require('../src/config/config');

// The WhatsApp Business Account ID from your curl command
const WABA_ID = '1992292391551033'; 

async function subscribeApp() {
  console.log('🚀 Subscribing App to Webhook Events...');
  console.log(`ID: ${WABA_ID}`);
  
  try {
    // Using the version from config or defaulting to v18.0
    const version = config.GRAPH_API_VERSION || 'v18.0';
    const url = `https://graph.facebook.com/${version}/${WABA_ID}/subscribed_apps`;
    
    console.log(`URL: ${url}`);

    const response = await axios.post(url, {}, {
      headers: {
        'Authorization': `Bearer ${config.META_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✅ Successfully subscribed!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('success: true');
    
  } catch (error) {
    console.error('\n❌ Failed to subscribe.');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

subscribeApp();
