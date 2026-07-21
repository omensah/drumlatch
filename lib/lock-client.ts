/**
 * DrumLatch Lock Client
 * =====================
 * Bridge between the web app and the ESP32 lock hardware.
 *
 * The ESP32 firmware (esp32/drumlatch_esp32.ino) exposes 3 HTTP endpoints:
 *
 *   GET  /api/status  -> { locked: boolean, vibration: 0|1, serial: string }
 *   POST /api/lock    -> { ok: true, locked: true }
 *   POST /api/unlock  -> { ok: true, locked: false }
 *
 * DEPLOYMENT MODES
 * ----------------
 * 1. Same-origin (demo): the app is served BY the ESP32 (LittleFS),
 *    so BASE_URL is "" and requests hit the device directly.
 * 2. Cross-origin (production): the app is hosted on Vercel and the
 *    device sits on the local network. Set NEXT_PUBLIC_LOCK_DEVICE_URL
 *    (e.g. "http://192.168.4.1") and add CORS headers to the firmware:
 *      server.sendHeader("Access-Control-Allow-Origin", "*");
 * 3. No device (pure demo): every call resolves with simulated data so
 *    the UI works identically in presentations.
 */

const BASE_URL = process.env.NEXT_PUBLIC_LOCK_DEVICE_URL ?? ''
const TIMEOUT_MS = 3000

export interface LockStatus {
  locked: boolean
  vibration: 0 | 1
  serial: string
  /** true when a real ESP32 answered; false when running in demo fallback */
  device: boolean
}

export interface LockResult {
  ok: boolean
  locked: boolean
  device: boolean
}

// Demo fallback state (module-level so it survives re-renders)
let demoLocked = false

async function fetchWithTimeout(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(`${BASE_URL}${path}`, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** Read the current lock state. Falls back to demo state if no device answers. */
export async function getLockStatus(): Promise<LockStatus> {
  try {
    const res = await fetchWithTimeout('/api/status')
    if (!res.ok) throw new Error(`status ${res.status}`)
    const json = await res.json()
    return { locked: !!json.locked, vibration: json.vibration ? 1 : 0, serial: json.serial ?? 'UNKNOWN', device: true }
  } catch {
    return { locked: demoLocked, vibration: 0, serial: 'DL-2024-W-03', device: false }
  }
}

/** Engage the physical lock. Resolves optimistically in demo mode. */
export async function engageLock(): Promise<LockResult> {
  try {
    const res = await fetchWithTimeout('/api/lock', { method: 'POST' })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const json = await res.json()
    return { ok: !!json.ok, locked: true, device: true }
  } catch {
    demoLocked = true
    return { ok: true, locked: true, device: false }
  }
}

/** Release the physical lock. Resolves optimistically in demo mode. */
export async function releaseLock(): Promise<LockResult> {
  try {
    const res = await fetchWithTimeout('/api/unlock', { method: 'POST' })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const json = await res.json()
    return { ok: !!json.ok, locked: false, device: true }
  } catch {
    demoLocked = false
    return { ok: true, locked: false, device: false }
  }
}
