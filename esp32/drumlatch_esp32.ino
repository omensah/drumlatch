/*
 * DrumLatch — ESP32 Smart Laundry Lock (Presentation Demo)
 * =========================================================
 *
 * Creates a WiFi access point and serves the DrumLatch web app.
 * The app controls a lock (relay / solenoid / servo) via GPIO.
 *
 * FLASHING INSTRUCTIONS
 * ---------------------
 * 1. Install Arduino IDE + ESP32 board support
 *    (Boards Manager URL: https://espressif.github.io/arduino-esp32/package_esp32_index.json)
 * 2. Select your board (e.g. "ESP32 Dev Module") and port.
 * 3. Upload the filesystem:
 *    - Install the "ESP32 LittleFS Uploader" plugin
 *    - Put index.html in the sketch's  data/  folder (already there)
 *    - Tools -> "ESP32 LittleFS Data Upload"
 * 4. Upload this sketch (Ctrl+U).
 * 5. Connect a phone/laptop to WiFi "DrumLatch-Demo" (password: drumlatch)
 * 6. Open http://192.168.4.1 in a browser. Done.
 *
 * WIRING
 * ------
 *   LOCK_PIN (GPIO 26)  -> relay IN / solenoid driver / servo signal
 *   LED_PIN  (GPIO 2)   -> onboard LED mirrors lock state
 *   (Optional) SW-420 vibration sensor -> GPIO 27 (cycle detection)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <LittleFS.h>

// ── Config ──────────────────────────────────────────────────
const char* AP_SSID = "DrumLatch-Demo";
const char* AP_PASS = "drumlatch";          // min 8 chars

const int LOCK_PIN  = 26;   // relay / solenoid / servo
const int LED_PIN   = 2;    // onboard LED (lock state indicator)
const int VIBE_PIN  = 27;   // optional SW-420 vibration sensor

// ── State ───────────────────────────────────────────────────
WebServer server(80);
bool locked = false;

// ── Lock control ────────────────────────────────────────────
void setLock(bool on) {
  locked = on;
  digitalWrite(LOCK_PIN, on ? HIGH : LOW);
  digitalWrite(LED_PIN,  on ? HIGH : LOW);
  Serial.printf("[DrumLatch] Lock %s\n", on ? "ENGAGED" : "RELEASED");
}

// ── HTTP handlers ───────────────────────────────────────────
void handleStatus() {
  int vibe = digitalRead(VIBE_PIN);
  String json = "{\"locked\":" + String(locked ? "true" : "false")
              + ",\"vibration\":" + String(vibe)
              + ",\"serial\":\"DL-2024-W-03\"}";
  server.send(200, "application/json", json);
}

void handleLock() {
  setLock(true);
  server.send(200, "application/json", "{\"ok\":true,\"locked\":true}");
}

void handleUnlock() {
  setLock(false);
  server.send(200, "application/json", "{\"ok\":true,\"locked\":false}");
}

void handleRoot() {
  File f = LittleFS.open("/index.html", "r");
  if (!f) {
    server.send(500, "text/plain", "index.html missing - run LittleFS upload");
    return;
  }
  server.streamFile(f, "text/html");
  f.close();
}

// ── Setup / loop ────────────────────────────────────────────
void setup() {
  Serial.begin(115200);

  pinMode(LOCK_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(VIBE_PIN, INPUT);
  setLock(false);

  if (!LittleFS.begin(true)) {
    Serial.println("[DrumLatch] LittleFS mount failed!");
  }

  WiFi.softAP(AP_SSID, AP_PASS);
  Serial.print("[DrumLatch] AP started: ");
  Serial.println(AP_SSID);
  Serial.print("[DrumLatch] Open http://");
  Serial.println(WiFi.softAPIP());   // usually 192.168.4.1

  server.on("/",            HTTP_GET,  handleRoot);
  server.on("/api/status",  HTTP_GET,  handleStatus);
  server.on("/api/lock",    HTTP_POST, handleLock);
  server.on("/api/unlock",  HTTP_POST, handleUnlock);
  server.onNotFound(handleRoot);      // SPA fallback
  server.begin();
  Serial.println("[DrumLatch] Web server running");
}

void loop() {
  server.handleClient();
}
