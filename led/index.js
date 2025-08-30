import cors from "cors";
import express from "express";
import os from "os";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import chatBot from "./chatBot.js";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/", chatBot);

const port = process.env.PORT || 3000;
let gateWay = 0;

function getWiFiIPv4() {
  const interfaces = os.networkInterfaces();

  const wifiNames = [
    "Wi-Fi",
    "WiFi",
    "wlan0",
    "wlp3s0",
    "en0",
    "en1",
    "wlo1",
    "wlx",
  ];

  for (const [interfaceName, addresses] of Object.entries(interfaces)) {
    const isWiFi = wifiNames.some(
      (name) =>
        interfaceName.toLowerCase().includes(name.toLowerCase()) ||
        interfaceName.toLowerCase().startsWith("wlx")
    );

    if (isWiFi && addresses) {
      for (const addr of addresses) {
        if (addr.family === "IPv4" && !addr.internal) {
          return addr.address;
        }
      }
    }
  }

  return null;
}

const wifiIP = getWiFiIPv4();
if (wifiIP) {
  gateWay = wifiIP.split(".")[2];
  console.log("WiFi IP:", wifiIP);
} else {
  console.log("No WiFi IPv4 address found");
  process.exit(1);
}

const esp32BaseUrl = `http://192.168.${gateWay}.50`;

let ledStates = { type: "updateLED", 1: false, 2: false };
let blinkLedStates = { type: "updateBlinkLED", 1: false, 2: false };
let json = { ledStates, blinkLedStates };
let clients = new Set();

function broadcastUpdate() {
  const message = JSON.stringify(json);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

function toggleLED(ledNumber, action, res, errorMessage) {
  const url = `${esp32BaseUrl}/${action}${ledNumber}`;

  fetch(url)
    .then(() => {
      ledStates[ledNumber] = action === "on";
      blinkLedStates[ledNumber] = false;
      broadcastUpdate();
      res.send({ success: true, state: ledStates[ledNumber] });
      res.end();
    })
    .catch((error) => {
      console.error(errorMessage, error);
      res.status(500).send(errorMessage);
    })
    .finally(() => res.end());
}

function blinkLED(ledNumber, action, res, errorMessage) {
  const url = `${esp32BaseUrl}/${action}${ledNumber}`;

  fetch(url)
    .then(() => {
      blinkLedStates[ledNumber] = action === "blink-on";
      ledNumber == 1 ? (ledStates[1] = false) : (ledStates[2] = false);
      broadcastUpdate();
      res.send({ success: true, state: blinkLedStates[ledNumber] });
      res.end();
    })
    .catch((error) => {
      console.error(errorMessage, error);
      res.status(500).send(errorMessage);
    })
    .finally(() => res.end());
}

app.post("/on:ledNumber", (req, res) =>
  toggleLED(req.params.ledNumber, "on", res, "Error turning ON")
);
app.post("/off:ledNumber", (req, res) =>
  toggleLED(req.params.ledNumber, "off", res, "Error turning OFF")
);

app.post("/blink-on:ledNumber", (req, res) =>
  blinkLED(req.params.ledNumber, "blink-on", res, "Error turning ON")
);
app.post("/blink-off:ledNumber", (req, res) =>
  blinkLED(req.params.ledNumber, "blink-off", res, "Error turning OFF")
);

app.get("*", (req, res) => {
  res.redirect("/");
});

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify(json));
  ws.on("close", () => {
    clients.delete(ws);
  });
});

server.listen(port);
