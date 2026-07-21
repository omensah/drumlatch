# DrumLatch — Lock Integration Handoff

Everything a developer needs to integrate the ESP32 physical lock with the DrumLatch web app.

## Repository layout

| File | Purpose |
|---|---|
| `esp32/drumlatch_esp32.ino` | ESP32 firmware — WiFi AP, web server, GPIO lock control |
| `esp32/data/index.html` | Standalone single-file app served BY the device (flash via LittleFS) |
| `public/esp32.html` | Same file, served by the Next.js app for browser preview |
| `lib/lock-client.ts` | TypeScript client used by the React app to talk to the device |
| `components/drumlatch/CustomerApp.tsx` | Main app — calls `engageLock()` / `releaseLock()` |

## Hardware API contract

The firmware exposes three HTTP endpoints. Any client (the flashed HTML, the React app, curl) uses the same contract:

```
GET  /api/status
     -> 200 {"locked": false, "vibration": 0, "serial": "DL-2024-W-03"}

POST /api/lock
     -> 200 {"ok": true, "locked": true}

POST /api/unlock
     -> 200 {"ok": true, "locked": false}
```

## Wiring

| Pin | Function |
|---|---|
| GPIO 26 | Lock actuator (relay IN / solenoid driver / servo signal) |
| GPIO 2 | Onboard LED — mirrors lock state |
| GPIO 27 | Optional SW-420 vibration sensor (cycle detection) |

## Flashing (Arduino IDE)

1. Install ESP32 board support — Boards Manager URL:
   `https://espressif.github.io/arduino-esp32/package_esp32_index.json`
2. Select board (e.g. "ESP32 Dev Module") and port.
3. Install the "ESP32 LittleFS Uploader" plugin, then run
   **Tools → ESP32 LittleFS Data Upload** (uploads `data/index.html`).
4. Upload the sketch (`drumlatch_esp32.ino`).
5. Join WiFi `DrumLatch-Demo` (password `drumlatch`), open `http://192.168.4.1`.

## How the React app talks to the device

`lib/lock-client.ts` wraps the three endpoints with a 3s timeout and a demo
fallback (simulated state when no device answers — the UI works identically
with or without hardware).

```ts
import { engageLock, releaseLock, getLockStatus } from '@/lib/lock-client'

await engageLock()          // POST /api/lock
await releaseLock()         // POST /api/unlock
const s = await getLockStatus()  // { locked, vibration, serial, device }
// s.device === false  ->  running in demo fallback, no hardware present
```

Current call sites in `CustomerApp.tsx`:
- `LockingScreen` fires `engageLock()` when the lock sequence starts
- "Emergency Unlock" (active cycle) and "Unlock Machine" (pickup) fire `releaseLock()`

## Deployment modes

1. **Device-hosted (demo / presentation)** — the ESP32 serves `index.html`
   itself. Same origin, zero config.
2. **Cloud-hosted app + local device** — set the env var
   `NEXT_PUBLIC_LOCK_DEVICE_URL=http://192.168.4.1` and add CORS to the
   firmware handlers:

   ```cpp
   // add inside each handler, before server.send(...):
   server.sendHeader("Access-Control-Allow-Origin", "*");

   // and register a preflight handler in setup():
   server.on("/api/lock", HTTP_OPTIONS, []() {
     server.sendHeader("Access-Control-Allow-Origin", "*");
     server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
     server.send(204);
   });
   ```

   Note: a page served over HTTPS cannot fetch `http://192.168.4.1` (mixed
   content). For production either proxy device calls through a backend on the
   same network, or run the device in station mode with TLS. For the demo,
   device-hosted mode avoids all of this.

## Production hardening checklist (post-demo)

- [ ] Station mode (join venue WiFi) instead of open AP; rotate AP password
- [ ] Auth token on `/api/lock` & `/api/unlock` (shared secret header at minimum)
- [ ] Serial number provisioned per device (currently hardcoded `DL-2024-W-03`)
- [ ] Debounce/rate-limit lock actuation; add relay flyback protection
- [ ] Report vibration events to the backend for cycle-state detection
- [ ] OTA firmware updates (ArduinoOTA or ESP-IDF OTA)
