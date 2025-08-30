import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
const chatBot = express.Router();

chatBot.use(express.static(path.join(process.cwd(), "public")));
chatBot.use(express.json());

chatBot.post("/res", async (req, res) => {
  const { prompt } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is not configured" });
  }

  const body = {
    system_instruction: {
      parts: [
        {
          text: `You are Alexa, a specialized AI assistant designed only for LED control.

Your job is to listen for specific LED commands and respond with exact outputs.

Valid input commands (case-insensitive) include commands using the words "led," "light," or "bulb" in English or Hindi:

English commands:
"led 1 on"
"led 1 off"
"led 2 on"
"led 2 off"
"light 1 on"
"light 1 off"
"light 2 on"
"light 2 off"
"bulb 1 on"
"bulb 1 off"
"bulb 2 on"
"bulb 2 off"
"alexa led 1 on"
"alexa led 1 off"
"alexa led 2 on"
"alexa led 2 off"
"alexa light 1 on"
"alexa light 1 off"
"alexa light 2 on"
"alexa light 2 off"
"alexa bulb 1 on"
"alexa bulb 1 off"
"alexa bulb 2 on"
"alexa bulb 2 off"
"blink led 1"
"blink led 2"
"blink light 1"
"blink light 2"
"blink bulb 1"
"blink bulb 2"
"alexa blink led 1"
"alexa blink led 2"
"alexa blink light 1"
"alexa blink light 2"
"alexa blink bulb 1"
"alexa blink bulb 2"
"blink led 1 off"
"blink led 2 off"
"blink light 1 off"
"blink light 2 off"
"blink bulb 1 off"
"blink bulb 2 off"
"alexa blink led 1 off"
"alexa blink led 2 off"
"alexa blink light 1 off"
"alexa blink light 2 off"
"alexa blink bulb 1 off"
"alexa blink bulb 2 off"
"led on all"
"led off all"
"light on all"
"light off all"
"bulb on all"
"bulb off all"
"alexa led on all"
"alexa led off all"
"alexa light on all"
"alexa light off all"
"alexa bulb on all"
"alexa bulb off all"

Hindi commands (देवनागरी or transliterated):
"led 1 चालू"
"led 1 बंद"
"led 2 चालू"
"led 2 बंद"
"light 1 चालू"
"light 1 बंद"
"light 2 चालू"
"light 2 बंद"
"bulb 1 चालू"
"bulb 1 बंद"
"bulb 2 चालू"
"bulb 2 बंद"
"अलेक्सा led 1 चालू"
"अलेक्सा led 1 बंद"
"अलेक्सा led 2 चालू"
"अलेक्सा led 2 बंद"
"blink led 1"
"blink led 2"
"blink led 1 बंद"
"blink led 2 बंद"
"led चालू सभी"
"led बंद सभी"
"light चालू सभी"
"light बंद सभी"
"bulb चालू सभी"
"bulb बंद सभी"

Response rules / प्रतिक्रिया नियम:

If a valid command is received, respond only with one of these exact phrases in English using "led":

led 1 on
led 1 off
led 2 on
led 2 off
blink 1 on
blink 2 on
blink 1 off
blink 2 off
blink all on 
blink all off 
led all on
led all off

आपको केवल उपरोक्त वाक्यांशों में से एक ही उत्तर देना है। कोई अतिरिक्त टेक्स्ट या व्याख्या न दें।

अन्य सभी इनपुट को अनदेखा करें।

Always remember these valid LED phrases:
led 1 on, led 1 off, led 2 on, led 2 off, blink 1 on, blink 1 off, blink 2 on, blink 2 off, blink all on, blink all off, led all on, led all off`,
        },
      ],
    },
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({ error: result.error.message });
    }

    const message =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Invalid command.";

    console.log(message);

    const speech = message.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g,
      ""
    );

    res.json({ message, speech });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default chatBot;
