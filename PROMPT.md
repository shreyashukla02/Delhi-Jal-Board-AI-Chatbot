# Master Prompt: WhatsApp Grievance Bot Backend Generation

**Role:** Act as a Senior Backend Engineer and System Architect.
**Objective:** Generate a complete, production-ready backend for a generic WhatsApp Grievance Management System using **Node.js, Express, and MongoDB (Mongoose)**. The system must be runnable on `localhost` immediately.

## 1. Project Overview
The application acts as a middleware between the WhatsApp Cloud API and a database. It functions as a chatbot state machine that collects user grievance details, generates a ticket, assigns it to a Junior Engineer (JE), and handles status updates back to the user.

## 2. Technical Stack & Requirements
* **Framework:** Node.js with Express.
* **Database:** MongoDB (use Mongoose for schema definition).
* **Environment:** Use `dotenv` for configuration (PORT, META_API_TOKEN, PHONE_NUMBER_ID, MONGODB_URI).
* **Architecture:** Modular structure (Routes, Controllers, Services, Models, Utils).
* **Localization:** The bot must support dynamic language switching (English & Hindi). Store all bot response strings in a separate localization dictionary/object (e.g., `locales.js`).

## 3. Database Schema Requirements
Create the following Mongoose models with appropriate data types and validation:

### A. UserSession Model (for State Management)
Since WhatsApp is stateless, this model tracks the user's progress.
* `phoneNumber` (String, Unique, Index)
* `currentStep` (String - e.g., 'ASK_LANG', 'ASK_DESC', 'CONFIRM_DETAILS')
* `language` (String - 'en' or 'hi')
* `draftData` (Object/Map - to temporarily store inputs like description, site_address, etc., before final submission)

### B. Ticket Model (The Grievance)
* `ticketID` (String, Unique - e.g., "DL-1001")
* `status` (Enum: 'OPEN', 'IN_PROGRESS', 'RESOLVED')
* `submissionDate` (Date)
* `assignedJE` (Reference to JE Model, optional for now)
* **Grievance Details:**
    * Description
    * Department
    * Locality
    * Site Address
    * Name
    * PIN Code
    * Mobile
    * Email
    * User Residential Address

### C. JE (Junior Engineer) Model
* `jeID` (String)
* `name` (String)
* `department` (String)
* `mobileNumber` (String)

## 4. API Endpoints

### A. WhatsApp Webhook
* `GET /webhook`: Handle Meta verification (hub.mode, hub.verify_token).
* `POST /webhook`: Receive messages. This is the core logic entry point. It must:
    1.  Extract the sender's phone number and message body.
    2.  Retrieve the `UserSession`.
    3.  Pass data to a "Conversation Service" to determine the next response based on the `currentStep`.

### B. JE/Admin Endpoints (to simulate the closed loop)
* `POST /je/update-status`: Accepts `ticketID`, `newStatus`, and `remarks`.
    * **Logic:** Update the Ticket in DB *AND* trigger a WhatsApp message to the user informing them of the update.

## 5. Conversation Flow & State Machine Logic
Implement a switch-case or object-lookup logic to handle the following states. 
*Note: At every step, check the user's selected language and fetch the string from the Localization Dictionary.*

1.  **Greeting / Start:** If new user or keyword "Hi/Reset", set state `ASK_LANGUAGE`. Ask: "Choose Language: 1. English, 2. Hindi".
2.  **ASK_LANGUAGE:** Validate input. Set `language` in session. Set state `ASK_DESCRIPTION`. Ask: "Please describe your grievance."
3.  **ASK_DESCRIPTION:** Save input to `draftData`. Set state `ASK_DEPARTMENT`. Ask for Department.
4.  **ASK_DEPARTMENT:** Save input. Set state `ASK_LOCALITY`. Ask for Locality.
5.  **ASK_LOCALITY:** Save input. Set state `ASK_SITE_ADDRESS`. Ask for Site Address.
6.  **ASK_SITE_ADDRESS:** Save input. Set state `ASK_NAME`. Ask for Name.
7.  **ASK_PIN:** Save input. Validate it is numeric. Set state `ASK_MOBILE`. Ask for Mobile.
8.  **ASK_MOBILE:** Save input. Set state `ASK_EMAIL`. Ask for Email.
9.  **ASK_EMAIL:** Save input. Set state `ASK_USER_ADDRESS`. Ask for User Address.
10. **ASK_USER_ADDRESS:** Save input. Set state `CONFIRMATION`.
    * **Action:** Format all `draftData` into a readable string list.
    * **Bot Message:** Display the list. Ask: "1. Submit, 2. Edit".
11. **CONFIRMATION:**
    * If **1 (Submit)**: Create `Ticket` document, generate Ticket ID, Clear Session `draftData` (but keep language), Send "Ticket Generated: [ID]".
    * If **2 (Edit)**: Ask "Which field to edit? (Reply with field name)" -> Set state back to that specific step (Simulate simple edit logic or just restart for MVP).

## 6. Helper Functions needed
* `sendMessage(to, text)`: A wrapper around Axios to send POST requests to the Meta Graph API.
* `generateTicketID()`: Simple utility to create unique short IDs.

## 7. Instructions for Generation
* Provide the full folder structure.
* Provide the code for `server.js` (entry), `models/*.js`, `controllers/webhookController.js`, `services/whatsappService.js` (logic), and `utils/locale.js`.
* Include a `README.md` on how to run it, set up the `.env`, and how to simulate the JE update using Postman or cURL.
* Ensure error handling is present (try-catch blocks).
* **Crucial:** Use the official 'WhatsApp Cloud API' JSON structure for sending text messages.