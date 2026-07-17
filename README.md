# ArenaOS: FIFA World Cup 2026 Stadium Operations & Fan Companion

ArenaOS is a client-side, GenAI-enabled stadium operations and fan experience platform built for the **FIFA World Cup 2026**. It leverages client-side natural language processing, vector routing engines, Web Audio synthesizers, and canvas simulations to resolve crowd bottlenecks, coordinate staff dispatch, and engage tournament spectators.

---

## 🎯 Chosen Vertical
**Stadium Operations & Fan Experience (FIFA World Cup 2026 Matchday)**
- **Fan Experience**: Ticket-aware pathing, stair-free accessibility detours, 3D seat view previews, concessions queues ordering, AR wayfinding, and a multilingual AI concierge.
- **Stadium Operations**: Real-time crowd heatmaps, volunteer resource dispatching, GenAI incident triage (SOP drafting), concessions backlog handlers, and a live diagnostics engine.

---

## 🧠 Approach & Logic

### 1. Zero-Compile client-side Architecture
- **Rationale**: To guarantee zero-configuration execution directly from local files in any modern browser, all modules use clean vanilla HTML5/CSS3 and ES6 JavaScript imports.
- **Outcome**: Bypasses compile steps and framework dependencies, resulting in a featherweight package (< 1.5MB total directory size) that loads instantly.

### 2. Client-Side NLP Intent Engine (`ai-engine.js`)
- **Logic**: Matches fan prompts (e.g. food, transit, restrooms, elevators) using multilingual keyword tokenizers across **6 World Cup languages** (English, Spanish, French, Portuguese, German, Arabic).
- **Context-Aware Responses**: Tailors answers based on the user's active ticket details (seat section, gate coordinates).

### 3. Automated Incident Triage expert (`incident-ai.js`)
- **Logic**: Classifies textual incident reports into four operational categories (Medical, Security, Facilities, Crowd Control) and grades severity (Low, Medium, High, Critical).
- **Proximity Coordinator**: Matches the incident coordinates with the nearest available steward's location and generates a step-by-step Standard Operating Procedure (SOP).

### 4. Interactive 3D Seating Horizons (`app.js`)
- **Logic**: Uses a 2D Canvas to draw a perspective viewport of the soccer field.
- **Adaptive Horizon**: Vertically shifts coordinates and horizon lines depending on the ticket elevation (100 Level vs 200 Level Upper Decks) and rotates pitch orientations for sidelines, corners, and endlines.

### 5. Web Audio API Acoustic Synthesizer (`app.js`)
- **Logic**: Generates low-latency stadium cheers, vuvuzela horns, referee whistles, and drum thumps using raw audio node graphs, eliminating external asset downloads.

### 6. Automated Diagnostic Self-Test Suite (`app.js`)
- **Logic**: Executes unit tests directly inside the browser environment, testing routing coordinates, AI intent extraction, cart checkout totals, and incident classification logic.

---

## 🛠️ How the Solution Works

### For Fans (Spectator Suite)
1. **Ticket-Aware Wayfinding**: Fans input their seat details. The custom SVG pathing engine draws a route from the gate to their seat. Toggling "Accessibility Mode" detours routes around stairs to the closest elevators.
2. **AR Navigation HUD**: Fans launch the AR HUD. It overlays bobbing green directional arrows on top of their camera feed. If camera permissions are blocked, a retro-grid concourse fallback takes over.
3. **Multilingual AI Assistant**: An interactive chat interface helping fans locate refreshments, restrooms, and exits in their native language.
4. **Express Concessions**: Spectators pre-order food, claim EcoPoints discounts for recycling, and get a pickup QR code.
5. **Shootout Challenge**: A mini-game letting fans shoot penalty kicks past a moving goalkeeper. Goals update the scoreboard and trigger golden light strobe goal overlays.

### For Organizers (Command Center)
1. **Operations Heatmap**: Displays crowd density and active incident flags overlaying the stadium sectors.
2. **GenAI Auto-Reporting**: Generates typewriter-scrolled Match Summaries, Crowd Flow logs, and Scoreboard Performance reports synced to the live match.
3. **Dispatch Desk**: Organizers input issues, let the AI triage the severity, assign closest volunteer assets, and push dispatch updates back to the reporting fan in real-time.

---

## 📌 Assumptions Made
1. **Mock Coordinates**: Stadium seating sections (101-214) are mapped to static coordinates on a custom oval SVG path to compute pathing directions and volunteer steward distances.
2. **Static Concessions Wait times**: Concessions queues adjust wait metrics based on active mock ticket section selections.
3. **Simulated Match Day**: A clock loop ticks every second, counting down to a simulated kickoff at 20:00:00 to trigger pre-match events.
4. **Browser Camera Access**: AR Wayfinding assumes standard HTTPS/localhost browser permissions to access camera devices, reverting to the corridor grid animation when blocked.

---

## 📂 Repository Contents
- `index.html` - Base layout grid and overlay structures.
- `styles.css` - Custom sports navy styling, TV tickers, strobe lights, and animations.
- `app.js` - Global state store, Canvas loops, Web Audio synthesizer, and Diagnostics tests.
- `ai-engine.js` - Multilingual concierge query parsing logic.
- `incident-ai.js` - Operations triage engine.
- `map-component.js` - SVG vector routing maps.
- `app.yaml` - GCP App Engine standard deployment configuration.
- `firebase.json` & `.firebaserc` - Firebase Hosting target project configurations.
- `deploy_gcp.ps1` - PowerShell deployment automation script.
