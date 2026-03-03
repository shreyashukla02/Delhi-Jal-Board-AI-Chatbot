const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  META_API_TOKEN: process.env.META_API_TOKEN,
  PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN || 'mysecrettoken123',
  GRAPH_API_VERSION: process.env.GRAPH_API_VERSION || 'v18.0'
};
