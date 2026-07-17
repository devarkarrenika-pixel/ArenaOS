/**
 * ArenaOS Generative Incident Expert - FIFA World Cup 2026
 * Simulates a Generative AI security & operations advisor that triages reports,
 * outputs incident categories, assigns severity ratings, and drafts actionable SOPs.
 */

class IncidentAiExpert {
  constructor() {}

  /**
   * Triage an incident report and returns operational decision support data.
   */
  analyzeIncident(reportText, locationSection) {
    const text = reportText.toLowerCase().trim();
    const section = parseInt(locationSection) || 100;
    
    // 1. Determine Category
    let category = "Facilities";
    if (this.containsAny(text, ["heart", "collapse", "faint", "sick", "bleed", "stroke", "medical", "injury", "hurt", "unconscious", "breathing"])) {
      category = "Medical";
    } else if (this.containsAny(text, ["fight", "brawl", "drunk", "security", "police", "stole", "weapon", "harass", "assault", "threat", "theft"])) {
      category = "Security";
    } else if (this.containsAny(text, ["crowd", "gate jam", "line", "crush", "overcrowd", "bottleneck", "blocked", "egress", "staircase"])) {
      category = "Crowd Control";
    } else if (this.containsAny(text, ["spill", "leak", "plumbing", "water", "trash", "broken", "light", "toilet block", "seat", "rubbish"])) {
      category = "Facilities";
    }

    // 2. Determine Severity
    let severity = "Medium";
    if (this.containsAny(text, ["heart attack", "unconscious", "weapon", "fire", "crush", "collapse", "breathing difficulty"])) {
      severity = "Critical";
    } else if (this.containsAny(text, ["fight", "bleeding", "leak", "blocked exit", "gate jam", "drunk brawl"])) {
      severity = "High";
    } else if (this.containsAny(text, ["spill", "broken seat", "trash overflow", "toilet block", "light out"])) {
      severity = "Medium";
    } else if (this.containsAny(text, ["lost item", "clean", "lightbulb", "question", "ticket issue"])) {
      severity = "Low";
    }

    // 3. Draft tailored SOP (Standard Operating Procedure)
    const sop = this.generateSop(category, severity, locationSection, text);

    // 4. Recommend steward/volunteer based on spatial section math
    const dispatcherInfo = this.recommendDispatcher(category, section);

    return {
      category: category,
      severity: severity,
      sop: sop,
      recommendedDispatcher: dispatcherInfo.name,
      dispatcherDistance: dispatcherInfo.distance,
      timestamp: new Date().toLocaleTimeString(),
      status: "Triage Done"
    };
  }

  containsAny(source, keywords) {
    return keywords.some(keyword => source.includes(keyword));
  }

  generateSop(category, severity, section, rawReport) {
    const steps = [];
    
    if (category === "Medical") {
      steps.push("Dispatch Red Cross Medical response team to Section " + section);
      if (severity === "Critical") {
        steps.push("Contact Metro Emergency Medical Services for ambulance standby at Gate A");
        steps.push("Instruct local Section " + section + " stewards to clear access paths and maintain crowd boundary");
      } else {
        steps.push("Notify Section Coordinator to monitor medical responder arrival");
        steps.push("Provide volunteer first-aid kit containing basic supplies");
      }
      steps.push("Submit clinical check-in report once patient is stabilized");
    } 
    
    else if (category === "Security") {
      steps.push("Dispatch Stadium Security Response Unit to Section " + section);
      if (severity === "Critical") {
        steps.push("Request municipal police backup at sector checkpoint");
        steps.push("Isolate immediate area and record video feed from dome camera Cam-" + section);
      } else {
        steps.push("Instruct local stewards to de-escalate without physical contact");
        steps.push("Request supervisor presence to log witness statement");
      }
      steps.push("Document incident with spectator ticket/seating ID for potential blacklist");
    } 
    
    else if (category === "Crowd Control") {
      steps.push("Direct overflow crowd from gate/corridor nearest Section " + section + " to bypass Gate B");
      steps.push("Activate emergency lighting and open extra ticket scanner gates");
      if (severity === "High" || severity === "Critical") {
        steps.push("Deploy Crowd Safety Stewards to form guide-channels");
        steps.push("Issue loudspeaker broadcast: 'Move slowly, follow directions to adjacent exits'");
      } else {
        steps.push("Deploy 2 volunteers to manually check tickets to speed up flow");
      }
      steps.push("Log gate throughput statistics after 10 minutes");
    } 
    
    else { // Facilities
      if (rawReport.includes("spill") || rawReport.includes("water") || rawReport.includes("leak")) {
        steps.push("Alert janitorial response team for wet cleanup");
        steps.push("Deploy yellow warning cone at site near Section " + section);
        steps.push("If pipeline leakage: shut off zone valve inside maintenance utility corridor V-" + Math.floor(parseInt(section)/10));
      } else if (rawReport.includes("seat") || rawReport.includes("broken")) {
        steps.push("Log maintenance ticket for seat repair post-match");
        steps.push("Instruct volunteer to re-seat fan in temporary general admission section");
      } else {
        steps.push("Alert facility sweepers for garbage/facility maintenance");
        steps.push("Log work completion order once cleared");
      }
      steps.push("Verify area is safe for heavy pedestrian transit");
    }

    return steps;
  }

  recommendDispatcher(category, targetSection) {
    // List of mock active stewards in different parts of the stadium
    const volunteers = [
      { name: "Officer Marcus (Security)", role: "Security", section: 104 },
      { name: "Officer Elena (Security)", role: "Security", section: 122 },
      { name: "Nurse David (Medical)", role: "Medical", section: 108 },
      { name: "Dr. Sarah (Medical)", role: "Medical", section: 126 },
      { name: "Steward Jose (Facilities)", role: "Facilities", section: 112 },
      { name: "Steward Kenji (Facilities)", role: "Facilities", section: 130 },
      { name: "Volunteer Clara (Crowd Control)", role: "Crowd Control", section: 118 },
      { name: "Volunteer Liam (Crowd Control)", role: "Crowd Control", section: 101 }
    ];

    // Filter volunteers that match the required category
    let eligible = volunteers.filter(v => v.role === category);
    if (eligible.length === 0) {
      eligible = volunteers; // Fallback to any staff
    }

    // Find the one closest to targetSection
    let closest = eligible[0];
    let minDist = Math.abs(eligible[0].section - targetSection);

    for (let i = 1; i < eligible.length; i++) {
      const dist = Math.abs(eligible[i].section - targetSection);
      if (dist < minDist) {
        minDist = dist;
        closest = eligible[i];
      }
    }

    // Convert section distance to meters (approx 5 meters per section)
    const distanceMeters = minDist * 8;

    return {
      name: closest.name,
      distance: distanceMeters === 0 ? "Local (same section)" : `${distanceMeters} meters`
    };
  }
}

// Export instance
window.incidentAiExpert = new IncidentAiExpert();
