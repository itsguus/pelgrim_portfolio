---
title: Openhoteldag
order: 1
links: 
    - title: Website
      url: https://openhoteldag.com/
    - title: Jekyll programma template (raw)
      url: uploads/openhoteldag.txt
---

Ik werd in de eerste week meteen in het diepe gegooid. Samen met Cris en Thomas van D/DOCK, een design community gelegen in de houthavens is het concept “Open Hotel Dag” neergezet. 

![](uploads/openhoteldag-2.png)

### Aanpak

Thomas zorgde ervoor dat data van de hotels verzameld werd, het was aan mij om hier een juist format voor te vinden en er een website van te realiseren. De wens was om alle activiteiten in een soort festivalprogramma te verpakken. Hierin kon je over de gehele dag zien wat er te doen was. Best een uitdaging. 

> Tijdens de nationale Open Hotel Dag kunnen bedrijven en inwoners van de grootste Nederlandse steden bij hotels komen werken, samenwerken, lunchen, sporten, borrelen, zwemmen, en meer. Dit is de uitgelezen kans voor bewoners en bedrijven om kennis te maken met de faciliteiten en gastvrijheid die de hotels in eigen stad te bieden hebben.
> 

### data 
Ik was begonnen met het uitzoeken van welke data we per hotel nodig hadden om dit in elkaar te kunnen zetten. Oorspronkelijk wilde we dit in een excel speadsheet zetten, maar nadat ik alle benodigde data hier in kolommen had neergezet leek dit veel te onoverzichtelijk te worden. Ik heb uiteindelijk gekozen voor een .yml file, zodat ik de data ook kon nesten. Ook kon iemand van D/DOCK dan alle data invullen. 

De schets die ik had binnengekregen zag er zo uit:  

![](uploads/openhoteldag-1.png)

Dit is een voorbeeld van hoe een input van één hotel er aan de achterkant uitziet:

```yml
- title: Kimpton De Witt
  image: uploads/kimpton-de-witt-exterior.jpg
  description_markdown: >-
    **Welkom bij Kimpton De Witt Amsterdam\!**


    Kimpton De Witt is our first European boutique hotel, Kimpton De Witt Hotel,
    which exudes a modern approach to luxury through fresh, refined rooms and
    imaginative spaces steeped in inspired Dutch design. Experience an immersive
    labyrinth of contemporary millwork, lush layers and clean lines. A journey
    where rooms open to grand inspiration and eclectic treasures. Nestled in the
    heart of Amsterdam’s thriving&nbsp;[City
    Centre](https://www.kimptondewitthotel.com/en/city-centre-hotels/), our
    hotel inspires you to imagine, explore, create and find a comfortable place
    to relax. With our unique personality and heartfelt service, consider our
    intimate boutique hotel your personal sanctuary.
  address: Nieuwezijds Voorburgwal 5
  hotel_mailadres: 'press@kimptondewitthotel.com '
  optional_url:
  activities:
    - title: Deep House Yoga
      description_markdown: >-
        Deep House Yoga workout x Blue Birds<br>Kick off your morning with a
        deep house yoga workout provided by Blue Birds and get a surprise goodie
        bag afterwards.
      category: sports_leasure
      from: '08:30'
      to: '09:15'
      cost: '0'
      registration_required: true
      optional_registration_mail: 'press@kimptondewitthotel.com '
      optional_registration_url:
      optional_registration_instructions:
      optional_no_registration_input_markdown:
    - title: 'Driegangen diner bij Celia Amsterdam '
      description_markdown: >-
        Enjoy a delicious Californian inspired 3-course dinner at Celia
        Amsterdam.
      category: food
      from: '17:00'
      to: '22:00'
      cost: 32.5
      registration_required: true
      optional_registration_mail: www.celiaasmterdam.com and leave a note 'Open Hotel Dag'
      optional_registration_url: https://www.celiaamsterdam.com/nl
      optional_registration_instructions: Leave a note "Open Hotel Dag"
      optional_no_registration_input_markdown:

```

Deze datafile is uiteindelijk ~ 2500 regels lang geworden.

### Programma

Na een hoop hoofdpijn en ellende ben is het wel allemaal gelukt. Op [deze link](https://openhoteldag.com/programma) kun je zien hoe het er uitziet. Het moeilijkste was om hier uit te rekenen wanneer er twee activiteitblokken waren die geen overlap hadden, zodat deze op dezelfde row konden te komen staan. Het hele ding is ook responsive, waar op mobile ook de labels van de activiteiten horizontaal meescrollen. 

Er kan ook gefilterd worden, waarna alle blokken met een transition verwijnen. Ik had hier gekozen om de breedtes en posities van de activiteiten static te coderen in Jekyll. Bij de [links bovenin](#top) kun je de jekyll template zien. 

_Desktop versie_
![](uploads/ohd-3.png)

_Mobiele versie_
![](uploads/ohd-4.png)

_Javascript van de website_
```js
function page(pageName) { return document.body.classList.contains(pageName); }

// Helper function to get form data in the supported format
function getFormDataString(formEl) {
  var formData = new FormData(formEl),
    data = [];
  for (var keyValue of formData) {
    data.push(encodeURIComponent(keyValue[0]) + "=" + encodeURIComponent(keyValue[1]));
  }
  return data.join("&");
}

if (page("content")) {
  var formEl = document.querySelector("form");
  // Override the submit event
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();

    var request = new XMLHttpRequest();

    request.addEventListener("load", function () {
      if (request.status === 302) { // CloudCannon redirects on success
        // It worked
      }
    });
    request.open(formEl.method, formEl.action);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(getFormDataString(formEl));
    collapseForm();
  });
}

if (page("landing")) {
  // Fetch the form element
  var formEl = document.querySelector(".intro form");
  // Override the submit event
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();

    var request = new XMLHttpRequest();

    request.addEventListener("load", function () {
      if (request.status === 302) { // CloudCannon redirects on success
        // It worked
      }
    });
    request.open(formEl.method, formEl.action);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(getFormDataString(formEl));
    collapseForm();
  });

  // Fetch the form element
  var formEl2 = document.querySelector(".content .form form");
  // Override the submit event
  formEl2.addEventListener("submit", function (e) {
    e.preventDefault();

    var request = new XMLHttpRequest();

    request.addEventListener("load", function () {
      if (request.status === 302) { // CloudCannon redirects on success
        // It worked
      }
    });
    request.open(formEl2.method, formEl2.action);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(getFormDataString(formEl2));

    collapseForm();
  });


  // Fetch the form element
  var formEl3 = document.querySelector("form#hotel");
  // Override the submit event
  formEl3.addEventListener("submit", function (e) {
    e.preventDefault();

    var request = new XMLHttpRequest();

    request.addEventListener("load", function () {
      if (request.status === 302) { // CloudCannon redirects on success
        // It worked
      }
    });
    request.open(formEl3.method, formEl3.action);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(getFormDataString(formEl3));

    collapseForm(true);
  });

  // Fetch the form element
  var formEl4 = document.querySelector("form#questionform");
  // Override the submit event
  formEl4.addEventListener("submit", function (e) {
    e.preventDefault();

    var request = new XMLHttpRequest();

    request.addEventListener("load", function () {
      if (request.status === 302) { // CloudCannon redirects on success
        // It worked
      }
    });
    request.open(formEl4.method, formEl4.action);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(getFormDataString(formEl4));

    collapseForm(false, true);
  });
}



function collapseForm(hotel) {
  if (hotel) document.querySelector("form#hotel").classList.add("hotelSent");
  else
    document.querySelectorAll("form").forEach(form => {
      form.classList.add("sent");
    });
}

function expandForm(e, expandQuestionForm) {
  e.preventDefault();
  document.querySelectorAll("form.expandable").forEach(form => {
    form.classList.remove("open");
  })
  var el = document.querySelector("#hotel");
  if (expandQuestionForm) el = document.querySelector("#questionform");
  el.classList.add("open");

  setTimeout(() => {
    const href = e.target.getAttribute("href");
    window.location.href = href;
  }, 500);
}

const as = document.querySelectorAll(".content article > p > a");
as.forEach(a => {
  if (a.href.includes("#hotel"))
    if (a == as[0]) {
      a.addEventListener("click", (event) => {
        expandForm(event);
      });
    }
    else if (a == as[2]) {
      a.addEventListener("click", (event) => {
        expandForm(event, true);
      });
    }
});

//------------------ HOTEL PAGE FUNCTIONS ----------------------

function scrollFunction() {
  const y = window.scrollY,
    figheight = document.querySelector("section figure").offsetHeight,
    h1 = document.querySelector("h1"),
    h1Height = h1.offsetHeight,
    singleLineH1Height = document.querySelector(".fakeh1").offsetHeight,
    thresholdY = (figheight / 2) - singleLineH1Height,
    maxThresholdX = 1400;

  var lines = getAmountOfLines(h1Height, singleLineH1Height),
    factor = getFactor(lines),
    correctionInPx = getCorrection(lines),
    margTop = `${figheight / 2}px - ${h1Height / 2}px`,
    transY = thresholdY * 2 - y + (factor * 20);

  if (window.innerWidth > maxThresholdX) transY = thresholdY - y + 150 - correctionInPx;

  if (y < thresholdY) {
    h1.style = `transform: translateY(${y}px); top: calc(${margTop})`;
    document.querySelector("h1.sticky").classList.remove("show");
    document.querySelector("h1.sticky").style=`height: {0px`;
  }
  else { 
    h1.classList.add("hide");
    document.querySelector("h1.sticky").classList.add("show");
    document.querySelector("h1.sticky").style=`height: ${h1Height}px`;
  }
}


function updateMargin(condition, h1Height) {
  const content = document.querySelector("div.md");
  if (!condition) content.style = `margin-top: ${h1Height}px`
  else content.style = `margin-top: 0px`
}

function getFactor(lines) {
  if (lines == 1) return 0;
  if (lines == 2) return 2;
  return 5;
}

function getCorrection(lines) {
  if (lines == 1) return 70
  if (lines == 2) return -20;
  return -50;
}
function getAmountOfLines(fullHeight, singleHeight) {
  return Math.floor(fullHeight / singleHeight);
}


// -------------- PROGRAMME FUNCTIONS ----------------
function setBars() {
  const rows = document.querySelectorAll("ul.hotelRow");
  rows.forEach(row => {
    let data = [];
    const lis = row.querySelectorAll("li:not(.relHeight)[data-visible=true]");
    lis.forEach(li => {
      let liData = {
        node: li,
        parent: li.parentNode,
        width: parseFloat(li.getAttribute("data-width")),
        left: parseFloat(li.getAttribute("data-left")),
        allLeft: parseFloat(li.getAttribute("data-width")) + parseFloat(li.getAttribute("data-left")),
        from: li.getAttribute("data-from"),
        to: li.getAttribute("data-to"),
        filter: li.getAttribute("data-filter"),
        moved: li.getAttribute("data-moved")
      };
      data.push(liData);
    });


    data.forEach(listObject => {
      for (const sibling of listObject.parent.querySelectorAll("li:not(.relHeight)[data-visible=true]")) {
        const siblingObject = data.filter(entry => { if (entry.node == sibling) return true })[0];
        if (clashes(listObject, siblingObject)) {
          moveBar(siblingObject);
        }
      }
    });
  });
  const allActivities = document.querySelectorAll("li.hotelActivity");
  allActivities.forEach(acivity => {
    acivity.setAttribute("data-moved", false)
  });
}

function clashes(obj, siblingObj) {
  if (obj.moved == 1 || siblingObj.moved == 1) return false;
  if (obj != siblingObj) {
    if (obj.from < siblingObj.to && obj.to > siblingObj.from) {
      return true;
    }
  }
  return false;
}

function moveBar(obj) {
  const amountOfMoves = obj.parent.querySelectorAll("li[data-moved=true][data-visible=true]").length + 1,
    rowHeight = ((amountOfMoves + 1) * 5),
    hotelName = obj.node.getAttribute("data-hotel");

  document.querySelector(`#titles > li#${hotelName}`).style = `height: ${rowHeight}rem`
  obj.parent.querySelector("li.relHeight").style = `height: ${rowHeight}rem`
  obj.parent.style = `height: ${rowHeight}rem`
  obj.node.classList.add(`row${amountOfMoves}`);
  obj.node.classList.add(`moved`);
  obj.node.setAttribute("data-moved", true);
  obj.moved = true;
}

function filter() {
  const activeFilters = document.querySelectorAll("fieldset input:checked"),
    allActivities = document.querySelectorAll("li.hotelActivity");
  if (activeFilters.length === 0) { showEverything(); adjustRowHeights(); return; }
  var toBeFiltered = [], expandableFilters = false;
  activeFilters.forEach(filter => {
    const filterName = filter.getAttribute("data-filter"),
      filterType = filter.getAttribute("data-filter-type"),
      filterObj = {
        name: filterName,
        type: filterType
      };
    if (filterObj.type == "expand") expandableFilters = true;
    toBeFiltered.push(filterObj);
  })
  if (!expandableFilters) allActivities.forEach(activity => { activity.classList.add("filter_available") });
  runFilters(toBeFiltered);


  allActivities.forEach(activity => {
    for (var i = 0; i < 10; i++) { activity.classList.remove(`row${i}`) }
    activity.classList.remove("moved");
  });
  setBars();
  adjustRowHeights();
}


function adjustRowHeights() {
  const allRows = document.querySelectorAll("ul.hotelRow");
  allRows.forEach(row => {
    const activeActivities = row.querySelectorAll("li.moved[data-visible=true]"),
      newRowHeight = parseFloat((activeActivities.length + 1) * 4.5) + (0.5 * (activeActivities.length));

    row.querySelector("li.relHeight").style = `height: ${newRowHeight}rem`;
    row.style = `height: ${newRowHeight}rem`;
    document.querySelector(`li#${row.getAttribute('data-hotel')}`).style = `height: ${newRowHeight}rem`;
  });
}

function runFilters(filterObjs) {
  const allActivities = document.querySelectorAll("li.hotelActivity");
  allActivities.forEach(el => {
    el.setAttribute("data-visible", false);
    var show = true;
    for (const filter of filterObjs) {
      if (el.classList.contains(filter.name) && filter.type == "expand") el.classList.add("filter_available");
    }
    for (const filter of filterObjs) {
      if (!el.classList.contains(filter.name) && filter.type == "narrow") {
        show = false;
      }
    }
    if (show && el.classList.contains("filter_available")) {
      el.setAttribute("data-visible", true);
      el.classList.remove("filter_available");
    };
  });
  const allRows = document.querySelectorAll("ul.hotelRow");
  allRows.forEach(row => {
    const activeRowActivities = row.querySelectorAll("li.hotelActivity[data-visible=true]")
    const hotel = row.getAttribute("data-hotel"),
      title = document.querySelector(`#${hotel}`);
    let result;
    if (activeRowActivities.length > 0) result = true;
    else result = false;
    title.setAttribute("data-visible", result);
    row.setAttribute("data-visible", result);
  });
}

function showEverything() {
  let allRows = document.querySelectorAll("ul.hotelRow"),
    allActivitiies = document.querySelectorAll("li.hotelActivity"),
    allTitles = document.querySelectorAll("li.hotelTitle");

  allRows.forEach(row => { row.setAttribute("data-visible", true); });
  allActivitiies.forEach(activity => { activity.setAttribute("data-visible", true); });
  allTitles.forEach(title => { title.setAttribute("data-visible", true); });
  setBars();
}

function setPopupHeights() {
  const allPopups = document.querySelectorAll("li.popup.show");
  allPopups.forEach(popup => {
    let height = 0;
    const allItems = popup.querySelectorAll("*");
    allItems.forEach(item => {
      if (item.parentNode.classList.contains("popup")) {
        let itemHeight = item.offsetHeight;
        itemHeight += parseInt(window.getComputedStyle(item).getPropertyValue('margin-top'));
        itemHeight += parseInt(window.getComputedStyle(item).getPropertyValue('margin-bottom'));
        height += itemHeight;
      }
    });
    popup.style = `max-height: ${height}px;`
  });
}

function expandActivity(el) {
  document.body.classList.add("no-scroll");
  const activityName = el.getAttribute("data-activity");

  const popup = document.querySelector(`li#${activityName}`);
  popup.classList.add("show");
  popup.parentNode.classList.add("show");

  setPopupHeights();
}

function closeActivity() {
  document.body.classList.remove("no-scroll");
  const allPopups = document.querySelectorAll("li.popup");
  allPopups.forEach(popup => { popup.classList.remove("show"); });
  allPopups[0].parentNode.classList.remove("show");
}

function fakeSticky() {
  const dataDOM = document.querySelector(".data")
  const toTop = dataDOM.getBoundingClientRect().top - 15;
  if (toTop <= 0) document.querySelector(".buttonbox").classList.add("sticky");
  else document.querySelector(".buttonbox").classList.remove("sticky");


  const stickyEl = document.querySelector(".stickyTimes"), fromTop = window.pageYOffset + dataDOM.getBoundingClientRect().top;
  if (toTop <= 0) {
    stickyEl.classList.add("show");
    stickyEl.style = `transform: translate3d(0,${window.scrollY - fromTop + 43}px,0);`
  }
  else stickyEl.classList.remove("show");
}

function horizontalScrollListener(e) {
  const x = e.target.scrollLeft,
    buttons = document.querySelector('.buttonbox');
  if (x === 0) buttons.classList.add("max_left");
  else if (e.target.offsetWidth + x == e.target.scrollWidth) buttons.classList.add("max_right");
  else {
    buttons.classList.remove("max_right");
    buttons.classList.remove("max_left");
  }
}

function scrollData(direction) {
  const dataDom = document.querySelector("div.data");
  if (direction == "right") dataDom.scrollBy(400, 0)
  else dataDom.scrollBy(-400, 0)
}


function setDragListeners() {
  let drag = false, xStart;
  document.querySelector(".data").addEventListener("mousedown", (e) => { if (e.target.classList.contains("hotelActivity")) return; xStart = e.clientX; drag = true; });
  document.querySelector(".data").addEventListener("mouseup", () => { drag = false; });
  document.querySelector(".data").addEventListener("mousemove", (e) => {
    if (!drag) return;
    const dataDom = document.querySelector("div.data"),
      difX = xStart - e.clientX;
    difX < 0 ? scrollData('left') : scrollData('right');
  });
}

// --------------- HOMEPAGE FUNCTIONS --------------------

if (page("home")) {
  let toTop = document.querySelector("nav#desktop li.logo").getBoundingClientRect().top + 40, stickyTimeout;
  function onScroll() {
    const header = document.querySelector("header"), y = window.scrollY;

    if (window.innerWidth < 768) {
      if (y > 0)
        header.classList.add("sticky");
      else
        stickyTimeout = setTimeout(() => {
          header.classList.remove("sticky");
          return;
        }, 500);

    } else {


      if (toTop < y) header.classList.add("sticky");
      else {
        header.style = `transform: translateY(${-y}px);`;
        header.classList.remove("sticky");
      }
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll);

  function zoomHero(e) {
    const img = document.querySelector("section.fullscreen img"),
      parentStyle = {
        left: img.offsetLeft,
        top: img.offsetTop,
        width: img.offsetWidth,
        height: img.offsetHeight
      }, percY = (img.classList.contains("zoomed") ? 0 : (parseFloat(50 - ((e.clientY + window.scrollY) / parentStyle.height * 100).toFixed(2)))),
      scale = (img.classList.contains("zoomed") ? 1 : 3);
    let percX = (img.classList.contains("zoomed") ? 0 : (parseFloat(50 - (e.clientX / parentStyle.width * 100).toFixed(2))));

    if (percX < -33.3) percX = -33.3;


    img.classList.toggle("zoomed");
    img.style = `transform: scale(${scale}) translate(${percX}%, ${percY}%)`;
  }

  function zoomOut() {
    const img = document.querySelector("section.fullscreen img");
    img.classList.remove("zoomed")
    img.style = `transform: scale(1) translate(0,0)`;
  }
}

function setUlRowBackgroundWidth() {
  const allBgs = document.querySelectorAll("ul.hotelRow > .bg"),
    allBlocks = document.querySelectorAll("ul#background > li").length - 0.5;
  allBgs.forEach(bg => {
    bg.style = `width: calc(${allBlocks} * var(--blockwidth)) `;
  });
}

function fakeStickyHotelNames() {
  if (window.innerWidth < 1100) {
    const dataDOM = document.querySelector("div.data"),
      spans = document.querySelectorAll("#programblock .data ul.hotelRow li span");
    spans.forEach(span => {
      const liActivity = span.parentNode,
        parentWidth = liActivity.offsetWidth,
        spanWidth = span.offsetWidth,
        boundary = parentWidth - spanWidth - 40,
        rem = (window.innerWidth < 768) ? 0 : 20;

      if (parentWidth - spanWidth < 50) return;

      let stickyPx = dataDOM.scrollLeft - liActivity.offsetLeft + rem
      if (stickyPx > boundary) stickyPx = boundary;

      if (dataDOM.scrollLeft > liActivity.offsetLeft) {
        span.style = `transform: translate3d(${stickyPx}px,0,0)`;
      }
    });
  }
}


if (page("hotel")) {
  scrollFunction();
  window.addEventListener("scroll", scrollFunction);
  window.addEventListener("resize", scrollFunction);
}

if (page("programme") || page("hotel")) {
  filter();
  fakeSticky();
  setUlRowBackgroundWidth();
  setDragListeners();
  setPopupHeights();
  fakeStickyHotelNames();
  const dataDOM = document.querySelector("div.data");
  dataDOM.addEventListener("scroll", fakeStickyHotelNames)
  document.querySelector(".data").addEventListener("scroll", (e) => { horizontalScrollListener(e) });
  window.addEventListener("scroll", fakeSticky);
  window.addEventListener("keydown", (e) => { if (e.key == "Escape" && document.querySelector("#popups").classList.contains("show")) { closeActivity(); } });
  window.addEventListener("resize", setUlRowBackgroundWidth);
}

```


### interactieve kaart

Het project was hier nog niet klaar! Er was ook een interactieve kaart van Amsterdam gewenst waar alle hotels instonden. Gelukkig had ik het themasemester Datavisualisatie gekozen, hier had ik al een ontmoeting met [d3](https://d3js.org/), een framework voor datavisualisaties. 

Ik heb uiteindelijk met een combinatie van d3 en [leaflet](https://leafletjs.com/) deze interactieve kaart in elkaar weten te fietsen. De hotels worden uit de datafile gehaald, hierbij wordt een corresponderende latitude en longitude gezocht in een andere datafile. 

_Javascript code van de interactieve kaart_
```js
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function slugify(text) {
    return text = text.toLowerCase().replaceAll(" ", "-").replaceAll(",", "").replaceAll("&", "").replaceAll("'", "-").replaceAll("ö", "o").replace("art--otel", "art-otel");
}

const lat = {
    min: 52.278175,
    max: 52.431064
}, lon = {
    min: 4.728763,
    max: 5.079159
}, center = {
    lon: (lon.min + lon.max) / 2,
    lat: (lat.min + lat.max) / 2
};


const dataUrl = "/data/mapData.json",
    customDataUrl = "/data/customMapData.json",
    hotelDataUrl = "/data/hotelCoordinates.json";

let workData;
getData(dataUrl).then(data => {
    getData(customDataUrl).then(customData => {
        getData(hotelDataUrl).then(hotelData => {
            workData = data;
            addCustomDataToData(customData);
            addHotelsToWorkData(hotelData);
            // compareHotels(hotelData);
            renderMap(workData, hotelData);
            addPathEventListeners();
            addHotelEventListeners();
            populateBuurtLists();
        });
    });
});

function mapPageScroll() {
    const fig = document.querySelector(".image figure img"),
        y = 1 + (window.scrollY * 0.00002);
    fig.style = `transform: scale(${y})`;
}

mapPageScroll();
window.addEventListener("scroll", mapPageScroll);


let currentZoom = (window.innerWidth <= 768) ? 12 : 13;
const layer = new L.StamenTileLayer("toner-lite");
const map = new L.Map("map", {
    center: [center.lat + 0.01, center.lon - 0.005],
    zoom: currentZoom,
    minZoom: currentZoom,
    maxZoom: 14,
    scrollWheelZoom: false
});
map.addLayer(layer);

const renderMap = (data, hotelData) => {
    const svg = d3.select(map.getPanes().overlayPane).append("svg"),
        gMaster = svg.append("g").attr("class", "leaflet-zoom-hide"),
        transform = d3.geoTransform({ point: projectPoint }),
        path = d3.geoPath().projection(transform);


    const colorScale = d3.scaleLinear()
        .domain(d3.extent(data.features, (d) => { return d.hotels.length }))
        .range([20, 80]);

    // create path elements for each of the features
    d3_features = gMaster.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("class", "buurt")
        .attr("data-clickable", d => { if (d.hotels.length === 0) return false; else return true; })
        .attr("data-buurt", d => d.properties.Gebied25_naam)
        .attr("data-tip-name", d => d.properties.Gebied25_naam)
        .attr("data-center", d => [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]])
        .style("opacity", d => { return (colorScale(d.hotels.length) / 100).toFixed(2) });


    hotelDots = gMaster.append("g")
        .selectAll("circle")
        .data(hotelData)
        .enter().append("circle")
        .attr("r", 7)
        .attr("class", "hotelDot")
        .attr("data-hotel", d => slugify(d.name))
        .attr("data-tip-name", d => d.name)
        .style("fill", "#333333")
        .on("click", (d) => { window.location.href = `/hotels/${slugify(d.name)}` })
        .on("mouseover", (d) => { highLightHotel(slugify(d.name)) })
        .on("mouseleave", (d) => { removeHighLightHotel(slugify(d.name)) });


    // fit the SVG element to leaflet's map layer
    function reset() {
        bounds = path.bounds(data);
        const topLeft = bounds[0],
            bottomRight = bounds[1];
        svg.attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px")
        gMaster.attr("transform", "translate(" + -topLeft[0] + ","
            + -topLeft[1] + ")");

        // initialize the path data	
        d3_features.attr("d", path);

        hotelDots
            .attr("cx", (d) => { d = cxcy(d.lat, d.lon); return d.coords.x })
            .attr("cy", (d) => { d = cxcy(d.lat, d.lon); return d.coords.y })
    }

    map.on("viewreset", reset);
    reset();
}

function cxcy(lat, lon) {
    const d = {};
    const newPoint = map.latLngToLayerPoint([lat, lon]); d.coords = { "x": newPoint.x, "y": newPoint.y }; return d
}

function projectPoint(x, y) {
    const point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}


function addPathEventListeners() {
    const allPaths = document.querySelectorAll("path.buurt");
    allPaths.forEach(path => {
        const tooltip = document.querySelector(".tooltip");
        path.addEventListener("mousemove", (e) => {
            updateToolTip(e)
        });
        path.addEventListener("mouseleave", (e) => {
            tooltip.classList.remove("show");
        });
        const clickEvents = ["mouseup", "touchend"];
        clickEvents.forEach(eventName => {
            path.addEventListener(eventName, (e) => {
                if (!document.body.classList.contains("leaflet-dragging") && e.target.getAttribute("data-clickable") == "true") {
                    moveIntoView(e.target);
                    e.target.classList.add("active");
                    populateList(e.target.getAttribute("data-buurt"), true);
                }
            })
        })
    })
}



function populateList(buurtName) {
    const details = document.querySelector(".details"),
        title = details.querySelector("h2"),
        list = details.querySelector("ul"),
        allListItems = list.querySelectorAll("li"),
        features = workData.features;
    let hotels = features.find(d => { if (d.properties.Gebied25_naam == buurtName) return true; }).hotels;

    details.classList.add("show")
    title.textContent = buurtName;
    allListItems.forEach(listItem => { listItem.remove(); });

    hotels = hotels.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    for (const hotel of hotels) {
        let node = document.createElement("li")
        node.innerHTML = `<a href="/hotels/${slugify(hotel.name)}">${hotel.name}</a>`;
        node.querySelector("a").setAttribute("data-hotel", slugify(hotel.name));
        node.querySelector("a").setAttribute("onmouseenter", "highLightHotel(this)");
        node.querySelector("a").setAttribute("onmouseleave", "removeHighLightHotel(this)");
        list.append(node);
    }
}

function highLightHotel(el) {
    let circle;
    if (typeof (el) == 'object') {
        let hotel = el.getAttribute("data-hotel");
        circle = document.querySelector(`svg circle[data-hotel=${hotel}`);
    }
    else circle = document.querySelector(`svg circle[data-hotel=${el}`)
    circle.setAttribute("r", 13);
    circle.setAttribute("stroke", "#333");
    circle.setAttribute("stroke-width", "2px");
    circle.classList.add("highlight");
}

function removeHighLightHotel(el) {
    let circle;
    if (typeof (el) == 'object') {
        let hotel = el.getAttribute("data-hotel");
        circle = document.querySelector(`svg circle[data-hotel=${hotel}`);
    }
    else circle = document.querySelector(`svg circle[data-hotel=${el}`)
    circle.setAttribute("r", 7);
    circle.setAttribute("stroke", "transparent");
    circle.setAttribute("stroke-width", "2px");
    circle.classList.remove("highlight");
}

function hideList() {
    const details = document.querySelector(".details");
    details.classList.remove("show");
}


function addHotelEventListeners() {
    const allHotels = document.querySelectorAll("circle.hotelDot");
    allHotels.forEach(hotelDot => {
        hotelDot.addEventListener("mousemove", (e) => { updateToolTip(e) });
    })
}

function updateToolTip(e) {
    const tooltip = document.querySelector(".tooltip");
    const x = e.x, y = e.y, fillText = e.target.getAttribute("data-tip-name");
    if (e.target.classList.contains("hotelDot")) tooltip.classList.add("hotel"); else tooltip.classList.remove("hotel");
    if (e.target.getAttribute("data-clickable") == "false") tooltip.classList.add("no-click"); else tooltip.classList.remove("no-click");

    tooltip.classList.add("show");
    tooltip.style = `transform: translate3d(${x}px,${y}px,0)`;
    tooltip.querySelector("span").textContent = fillText;
}

function removePathClasses() {
    const allPaths = document.querySelectorAll("path.buurt")
    allPaths.forEach(path => { path.classList.remove("active"); });
}

function moveIntoView(el, fullscreen) {
    let newCenter, newZoom;
    if (!fullscreen) {
        newCenter = el.getAttribute("data-center").split(",");
        if (window.innerWidth > 768) newCenter[1] -= 0.015; // move right a little to make room for list
        else newCenter[0] -= 0.01; // same but then up a little for mobile
        newZoom = (window.innerWidth <= 768) ? 13 : 14;
    } else {
        newCenter = [center.lat + 0.01, center.lon - 0.005];
        newZoom = (window.innerWidth <= 768) ? 12 : 13;
    }
    removePathClasses();
    let animate = false;
    if (newZoom == currentZoom) animate = true;
    map.setView(newCenter, newZoom, {
        "animate": animate
    });
    currentZoom = newZoom;
}

function addCustomDataToData(data) {
    data.forEach(entry => {
        if (workData.features.find(d => d.properties.Gebied25_naam == entry.name)) {
            const newProperties = {
                "Gebied25_naam": entry.name,
                "color": entry.properties.color,
                "left": `${entry.properties.textOffsetLeft}`,
                "top": `${entry.properties.textOffsetTop}`
            }
            workData.features.find(d => d.properties.Gebied25_naam == entry.name).properties = newProperties;
        }
    });
}


function addHotelsToWorkData(hotelData) {
    hotelData.forEach(d => {
        const coords = [d.lon, d.lat]
        workData.features.forEach(feature => {
            if (!feature.hotels) feature.hotels = [];
            if (d3.geoContains(feature.geometry, coords)) {
                feature.hotels.push(d)
            }
        });
    })
}

function compareHotels() {
    let registeredNames = [], unRegisteredNames = [], namesWithData = [];
    workData.features.forEach(feature => {
        feature.hotels.forEach(y => {
            checkValidityUrl(slugify(y.name));
            hotelNames.forEach(x => {
                if (x == y.name) {
                    registeredNames.push(y.name)
                }
                else if (!unRegisteredNames.includes(y.name)) {
                    unRegisteredNames.push(y.name)
                }
                else if (!unRegisteredNames.includes(x)) {
                    unRegisteredNames.push(x)
                }
            })
        })
    });
    unRegisteredNames = unRegisteredNames.filter(d => {
        for (const registeredName of registeredNames) {
            if (registeredName == d) return false;
        }
        return true;
    })
    // console.log(unRegisteredNames.sort(), registeredNames);
}



function checkValidityUrl(url) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                console.log("Valid")
            }
            else if (xmlhttp.status == 400) {
                console.log("Error 400")
            }
            else if (xmlhttp.status == 404) {
                // Console will gave page not found
                // console.log(`Error: page ${url} not found`);
            }
            else {
                console.log("Error occured. Status: ", xmlhttp.status);
            }
        }
    }
    xmlhttp.open("GET", `/hotels/${url}`, true);
    xmlhttp.send();
}

function populateBuurtLists() {
    giveTitlesBuurtName();
    const allTitles = Array.from(document.querySelectorAll('#list .hotelList > li'));
    allTitles.sort(sortByBuurt);
    const firstTitle = document.createElement("li");
    firstTitle.innerHTML = `<h3>${allTitles[0].getAttribute('data-buurt')}</h3>`;
    firstTitle.classList.add("title");

    let newTitles = [firstTitle];
    for (let i in allTitles) {
        if (allTitles[i - 1] && allTitles[i].getAttribute('data-buurt') != allTitles[i - 1].getAttribute("data-buurt")) {
            const h3 = document.createElement("li");
            h3.innerHTML = `<h3>${allTitles[i].getAttribute('data-buurt')}</h3>`;
            h3.classList.add("title");
            newTitles.push(h3);
        }
        newTitles.push(allTitles[i]);
    }
    document.querySelectorAll('#list .hotelList > li').forEach(li => { li.remove(); });   
    newTitles.forEach(item  => {
        document.querySelector("#list .hotelList").appendChild(item);
    })
}

function sortByBuurt(a, b) {
    const aBuurt = a.getAttribute("data-buurt"), bBuurt = b.getAttribute("data-buurt");
    if (aBuurt < bBuurt) return -1;
    if (aBuurt > bBuurt) return 1;
    return 0;
}


function giveTitlesBuurtName() {
    workData.features.forEach(feature => {
        if (feature.hotels.length === 0) return;

        const allTitles = document.querySelectorAll("#list .hotelList li");
        allTitles.forEach(title => {
            const hotelName = title.getAttribute('data-hotel');
            feature.hotels.forEach(hotel => {
                if (hotel.name == hotelName)
                    title.setAttribute('data-buurt', feature.properties.Gebied25_naam);
            });
        });
    });
}
```

Op basis van deze gegevens krijgt een hotel zo een stip op de kaart, waarop geklikt kan worden om door te linken naar de individuele hotelpagina. Ik heb zelfs als easter egg nog een cloropleth-map gemaakt van de kaart (thanks, dataviz track). Hoe meer bolletjes in een bepaald stadsdeel, hoe meer opacity de buurt heeft op de kaart.

_De interactieve kaart van Openhoteldag, fresh state_
![](uploads/ohd-5.png)

_Kaart, geklikt op een buurt state_
![](uploads/ohd-6.png)

Ik raad aan om [zelf even te kijken!](https://openhoteldag.com/hotels#scroll_to_map)