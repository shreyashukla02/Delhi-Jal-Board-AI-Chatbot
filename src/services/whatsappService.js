const axios = require("axios");
require("dotenv").config();

// 👇 FIX: Ab ye aapke original .env variable name ko use karega
const WHATSAPP_TOKEN = process.env.META_API_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const apiClient = axios.create({
  baseURL: `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}`, // Version v18.0 kar diya (safe side)
  headers: {
    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  },
});

async function sendMessage(to, body) {
  try {
    await apiClient.post("/messages", {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: body },
    });
  } catch (error) {
    console.error(
      `Error sending message to ${to}:`,
      error.response?.data || error.message
    );
  }
}

async function sendInteractiveButtons(to, bodyText, buttons) {
  try {
    await apiClient.post("/messages", {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons.map((btn) => ({
            type: "reply",
            reply: { id: btn.id, title: btn.title },
          })),
        },
      },
    });
  } catch (error) {
    console.error(
      `Error sending buttons to ${to}:`,
      error.response?.data || error.message
    );
  }
}

async function sendFlow(to, flowId, screen, bodyText, ctaText) {
  try {
    await apiClient.post("/messages", {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "flow",
        body: {
          text: bodyText,
        },
        action: {
          name: "flow",
          parameters: {
            flow_message_version: "3",
            flow_token: "unused",
            flow_id: flowId,
            flow_cta: ctaText,
            flow_action: "navigate",
            flow_action_payload: {
              screen: screen,
              data: {},
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(
      `Error sending flow to ${to}:`,
      error.response?.data || error.message
    );
  }
}

async function sendInteractiveList(to, bodyText, buttonText, sections) {
  try {
    await apiClient.post("/messages", {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text: bodyText },
        action: {
          button: buttonText,
          sections: sections,
        },
      },
    });
  } catch (error) {
    console.error(
      `Error sending list to ${to}:`,
      error.response?.data || error.message
    );
  }
}

async function markAsRead(messageId) {
  try {
    await apiClient.post("/messages", {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    });
  } catch (error) {
    // Silent fail okay
  }
}

module.exports = {
  sendMessage,
  sendInteractiveButtons,
  sendFlow,
  sendInteractiveList,
  markAsRead,
};
