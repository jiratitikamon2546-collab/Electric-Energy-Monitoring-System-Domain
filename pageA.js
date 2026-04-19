const baseURL = "https://grafana.kmitl-pcc-energy.com/d-solo/cb12dc3e-be61-4dca-9f4b-15fa5afc0f55/point-a";
const orgId = 1;

const buildingPageMap = {
  A: "pageA.html",
  B: "pageB.html",
  C: "pageC.html",
  D: "pageD.html",
  E: "pageE.html",
  ME: "pageME.html",
  RIE: "pageRIE.html",
  AE: "pageAE.html",
  PP: "pagePP.html"
};

const pageToBuildingMap = {
  "pageA.html": "A",
  "pageB.html": "B",
  "pageC.html": "C",
  "pageD.html": "D",
  "pageE.html": "E",
  "pageME.html": "ME",
  "pageRIE.html": "RIE",
  "pageAE.html": "AE",
  "pagePP.html": "PP"
};

let currentFrom = "now/d";
let currentTo = "now";
let currentPhase = null;

/* -------------------- main graph เดิม -------------------- */
const mainPanels = {
  rt1: 252, rt2: 276, rt3: 275, rt4: 277, rt5: 278,
  v1: 212, v2: 253, v3: 254,
  c1: 247, c2: 255, c3: 256,
  pf1: 281, pf2: 286, pf3: 287,
  td1: 306, td2: 307,
  mo1: 308, mo2: 310,
  pk1: 267, pk2: 269,
  ex1: 291,
  totalPower: 311,
  sPower: 314,
  qPower: 313,
  ePower: 202,
  pfSummary: 317
};

const phaseDashboardConfig = {
  1: [
    { id: "phaseGraph1", title: "Voltage", panelId: 212 },
    { id: "phaseGraph2", title: "Current", panelId: 247 },
    { id: "phaseGraph3", title: "Power factor", panelId: 281 },
    { id: "phaseGraph4", title: "Apparent Power", panelId: 249 },
    { id: "phaseGraph5", title: "Real Power", panelId: 248 },
    { id: "phaseGraph6", title: "Reactive Power", panelId: 250 },
    { id: "phaseGraph7", title: "Voltage", panelId: 173 },
    { id: "phaseGraph8", title: "Current", panelId: 174 },
    { id: "phaseGraph9", title: "Power factor", panelId: 205 },
    { id: "phaseGraph10", title: "Apparent Power", panelId: 196 },
    { id: "phaseGraph11", title: "Real Power", panelId: 198 },
    { id: "phaseGraph12", title: "Reactive Power", panelId: 200 }
  ],
  2: [
    { id: "phaseGraph1", title: "Voltage", panelId: 253 },
    { id: "phaseGraph2", title: "Current", panelId: 255 },
    { id: "phaseGraph3", title: "Power factor", panelId: 286 },
    { id: "phaseGraph4", title: "Apparent Power", panelId: 257 },
    { id: "phaseGraph5", title: "Real Power", panelId: 259 },
    { id: "phaseGraph6", title: "Reactive Power", panelId: 261 },
    { id: "phaseGraph7", title: "Voltage", panelId: 294 },
    { id: "phaseGraph8", title: "Current", panelId: 296 },
    { id: "phaseGraph9", title: "Power factor", panelId: 304 },
    { id: "phaseGraph10", title: "Apparent Power", panelId: 298 },
    { id: "phaseGraph11", title: "Real Power", panelId: 301 },
    { id: "phaseGraph12", title: "Reactive Power", panelId: 303 }
  ],
  3: [
    { id: "phaseGraph1", title: "Voltage", panelId: 254 },
    { id: "phaseGraph2", title: "Current", panelId: 256 },
    { id: "phaseGraph3", title: "Power factor", panelId: 287 },
    { id: "phaseGraph4", title: "Apparent Power", panelId: 258 },
    { id: "phaseGraph5", title: "Real Power", panelId: 260 },
    { id: "phaseGraph6", title: "Reactive Power", panelId: 262 },
    { id: "phaseGraph7", title: "Voltage", panelId: 295 },
    { id: "phaseGraph8", title: "Current", panelId: 297 },
    { id: "phaseGraph9", title: "Power factor", panelId: 305 },
    { id: "phaseGraph10", title: "Apparent Power", panelId: 299 },
    { id: "phaseGraph11", title: "Real Power", panelId: 300 },
    { id: "phaseGraph12", title: "Reactive Power", panelId: 302 }
  ]
};

function buildGrafanaURL(panelId) {
  const params = new URLSearchParams({
    orgId: String(orgId),
    panelId: String(panelId),
    from: String(currentFrom),
    to: String(currentTo),
    timezone: "Asia/Bangkok",
    __feature_dashboardSceneSolo: "true",
    _ts: String(Date.now())
  });

  return `${baseURL}?${params.toString().replace("__feature_dashboardSceneSolo", "__feature.dashboardSceneSolo")}`;
}

function setFrame(id, panelId) {
  const frame = document.getElementById(id);
  if (frame) {
    frame.src = buildGrafanaURL(panelId);
  }
}

function clearFrame(id) {
  const frame = document.getElementById(id);
  if (frame) {
    frame.src = "";
  }
}

function clearPhaseGraphs() {
  for (let i = 1; i <= 12; i++) {
    clearFrame(`phaseGraph${i}`);
  }
}

function setActivePhaseButton(buttonEl) {
  document.querySelectorAll(".phase-normal-btn").forEach(btn => btn.classList.remove("active"));
  if (buttonEl) buttonEl.classList.add("active");
}

function clearQuickGraphButtons() {
  document.querySelectorAll(".quick-graph-btn").forEach(button => {
    button.classList.remove("active");
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("hide");
  }
}

function goHome() {
  window.location.href = "Homepage10.html";
}

function goToBuilding(fileName) {
  if (!fileName) return;
  window.location.href = fileName;
}

function goToBuildingFromDropdown() {
  const select = document.getElementById("buildingSelect");
  if (!select) return;

  const building = select.value;
  const targetPage = buildingPageMap[building];

  if (!targetPage) return;

  localStorage.setItem("selectedBuilding", building);
  window.location.href = targetPage;
}

function syncBuildingDropdown() {
  const select = document.getElementById("buildingSelect");
  if (!select) return;

  const currentPage = window.location.pathname.split("/").pop();
  const buildingFromPage = pageToBuildingMap[currentPage];

  if (buildingFromPage) {
    select.value = buildingFromPage;
    localStorage.setItem("selectedBuilding", buildingFromPage);
    return;
  }

  const savedBuilding = localStorage.getItem("selectedBuilding");
  if (savedBuilding && buildingPageMap[savedBuilding]) {
    select.value = savedBuilding;
  }
}

function applyPresetRange(value) {
  if (!value) return;

  if (value === "d") {
    currentFrom = "now/d";
    currentTo = "now";
  } else {
    currentFrom = `now-${value}`;
    currentTo = "now";
  }

  const startInput = document.getElementById("start");
  const endInput = document.getElementById("end");
  if (startInput) startInput.value = "";
  if (endInput) endInput.value = "";

  refreshCurrentView();
}

function applyTime() {
  const startEl = document.getElementById("start");
  const endEl = document.getElementById("end");
  const presetEl = document.getElementById("preset");

  const start = startEl ? startEl.value : "";
  const end = endEl ? endEl.value : "";
  const preset = presetEl ? presetEl.value : "";

  if (start && end) {
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();

    if (!Number.isNaN(startMs) && !Number.isNaN(endMs) && startMs < endMs) {
      currentFrom = startMs;
      currentTo = endMs;

      if (presetEl) presetEl.value = "";
      refreshCurrentView();
      return;
    }
  }

  if (preset) {
    applyPresetRange(preset);
    return;
  }

  currentFrom = "now/d";
  currentTo = "now";
  refreshCurrentView();
}

function resetTime() {
  const startEl = document.getElementById("start");
  const endEl = document.getElementById("end");
  const presetEl = document.getElementById("preset");

  if (startEl) startEl.value = "";
  if (endEl) endEl.value = "";
  if (presetEl) presetEl.value = "";

  currentFrom = "now/d";
  currentTo = "now";
  refreshCurrentView();
}

function loadMainGraphs() {
  Object.entries(mainPanels).forEach(([id, panelId]) => {
    setFrame(id, panelId);
  });
}

function loadPhaseGraphs(phaseNumber) {
  const phaseConfig = phaseDashboardConfig[phaseNumber];
  if (!phaseConfig) return;

  phaseConfig.forEach((item, index) => {
    const titleEl = document.getElementById(`phaseCardTitle${index + 1}`);
    if (titleEl) {
      titleEl.textContent = item.title;
    }
    setFrame(item.id, item.panelId);
  });
}

function openPhasePage(phaseNumber, btn) {
  currentPhase = phaseNumber;

  const singleView = document.getElementById("singleGraphView");
  const mainPage = document.getElementById("mainDashboardPage");
  const phasePage = document.getElementById("phaseDashboardPage");

  if (singleView) {
    singleView.classList.remove("active");
    singleView.style.display = "none";
  }

  if (mainPage) mainPage.style.display = "none";
  if (phasePage) phasePage.style.display = "block";

  const phaseTitle = document.getElementById("phasePageTitle");
  if (phaseTitle) {
    phaseTitle.textContent = `PHASE ${phaseNumber}`;
  }

  setActivePhaseButton(btn);
  loadPhaseGraphs(phaseNumber);
}

function backToMainDashboard() {
  currentPhase = null;

  const mainPage = document.getElementById("mainDashboardPage");
  const phasePage = document.getElementById("phaseDashboardPage");
  const singleView = document.getElementById("singleGraphView");

  if (phasePage) phasePage.style.display = "none";
  if (mainPage) mainPage.style.display = "block";
  if (singleView) {
    singleView.classList.remove("active");
    singleView.style.display = "none";
  }

  clearPhaseGraphs();
  clearQuickGraphButtons();
  setActivePhaseButton(document.getElementById("phaseBtnAll"));
}

function backToDashboard() {
  backToMainDashboard();
}

function showAllGraphs(btn) {
  backToMainDashboard();
  if (btn) setActivePhaseButton(btn);
}

function showSingleGraph(type, btn) {
  currentPhase = null;
  clearQuickGraphButtons();

  if (btn) btn.classList.add("active");

  const phasePage = document.getElementById("phaseDashboardPage");
  const mainPage = document.getElementById("mainDashboardPage");
  const singleView = document.getElementById("singleGraphView");

  if (phasePage) phasePage.style.display = "none";
  if (mainPage) mainPage.style.display = "none";
  if (singleView) {
    singleView.style.display = "block";
    singleView.classList.add("active");
  }

  clearPhaseGraphs();

  const config = {
    S: { title: "Apparent Power", panelId: 314 },
    P: { title: "Real Power", panelId: 311 },
    Q: { title: "Reactive Power", panelId: 313 },
    PF: { title: "Power Factor", panelId: 317 },
    E: { title: "Energy", panelId: 202 }
  };

  const selected = config[type];
  if (!selected) return;

  const titleEl = document.getElementById("singleGraphTitle");
  if (titleEl) {
    titleEl.textContent = selected.title;
  }

  const frame = document.getElementById("singleGraphFrame");
  if (frame) {
    frame.dataset.panelId = selected.panelId;
    frame.src = buildGrafanaURL(selected.panelId);
  }

  document.querySelectorAll(".phase-normal-btn").forEach(button => {
    button.classList.remove("active");
  });
}

function refreshCurrentView() {
  const singleView = document.getElementById("singleGraphView");
  const phasePage = document.getElementById("phaseDashboardPage");
  const mainPage = document.getElementById("mainDashboardPage");

  if (singleView && singleView.classList.contains("active") && singleView.style.display !== "none") {
    const frame = document.getElementById("singleGraphFrame");
    const panelId = frame ? frame.dataset.panelId : "";
    if (panelId) {
      frame.src = buildGrafanaURL(panelId);
    }
    return;
  }

  if (phasePage && phasePage.style.display === "block" && currentPhase) {
    loadPhaseGraphs(currentPhase);
    return;
  }

  if (mainPage && mainPage.style.display !== "none") {
    loadMainGraphs();
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

let scrollTimeout;

window.addEventListener("scroll", function () {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  }

  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    scrollBtn.classList.remove("show");
  }, 1200);
});

document.addEventListener("DOMContentLoaded", () => {
  syncBuildingDropdown();

  const preset = document.getElementById("preset");
  const start = document.getElementById("start");
  const end = document.getElementById("end");
  const singleView = document.getElementById("singleGraphView");
  const mainPage = document.getElementById("mainDashboardPage");
  const phasePage = document.getElementById("phaseDashboardPage");

  if (preset) {
    preset.addEventListener("change", function () {
      applyPresetRange(this.value);
    });
  }

  if (start) {
    start.addEventListener("change", () => {
      const presetEl = document.getElementById("preset");
      if (presetEl) presetEl.value = "";
      const endValue = end ? end.value : "";
      if (start.value && endValue) {
        applyTime();
      }
    });
  }

  if (end) {
    end.addEventListener("change", () => {
      const presetEl = document.getElementById("preset");
      if (presetEl) presetEl.value = "";
      const startValue = start ? start.value : "";
      if (startValue && end.value) {
        applyTime();
      }
    });
  }

  if (singleView) singleView.style.display = "none";
  if (mainPage) mainPage.style.display = "block";
  if (phasePage) phasePage.style.display = "none";

  clearPhaseGraphs();
  loadMainGraphs();
});