# WhatsApp Grievance Management System - Backend

A production-ready backend system for managing citizen grievances through WhatsApp using Node.js, Express, and MongoDB. The system implements a conversational chatbot that collects user information, creates tickets, and provides status updates.

## 🚀 Features

- **Multi-language Support**: English and Hindi localization
- **State Machine Architecture**: Robust conversation flow management
- **WhatsApp Cloud API Integration**: Official Meta WhatsApp Business API
- **MongoDB Database**: Persistent storage with Mongoose ODM
- **Ticket Management**: Create, track, and update grievance tickets
- **Real-time Notifications**: Users receive WhatsApp notifications on status updates
- **JE/Admin API**: RESTful endpoints for ticket management
- **Validation**: Input validation for phone, email, and PIN codes

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher) - Running locally or remote connection
- **WhatsApp Business Account** with Cloud API access
- **Meta Developer Account** with WhatsApp Business App

## 📁 Project Structure

```
crm_wa_backend/
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
└── src/
    ├── config/
    │   ├── config.js           # Configuration management
    │   └── database.js         # MongoDB connection
    ├── models/
    │   ├── UserSession.js      # User session schema
    │   ├── Ticket.js           # Ticket schema
    │   └── JuniorEngineer.js   # JE schema
    ├── controllers/
    │   ├── webhookController.js # WhatsApp webhook handlers
    │   └── jeController.js      # JE/Admin API handlers
    ├── services/
    │   ├── whatsappService.js   # WhatsApp API wrapper
    │   └── conversationService.js # State machine logic
    ├── routes/
    │   ├── webhook.js           # Webhook routes
    │   └── je.js               # JE/Admin routes
    └── utils/
        ├── locale.js            # Localization dictionary
        └── helpers.js           # Helper functions
```

## ⚙️ Installation & Setup

### Step 1: Clone or Extract the Project

```powershell
cd "e:\Projects\College Projects\crm_wa_backend"
```

### Step 2: Install Dependencies

```powershell
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

2. Edit `.env` file with your credentials:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/whatsapp_grievance_bot

# WhatsApp Cloud API Configuration
META_API_TOKEN=your_meta_api_token_here
PHONE_NUMBER_ID=your_phone_number_id_here
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token_here

# API Version
GRAPH_API_VERSION=v18.0
```

**How to get WhatsApp credentials:**

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or select existing WhatsApp Business app
3. Navigate to WhatsApp > Getting Started
4. Copy the **Phone Number ID** and **Access Token**
5. Set a custom **Webhook Verify Token** (any secure string)

### Step 4: Start MongoDB

Ensure MongoDB is running locally:

```powershell
# If MongoDB is installed as a service
net start MongoDB

# Or run mongod manually
mongod --dbpath="C:\data\db"
```

### Step 5: Start the Server

**Development mode with auto-reload:**

```powershell
npm run dev
```

**Production mode:**

```powershell
npm start
```

You should see:

```
╔════════════════════════════════════════════════════════╗
║   WhatsApp Grievance Management System - Backend      ║
╚════════════════════════════════════════════════════════╝

✓ MongoDB connected successfully
  Database: whatsapp_grievance_bot
✓ Server is running on port 3000
✓ Environment: development

📍 Endpoints:
   - Health: http://localhost:3000/health
   - Webhook: http://localhost:3000/webhook
   - JE API: http://localhost:3000/je

🚀 Ready to receive WhatsApp messages!
```

## 🌐 Webhook Setup (for WhatsApp)

### Local Development with ngrok

Since WhatsApp needs a public HTTPS URL, use ngrok for local testing:

1. Download and install [ngrok](https://ngrok.com/)

2. Start ngrok tunnel:

```powershell
ngrok http 3000
```

3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. Configure in Meta Developer Console:
   - Go to WhatsApp > Configuration
   - **Callback URL**: `https://abc123.ngrok.io/webhook`
   - **Verify Token**: Your `WEBHOOK_VERIFY_TOKEN` from `.env`
   - Click "Verify and Save"

5. Subscribe to webhook fields:
   - Check: `messages`

## 📱 Conversation Flow

The bot follows this state machine:

1. **Language Selection**: User chooses English (1) or Hindi (2)
2. **Grievance Description**: User describes the issue
3. **Department**: User specifies the department
4. **Locality**: User provides locality/area
5. **Site Address**: Complete site address
6. **Name**: User's full name
7. **PIN Code**: 6-digit PIN code (validated)
8. **Mobile**: 10-digit mobile number (validated)
9. **Email**: Email address (validated)
10. **Residential Address**: User's home address
11. **Confirmation**: Review and Submit or Edit
12. **Ticket Created**: Unique ticket ID generated

**Special Commands:**
- Type `Hi` or `Reset` anytime to restart the conversation

## 🔧 API Endpoints

### Webhook Endpoints

**1. Verify Webhook (GET)**
```
GET /webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE
```

**2. Receive Messages (POST)**
```
POST /webhook
```
- Automatically handled by WhatsApp Cloud API
- Processes incoming user messages

### JE/Admin Endpoints

**1. Update Ticket Status**

```http
POST /je/update-status
Content-Type: application/json

{
  "ticketID": "DL-1001",
  "newStatus": "IN_PROGRESS",
  "remarks": "Engineer assigned, work will begin tomorrow",
  "updatedBy": "JE-001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket updated and user notified successfully",
  "data": {
    "ticketID": "DL-1001",
    "oldStatus": "OPEN",
    "newStatus": "IN_PROGRESS",
    "remarks": "Engineer assigned, work will begin tomorrow"
  }
}
```

**Valid Status Values:**
- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`

**2. Get Ticket Details**

```http
GET /je/ticket/DL-1001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketID": "DL-1001",
    "status": "OPEN",
    "description": "Street light not working",
    "department": "Electricity",
    "locality": "Connaught Place",
    "siteAddress": "Block A, CP, New Delhi",
    "name": "John Doe",
    "pinCode": "110001",
    "mobile": "9876543210",
    "email": "john@example.com",
    "userResidentialAddress": "123 Main St, Delhi",
    "submissionDate": "2025-12-09T10:30:00.000Z",
    "statusHistory": []
  }
}
```

**3. Get All Tickets**

```http
GET /je/tickets?status=OPEN&limit=20&skip=0
```

**Query Parameters:**
- `status` (optional): Filter by status (OPEN, IN_PROGRESS, RESOLVED)
- `department` (optional): Filter by department
- `limit` (optional): Number of records (default: 50)
- `skip` (optional): Skip records for pagination (default: 0)

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "WhatsApp Grievance Bot is running",
  "timestamp": "2025-12-09T10:00:00.000Z",
  "environment": "development"
}
```

## 🧪 Testing with Postman/cURL

### Test Ticket Status Update

**Using cURL:**

```powershell
curl -X POST http://localhost:3000/je/update-status `
  -H "Content-Type: application/json" `
  -d '{\"ticketID\": \"DL-1001\", \"newStatus\": \"IN_PROGRESS\", \"remarks\": \"Work in progress\"}'
```

**Using PowerShell:**

```powershell
$body = @{
    ticketID = "DL-1001"
    newStatus = "IN_PROGRESS"
    remarks = "Engineer assigned"
    updatedBy = "Admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/je/update-status" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Test Get All Tickets

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/je/tickets?status=OPEN" -Method GET
```

## 📊 Database Collections

### UserSession Collection
- Stores user conversation state
- Tracks language preference
- Holds draft data during conversation

### Ticket Collection
- Stores all grievance tickets
- Tracks status history
- Links to assigned Junior Engineers

### JuniorEngineer Collection
- Stores JE information
- Department assignments
- Contact details

## 🔍 Monitoring & Logs

The application logs important events to console:

- ✓ Message sent/received
- ✓ Ticket created
- ✓ Ticket status updated
- ✓ Database operations
- ✗ Errors and warnings

## 🛠️ Troubleshooting

### MongoDB Connection Failed

```
✗ MongoDB connection failed: connect ECONNREFUSED
```

**Solution:**
- Ensure MongoDB is running: `net start MongoDB`
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB is listening on port 27017

### Webhook Verification Failed

```
✗ Webhook verification failed
```

**Solution:**
- Check `WEBHOOK_VERIFY_TOKEN` matches in `.env` and Meta console
- Ensure ngrok tunnel is active
- Verify callback URL is correct

### WhatsApp Messages Not Sending

```
Error sending WhatsApp message: Invalid OAuth access token
```

**Solution:**
- Verify `META_API_TOKEN` is correct and not expired
- Check `PHONE_NUMBER_ID` is correct
- Ensure you have WhatsApp Business API access

### Module Not Found Error

```
Error: Cannot find module 'express'
```

**Solution:**
```powershell
npm install
```

## 🚀 Production Deployment

### Using PM2 (Process Manager)

```powershell
npm install -g pm2

# Start application
pm2 start server.js --name "whatsapp-grievance-bot"

# View logs
pm2 logs whatsapp-grievance-bot

# Monitor
pm2 monit

# Restart
pm2 restart whatsapp-grievance-bot
```

### Environment Best Practices

- Use strong `WEBHOOK_VERIFY_TOKEN`
- Never commit `.env` file
- Rotate API tokens regularly
- Use MongoDB Atlas for production database
- Enable HTTPS (required for WhatsApp)
- Set up proper error monitoring (e.g., Sentry)

## 📝 License

MIT License - Feel free to use and modify for your needs.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Meta WhatsApp documentation
3. Verify all environment variables are correct

## 🎯 Next Steps

- [ ] Add authentication for JE endpoints
- [ ] Implement ticket assignment algorithm
- [ ] Add image/file upload support
- [ ] Create admin dashboard
- [ ] Add analytics and reporting
- [ ] Implement ticket priority levels
- [ ] Add email notifications
- [ ] Create mobile app for JEs

---

**Built with ❤️ for better citizen services**
