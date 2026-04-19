const AUTO_ROTATE_MS = 60 * 1000;

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

let navTimeout;

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
  transitionToPage("index.html");
}

function startAutoRotate() {
  setTimeout(() => {
    goToNextPage();
  }, AUTO_ROTATE_MS);
}

function buildGrafanaUrl(baseUrl, panelId) {
  const connector = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${connector}orgId=1&panelId=${panelId}&from=now-24h&to=now&timezone=Asia%2FBangkok&__feature.dashboardSceneSolo=true`;
}

function loadGrafanaFrames() {
  const baseUrl = document.body.dataset.grafanaBase;
  if (!baseUrl) return;

  const frames = document.querySelectorAll("iframe[data-panel-id]");

  frames.forEach((frame) => {
    const panelId = frame.dataset.panelId;
    if (!panelId) return;
    frame.src = buildGrafanaUrl(baseUrl, panelId);
  });
}

/* ===== ซ่อน/แสดงปุ่มเลื่อนอัตโนมัติ ===== */
function showNavTemporarily() {
  const nav = document.querySelector(".manual-nav");
  if (!nav) return;

  nav.classList.add("active");

  clearTimeout(navTimeout);

  navTimeout = setTimeout(() => {
    nav.classList.remove("active");
  }, 1500); // ไม่ขยับเมาส์ 1.5 วิ ปุ่มหาย
}

/* ขยับเมาส์แล้วปุ่มโผล่ */
document.addEventListener("mousemove", showNavTemporarily);

/* มือถือ แตะจอแล้วปุ่มโผล่ */
document.addEventListener("touchstart", showNavTemporarily);

/* กดคีย์บอร์ดซ้าย/ขวาได้ */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    goToPrevPage();
    showNavTemporarily();
  } else if (e.key === "ArrowRight") {
    goToNextPageManual();
    showNavTemporarily();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadGrafanaFrames();
  startAutoRotate();
  showNavTemporarily();
});