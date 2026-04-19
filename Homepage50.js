const BASE_URL = "https://grafana.kmitl-pcc-energy.com";

let grafanaConfig = {
  ALL:{
    uid:"cfa48751-5ce0-4064-8a58-c4f85c54467c",
    path:"all-point",
    top:[258,261],
    main:[262,264,263,265,245,169,238,253]
  },
  A:{
    uid:"6125592f-a9c1-4763-932f-b78bc97a9158",
    path:"all-point-a",
    top:[257,258,261,260],
    main:[245,169,238,253]
  },
  B:{
    uid:"e4c52f95-831c-42ed-af9d-80128bef92bc",
    path:"all-point-b",
    top:[257,258,260,261],
    main:[245,169,238,253]
  },

  C:{
    uid:"8cb42adb-2885-4b5b-a7cd-4e6487f84f75",
    path:"all-point-c",
    top:[257,258,260,262],
    main:[245,169,238,253]
  },
  D:{
     uid:"928cb115-dca8-47e6-b331-f2d396876b2f",
    path:"all-point-d",
    top:[257,258,260,262],
    main:[245,169,238,253]
  },
  E:{
     uid:"4b24e01e-9057-431a-a7bd-53cbb0442939",
    path:"all-point-e",
    top:[257,258,260,261],
    main:[245,169,238,253]
  },
  ME:{
     uid:"1f50a27d-b14a-4d51-97bf-ef50bcf10b05",
    path:"all-point-me",
    top:[257,258,260,261],
    main:[245,169,238,253]
  },
  RIE:{
     uid:"140fc603-dd1f-4563-9393-8cf38d7cc0d2",
    path:"all-point-rie",
    top:[257,258,260,260],
    main:[245,169,238,253]
  },
  AE:{
     uid:"a9523847-14cc-4f9c-a587-b0bc39c87927",
    path:"all-point-ae",
    top:[257,258,260,262],
    main:[245,169,238,253]
  },
  PP:{
     uid:"5d76f710-3c02-485d-937c-0d1cf0875c7c",
    path:"all-point-pp",
    top:[257,258,260,261],
    main:[245,169,238,253]
  }
};

let current = "ALL";
let buildingOrder = ["ALL","A","B","C","D","E","ME","RIE","AE","PP"];

let from = null;
let to = null;

let buildingLinks = {
  A:"pageA.html",
  B:"pageB.html",
  C:"pageC.html",
  D:"pageD.html",
  E:"pageE.html",
  ME:"pageME.html",
  RIE:"pageRIE.html",
  AE:"pageAE.html",
  PP:"pagePP.html"
};

let buildingImages = {
  A:"A.png",
  B:"B3.png",
  C:"C.png",
  D:"D.png",
  E:"E.png",
  ME:"ME.png",
  RIE:"RIE.png",
  AE:"AE.png",
  PP:"PP.png"
};

function toggleLayout(showSidebar){
  const sidebar = document.getElementById("sidebar");
  const container = document.getElementById("mainContainer");
  const grid = document.getElementById("allGraphs");

  if(!sidebar || !container || !grid) return;

  if(showSidebar){
    sidebar.classList.remove("hidden");
    container.classList.remove("full");
    grid.classList.remove("full");
  }else{
    sidebar.classList.add("hidden");
    container.classList.add("full");
    grid.classList.add("full");
  }
}

function getIframe(panel){
  const c = grafanaConfig[current];

  let timeParam = "";
  if(from !== null && to !== null){
    timeParam = `from=${from}&to=${to}&`;
  }

  return `${BASE_URL}/d-solo/${c.uid}/${c.path}?${timeParam}orgId=1&timezone=Asia%2FBangkok&panelId=${panel}&__feature.dashboardSceneSolo=true&_ts=${Date.now()}`;
}

function updateTopGraphLayout(){
  const topGraphs = document.getElementById("topGraphs");
  const extraCards = document.querySelectorAll(".extra-top-card");

  if(!topGraphs) return;

  if(current === "ALL"){
    topGraphs.classList.remove("four-graphs");
    topGraphs.classList.add("two-graphs");

    extraCards.forEach(card => {
      card.classList.add("hidden-top-graph");
    });
  }else{
    topGraphs.classList.remove("two-graphs");
    topGraphs.classList.add("four-graphs");

    extraCards.forEach(card => {
      card.classList.remove("hidden-top-graph");
    });
  }
}

function updateMainGraphVisibility(){
  const allGraphs = document.getElementById("allGraphs");
  const card5 = document.getElementById("card-b5");
  const card6 = document.getElementById("card-b6");
  const card7 = document.getElementById("card-b7");
  const card8 = document.getElementById("card-b8");

  if(!allGraphs) return;

  if(current === "ALL"){
    allGraphs.classList.remove("building-layout");
    allGraphs.classList.add("home-layout");

    [card5, card6, card7, card8].forEach(card => {
      if(card) card.classList.remove("hide-main-graph");
    });
  }else{
    allGraphs.classList.remove("home-layout");
    allGraphs.classList.add("building-layout");

    [card5, card6, card7, card8].forEach(card => {
      if(card) card.classList.add("hide-main-graph");
    });
  }
}

function updateGraphTitles(){
  const topTitles = document.querySelectorAll("#topGraphs .graph-title");
  const mainTitles = document.querySelectorAll("#allGraphs .big-card .graph-title");

  if(current === "ALL"){
    const topNames = [
      "Total Real Power Consumption",
      "Total Energy Consumption",
      "Real Power Consumption",
      "Monthly Energy Consumption"
    ];

    const mainNames = [
      "Today's Total Energy ",
      "Today's Hightest Total Energy by Building ",
      "Today's Total Peak Real Power ",
      "Today's Hightest Real Power by Building ",
      "Total Real Power",
      "Power Consumption",
      "Monthly Peak Demand (W)",
      "Monthly Peak Demand (var)"
    ];

    topTitles.forEach((title, index) => {
      if(topNames[index]) title.textContent = topNames[index];
    });

    mainTitles.forEach((title, index) => {
      if(mainNames[index]) title.textContent = mainNames[index];
    });
  }else{
    const buildingName = current === "ME" || current === "RIE" || current === "AE" || current === "PP"
      ? `Building ${current}`
      : `Building ${current}`;

    const topNames = [
      `${buildingName}<br>Total Real Power`,
      `${buildingName}<br>Total Energy`,
      `${buildingName}<br>Today's Peak Real Power`,
      `${buildingName}<br>Today's Total Energy`
    ];

    const mainNames = [
      ` Real Poaer Trend `,
      ` Monthly Energy Consumption `,
      ` Monthly Peak Demand (W)`,
      ` Monthly Peak Demand (var)`
    ];

    topTitles.forEach((title, index) => {
      if(topNames[index]) title.innerHTML = topNames[index];
    });

    mainTitles.forEach((title, index) => {
      if(mainNames[index]) title.innerHTML = mainNames[index];
    });
  }
}

function loadGraphs(){
  const c = grafanaConfig[current];
  const refreshKey = `&_ts=${Date.now()}`;

  for(let i = 0; i < 4; i++){
    const el = document.getElementById("g" + (i + 1));
    if(!el) continue;

    if(c.top[i] !== undefined){
      el.src = getIframe(c.top[i]) + refreshKey;
    }else{
      el.src = "";
    }
  }

  for(let i = 0; i < 8; i++){
    const el = document.getElementById("b" + (i + 1));
    if(!el) continue;

    if(c.main[i] !== undefined){
      el.src = getIframe(c.main[i]) + refreshKey;
    }else{
      el.src = "";
    }
  }

  const singleGraph = document.getElementById("singleGraph");
  const single = document.getElementById("single");

  if(single && singleGraph && singleGraph.style.display === "block"){
    const currentSinglePanel = single.getAttribute("data-panel-id");
    if(currentSinglePanel){
      single.src = getIframe(currentSinglePanel) + refreshKey;
    }
  }

  updateTopGraphLayout();
  updateMainGraphVisibility();
  updateGraphTitles();
}

function resetTimeFilter(){
  from = null;
  to = null;

  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  document.getElementById("timeRange").value = "";

  loadGraphs();
}

function applyPresetRange(value){
  if(!value) return;

  from = `now-${value}`;
  to = "now";

  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";

  loadGraphs();
}

function setTopGraphsMode(isHome){
  const topGraphs = document.getElementById("topGraphs");
  if(!topGraphs) return;

  if(isHome){
    topGraphs.classList.remove("building-mode");
    topGraphs.classList.add("home-mode");
  }else{
    topGraphs.classList.remove("home-mode");
    topGraphs.classList.add("building-mode");
  }
}

function changeBuilding(b){
  current = b;
  setupSidebarMenu();
  toggleLayout(true);
  setTopGraphsMode(false);
  backToAll();
  loadGraphs();
}

function setupSidebarMenu(){
  const menu = document.getElementById("menuList");
  const imageWrap = document.getElementById("buildingImageWrap");

  if(!menu || !imageWrap) return;

  if(current === "ALL"){
    menu.innerHTML = `
      <li onclick="showGraph(1)">Today's Total Energy</li>
      <li onclick="showGraph(2)">Today's Hightest Total Energy by Building</li>
      <li onclick="showGraph(3)">Today's Total Peak Real Power</li>
      <li onclick="showGraph(4)">Today's Hightest Real Power by Building</li>
      <li onclick="showGraph(5)">Real Power Trend</li>
      <li onclick="showGraph(6)">Monthly Energy Consumption</li>
      <li onclick="showGraph(7)">Monthly Peak Demand (W)</li>
      <li onclick="showGraph(8)">Monthly Peak Demand (var)</li>
    `;
  }else{
    menu.innerHTML = `
      <li onclick="showGraph(1)">Real Power Trend</li>
      <li onclick="showGraph(2)">Monthly Energy Consumption</li>
      <li onclick="showGraph(3)">Monthly Peak Demand (W)</li>
      <li onclick="showGraph(4)">Monthly Peak Demand (var)</li>
    `;
  }

  imageWrap.innerHTML = "";

  if(current !== "ALL"){
    const link = document.createElement("a");
    link.href = buildingLinks[current] || "#";
    link.className = "building-image-btn";

    link.innerHTML = `
      <img src="${buildingImages[current] || ""}" alt="ไปหน้าตึก ${current}">
      <span>ไปหน้าตึก ${current}</span>
    `;

    imageWrap.appendChild(link);
  }
}

function applyTime(){
  const s = document.getElementById("startTime").value;
  const e = document.getElementById("endTime").value;

  if(!s || !e){
    alert("กรุณาเลือกเวลาเริ่มต้นและเวลาสิ้นสุดให้ครบ");
    return;
  }

  from = new Date(s).getTime();
  to = new Date(e).getTime();

  document.getElementById("timeRange").value = "";
  loadGraphs();
}

function showGraph(index){
  document.querySelectorAll("#menuList li").forEach(li => {
    li.classList.remove("active");
  });

  const currentBtn = document.querySelectorAll("#menuList li")[index - 1];
  if(currentBtn){
    currentBtn.classList.add("active");
  }

  document.getElementById("allGraphs").style.display = "none";
  document.getElementById("singleGraph").style.display = "block";

  const panel = grafanaConfig[current].main[index - 1];
  const single = document.getElementById("single");

  if(single && panel !== undefined){
    single.setAttribute("data-panel-id", panel);
    single.src = getIframe(panel) + `&_ts=${Date.now()}`;
  }
}

function backToAll(){
  const allGraphs = document.getElementById("allGraphs");
  const singleGraph = document.getElementById("singleGraph");

  if(allGraphs) allGraphs.style.display = "grid";
  if(singleGraph) singleGraph.style.display = "none";

  document.querySelectorAll("#menuList li").forEach(li => {
    li.classList.remove("active");
  });
}

function goNextBuilding(){
  const i = buildingOrder.indexOf(current);
  const next = buildingOrder[(i + 1) % buildingOrder.length];

  current = next;
  document.getElementById("buildingSelect").value = next;
  changeBuilding(next);
}

function goHome(){
  current = "ALL";
  document.getElementById("buildingSelect").value = "ALL";

  toggleLayout(false);
  setupSidebarMenu();
  setTopGraphsMode(true);
  backToAll();
  loadGraphs();
}

function goToPage(){
  window.location.href = "HOMEshow.html";
}

const heroImages = [
  "1.KMITLHOME.jpg",
  "2.map.png",
  "3.HOMEFULL.png",
  "4.HOMESUN.png",
  "5.HOMERE.png"
];

let heroIndex = 0;
let heroTimer = null;

function renderHeroImage(){
  const hero = document.getElementById("heroSlider");
  if(!hero) return;

  hero.style.background = `url('${heroImages[heroIndex]}') center/cover no-repeat`;
  updateHeroDots();
}

function createHeroDots(){
  const dotsContainer = document.getElementById("heroDots");
  if(!dotsContainer) return;

  dotsContainer.innerHTML = "";

  heroImages.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "hero-dot";
    dot.onclick = () => {
      heroIndex = index;
      renderHeroImage();
      restartHeroAutoSlide();
    };
    dotsContainer.appendChild(dot);
  });

  updateHeroDots();
}

function updateHeroDots(){
  const dots = document.querySelectorAll(".hero-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === heroIndex);
  });
}

function nextHeroImage(){
  heroIndex = (heroIndex + 1) % heroImages.length;
  renderHeroImage();
  restartHeroAutoSlide();
}

function prevHeroImage(){
  heroIndex = (heroIndex - 1 + heroImages.length) % heroImages.length;
  renderHeroImage();
  restartHeroAutoSlide();
}

function startHeroAutoSlide(){
  heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroImages.length;
    renderHeroImage();
  }, 10000);
}

function restartHeroAutoSlide(){
  clearInterval(heroTimer);
  startHeroAutoSlide();
}

/* INIT */
toggleLayout(false);
setupSidebarMenu();
setTopGraphsMode(true);
backToAll();
loadGraphs();
createHeroDots();
renderHeroImage();
startHeroAutoSlide();