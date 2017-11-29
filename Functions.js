function addPopups(feature, layer) {
    var monthFixed = feature.properties.Month;
    if (feature.properties.Month<10){
        monthFixed="0"+feature.properties.Month;
    }
    layer.bindPopup("<b>Address: </b>" + feature.properties.Address + 
    "</br>" + feature.properties.CityOrCounty + ", " + feature.properties.StateAbr + 
    "</br> <b>Date: </b>" + monthFixed+ "/" + feature.properties.Year+
    "</br> <b>Killed: </b>" + feature.properties.Killed+
    "</br> <b>Injured: </b>" + feature.properties.Injured);
}

function triggerMapPoints(Month, map, incidents, clusters, monthLayerGroup) {

    monthLayerGroup = L.geoJson(incidents, {
        filter: monthFilter,
        onEachFeature: addPopups
    });

    function monthFilter(feature) {
        if (feature.properties.Month === Month) return true
    }

    clusters.addLayer(monthLayerGroup);
    map.addLayer(clusters);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        clusters.bringToFront();
    }
}

function triggerMapReset(allMonths, map, incidents, clusters, monthLayerGroup) {
    clusters.clearLayers();
    for (var i = 0; i < allMonths.length; i++) {
        if (allMonths[i] == 1) {
            monthLayerGroup = L.geoJson(incidents, { filter: monthFilter, onEachFeature: addPopups});
            function monthFilter(feature) {
                if (feature.properties.Month == i + 1) return true
            };
            clusters.addLayer(monthLayerGroup);
            map.addLayer(clusters);
        }
    }

}

function triggerBarHighlight(Month, map) {
    document.getElementById(map+Month+'Bar').classList.remove('bar');
    document.getElementById(map+Month+'Bar').classList.add('barHover');
}

function triggerBarReset(Month, map){
    document.getElementById(map+Month+'Bar').classList.remove('barHover');
    document.getElementById(map+Month+'Bar').classList.add('bar');
}

