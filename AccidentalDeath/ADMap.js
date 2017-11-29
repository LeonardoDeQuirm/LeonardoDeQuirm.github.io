"use strict";

function renderAccidentalDeath(){
    renderADMap();
    renderADBar();
}

var map2;
var geojson2;
var info2 = L.control(map2);
function renderADMap() {

    map2 = L.map('ADmap').setView([37.8, -96], 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 10,
        minZoom: 4,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.light'
    }).addTo(map2);

    // info is declared as a global variable, outside the function assigned to the window.onload
    info2.addTo(map2);

    //geojson is declared as a global variable, outside the function assigned to the window.onload
    geojson2 = L.geoJson(statesData, {
        style: style2,
        onEachFeature: onEachFeature2,
        pointToLayer: pointToMarker
    }).addTo(map2);

    map2.attributionControl.addAttribution('Gun Violence data &copy; <a href="http://www.gunviolencearchive.org/">Gun Violence Archive</a>');

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map2) {
        
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 5, 10, 20, 30],
            labels = ['<strong> Incidents by State </strong>'],
            from, to;
    
        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
    
            labels.push(
                '<i style="background:' + getColor2(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }
    
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map2);

}

//When adding the info
info2.onAdd = function (map2s) {
    //"this" returns to info. 
    this._div = L.DomUtil.create('div', 'info');
    //the following line calls info.update(props) function. Again, this refers to 'info' here
    this.update();
    return this._div;
};

//Update the info based on what state user has clicked on
info2.update = function (props) {
    this._div.innerHTML = '<h4>US Accidental Deaths Frequency</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.ADFrequency + ' accidental deaths between 2016 and 2017'
        : 'Hover over a state');
};

function getColor2(d) {
    return  d > 30 ? '#E31A1C' :
                d > 20 ? '#FC4E2A' :
                    d > 10 ? '#FD8D3C' :
                        d > 5 ? '#FEB24C' :
                            d > 1 ? '#FED976' :
                                '#FFEDA0';
}

function style2(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor2(feature.properties.ADFrequency)
    };
}

function highlightFeature2(e) {
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

    info2.update(layer.feature.properties);
}

function resetHighlight2(e) {
    geojson2.resetStyle(e.target);
    info2.update();
}

function onEachFeature2(feature, layer) {
    layer.on({
        mouseover: highlightFeature2,
        mouseout: resetHighlight2
    });

}