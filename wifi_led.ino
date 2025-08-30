#include <WiFi.h>

const char* ssid = "Abhishek";
const char* password = "@bhishek";

const int output1 = 27;
const int output2 = 26;

WiFiServer server(80);

String header;
bool blinkingState1 = false; 
bool blinkingState2 = false;

void setup() {
  Serial.begin(115200);
  pinMode(output1, OUTPUT);
  digitalWrite(output1, HIGH);
  pinMode(output2, OUTPUT);
  digitalWrite(output2, HIGH);

  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected.");

  IPAddress gatewayIp = WiFi.gatewayIP();
  IPAddress local_IP(192, 168, gatewayIp[2], 50);
  IPAddress gateway(192, 168, gatewayIp[2], gatewayIp[3]);
  IPAddress subnet(255, 255, 255, 0);
  IPAddress dns(8, 8, 8, 8);

  if (!WiFi.config(local_IP, gateway, subnet, dns)) {
    Serial.println("Static IP configuration failed");
  }

  Serial.println("\nWiFi reconnected with static IP.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());

  server.begin();
}

void loop() {
  WiFiClient client = server.available();

  if (client) {
    Serial.println("New Client Connected.");
    String request = "";

    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        request += c;

        if (c == '\n') {
         
          if (request.indexOf("GET /on1") >= 0) {
            blinkingState1 = false;
            digitalWrite(output1, LOW);
          } else if (request.indexOf("GET /off1") >= 0) {
            blinkingState1 = false;
            digitalWrite(output1, HIGH);
          } else if (request.indexOf("GET /on2") >= 0) {
            blinkingState2 = false;
            digitalWrite(output2, LOW);
          } else if (request.indexOf("GET /off2") >= 0) {
            blinkingState2 = false;
            digitalWrite(output2, HIGH);
          } else if (request.indexOf("GET /blink-on1") >= 0) {
            blinkingState1 = true;
          } else if (request.indexOf("GET /blink-off1") >= 0) {
            blinkingState1 = false;
            digitalWrite(output1, HIGH);
          } else if (request.indexOf("GET /blink-on2") >= 0) {
            blinkingState2 = true;
          } else if (request.indexOf("GET /blink-off2") >= 0) {
            blinkingState2 = false;
            digitalWrite(output2, HIGH);
          }

          client.println("HTTP/1.1 200 OK");
          client.println("Content-type:text/html");
          client.println("Connection: close");
          client.println();
          
          client.println("<!DOCTYPE html><html lang='en'>");
          client.println("<head>");
          client.println("<meta charset='UTF-8'>");
          client.println("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
          client.println("<title>ESP32 Smart Controller</title>");
          client.println("<style>");
          
          // CSS Styles
          client.println("* { margin: 0; padding: 0; box-sizing: border-box; }");
          client.println("body {");
          client.println("  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;");
          client.println("  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);");
          client.println("  min-height: 100vh;");
          client.println("  display: flex;");
          client.println("  justify-content: center;");
          client.println("  align-items: center;");
          client.println("  padding: 20px;");
          client.println("}");
          
          client.println(".container {");
          client.println("  background: rgba(255, 255, 255, 0.95);");
          client.println("  backdrop-filter: blur(10px);");
          client.println("  border-radius: 24px;");
          client.println("  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);");
          client.println("  padding: 40px;");
          client.println("  max-width: 500px;");
          client.println("  width: 100%;");
          client.println("  text-align: center;");
          client.println("  animation: slideUp 0.8s ease-out;");
          client.println("}");
          
          client.println("@keyframes slideUp {");
          client.println("  from { opacity: 0; transform: translateY(50px); }");
          client.println("  to { opacity: 1; transform: translateY(0); }");
          client.println("}");
          
          client.println("h1 {");
          client.println("  color: #2d3748;");
          client.println("  font-size: 2.5em;");
          client.println("  margin-bottom: 10px;");
          client.println("  font-weight: 700;");
          client.println("  background: linear-gradient(135deg, #667eea, #764ba2);");
          client.println("  -webkit-background-clip: text;");
          client.println("  -webkit-text-fill-color: transparent;");
          client.println("  background-clip: text;");
          client.println("}");
          
          client.println(".subtitle {");
          client.println("  color: #718096;");
          client.println("  font-size: 1.1em;");
          client.println("  margin-bottom: 40px;");
          client.println("  font-weight: 400;");
          client.println("}");
          
          client.println(".device-grid {");
          client.println("  display: grid;");
          client.println("  gap: 24px;");
          client.println("  margin: 30px 0;");
          client.println("}");
          
          client.println(".device-card {");
          client.println("  background: linear-gradient(145deg, #f7fafc, #edf2f7);");
          client.println("  border-radius: 20px;");
          client.println("  padding: 24px;");
          client.println("  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);");
          client.println("  border: 2px solid transparent;");
          client.println("  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);");
          client.println("  position: relative;");
          client.println("  overflow: hidden;");
          client.println("}");
          
          client.println(".device-card:hover {");
          client.println("  transform: translateY(-5px);");
          client.println("  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);");
          client.println("  border-color: #667eea;");
          client.println("}");
          
          client.println(".device-card.active {");
          client.println("  background: linear-gradient(145deg, #e6fffa, #b2f5ea);");
          client.println("  border-color: #38b2ac;");
          client.println("}");
          
          client.println(".device-card.blinking {");
          client.println("  animation: pulseGlow 1.5s ease-in-out infinite;");
          client.println("}");
          
          client.println("@keyframes pulseGlow {");
          client.println("  0%, 100% { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); }");
          client.println("  50% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }");
          client.println("}");
          
          client.println(".device-header {");
          client.println("  display: flex;");
          client.println("  align-items: center;");
          client.println("  justify-content: space-between;");
          client.println("  margin-bottom: 16px;");
          client.println("}");
          
          client.println(".device-name {");
          client.println("  font-size: 1.3em;");
          client.println("  font-weight: 600;");
          client.println("  color: #2d3748;");
          client.println("}");
          
          client.println(".status-indicator {");
          client.println("  width: 16px;");
          client.println("  height: 16px;");
          client.println("  border-radius: 50%;");
          client.println("  background: #e2e8f0;");
          client.println("  transition: all 0.3s ease;");
          client.println("  position: relative;");
          client.println("}");
          
          client.println(".status-indicator.on {");
          client.println("  background: #48bb78;");
          client.println("  box-shadow: 0 0 12px rgba(72, 187, 120, 0.4);");
          client.println("}");
          
          client.println(".status-indicator.blinking {");
          client.println("  background: #ed8936;");
          client.println("  animation: blink 1s ease-in-out infinite;");
          client.println("}");
          
          client.println("@keyframes blink {");
          client.println("  0%, 50% { opacity: 1; }");
          client.println("  51%, 100% { opacity: 0.3; }");
          client.println("}");
          
          client.println(".status-text {");
          client.println("  font-size: 1.1em;");
          client.println("  font-weight: 500;");
          client.println("  margin: 12px 0;");
          client.println("  color: #4a5568;");
          client.println("}");
          
          client.println(".status-text.on { color: #38a169; }");
          client.println(".status-text.blinking { color: #dd6b20; }");
          
          client.println(".control-btn {");
          client.println("  background: linear-gradient(135deg, #667eea, #764ba2);");
          client.println("  color: white;");
          client.println("  border: none;");
          client.println("  border-radius: 12px;");
          client.println("  padding: 12px 24px;");
          client.println("  font-size: 1em;");
          client.println("  font-weight: 600;");
          client.println("  cursor: pointer;");
          client.println("  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);");
          client.println("  width: 100%;");
          client.println("  position: relative;");
          client.println("  overflow: hidden;");
          client.println("}");
          
          client.println(".control-btn:hover {");
          client.println("  transform: translateY(-2px);");
          client.println("  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);");
          client.println("}");
          
          client.println(".control-btn:active {");
          client.println("  transform: translateY(0);");
          client.println("}");
          
          client.println(".control-btn.off {");
          client.println("  background: linear-gradient(135deg, #718096, #4a5568);");
          client.println("}");
          
          client.println(".control-btn.off:hover {");
          client.println("  box-shadow: 0 8px 20px rgba(113, 128, 150, 0.4);");
          client.println("}");
          
          client.println(".footer {");
          client.println("  margin-top: 30px;");
          client.println("  padding-top: 20px;");
          client.println("  border-top: 2px solid #e2e8f0;");
          client.println("  color: #718096;");
          client.println("  font-size: 0.9em;");
          client.println("}");
          
          client.println(".refresh-btn {");
          client.println("  background: transparent;");
          client.println("  border: 2px solid #667eea;");
          client.println("  color: #667eea;");
          client.println("  border-radius: 8px;");
          client.println("  padding: 8px 16px;");
          client.println("  font-size: 0.9em;");
          client.println("  cursor: pointer;");
          client.println("  transition: all 0.3s ease;");
          client.println("  margin-top: 10px;");
          client.println("}");
          
          client.println(".refresh-btn:hover {");
          client.println("  background: #667eea;");
          client.println("  color: white;");
          client.println("}");
          
          client.println("@media (max-width: 480px) {");
          client.println("  .container { padding: 24px; margin: 10px; }");
          client.println("  h1 { font-size: 2em; }");
          client.println("  .device-card { padding: 20px; }");
          client.println("}");
          
          client.println("</style>");
          client.println("</head>");
          
          client.println("<body>");
          client.println("<div class='container'>");
          client.println("<h1>ESP32 Smart Controller</h1>");
          client.println("<div class='subtitle'>Device Management Dashboard</div>");
          
          client.println("<div class='device-grid'>");
          
          // Device 1
          bool output1State = digitalRead(output1) == LOW;
          client.println("<div class='device-card " + String(output1State ? "active" : "") + String(blinkingState1 ? " blinking" : "") + "'>");
          client.println("<div class='device-header'>");
          client.println("<div class='device-name'>Output Device 1</div>");
          client.println("<div class='status-indicator " + String(output1State ? "on" : "") + String(blinkingState1 ? " blinking" : "") + "'></div>");
          client.println("</div>");
          
          String status1 = blinkingState1 ? "BLINKING" : (output1State ? "ACTIVE" : "INACTIVE");
          String statusClass1 = blinkingState1 ? "blinking" : (output1State ? "on" : "");
          client.println("<div class='status-text " + statusClass1 + "'>" + status1 + "</div>");
          
          String btnText1 = output1State ? "TURN OFF" : "TURN ON";
          String btnClass1 = output1State ? "off" : "";
          String btnLink1 = output1State ? "/off1" : "/on1";
          client.println("<button class='control-btn " + btnClass1 + "' onclick='location.href=\"" + btnLink1 + "\"'>" + btnText1 + "</button>");
          client.println("</div>");
          
          // Device 2
          bool output2State = digitalRead(output2) == LOW;
          client.println("<div class='device-card " + String(output2State ? "active" : "") + String(blinkingState2 ? " blinking" : "") + "'>");
          client.println("<div class='device-header'>");
          client.println("<div class='device-name'>Output Device 2</div>");
          client.println("<div class='status-indicator " + String(output2State ? "on" : "") + String(blinkingState2 ? " blinking" : "") + "'></div>");
          client.println("</div>");
          
          String status2 = blinkingState2 ? "BLINKING" : (output2State ? "ACTIVE" : "INACTIVE");
          String statusClass2 = blinkingState2 ? "blinking" : (output2State ? "on" : "");
          client.println("<div class='status-text " + statusClass2 + "'>" + status2 + "</div>");
          
          String btnText2 = output2State ? "TURN OFF" : "TURN ON";
          String btnClass2 = output2State ? "off" : "";
          String btnLink2 = output2State ? "/off2" : "/on2";
          client.println("<button class='control-btn " + btnClass2 + "' onclick='location.href=\"" + btnLink2 + "\"'>" + btnText2 + "</button>");
          client.println("</div>");
          
          client.println("</div>"); 
          
          client.println("<div class='footer'>");
          client.println("ESP32 Smart Home Controller<br>");
          client.println("<button class='refresh-btn' onclick='location.reload()'>🔄 Refresh Status</button>");
          client.println("</div>");
          
          client.println("</div>");
          client.println("</body></html>");
          break;
        }
      }
    }

    client.stop();
    Serial.println("Client Disconnected.");
  }

  if (blinkingState1) {
    digitalWrite(output1, !digitalRead(output1));
    delay(1000);
  } 
  
  if (blinkingState2) {
    digitalWrite(output2, !digitalRead(output2));
    delay(1000);
  }
}
