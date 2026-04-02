// webhook.js
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // Verification logic for Meta
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === 'my_secret_token_123') {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      if (body.object === 'whatsapp_business_account') {
        const msg = body.entry[0].changes[0].value.messages[0];
        const from = msg.from;
        const text = msg.text.body;

        // Placeholder for Gemini AI logic
        const aiResponse = `Hello! I received: "${text}". I'm setting up my brain!`;

        // Send back to WhatsApp
        await axios.post(`https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`, {
          messaging_product: "whatsapp",
          to: from,
          text: { body: aiResponse },
        }, {
          headers: { "Authorization": `Bearer ${process.env.ACCESS_TOKEN}` }
        });
      }
      return res.status(200).send('EVENT_RECEIVED');
    } catch (err) {
      return res.status(500).send('Error');
    }
  }
};
