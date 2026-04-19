/* =========================
   CONFIG
========================= */

// ใส่หน้าหลักของคุณตรงนี้
const HOME_PAGE = "index.html";

// Base URL ใช้แค่รอบเดียว
const BASE_DASHBOARD_URL =
  "https://grafana.kmitl-pcc-energy.com/d-solo/ba9de396-f16b-491f-af48-8d3457b73c96/pre-e?";

const PANELS = {
  g1: { title: "Total Energy Consumption", panelId: 2 },
  g2: { title: "Total Real Power Consumption", panelId: 1 },
  g3: { title: "Energy", panelId: 7 },
  g4: { title: "Peak Real Power", panelId: 6 },
  g5: { title: "Total Real Power Trend", panelId: 4 },
  g6: { title: "Monthly Energy Consumption", panelId: 8 }
};

const pageOrder = [
  "HOMEshow.html",
  "showA.html",
  "showB.html",
  "showC.html",
  "showD.html",
  "showE.html",
  "showME.html",
  "showRIE.html",
  "showAE.html",
  "showPP.html"
];

const AUTO_ROTATE_MS = 60 * 1000;

const DEFAULT_FROM = "now-24h";
const DEFAULT_TO = "now";

/* ถ้ามีรูปก็ใส่ชื่อไฟล์ตรงนี้ ถ้าไม่ใช้ปล่อยว่างได้ */
const IMAGE_FILE = "1.KMITLHOME.jpg";


/* =========================
   FUNCTIONS
========================= */

function buildGrafanaURL(panelId) {
  const params = new URLSearchParams({
    orgId: "1",
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    timezone: "Asia/Bangkok",
    panelId: String(panelId),
    "__feature.dashboardSceneSolo": "true"
  });

  return `${BASE_DASHBOARD_URL}?${params.toString()}`;
}

function loadPanels() {
  Object.entries(PANELS).forEach(([frameId, config]) => {
    const iframe = document.getElementById(frameId);
    const title = document.getElementById(`title-${frameId}`);

    if (title) title.textContent = config.title;
    if (iframe) iframe.src = buildGrafanaURL(config.panelId);
  });
}

function getCurrentPageName() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

function transitionToPage(targetPage) {
  const transition = document.getElementById("pageTransition");

  if (transition) {
    transition.classList.add("active");

    setTimeout(() => {
      window.location.href = targetPage;
    }, 450);
  } else {
    window.location.href = targetPage;
  }
}

function goToNextPage() {
  const currentPage = getCurrentPageName();
  const currentIndex = pageOrder.indexOf(currentPage);

  if (currentIndex === -1) {
    transitionToPage(pageOrder[0]);
    return;
  }

  const nextIndex = (currentIndex + 1) % pageOrder.length;
  transitionToPage(pageOrder[nextIndex]);
}

function goToPrevPage() {
  const currentPage = getCurrentPageName();
  const currentIndex = pageOrder.indexOf(currentPage);

  if (currentIndex === -1) {
    transitionToPage(pageOrder[0]);
    return;
  }

  const prevIndex = (currentIndex - 1 + pageOrder.length) % pageOrder.length;
  transitionToPage(pageOrder[prevIndex]);
}

function goToNextPageManual() {
  goToNextPage();
}

function goHome() {
  transitionToPage(HOME_PAGE);
}

function startAutoRotate() {
  setTimeout(() => {
    goToNextPage();
  }, AUTO_ROTATE_MS);
}

function loadImage() {
  const img = document.getElementById("buildingImage");
  if (img && IMAGE_FILE) {
    img.src = IMAGE_FILE;
  }
}

/* =========================
   AUTO HIDE NAV
========================= */

let navTimeout;

function showNavTemporarily() {
  const nav = document.querySelector(".manual-nav");
  if (!nav) return;

  nav.classList.add("active");

  clearTimeout(navTimeout);

  navTimeout = setTimeout(() => {
    nav.classList.remove("active");
  }, 1500);
}

/* =========================
   EVENTS
========================= */

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    goToPrevPage();
  } else if (e.key === "ArrowRight") {
    goToNextPageManual();
  }
});

document.addEventListener("mousemove", showNavTemporarily);
document.addEventListener("touchstart", showNavTemporarily);

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadImage();
  loadPanels();
  startAutoRotate();
  showNavTemporarily();
});