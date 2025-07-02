const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

module.exports = async (req, res) => {
  // 🔐 Tambahkan CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5501"); // ← bisa diganti dengan domain tertentu di production
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🌐 Handle preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Tidak perlu body untuk preflight
  }

  // ❌ Batasi hanya ke POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { to, message } = req.body;

  try {
    const result = await client.messages.create({
      from: 'whatsapp:+14155238886', // WhatsApp number Twilio
      to: `whatsapp:${to}`,
      body: message,
    });

    res.status(200).json({ success: true, sid: result.sid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
