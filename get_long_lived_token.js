require('dotenv').config();
const axios = require('axios');

/**
 * Script to exchange a short-lived User Access Token for a Long-Lived User Access Token.
 * 
 * Prerequisites:
 * 1. Add the following to your .env file:
 *    - APP_ID=your_facebook_app_id
 *    - APP_SECRET=your_facebook_app_secret
 *    - META_API_TOKEN=your_short_lived_token
 * 
 * 2. Run this script:
 *    node get_long_lived_token.js
 */

async function getLongLivedToken() {
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;
    const shortLivedToken = process.env.META_API_TOKEN;
    const graphApiVersion = process.env.GRAPH_API_VERSION || 'v18.0';

    // Validate environment variables
    if (!appId || !appSecret || !shortLivedToken) {
        console.error('❌ Error: Missing required environment variables.');
        console.error('Please ensure APP_ID, APP_SECRET, and META_API_TOKEN are set in your .env file.');
        return;
    }

    console.log('🔄 Exchanging short-lived token for long-lived token...');
    console.log(`   App ID: ${appId}`);
    console.log(`   API Version: ${graphApiVersion}`);

    try {
        const url = `https://graph.facebook.com/${graphApiVersion}/oauth/access_token`;
        
        const params = {
            grant_type: 'fb_exchange_token',
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: shortLivedToken
        };

        const response = await axios.get(url, { params });

        const data = response.data;
        
        console.log('\n✅ Success! Long-Lived Token Generated:');
        console.log('----------------------------------------');
        console.log(`Access Token: ${data.access_token}`);
        console.log(`Token Type:   ${data.token_type}`);
        console.log(`Expires In:   ${data.expires_in} seconds (~${Math.round(data.expires_in / 86400)} days)`);
        console.log('----------------------------------------');
        console.log('\n📝 Update your .env file with this new META_API_TOKEN value.');

    } catch (error) {
        console.error('\n❌ Error fetching long-lived token:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Message: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.error(`   ${error.message}`);
        }
    }
}

// Run the function
getLongLivedToken();
