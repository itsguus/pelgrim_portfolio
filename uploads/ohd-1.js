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