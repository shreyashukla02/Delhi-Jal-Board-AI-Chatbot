# Delhi Jal Board (DJB) — WhatsApp CRM Grievance Backend

Purpose-built WhatsApp backend for registering, tracking and updating citizen grievances (water/sewer/revenue) via the WhatsApp Cloud API. This README focuses on developer experience (DX): system architecture, message lifecycle, project layout, setup and runtime tips for local development and integration testing.

---

## Table of Contents
- Overview
- System Architecture
- Message / Grievance Lifecycle (logic flow)
- Project Structure (key files)
- Setup & Local Development
- API Integration (WhatsApp Cloud API)
- Testing & Debugging
- Troubleshooting & Common Pitfalls
- Contributing

---

## Overview

This service implements a lightweight stateful chatbot backend that receives WhatsApp webhook events, processes interactive and text messages, runs a simple conversation state machine, and persists tickets into MongoDB.

- Incoming messages are handled by a webhook controller.
- Conversation state is stored per phone number in `UserSession` documents.
- Tickets are created as `Ticket` documents and include category, sub-category, description, media placeholder and contact details.
- Outbound messaging uses the WhatsApp Cloud API (Graph API).

Goal: keep behavior predictable and testable for developers — clear entrypoints, a small state machine, and a test harness (`test_djb_flow.js`) that mocks services.

---

**System Architecture**

- WhatsApp Cloud API → HTTP POST to `/webhook` (controller)
- `webhookController` extracts message payloads (text, interactive/button_reply, list_reply)
- `webhookController` marks message as read (via `whatsappService.markAsRead`) and forwards normalized input to `conversationService.handleConversation(phone, textOrId)`
- `conversationService` manages session state (via `UserSession` model) and drives decisions (send buttons, lists, ask questions)
- `whatsappService` sends interactive messages and text back via Graph API
- `Ticket` documents are created in MongoDB when submission completes

Diagram (simplified):

User (WhatsApp) -> WhatsApp Cloud API -> /webhook -> webhookController -> conversationService -> (UserSession, Ticket DB) -> whatsappService -> WhatsApp Cloud API -> User

---

## Message / Grievance Lifecycle (detailed)

1. User sends message (e.g., "Hi") to the WhatsApp business number.
2. WhatsApp Cloud API POSTs the event to your configured `/webhook` endpoint.
3. `webhookController` verifies event type, extracts `messages[]` entries.
	 - If `message.type === 'text'` → `message.text.body` used
	 - If `message.type === 'interactive'` and `interactive.type === 'button_reply'` → `interactive.button_reply.id` used
	 - If `message.type === 'interactive'` and `interactive.type === 'list_reply'` → `interactive.list_reply.id` used
4. `webhookController` calls `markAsRead(messageId)` to acknowledge message in WhatsApp.
5. Webhook forwards the normalized payload (phone number and id/text) to `conversationService.handleConversation(phone, input)`.
6. `conversationService` loads/creates a `UserSession` for the phone number and reads `currentStep`.
7. Based on the step and input, the service will:
	 - send interactive buttons (max 3) via `whatsappService.sendInteractiveButtons`
	 - send interactive lists via `whatsappService.sendInteractiveList` for large choices
	 - collect free-text inputs (name, address, description)
8. When user reaches the end of the register flow, `createTicket(session)` saves a `Ticket` document and sends a confirmation message containing the ticket ID.
9. Users can query status by sending the ticket ID; `conversationService` fetches the `Ticket` and replies with status / JE details.

Notes:
- Interactive payload handler uses the `id` field sent by WhatsApp for button/list replies (e.g., `LANG_EN`, `SUB_SEWER`, `OPT_0`). The system treats these IDs as normalized commands.
- Button titles must respect WhatsApp limits (max 20 characters). Keep short labels like `English`, `Hindi`, `Register`, `Check Status`.

---

## Project Structure (key files & folders)

- `src/controllers`
	- `webhookController.js` — main webhook entrypoint, sanitizes payloads and routes to services

- `src/services`
	- `conversationService.js` — state machine, step handlers, ticket creation logic
	- `whatsappService.js` — low-level Graph API calls: send text, interactive buttons, list messages, markAsRead

- `src/models`
	- `UserSession.js` — session schema (phoneNumber, currentStep, language, draftData)
	- `Ticket.js` — ticket schema (ticketID, status, description, category, subCategory, mediaUrl, contact fields)

- `src/utils`
	- `locale.js` — localized strings (English, Hindi). Use `getMessage(lang, key)` to fetch templates.
	- `helpers.js` — validation and small helpers (ticket ID generator, validators)

- Tests & Dev
	- `test_djb_flow.js` — local unit-style test harness that mocks DB and WhatsApp service for quick verification

- Entry
	- `server.js` — Express app wiring the `/webhook` endpoint and loading configuration

Files of interest to start reading:
- `src/controllers/webhookController.js`
- `src/services/conversationService.js`
- `src/services/whatsappService.js`

---

## Setup & Local Development (DX-focused)

Prerequisites
- Node 16+ (or project Node version in `package.json`)
- MongoDB (local or hosted)
- Ngrok (or another tunneling tool) for webhook testing

1) Clone and install

```powershell
git clone <repo-url>
cd crm_wa_backend
npm install
```

2) Environment variables

Create a `.env` in project root with these values (example):

```env
# WhatsApp / Meta
META_API_TOKEN=EAA...your_token_here
PHONE_NUMBER_ID=1234567890
GRAPH_API_VERSION=v18.0
WEBHOOK_VERIFY_TOKEN=some_shared_secret

# App
PORT=3000
MONGODB_URI=mongodb://localhost:27017/djb_crm
```

3) Expose local server to WhatsApp (Ngrok)

Start server locally and expose it:

```powershell
# Start server in one terminal
node server.js

# In another terminal install & run ngrok (if not installed)
# ngrok http 3000

# Copy the HTTPS ngrok URL and set it as your webhook in the Meta App dashboard
```

4) MongoDB / migrations

This project uses Mongoose. There are no migration scripts by default — schema changes are applied via models. For production, use a migration tool (like `migrate-mongo`) or add index creation scripts.

To seed or test locally, run `node test_djb_flow.js` which uses a mocked DB and WhatsApp service to simulate the flow.

5) Run server

```powershell
node server.js
```

---

## WhatsApp Cloud API Integration

Key integration points:

- `whatsappService.sendMessage(to, text)` — sends plain text messages
- `whatsappService.sendInteractiveButtons(to, bodyText, buttons)` — sends a button interactive message (max 3 buttons). Buttons must have titles ≤ 20 chars.
- `whatsappService.sendInteractiveList(to, bodyText, buttonText, sections)` — sends list messages for larger option sets
- `whatsappService.markAsRead(messageId)` — marks message as read via Graph API

Important payload rules & tips:
- Button titles: 1–20 characters. Use short labels such as `English`, `Hindi`, `Register`, `Check Status` to avoid Graph API errors.
- For interactive replies, WhatsApp returns `interactive` message types. Always parse `interactive.button_reply.id` or `interactive.list_reply.id` — the `id` is the stable command.
- Use `recipient_type: 'individual'` and `messaging_product: 'whatsapp'` in payloads.

Example button reply webhook snippet (normalized by `webhookController`):

```json
{
	"from": "919356610789",
	"type": "interactive",
	"interactive": {
		"type": "button_reply",
		"button_reply": { "id": "LANG_EN", "title": "English" }
	}
}
```

The controller converts that to a call:

```js
handleConversation('919356610789', 'LANG_EN');
```

---

## Testing & Debugging (Developer Tips)

- `test_djb_flow.js` provides a runnable simulation: it mocks `UserSession` and `Ticket` models and the `whatsappService` to print the conversation flow to the terminal.
- Useful commands while debugging:

```powershell
# start server
node server.js

# run local flow simulation
node test_djb_flow.js
```

- Watch webhook logs: `webhookController` logs the raw webhook JSON. If you see `Ignoring non-text message type`, ensure controller can parse `interactive` payloads — the app now supports `button_reply` and `list_reply`.

Common errors & fixes
- "Button title length invalid": shorten button `title` to <= 20 chars
- 400 errors from Graph API: inspect `error.response.data` from axios logs to see field-level details
