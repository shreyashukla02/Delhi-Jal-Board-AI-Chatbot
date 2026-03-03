const conversationService = require('../src/services/conversationService');
const UserSession = require('../src/models/UserSession');
const Ticket = require('../src/models/Ticket');
const whatsappService = require('../src/services/whatsappService');

// Mock Data Store
const sessions = new Map();
const tickets = [];

// Mock Mongoose Models
UserSession.findOne = async (query) => {
    const session = sessions.get(query.phoneNumber);
    if (session) {
        // Add save method to the mock object
        session.save = async () => {
            sessions.set(query.phoneNumber, session);
            return session;
        };
    }
    return session;
};

UserSession.findOneAndDelete = async (query) => {
    sessions.delete(query.phoneNumber);
};

// Mock Ticket Model
Ticket.prototype.save = async function() {
    tickets.push(this);
    console.log('   [DB] Ticket Saved:', this.ticketID);
    return this;
};

Ticket.findOne = async (query) => {
    return tickets.find(t => t.ticketID === query.ticketID);
};

// Mock WhatsApp Service
whatsappService.sendMessage = async (to, text) => {
    console.log(`   [WA] Text to ${to}: ${text.replace(/\n/g, ' ')}`);
};

whatsappService.sendInteractiveButtons = async (to, text, buttons) => {
    console.log(`   [WA] Buttons to ${to}: ${text}`);
    console.log(`        Options: ${buttons.map(b => `[${b.id}] ${b.title}`).join(', ')}`);
};

whatsappService.sendInteractiveList = async (to, text, btnText, sections) => {
    console.log(`   [WA] List to ${to}: ${text}`);
    console.log(`        Button: ${btnText}`);
    sections.forEach(s => {
        console.log(`        Section: ${s.title}`);
        s.rows.forEach(r => console.log(`          - [${r.id}] ${r.title}`));
    });
};

// Helper to simulate user input
async function simulateUser(phone, text, description) {
    console.log(`\n--- User (${phone}) says: "${text}" [${description}] ---`);
    await conversationService.handleConversation(phone, text);
}

// Main Test Flow
async function runTest() {
    const phone = '919876543210';
    
    
    // 1. Start / Reset
    await simulateUser(phone, 'Hi', 'Initial Greeting');
    
    // 2. Select Language (Marathi)
    await simulateUser(phone, 'LANG_MR', 'Select Marathi');
    
    // 3. Select Register Complaint
    await simulateUser(phone, 'MENU_REGISTER', 'Select Register');
    
    // 4. Enter Name
    await simulateUser(phone, 'Varad Patil', 'Enter Name');
    
    // 5. Enter Mobile
    await simulateUser(phone, '9876543210', 'Enter Mobile');
    
    // 6. Enter Email
    await simulateUser(phone, 'varad@example.com', 'Enter Email');
    
    // 7. Enter User Address
    await simulateUser(phone, 'Pune, Maharashtra', 'Enter User Address');
    
    // 8. Enter Grievance Address
    await simulateUser(phone, 'Mumbai, Maharashtra', 'Enter Grievance Address');
    
    // 9. Select Category (CRM)
    await simulateUser(phone, 'CAT_CRM', 'Select CRM Category');
    
    // 10. Select Sub-Category (Sewer)
    await simulateUser(phone, 'SUB_SEWER', 'Select Sewer Sub-Category');
    
    // 11. Select Specific Issue (First Option)
    await simulateUser(phone, 'OPT_0', 'Select "Missing Manhole Cover"');
    
    // 12. Enter Description
    await simulateUser(phone, 'Manhole cover is missing.', 'Enter Description');
    
    // 13. Media (Skip)
    await simulateUser(phone, 'Skip', 'Skip Media Upload');
    
    // Check Ticket
    if (tickets.length > 0) {
        console.log('\n✓ Test Passed: Ticket Created!');
        console.log(tickets[0]);
        
        // 14. Check Status
        const ticketID = tickets[0].ticketID;
        await simulateUser(phone, 'MENU_STATUS', 'Check Status Menu');
        await simulateUser(phone, ticketID, 'Enter Ticket ID');
        
    } else {
        console.log('\n❌ Test Failed: No ticket created.');
    }
}

// Run
runTest().catch(console.error);
