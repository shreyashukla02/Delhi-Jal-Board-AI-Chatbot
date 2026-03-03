// reset_db.js
const mongoose = require('mongoose');
require('dotenv').config();

async function clearDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("🔥 Connected to DB. Clearing UserSessions...");
  
  // UserSession collection ko poora uda dega
  await mongoose.connection.collection('usersessions').drop().catch(() => console.log("Collection didn't exist, all good."));
  
  console.log("✅ Database Cleaned. Now your new Schema will work perfectly.");
  process.exit();
}

clearDB();