/**
 * Localization Dictionary for English and Hindi
 * Based on Delhi Jal Board WhatsApp Grievance Bot Flow
 */

const locales = {
  en: {
    // 1. Language Selection
    askLanguage:
      "Namaste! I am *JalMitr* 💧, your Delhi Jal Board assistant.\nPlease select your preferred language.\n\nनमस्ते! मैं *जलमित्र* 💧 हूँ, आपका दिल्ली जल बोर्ड सहायक।\nकृपया अपनी भाषा चुनें।",

    // 2. Welcome & Main Menu
    welcome:
      "Welcome to Delhi Jal Board! I am *JalMitr*. I'm here to help you with your water and sewer related queries.\n\nWould you like to register a new grievance or check the status of an existing one?",
    menuOptions: {
      register: "Register Complaint",
      status: "Check Status",
    },

    // Flow Messages
    openFormMessage:
      "Please click the button below to provide your personal details.",
    openFormButton: "Fill Personal Details",
    openAddressFormMessage:
      "Thank you. Now, please provide the address where the issue is located.",
    openAddressFormButton: "Fill Grievance Address",

    // 3A. Register New Complaint - Step 1: Personal Details
    askName: "Let's get started. May I know your name, please?",
    askMobile: "Could you please share your 10-digit mobile number?",
    askEmail: "Please share your email address (optional):",
    askUserAddress: "Please provide your residential address:",

    // Step 2: Grievance Address
    askGrievanceAddress:
      "Where is the problem located?\nPlease provide the complete address (House No., Colony, Landmark, Pincode).",

    // Step 3: Category Selection
    askCategory: "What type of issue are you facing?",
    categories: {
      crm: "Water/Sewer Issue (CRM)",
      rms: "Billing/Meter Issue (RMS)",
    },

    // 4. CRM - Sub-Category Selection
    askSubCategoryCRM: "Could you be more specific about the issue?",
    subCategoriesCRM: {
      sewer: "Sewer",
      water: "Water Supply",
      tanker: "Tanker",
      logging: "Water Logging",
      rms: "None, go to RMS",
    },

    // 4.1 Sewer Complaints
    askSubCategorySewer: "Select specific Sewer complaint:",
    sewerOptions: [
      "Missing of Manhole Cover",
      "Pits on Road Sewer / Road Construction Sewer",
      "Repairing Manhole Cover",
      "Sewer Blockage / Overflow / Leakage",
      "Sewer Garbage",
      "Unauthorized Sewer Connection",
    ],

    // 4.2 Water Supply Complaints
    askSubCategoryWater: "Select specific Water Supply complaint:",
    waterOptions: [
      "Dirty Water (Contamination)",
      "Leakages in Water Pipeline",
      "Low Water Pressure",
      "No Water Supply",
      "Pits on Road / Road Construction",
      "Short Water Supply",
      "Unauthorized Water Connection",
      "Wastage of Water",
    ],

    // 4.3 Tanker Complaints
    askSubCategoryTanker: "Select specific Tanker complaint:",
    tankerOptions: ["Water Tanker Required", "Water Tanker – Missed Trip"],

    // 4.4 Water Logging
    askSubCategoryLogging: "Select specific Water Logging complaint:",
    loggingOptions: ["Water Logging"],

    // 5. Grievance Description & Media
    askDescription: "Please describe the problem in a few words.",
    askMedia:
      "If you have any photos or videos of the issue, please upload them now. Otherwise, simply type 'Skip'.",

    // 6. Confirmation
    confirmation:
      "Thank you! Your grievance has been successfully registered with *JalMitr*. 📝\n\n*Grievance Number: {ticketID}*\n\nWe have notified the concerned department. You can use this number to track the status later.",

    // 3B. View Grievance Status
    askTicketID: "Please enter your registered Grievance Number.",
    statusAssigned:
      "Your grievance is currently assigned to JE/AE {jeDetails}. We are working on it.",
    statusResolved:
      "Good news! Your grievance has been resolved successfully. ✅",
    ticketNotFound:
      "I couldn't find a grievance with that number. Please check and try again.",

    // Validation & Errors
    invalidMobile:
      "That doesn't look like a valid mobile number. Please enter a 10-digit number.",
    invalidEmail: "That doesn't look like a valid email. Please try again.",
    genericError:
      "Oops! Something went wrong. Please try again or type 'Hi' to restart.",
    resetMessage: "Session has been reset. Type 'Hi' to start again.",
  },

  hi: {
    // 1. Language Selection
    askLanguage:
      "नमस्ते! मैं *जलमित्र* 💧 हूँ। कृपया अपनी भाषा चुनें। {हिन्दी/अंग्रेज़ी}",

    // 2. Welcome & Main Menu
    welcome:
      "दिल्ली जल बोर्ड में आपका स्वागत है! मैं *जलमित्र* हूँ। मैं आपकी पानी और सीवर संबंधित समस्याओं में सहायता कर सकता हूँ।\n\nक्या आप नई शिकायत दर्ज करना चाहते हैं या पुरानी शिकायत की स्थिति जानना चाहते हैं?",
    menuOptions: {
      register: "शिकायत दर्ज करें",
      status: "स्थिति देखें",
    },

    // Flow Messages
    openFormMessage:
      "कृपया अपना व्यक्तिगत विवरण देने के लिए नीचे दिए गए बटन पर क्लिक करें।",
    openFormButton: "व्यक्तिगत विवरण भरें",
    openAddressFormMessage: "धन्यवाद। अब, कृपया वह पता बताएं जहां समस्या है।",
    openAddressFormButton: "शिकायत का पता भरें",

    // 3A. Register New Complaint - Step 1: Personal Details
    askName: "चलिए शुरू करते हैं। क्या मैं आपका शुभ नाम जान सकता हूँ?",
    askMobile: "कृपया अपना 10 अंकों का मोबाइल नंबर साझा करें:",
    askEmail: "कृपया अपना ईमेल पता दर्ज करें (वैकल्पिक):",
    askUserAddress: "कृपया अपना आवासीय पता बताएं:",

    // Step 2: Grievance Address
    askGrievanceAddress:
      "समस्या कहाँ है?\nकृपया पूरा पता (घर संख्या, कॉलोनी, लैंडमार्क, पिनकोड) बताएं।",

    // Step 3: Category Selection
    askCategory: "आप किस प्रकार की समस्या का सामना कर रहे हैं?",
    categories: {
      crm: "पानी/सीवर समस्या (CRM)",
      rms: "बिल/मीटर समस्या (RMS)",
    },

    // 4. CRM - Sub-Category Selection
    askSubCategoryCRM: "कृपया समस्या के बारे में थोड़ा और विस्तार से बताएं:",
    subCategoriesCRM: {
      sewer: "सीवर",
      water: "पानी की आपूर्ति",
      tanker: "टैंकर",
      logging: "पानी भरना",
      rms: "कोई नहीं, RMS पर जाएं",
    },

    // 4.1 Sewer Complaints
    askSubCategorySewer: "विशिष्ट सीवर शिकायत चुनें:",
    sewerOptions: [
      "मैनहोल कवर गायब",
      "सड़कों पर गड्ढे / सड़क निर्माण सीवर",
      "मैनहोल कवर की मरम्मत",
      "सीवर में ब्लॉकेज / ओवरफ़्लो / लीकेज",
      "सीवर कचरा",
      "अनधिकृत सीवर कनेक्शन",
    ],

    // 4.2 Water Supply Complaints
    askSubCategoryWater: "विशिष्ट जल आपूर्ति शिकायत चुनें:",
    waterOptions: [
      "गंदा पानी (प्रदूषण)",
      "जल पाइपलाइन में रिसाव",
      "कम पानी का दबाव",
      "जल आपूर्ति नहीं",
      "सड़क पर गड्ढे / सड़क निर्माण",
      "सीमित जल आपूर्ति",
      "अवैध जल कनेक्शन",
      "पानी की बर्बादी",
    ],

    // 4.3 Tanker Complaints
    askSubCategoryTanker: "विशिष्ट टैंकर शिकायत चुनें:",
    tankerOptions: ["पानी का टैंकर आवश्यक", "पानी का टैंकर – चूकी हुई यात्रा"],

    // 4.4 Water Logging
    askSubCategoryLogging: "विशिष्ट जलभराव शिकायत चुनें:",
    loggingOptions: ["जलभराव"],

    // 5. Grievance Description & Media
    askDescription: "कृपया समस्या का संक्षिप्त विवरण दें:",
    askMedia:
      "यदि आपके पास समस्या की कोई फोटो या वीडियो है, तो कृपया अपलोड करें। अन्यथा 'Skip' टाइप करें।",

    // 6. Confirmation
    confirmation:
      "धन्यवाद! आपकी शिकायत *जलमित्र* के पास सफलतापूर्वक दर्ज कर ली गई है। 📝\n\n*शिकायत क्रमांक: {ticketID}*\n\nहमने संबंधित विभाग को सूचित कर दिया है। आप बाद में स्थिति जानने के लिए इस नंबर का उपयोग कर सकते हैं।",

    // 3B. View Grievance Status
    askTicketID: "कृपया अपनी पंजीकृत शिकायत संख्या दर्ज करें।",
    statusAssigned:
      " आपकी शिकायत JE/AE {jeDetails} को सौंप दी गई है। हम इस पर काम कर रहे हैं।",
    statusResolved: "खुशखबरी! आपकी शिकायत सफलतापूर्वक हल कर दी गई है। ✅",
    ticketNotFound:
      "मुझे इस नंबर से कोई शिकायत नहीं मिली। कृपया जांच कर पुनः प्रयास करें।",

    // Validation & Errors
    invalidMobile:
      "यह अमान्य मोबाइल नंबर लग रहा है। कृपया 10 अंकों का सही नंबर दर्ज करें।",
    invalidEmail: "यह अमान्य ईमेल प्रारूप लग रहा है। कृपया सही ईमेल पता दें।",
    genericError:
      "ओह! कुछ गड़बड़ हो गई। कृपया पुनः प्रयास करें या 'Hi' टाइप करें।",
    resetMessage:
      "सत्र रीसेट हो गया है। फिर से शुरू करने के लिए 'Hi' टाइप करें।",
  },
};

/**
 * Get localized message
 * @param {string} lang - Language code ('en' or 'hi')
 * @param {string} key - Message key
 * @param {object} params - Parameters to replace in message (optional)
 * @returns {string} Localized message
 */
function getMessage(lang, key, params = {}) {
  const language = lang || "en";
  let message = locales[language]?.[key] || locales["en"][key] || key;

  // Replace parameters in message
  Object.keys(params).forEach((param) => {
    message = message.replace(`{${param}}`, params[param]);
  });

  return message;
}

module.exports = {
  locales,
  getMessage,
};
