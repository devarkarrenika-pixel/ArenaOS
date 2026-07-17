/**
 * ArenaOS Stadium Map Component - FIFA World Cup 2026
 * Renders the vector SVG stadium, manages section selection, draws routing paths,
 * highlights elevators/facilities, and displays live crowd density heatmaps.
 */

class StadiumMap {
  constructor(containerId, isStaffPortal = false) {
    this.container = document.getElementById(containerId);
    this.isStaffPortal = isStaffPortal;
    this.selectedSection = null;
    this.routeActive = false;
    
    // Core nodes for path drawing (x, y coordinates on standard 400x400 map space)
    this.gateCoords = {
      "A": { x: 200, y: 30 },   // Top Gate
      "B": { x: 370, y: 200 },  // Right Gate
      "C": { x: 200, y: 370 },  // Bottom Gate
      "D": { x: 30, y: 200 }    // Left Gate
    };

    this.elevatorCoords = {
      "A": { x: 170, y: 70 },
      "B": { x: 330, y: 170 },
      "C": { x: 230, y: 330 },
      "D": { x: 70, y: 230 }
    };

    // Coordinates for stadium seating sectors 101 to 116 (Level 1) and 201 to 216 (Level 2)
    this.sectorCoords = {
      // Inner ring (100 level)
      101: { x: 200, y: 100, side: "top" },
      102: { x: 250, y: 110, side: "top-right" },
      103: { x: 290, y: 130, side: "right" },
      104: { x: 300, y: 170, side: "right" },
      105: { x: 300, y: 230, side: "right" },
      106: { x: 290, y: 270, side: "right" },
      107: { x: 250, y: 290, side: "bottom-right" },
      108: { x: 200, y: 300, side: "bottom" },
      109: { x: 150, y: 290, side: "bottom-left" },
      110: { x: 110, y: 270, side: "left" },
      111: { x: 100, y: 230, side: "left" },
      112: { x: 100, y: 170, side: "left" },
      113: { x: 110, y: 130, side: "left" },
      114: { x: 150, y: 110, side: "top-left" },
      
      // Outer ring (200 level)
      201: { x: 200, y: 65, side: "top" },
      202: { x: 270, y: 80, side: "top-right" },
      203: { x: 330, y: 105, side: "right" },
      204: { x: 345, y: 160, side: "right" },
      205: { x: 345, y: 240, side: "right" },
      206: { x: 330, y: 295, side: "right" },
      207: { x: 270, y: 320, side: "bottom-right" },
      208: { x: 200, y: 335, side: "bottom" },
      209: { x: 130, y: 320, side: "bottom-left" },
      210: { x: 70, y: 295, side: "left" },
      211: { x: 55, y: 240, side: "left" },
      212: { x: 55, y: 160, side: "left" },
      213: { x: 70, y: 105, side: "left" },
      214: { x: 130, y: 80, side: "top-left" }
    };
    
    this.render();
  }

  /**
   * Generates the SVG Elements and binds interaction handlers.
   */
  render() {
    if (!this.container) return;

    let svgHtml = `
      <svg viewBox="0 0 400 400" class="stadium-svg" id="stadiumSvg">
        <defs>
          <radialGradient id="pitchGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#023b1c" />
            <stop offset="100%" stop-color="#011f0e" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <blur stdDeviation="3" result="blur" />
            <composite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Stadium Exterior Wall -->
        <ellipse cx="200" cy="200" rx="190" ry="180" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" />
        <ellipse cx="200" cy="200" rx="180" ry="170" fill="rgba(3, 5, 11, 0.8)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />

        <!-- Outer Ring Seating (200 Level Blocks) -->
        <g id="sectors200">
          ${this.generateSectorPaths(140, 160, 200)}
        </g>

        <!-- Intermediate Corridor -->
        <ellipse cx="200" cy="200" rx="125" ry="115" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6" />

        <!-- Inner Ring Seating (100 Level Blocks) -->
        <g id="sectors100">
          ${this.generateSectorPaths(85, 105, 100)}
        </g>

        <!-- Soccer Pitch / Field in Center -->
        <g id="footballPitch" transform="translate(145, 160)">
          <rect width="110" height="80" rx="4" fill="url(#pitchGlow)" stroke="#00e575" stroke-width="1.5" />
          <line x1="55" y1="0" x2="55" y2="80" stroke="#00e575" stroke-dasharray="0" stroke-width="1" />
          <circle cx="55" cy="40" r="15" fill="none" stroke="#00e575" stroke-width="1" />
          <!-- Penalty boxes -->
          <rect x="0" y="20" width="15" height="40" fill="none" stroke="#00e575" stroke-width="1" />
          <rect x="95" y="20" width="15" height="40" fill="none" stroke="#00e575" stroke-width="1" />
          <!-- Goalposts -->
          <rect x="-2" y="32" width="2" height="16" fill="#fff" />
          <rect x="110" y="32" width="2" height="16" fill="#fff" />
        </g>

        <!-- Elevator Nodes -->
        <g id="elevators" opacity="0.6">
          <circle cx="170" cy="70" r="6" fill="#0062ff" />
          <circle cx="330" cy="170" r="6" fill="#0062ff" />
          <circle cx="230" cy="330" r="6" fill="#0062ff" />
          <circle cx="70" cy="230" r="6" fill="#0062ff" />
        </g>

        <!-- Entrance Gates -->
        <g id="gates">
          <!-- Gate A (Top) -->
          <g class="gate-pin" id="gatePin-A" onclick="window.arenaMap.selectGate('A')">
            <circle cx="200" cy="30" r="10" class="gate-ring gate-level-low" id="gateRing-A" />
            <circle cx="200" cy="30" r="5" fill="#fff" />
          </g>
          <!-- Gate B (Right) -->
          <g class="gate-pin" id="gatePin-B" onclick="window.arenaMap.selectGate('B')">
            <circle cx="370" cy="200" r="10" class="gate-ring gate-level-medium" id="gateRing-B" />
            <circle cx="370" cy="200" r="5" fill="#fff" />
          </g>
          <!-- Gate C (Bottom) -->
          <g class="gate-pin" id="gatePin-C" onclick="window.arenaMap.selectGate('C')">
            <circle cx="200" cy="370" r="10" class="gate-ring gate-level-high" id="gateRing-C" />
            <circle cx="200" cy="370" r="5" fill="#fff" />
          </g>
          <!-- Gate D (Left) -->
          <g class="gate-pin" id="gatePin-D" onclick="window.arenaMap.selectGate('D')">
            <circle cx="30" cy="200" r="10" class="gate-ring gate-level-low" id="gateRing-D" />
            <circle cx="30" cy="200" r="5" fill="#fff" />
          </g>
        </g>

        <!-- Dynamic Path Line -->
        <path id="routePath" d="" class="route-path" />

        <!-- Hover Info overlay -->
        <g id="mapTooltip" opacity="0" pointer-events="none">
          <rect width="90" height="35" rx="4" fill="rgba(0,0,0,0.85)" stroke="var(--fifa-green)" stroke-width="1" />
          <text x="45" y="15" fill="#fff" font-size="10" text-anchor="middle" font-weight="bold" id="tooltipTextSec">SEC 101</text>
          <text x="45" y="27" fill="var(--text-muted)" font-size="8" text-anchor="middle" id="tooltipTextWait">Wait: 4m</text>
        </g>

        <!-- Incident Highlight Pins (Staff Dashboard Only) -->
        <g id="incidentPins"></g>
      </svg>
    `;

    this.container.innerHTML = svgHtml;
    this.bindEvents();
  }

  /**
   * Helper to draw segment rings for stadium seating.
   * Creates 14 segments around the oval.
   */
  generateSectorPaths(rInner, rOuter, level) {
    let segments = [];
    const count = 14;
    const offset = level === 100 ? 0 : 0.05; // Slightly rotate levels for aesthetics

    for (let i = 0; i < count; i++) {
      const secNum = level + (i + 1);
      const angleStart = (i * (2 * Math.PI) / count) - Math.PI / 2 + offset;
      const angleEnd = ((i + 1) * (2 * Math.PI) / count) - Math.PI / 2 + offset;

      // Outer endpoints
      const x1 = Math.round(200 + rOuter * Math.cos(angleStart));
      const y1 = Math.round(200 + rOuter * Math.sin(angleStart) * 0.9); // Oval aspect
      const x2 = Math.round(200 + rOuter * Math.cos(angleEnd));
      const y2 = Math.round(200 + rOuter * Math.sin(angleEnd) * 0.9);

      // Inner endpoints
      const x3 = Math.round(200 + rInner * Math.cos(angleEnd));
      const y3 = Math.round(200 + rInner * Math.sin(angleEnd) * 0.9);
      const x4 = Math.round(200 + rInner * Math.cos(angleStart));
      const y4 = Math.round(200 + rInner * Math.sin(angleStart) * 0.9);

      // SVG path command: Move to outer 1, Arc to outer 2, Line to inner 3, Arc back to inner 4, Close
      const pathData = `M ${x1} ${y1} A ${rOuter} ${rOuter * 0.9} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner * 0.9} 0 0 0 ${x4} ${y4} Z`;
      
      segments.push(`
        <path d="${pathData}" 
              class="stadium-sector" 
              id="sector-${secNum}" 
              data-sector="${secNum}" 
              onclick="window.arenaMap.selectSector('${secNum}')"
              onmouseover="window.arenaMap.showTooltip(event, '${secNum}')"
              onmouseout="window.arenaMap.hideTooltip()" />
      `);
    }

    return segments.join("");
  }

  bindEvents() {
    // Add tooltip coordinate tracking
    const svgEl = document.getElementById("stadiumSvg");
    if (!svgEl) return;
    svgEl.addEventListener("mousemove", (e) => {
      const tooltip = document.getElementById("mapTooltip");
      if (tooltip && tooltip.getAttribute("opacity") === "1") {
        const rect = svgEl.getBoundingClientRect();
        // Convert screen client coordinates to SVG viewport space (400x400)
        const x = (e.clientX - rect.left) / rect.width * 400;
        const y = (e.clientY - rect.top) / rect.height * 400;
        
        // Position tooltip slightly above/right of cursor
        tooltip.setAttribute("transform", `translate(${Math.min(x + 10, 300)}, ${Math.min(y - 45, 350)})`);
      }
    });
  }

  /**
   * Selection and Routing Handlers
   */
  selectSector(secNum) {
    // Unselect previous
    if (this.selectedSection) {
      const prevSec = document.getElementById(`sector-${this.selectedSection}`);
      if (prevSec) prevSec.classList.remove("selected");
    }

    this.selectedSection = secNum;
    const currentSec = document.getElementById(`sector-${secNum}`);
    if (currentSec) {
      currentSec.classList.add("selected");
    }

    // Trigger update in general App context if exists
    if (window.onMapSectorSelect) {
      window.onMapSectorSelect(secNum);
    }
  }

  selectGate(gateId) {
    if (window.onMapGateSelect) {
      window.onMapGateSelect(gateId);
    }
  }

  /**
   * Draws a glowing path line from entrance gate to target sector.
   * Handles elevator-routing when accessibility mode is enabled.
   */
  drawRoute(fromGate, toSector, accessibleMode = false) {
    const routePath = document.getElementById("routePath");
    if (!routePath) return;

    if (!fromGate || !toSector || !this.sectorCoords[toSector]) {
      routePath.setAttribute("d", "");
      routePath.classList.remove("filter-glow");
      this.routeActive = false;
      return;
    }

    const start = this.gateCoords[fromGate];
    const end = this.sectorCoords[toSector];
    
    // Set line style color based on accessibility mode
    if (accessibleMode) {
      routePath.classList.add("route-path-accessible");
    } else {
      routePath.classList.remove("route-path-accessible");
    }

    // Build Path coordinates
    let pathString = `M ${start.x} ${start.y} `;

    if (accessibleMode) {
      // Route through the elevator closest to that gate zone
      const elevator = this.elevatorCoords[fromGate] || this.elevatorCoords["A"];
      pathString += `Q ${elevator.x} ${elevator.y}, ${elevator.x} ${elevator.y} `;
      pathString += `T ${end.x} ${end.y}`;
    } else {
      // Normal path curving around the stadium corridor ring
      const midX = (start.x + end.x) / 2 + (start.y - end.y) * 0.15;
      const midY = (start.y + end.y) / 2 + (end.x - start.x) * 0.15;
      pathString += `Q ${midX} ${midY}, ${end.x} ${end.y}`;
    }

    routePath.setAttribute("d", pathString);
    this.routeActive = true;
  }

  /**
   * Tooltip helper
   */
  showTooltip(e, secNum) {
    const tooltip = document.getElementById("mapTooltip");
    const textSec = document.getElementById("tooltipTextSec");
    const textWait = document.getElementById("tooltipTextWait");
    if (!tooltip || !textSec || !textWait) return;

    textSec.textContent = `SECTION ${secNum}`;
    
    // Density percentage simulation
    let density = "Normal Flow";
    if (parseInt(secNum) % 3 === 0) {
      density = "High Flow (Wait: 8m)";
    } else if (parseInt(secNum) % 4 === 0) {
      density = "Light Flow (Wait: 1m)";
    } else {
      density = "Moderate Flow (Wait: 3m)";
    }
    textWait.textContent = density;

    tooltip.setAttribute("opacity", "1");
  }

  hideTooltip() {
    const tooltip = document.getElementById("mapTooltip");
    if (tooltip) tooltip.setAttribute("opacity", "0");
  }

  /**
   * Heatmap logic for Command Center
   * Color codes sections based on simulated live crowd density
   */
  updateCrowdHeatmap(densityMap) {
    // Loop through all mapped sectors
    Object.keys(this.sectorCoords).forEach(secNum => {
      const sectorEl = document.getElementById(`sector-${secNum}`);
      if (sectorEl) {
        const level = densityMap[secNum] || "low";
        if (level === "critical") {
          sectorEl.style.fill = "rgba(255, 51, 51, 0.4)";
          sectorEl.style.stroke = "var(--red-card)";
        } else if (level === "high") {
          sectorEl.style.fill = "rgba(255, 170, 0, 0.35)";
          sectorEl.style.stroke = "var(--yellow-card)";
        } else if (level === "medium") {
          sectorEl.style.fill = "rgba(0, 98, 255, 0.25)";
          sectorEl.style.stroke = "var(--fifa-blue)";
        } else {
          sectorEl.style.fill = "rgba(0, 229, 117, 0.12)";
          sectorEl.style.stroke = "var(--fifa-green)";
        }
      }
    });
  }

  /**
   * Refreshes red glowing circles where active incidents are occurring (Staff Portal only)
   */
  updateIncidentPins(incidentsList) {
    const pinsGroup = document.getElementById("incidentPins");
    if (!pinsGroup || !this.isStaffPortal) return;

    pinsGroup.innerHTML = "";

    incidentsList.forEach(inc => {
      if (inc.status !== "Resolved" && inc.section) {
        const coords = this.sectorCoords[inc.section];
        if (coords) {
          pinsGroup.innerHTML += `
            <g transform="translate(${coords.x}, ${coords.y})">
              <circle cx="0" cy="0" r="12" fill="none" stroke="var(--red-card)" stroke-width="2">
                <animate attributeName="r" values="4;15;4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="5" fill="var(--red-card)" />
            </g>
          `;
        }
      }
    });
  }
}

// Global expose
window.StadiumMap = StadiumMap;
