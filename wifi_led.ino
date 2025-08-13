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

          client.println("<!DOCTYPE html><html>");
          client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
          client.println("<style>body { font-family: Arial, sans-serif; }</style></head>");
          client.println("<body><h1>ESP32 Web Server</h1>");

          client.println("<p>Output 1: " + String(digitalRead(output1) == LOW ? "ON" : "OFF") + "</p>");
          client.println("<p>Output 2: " + String(digitalRead(output2) == LOW ? "ON" : "OFF") + "</p>");

          if (blinkingState1) {
            client.println("<p>Blinking ON for Output 1</p>");
          } 
          
          if (blinkingState2) {
            client.println("<p>Blinking ON for Output 2</p>");
          }

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
