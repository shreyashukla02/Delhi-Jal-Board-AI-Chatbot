const UserSession = require("../models/UserSession");
const Ticket = require("../models/Ticket");
const {
  sendMessage,
  sendInteractiveButtons,
  sendFlow,
  sendInteractiveList
} = require("./whatsappService");
const { getMessage } = require("../utils/locale");
const { analyzeComplaint } = require("./aiService");
const { generateTicketID, validateMobile } = require("../utils/helpers");

async function handleConversation(phoneNumber, messageText) {
  try {
    const userInput = messageText.trim();

    // Reset Command
    if (userInput.toLowerCase() === "hi" || userInput.toLowerCase() === "reset") {
      await UserSession.findOneAndDelete({ phoneNumber });
    }

    let session = await UserSession.findOne({ phoneNumber });

    // 🆕 Create New Session if not exists
    if (!session) {
      console.log(`🆕 Creating New Session for ${phoneNumber}`);
      session = new UserSession({
        phoneNumber,
        currentStep: "ASK_LANGUAGE",
        language: "en",
      });
      await session.save();

      const buttons = [
        { id: "LANG_EN", title: "English" },
        { id: "LANG_HI", title: "हिंदी" },
      ];
      await sendInteractiveButtons(
        phoneNumber,
        "Welcome to Delhi Jal Board (DJB)! I am JalMitr.\nदिल्ली जल बोर्ड (DJB) में आपका स्वागत है! मैं जलमित्र हूँ। \n\nPlease select your preferred language: \nकृपया अपनी पसंदीदा भाषा चुनें:",
        buttons
      );
      return;
    }

    // Handle Flow Response
    if (userInput.startsWith("FLOW_RESPONSE:")) {
      const flowData = JSON.parse(userInput.replace("FLOW_RESPONSE:", ""));
      await handleFlowResponse(session, flowData);
      return;
    }

    await processStep(session, userInput);
  } catch (error) {
    console.error("Error in conversation:", error);
  }
}

async function processStep(session, userInput) {
  const { currentStep, language, phoneNumber } = session;
  const isHindi = language === 'hi';

  switch (currentStep) {
    case "ASK_LANGUAGE":
      await handleLanguageSelection(session, userInput);
      break;
    case "MAIN_MENU":
      await handleMainMenu(session, userInput);
      break;
      
    // --- MANUAL FLOW CASES ---
    case "ASK_NAME":
      session.name = userInput;
      session.currentStep = "ASK_MOBILE";
      await session.save();
      await sendMessage(phoneNumber, getMessage(language, "askMobile")); // Uses locale.js logic
      break;
    case "ASK_MOBILE":
      if (!validateMobile(userInput)) {
        await sendMessage(phoneNumber, getMessage(language, "invalidMobile"));
        return;
      }
      session.mobile = userInput;
      session.currentStep = "ASK_USER_ADDRESS";
      await session.save();
      await sendMessage(phoneNumber, getMessage(language, "askUserAddress"));
      break;
    case "ASK_USER_ADDRESS":
      session.address = userInput;
      session.currentStep = "ASK_GRIEVANCE_ADDRESS";
      await session.save();
      await sendMessage(phoneNumber, getMessage(language, "askGrievanceAddress"));
      break;
    case "ASK_GRIEVANCE_ADDRESS":
      session.description = `[Location: ${userInput}]`;
      session.currentStep = "ASK_CATEGORY";
      await session.save();

      // 👇 FIX: Category Buttons in Hindi if selected
      const catButtons = [
        { id: "CAT_CRM", title: isHindi ? "पानी/सीवर (CRM)" : "Water/Sewer (CRM)" },
        { id: "CAT_RMS", title: isHindi ? "बिलिंग (RMS)" : "Billing (RMS)" },
      ];
      await sendInteractiveButtons(
        phoneNumber,
        getMessage(language, "askCategory"),
        catButtons
      );
      break;
    case "ASK_CATEGORY":
      await handleCategorySelection(session, userInput);
      break;
    case "ASK_SUB_CATEGORY":
      await handleSubCategorySelection(session, userInput);
      break;
    case "ASK_DESCRIPTION":
      if (session.description) {
        session.description = session.description + " " + userInput;
      } else {
        session.description = userInput;
      }
      await createTicket(session, "Manual Form");
      break;
      
    // --- STATUS CHECK ---
    case "VIEW_STATUS_INPUT":
    const ticketID = userInput.trim();

    const ticket = await Ticket.findOne({ ticketID });

    if (!ticket) {
        await sendMessage(
            phoneNumber,
            isHindi 
              ? "❌ अमान्य टिकट आईडी। कृपया दोबारा जांचें।"
              : "❌ Invalid Ticket ID. Please check again."
        );
        return;
    }

    const statusMsg = isHindi
        ? `📌 *टिकट स्थिति*\n
🆔 *टिकट आईडी:* ${ticket.ticketID}
👤 *नाम:* ${ticket.name}
📞 *मोबाइल:* ${ticket.mobile}
📂 *श्रेणी:* ${ticket.category}
📌 *सब-कैटेगरी:* ${ticket.subCategory}
📝 *समस्या:* ${ticket.description}
📍 *पता:* ${ticket.grievanceAddress}
🚦 *स्थिति:* ${ticket.status}
📅 *तारीख:* ${ticket.submissionDate.toDateString()}`
        : `📌 *Ticket Status*\n
🆔 *Ticket ID:* ${ticket.ticketID}
👤 *Name:* ${ticket.name}
📞 *Mobile:* ${ticket.mobile}
📂 *Category:* ${ticket.category}
📌 *Sub-category:* ${ticket.subCategory}
📝 *Issue:* ${ticket.description}
📍 *Address:* ${ticket.grievanceAddress}
🚦 *Status:* ${ticket.status}
📅 *Date:* ${ticket.submissionDate.toDateString()}`;

    await sendMessage(phoneNumber, statusMsg);

    // Reset to menu
    session.currentStep = "MAIN_MENU";
    await session.save();
    break;

    // --- AI CHAT FLOW ---
    case "AI_CHAT_MODE":
      await handleAIChatLoop(session, userInput);
      break;
      
    case "AI_CONFIRMATION_MODE":
      await handleAIConfirmation(session, userInput);
      break;

    default:
      await sendMessage(
        phoneNumber,
        "I'm not sure I understood that. Type 'Hi' to start over."
      );
  }
}

async function handleLanguageSelection(session, userInput) {
  const isHindi = userInput.toLowerCase().includes("hi") || userInput === "LANG_HI";
  
  session.language = isHindi ? "hi" : "en";
  session.currentStep = "MAIN_MENU";
  await session.save();

  // Dynamic Buttons based on Language
  const buttons = [
    { id: "MENU_AI", title: isHindi ? "AI के साथ फॉर्म भरें" : "Fill Form with AI" },     
    { id: "MENU_MANUAL", title: isHindi ? "खुद फॉर्म भरें" : "Fill Form Manually" }, 
    { id: "MENU_STATUS", title: isHindi ? "स्थिति देखें" : "Check Status" }, 
  ];
  
  const welcomeMsg = isHindi 
    ? "आज मैं आपकी क्या सहायता कर सकता हूँ?"
    : "How can I assist you today?";

  await sendInteractiveButtons(session.phoneNumber, welcomeMsg, buttons);
}

async function handleMainMenu(session, userInput) {
  const choice = userInput;
  const isHindi = session.language === 'hi';
  
  if (choice === "MENU_MANUAL") {
    session.currentStep = "ASK_NAME";
    await session.save();
    // getMessage handles the text translation for "Please enter your name"
    await sendMessage(session.phoneNumber, getMessage(session.language, "askName"));
    
  } else if (choice === "MENU_STATUS") {
    session.currentStep = "VIEW_STATUS_INPUT";
    await session.save();
    const msg = isHindi ? "कृपया अपना टिकट आईडी (Ticket ID) दर्ज करें:" : "Please enter your Ticket ID:";
    await sendMessage(session.phoneNumber, msg);
    
  } else if (choice === "MENU_AI") {
    session.currentStep = "AI_CHAT_MODE";
    await session.save();
    await sendMessage(
      session.phoneNumber,
      isHindi
        ? "नमस्ते! मैं *जलमित्र* हूँ 💧।\nकृपया मुझे अपनी समस्या बताएं, और मैं शिकायत दर्ज करने में आपकी मदद करूँगा।"
        : "Welcome! I am *JalMitr* 💧.\nPlease tell me about your problem, and I will help you register a complaint."
    );
    
  } else {
    session.currentStep = "AI_CHAT_MODE";
    await session.save();
    await handleAIChatLoop(session, userInput);
  }
}

async function handleFlowResponse(session, flowData) {
  console.log("📝 Flow Data Received:", flowData);

  session.name = flowData.name;
  session.mobile = flowData.mobile;
  session.email = flowData.email || "Not Provided";
  session.address = flowData.user_address;

  const grievanceAddr = `${flowData.house_no}, ${flowData.colony}, ${
    flowData.landmark || ""
  }, Delhi - ${flowData.pincode}`;

  session.description = `[Location: ${grievanceAddr}]`;
  session.currentStep = "ASK_CATEGORY";
  await session.save();

  // 👇 FIX: Category Buttons in Hindi for Flow Response as well
  const isHindi = session.language === 'hi';
  const buttons = [
    { id: "CAT_CRM", title: isHindi ? "पानी/सीवर (CRM)" : "Water/Sewer (CRM)" },
    { id: "CAT_RMS", title: isHindi ? "बिलिंग (RMS)" : "Billing (RMS)" },
  ];
  await sendInteractiveButtons(
    session.phoneNumber,
    getMessage(session.language, "askCategory"),
    buttons
  );
}

async function handleCategorySelection(session, userInput) {
    const isHindi = session.language === 'hi';

    if (userInput === 'CAT_CRM') {
        session.category = 'CRM';
        session.currentStep = 'ASK_SUB_CATEGORY';
        await session.save();
        
        // 👇 FIX: Sub-Category List Titles in Hindi
        const sections = [{
          title: isHindi ? "समस्या चुनें" : "Select Issue",
          rows: [
            { id: 'SUB_SEWER', title: isHindi ? "सीवर की समस्या" : 'Sewer Issue' },
            { id: 'SUB_WATER', title: isHindi ? "पानी की आपूर्ति" : 'Water Supply' },
            { id: 'SUB_TANKER', title: isHindi ? "टैंकर अनुरोध" : 'Tanker Request' },
            { id: 'SUB_LOGGING', title: isHindi ? "जल भराव" : 'Water Logging' }
          ]
        }];
        
        const listBody = isHindi 
            ? "कृपया नीचे दी गई सूची से अपनी समस्या का चयन करें:" 
            : getMessage(session.language, 'askSubCategoryCRM'); // fallback if key exists
            
        await sendInteractiveList(session.phoneNumber, listBody, isHindi ? "समस्या चुनें" : "Select Issue", sections);

      } else if (userInput === 'CAT_RMS') {
        session.category = 'RMS';
        session.subCategory = 'Billing';
        session.currentStep = 'ASK_DESCRIPTION';
        await session.save();
        await sendMessage(session.phoneNumber, getMessage(session.language, 'askDescription'));
      } else {
        await sendMessage(session.phoneNumber, isHindi ? "कृपया एक वैध श्रेणी चुनें।" : "Please select a valid category.");
      }
}

async function handleSubCategorySelection(session, userInput) {
    // Internal mapping stays English for DB consistency
    const subCatMap = {
        'SUB_SEWER': 'Sewer',
        'SUB_WATER': 'Water Supply',
        'SUB_TANKER': 'Tanker',
        'SUB_LOGGING': 'Water Logging'
      };
      
      if (subCatMap[userInput]) {
        session.subCategory = subCatMap[userInput];
        session.currentStep = 'ASK_DESCRIPTION';
        await session.save();
        await sendMessage(session.phoneNumber, getMessage(session.language, 'askDescription'));
      } else {
        const isHindi = session.language === 'hi';
        await sendMessage(session.phoneNumber, isHindi ? "कृपया सूची से एक वैध विकल्प चुनें।" : "Please select a valid option from the list.");
      }
}

async function handleAIChatLoop(initialSession, userInput) {
  const session = await UserSession.findOne({ phoneNumber: initialSession.phoneNumber });

  const currentData = {
    name: session.name || null,
    mobile: session.mobile || null,
    address: session.address || null,
    issue: session.description || null,
  };

  console.log("🔍 Sending to AI (Context):", JSON.stringify(currentData));

  const aiResult = await analyzeComplaint(userInput, currentData);

  if (!aiResult) {
    const msg = session.language === 'hi' 
      ? "तकनीकी त्रुटि। कृपया पुनः प्रयास करें।" 
      : "Technical error. Please try again.";
    await sendMessage(session.phoneNumber, msg);
    return;
  }

  const extracted = aiResult.extractedData;
  console.log("🤖 Received from AI:", JSON.stringify(extracted));

  if (extracted.name) session.name = extracted.name;
  if (extracted.mobile) session.mobile = extracted.mobile;
  if (extracted.address) session.address = extracted.address;
  if (extracted.category) session.category = extracted.category;
  if (extracted.subCategory) session.subCategory = extracted.subCategory;
  if (extracted.issue && extracted.issue !== "null") session.description = extracted.issue;

  await session.save();

  if (aiResult.isComplete) {
    session.currentStep = "AI_CONFIRMATION_MODE";
    await session.save();
    await sendMessage(session.phoneNumber, aiResult.nextQuestion);
  } else {
    await sendMessage(session.phoneNumber, aiResult.nextQuestion);
  }
}

async function handleAIConfirmation(session, userInput) {
    const text = userInput.toLowerCase();
    const affirmative = ["yes", "confirm", "ok", "okay", "correct", "sahi", "haan", "ha", "submit", "thik", "han", "h"];
    
    const isConfirmed = affirmative.some(word => text.includes(word));

    if (isConfirmed) {
        await createTicket(session, "AI-Assistant");
    } else {
        session.currentStep = "AI_CHAT_MODE";
        await session.save();
        const msg = session.language === 'hi' ? "ठीक है, मैं इसे अपडेट कर रहा हूँ..." : "Okay, updating details...";
        await sendMessage(session.phoneNumber, msg);
        await handleAIChatLoop(session, userInput);
    }
}

async function createTicket(session, source) {
  const ticketID = generateTicketID();
  let grievanceAddr = session.address || "Address Not Provided";
  let finalDescription = session.description;

  if (session.description && session.description.startsWith("[Location:")) {
    const parts = session.description.split("]");
    if (parts.length > 1) {
      grievanceAddr = parts[0].replace("[Location: ", "").trim();
      finalDescription = parts.slice(1).join("]").trim();
    }
  }

  const ticket = new Ticket({
    ticketID,
    status: "OPEN",
    description: finalDescription,
    grievanceAddress: grievanceAddr,
    userResidentialAddress: session.address || "Address Not Provided",
    name: session.name,
    mobile: session.mobile,
    email: "whatsapp_user@djb.gov.in",
    category: session.category || "General",
    subCategory: session.subCategory || "Others",
    submissionDate: new Date(),
  });

  await ticket.save();

  const isHindi = session.language === 'hi';
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateStr = new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', dateOptions);
  
  const successMsg = session.language === 'hi'
    ? `✅ *शिकायत सफलतापूर्वक दर्ज की गई*\n
🆔 *टिकट आईडी:* ${ticketID}
👤 *नाम:* ${session.name || "N/A"}
📞 *मोबाइल:* ${session.mobile}
📂 *श्रेणी:* ${session.category || "N/A"}
📌 *सब-कैटेगरी:* ${session.subCategory || "N/A"}
📝 *समस्या:* ${finalDescription}
📍 *पता:* ${grievanceAddr}
🚦 *स्थिति:* OPEN
📅 *तारीख:* ${dateStr}

🙏 *जलमित्र सेवा का उपयोग करने के लिए धन्यवाद।*`

    : `✅ *Complaint Registered Successfully*\n
🆔 *Ticket ID:* ${ticketID}
👤 *Name:* ${session.name || "N/A"}
📞 *Mobile:* ${session.mobile}
📂 *Category:* ${session.category || "N/A"}
📌 *Sub-category:* ${session.subCategory || "N/A"}
📝 *Issue:* ${finalDescription}
📍 *Address:* ${grievanceAddr}
🚦 *Status:* OPEN
📅 *Date:* ${dateStr}

🙏 *Thank you for using JalMitr.*`;

  await sendMessage(session.phoneNumber, successMsg);
  await UserSession.findOneAndDelete({ phoneNumber: session.phoneNumber });
}

module.exports = { handleConversation };
