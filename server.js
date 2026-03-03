const express = require('express');
const config = require('./src/config/config');
const connectDB = require('./src/config/database');

// Import routes
const webhookRoutes = require('./src/routes/webhook');
const jeRoutes = require('./src/routes/je');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/webhook', webhookRoutes);
app.use('/je', jeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'WhatsApp Grievance Bot is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'WhatsApp Grievance Management System API',
    version: '1.0.0',
    endpoints: {
      webhook: {
        verify: 'GET /webhook',
        receive: 'POST /webhook'
      },
      je: {
        updateStatus: 'POST /je/update-status',
        getTicket: 'GET /je/ticket/:ticketID',
        getAllTickets: 'GET /je/tickets'
      },
      health: 'GET /health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDB();

    // Check critical config
    if (!config.META_API_TOKEN || !config.PHONE_NUMBER_ID) {
      console.error('❌ Missing critical configuration: META_API_TOKEN or PHONE_NUMBER_ID is not set.');
      console.error('   Please check your .env file.');
    } else {
      console.log('✓ Configuration loaded successfully');
      console.log(`   - Phone ID: ${config.PHONE_NUMBER_ID}`);
      console.log(`   - Token: ${config.META_API_TOKEN.substring(0, 10)}...`);
    }

    // Start listening
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║   WhatsApp Grievance Management System - Backend      ║');
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log(`\n✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📍 Endpoints:`);
      console.log(`   - Health: http://localhost:${PORT}/health`);
      console.log(`   - Webhook: http://localhost:${PORT}/webhook`);
      console.log(`   - JE API: http://localhost:${PORT}/je`);
      console.log(`\n🚀 Ready to receive WhatsApp messages!\n`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startServer();
