const { handleConversation } = require('../services/conversationService');
const { markAsRead } = require('../services/whatsappService');

const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

const handleWebhook = async (req, res) => {
  const body = req.body;

  if (body.object) {
    // 👇 FIX: Check karte hi WhatsApp ko '200 OK' bhej do.
    // Taaki wo dobara message na bheje (Retry band ho jayega).
    res.sendStatus(200);

    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const messageId = message.id;
      
      let messageText = '';
      if (message.type === 'text') {
        messageText = message.text.body;
      } else if (message.type === 'interactive') {
        if (message.interactive.type === 'button_reply') {
          messageText = message.interactive.button_reply.id;
        } else if (message.interactive.type === 'list_reply') {
          messageText = message.interactive.list_reply.id;
        } else if (message.interactive.type === 'nfm_reply') {
          // Handle Flow Response
          const responseJson = JSON.parse(message.interactive.nfm_reply.response_json);
          messageText = `FLOW_RESPONSE:${JSON.stringify(responseJson)}`;
        }
      } else {
        // Unknown type, humne already 200 bhej diya hai, to return kar jao
        return;
      }

      // Background Processing (User ko wait nahi karna padega)
      try {
        if (markAsRead) await markAsRead(messageId);
        await handleConversation(from, messageText);
      } catch (error) {
        console.error('Error processing messages:', error);
      }
    }
  } else {
    // Agar body.object nahi hai to 404
    res.sendStatus(404);
  }
};

module.exports = { verifyWebhook, handleWebhook };