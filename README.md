# WiFi LED Controller with AI Voice Assistant

A comprehensive Node.js application that enables wireless control of LEDs through an ESP32 microcontroller, featuring a web interface, real-time WebSocket communication, and an integrated AI chatbot for voice-activated commands.

## ðŸš€ Features

- **WiFi LED Control**: Control two LEDs wirelessly through a web interface
- **Real-time Communication**: WebSocket integration for instant status updates
- **AI Voice Assistant**: Gemini AI-powered chatbot supporting English and Hindi commands
- **ESP32 Integration**: Arduino code for microcontroller-based LED management
- **Blinking Patterns**: Support for both steady and blinking LED modes
- **Responsive Web UI**: Modern, mobile-friendly interface with toggle switches
- **Network Auto-detection**: Automatic WiFi IP detection and configuration

![Project Demo](./images/demo-screenshot.png)
*LED control interface with integrated AI chatbot*

## ðŸ“‹ Table of Contents

- [Hardware Requirements](#hardware-requirements)
- [Software Requirements](#software-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [AI Voice Commands](#ai-voice-commands)
- [Project Structure](#project-structure)
- [Circuit Diagram](#circuit-diagram)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ðŸ› ï¸ Hardware Requirements

- ESP32 Development Board
- 2x LEDs
- 2x 220Î© Resistors
- Breadboard and jumper wires
- USB cable for ESP32 programming

![Hardware Setup](./images/hardware-setup.jpg)
*Complete hardware setup with ESP32 and LEDs*

## ðŸ’» Software Requirements

- **Node.js** (v14 or higher)
- **Arduino IDE** (for ESP32 programming)
- **ESP32 Board Package** for Arduino IDE
- **Google Gemini API Key** (for AI chatbot functionality)

## ðŸ”§ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Abhi0065/node-wifi-led-controller.git
cd node-wifi-led-controller
```

### 2. Install Node.js Dependencies

```bash
cd led
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `led` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. ESP32 Setup

1. Open `wifi_led.ino` in Arduino IDE
2. Install ESP32 board package if not already installed
3. Update WiFi credentials in the code:
   ```cpp
   const char* ssid = "Your_WiFi_Name";
   const char* password = "Your_WiFi_Password";
   ```
4. Upload the code to your ESP32

## âš™ï¸ Configuration

### Network Configuration

The application automatically detects your WiFi network and configures the ESP32 with a static IP address (`192.168.X.50` where X is your network subnet).

### Circuit Connections

- **LED 1**: GPIO 27 â†’ LED â†’ 220Î© Resistor â†’ GND
- **LED 2**: GPIO 26 â†’ LED â†’ 220Î© Resistor â†’ GND

![Circuit Diagram](./images/circuit-diagram.png)
*Detailed circuit connections for ESP32 and LEDs*

## ðŸŽ¯ Usage

### 1. Start the Server

```bash
cd led
npm start
```

### 2. Access the Web Interface

Open your browser and navigate to:
- `http://localhost:3000` (if running locally)
- `http://[your-computer-ip]:3000` (for network access)

### 3. Control LEDs

- Use toggle switches to turn LEDs on/off
- Enable blinking mode for dynamic LED patterns
- Real-time status updates across all connected devices

![Web Interface](./images/web-interface.png)
*Clean and intuitive web control interface*

### 4. AI Voice Commands

Click the "Ask Alexa" button and use voice commands:
- "LED 1 on" / "LED 1 off"
- "Blink LED 2" / "Stop blinking LED 2"
- "Turn on all lights" / "Turn off all lights"
- Hindi commands: "LED 1 à¤šà¤¾à¤²à¥‚" / "LED 1 à¤¬à¤‚à¤¦"

## ðŸŒ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/on1` | Turn on LED 1 |
| POST | `/off1` | Turn off LED 1 |
| POST | `/on2` | Turn on LED 2 |
| POST | `/off2` | Turn off LED 2 |
| POST | `/blink-on1` | Start blinking LED 1 |
| POST | `/blink-off1` | Stop blinking LED 1 |
| POST | `/blink-on2` | Start blinking LED 2 |
| POST | `/blink-off2` | Stop blinking LED 2 |
| POST | `/res` | AI chatbot endpoint |

## ðŸ—£ï¸ AI Voice Commands

### English Commands
- Basic control: "LED [1/2] on/off"
- Blinking: "Blink LED [1/2]", "Stop blinking LED [1/2]"
- Bulk control: "Turn on all lights", "Turn off all lights"
- Alternative terms: "light", "bulb" (instead of "LED")

### Hindi Commands (à¤¹à¤¿à¤‚à¤¦à¥€)
- Basic control: "LED [1/2] à¤šà¤¾à¤²à¥‚/à¤¬à¤‚à¤¦"
- Bulk control: "à¤¸à¤­à¥€ LED à¤šà¤¾à¤²à¥‚/à¤¬à¤‚à¤¦"

![AI Assistant](./images/ai-chat-interface.png)
*AI-powered voice assistant interface*

## ðŸ“ Project Structure

```
node-wifi-led-controller/
â”œâ”€â”€ led/
â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â”œâ”€â”€ index.html          # Main web interface
â”‚   â”‚   â”œâ”€â”€ style.css           # LED control styling
â”‚   â”‚   â”œâ”€â”€ chatbot.css         # AI chatbot styling
â”‚   â”‚   â”œâ”€â”€ script.js           # LED control logic
â”‚   â”‚   â””â”€â”€ chatbot.js          # AI chatbot frontend
â”‚   â”œâ”€â”€ index.js                # Main server application
â”‚   â”œâ”€â”€ chatBot.js              # AI chatbot backend
â”‚   â”œâ”€â”€ package.json            # Node.js dependencies
â”‚   â””â”€â”€ .env                    # Environment variables
â”œâ”€â”€ wifi_led.ino                # ESP32 Arduino code
â””â”€â”€ README.md                   # Project documentation
```

## ðŸ“Š Technical Architecture

![System Architecture](./images/system-architecture.png)
*Complete system architecture diagram*

### Key Components:

1. **Node.js Server**: Express.js web server with WebSocket support
2. **ESP32 Controller**: Arduino-based microcontroller for LED management  
3. **Web Interface**: Responsive HTML/CSS/JavaScript frontend
4. **AI Integration**: Google Gemini API for natural language processing
5. **Real-time Communication**: WebSocket for instant status synchronization

## ðŸ” Troubleshooting

### Common Issues:

**ESP32 not connecting:**
- Verify WiFi credentials
- Check power supply
- Ensure ESP32 is within WiFi range

**LEDs not responding:**
- Verify circuit connections
- Check GPIO pin assignments
- Test LED functionality manually

**AI chatbot not working:**
- Verify Gemini API key in `.env` file
- Check internet connectivity
- Review API quotas and limits

## ðŸ¤ Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ðŸ“„ License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## ðŸ™ Acknowledgments

- Google Gemini AI for natural language processing
- ESP32 community for hardware support
- Node.js and Express.js communities

---

**Made with â¤ï¸ by [Abhi0065](https://github.com/Abhi0065)**

For questions or support, please open an issue on GitHub or contact the maintainer.
