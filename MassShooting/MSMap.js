"use strict";

function renderMassShooting(){
    renderMSMap();
    renderMSBar();
    renderMSLine();
}

var geojson;
var map1;
// control that shows state info on hover
var info1 = L.control(map1);

function renderMSMap() {

    map1 = L.map('MSmap').setView([37.8, -96], 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 10,
        minZoom: 4,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.light'
    }).addTo(map1);

    // info is declared as a global variable, outside the function assigned to the window.onload
    info1.addTo(map1);

    //geojson is declared as a global variable, outside the function assigned to the window.onload
    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature,
        pointToLayer: pointToMarker
    }).addTo(map1);

    map1.attributionControl.addAttribution('Gun Violence data &copy; <a href="http://www.gunviolencearchive.org/">Gun Violence Archive</a>');

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map1) {
        
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100],
            labels = ['<strong> Incidents by State </strong>'],
            from, to;
    
        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
    
            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }
    
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map1);
}

//When adding the info
info1.onAdd = function (map1) {
    //"this" returns to info. 
    this._div = L.DomUtil.create('div', 'info');
    //the following line calls info.update(props) function. Again, this refers to 'info' here
    this.update();
    return this._div;
};

//Update the info based on what state user has clicked on
info1.update = function (props) {
    this._div.innerHTML = '<h4>US Mass Shootings Frequency</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.MSFrequency + ' Mass shootings between 2014 and 2017'
        : 'Hover over a state');
};


function pointToMarker(feature, latlng) {
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#1262e2",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);

    return circleMarker
}
// get color depending on incedent density value
function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                        d > 20 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.MSFrequency)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info1.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info1.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });

}