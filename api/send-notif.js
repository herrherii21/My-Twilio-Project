import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: "Missing 'to' or 'message' field" });
  }

  try {
    const result = await client.messages.create({
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`,
      body: message
    });

    return res.status(200).json({ success: true, sid: result.sid });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
