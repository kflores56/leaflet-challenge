//// CREATE LOCATION MARKERS ////

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // function to determine marker color (magnitude) 
// // function chooseColor()

// // function to determine marker size (depth)

// grab geoJSON data & bind pop-up information

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Location: " + feature.properties.place + 
      "</h3><h3>Magnitude: " + feature.properties.mag + "</h3>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

//// CREATE MAP FUNCTION ////

function createMap(earthquakes) {

  // defining basemap layers
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });
  
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  //// CREATE LAYER GROUPS ////

  // baseMaps object
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Light Map": lightmap,
    "Street Map": streetmap,
  };

  // overlay object
  var overlayMaps = {
    Earthquakes : earthquakes
  };

  //// CREATE MAP ////

  // Define a map object
  var myMap = L.map("mapid", {
    center: [0, 0],
    zoom: 3, 
    layers: [satellitemap, earthquakes]
  });

  // Pass map layers into layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

