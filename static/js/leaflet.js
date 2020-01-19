// Load in Dashboard


// function to merge the count peroperties of the listing to the geojson
function mergeJson(js1, js2) {
    for (var i = 0; i < js2.length; i++) {
        for (var j = 0; j < js1.length; j++) {
            if (js1[j].properties.neighbourhood === js2[i].neighbourhood) {
                js1[j].properties.count = js2[i].Count
                js1[j].properties.Reviews = js2[i].Reviews
                js1[j].properties.Price = js2[i].Price
            }
        }
    }
    return js1;
}

function markerSize(x) {
    return x * 1;
}

// Adding Outdoor tile layer
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

// Adding the BaseMap
var baseMaps = {
    "Outdoors": outdoors
};

// Create the map
var myMap = L.map("map", {
    center: [40.84, -73.8659],
    zoom: 12,
    layers: outdoors
        // layers.Count,
        //     layers.Reviews
        // ]

});

// return color based on Listing
function getValue(x) {

    return x > 1500 ? "#E31A1C" :
        x > 1000 ? "#FC4E2A" :
        x > 500 ? "#FD8D3C" :
        x > 100 ? "#FEB24C" :
        x > 50 ? "#FED976" :
        "#FFEDA0";
}


// return color based on Reviews
function getValue1(x) {

    return x > 10000 ? "#770087" :
        x > 5000 ? "#9600B3" :
        x > 2000 ? "#AA00D7" :
        x > 1000 ? "#C030ED" :
        x > 500 ? "#DC86FA" :
        "#FBF2FF";
}

function getValueP(x) {

    return x > 200 ? "#005582" :
        x > 150 ? "#0086ad" :
        x > 100 ? "#00c2c7" :
        x > 50 ? "#97ebdb" :
        "#daf8e3";
}

// Styling the Map Listing(count)
function areaStyle(feature) {
    return {
        fillColor: getValue(feature.properties.count),
        weight: 2,
        opacity: 1,
        color: 'blue',
        dashArray: '3',
        fillOpacity: 1
    }
};

// Styling the Map Reviews 
function areaStyle1(feature) {
    return {
        fillColor: getValue1(feature.properties.Reviews),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }
};

function areaStyleP(feature) {
    return {
        fillColor: getValueP(feature.properties.Price),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }
};
var layers;

// Initializing the Control
var baseControl = L.control.layers(baseMaps).addTo(myMap);
var LayerControl;
var geojsonLayer1;
var geojsonLayer2;
var geojsonLayer3;

// Creating a function to build the Map
function BuildMap(borough) {
    var listing = `http://127.0.0.1:5000/listing/${borough}`;
    var nyc_shp = "../static/neighbourhoods.geojson";

    // Create Layers
    layers = {
        Count: new L.LayerGroup(),
        Reviews: new L.LayerGroup(),
        avg_price: new L.LayerGroup()
    };

    // myMap.removeControl(LayerControl);
    d3.json(nyc_shp, function(d) {
        var features = d.features
        console.log(features)
        d3.json(listing, function(ls) {
            console.log(ls)
            var merged_feature = mergeJson(features, ls)
            console.log(merged_feature)
                // Creating The Listing count layer per Borough
            geojsonlayer1 = L.geoJSON(merged_feature, {
                filter: function(feature, layer) {
                    return feature.properties.neighbourhood_group === borough;
                },

                style: function(feature, layer) {
                    return areaStyle(feature);
                },
                onEachFeature: function(feature, layer) {
                    layer.bindTooltip("<h3>" + feature.properties.neighbourhood + "</h3> <hr> <h4> Listing:" + feature.properties.count + "</h4>", { className: 'myCSSClass' });
                }

            }).addTo(layers.Count);

            // Creating Reviews Layer per Borough
            geojsonlayer2 = L.geoJSON(merged_feature, {
                filter: function(feature, layer) {
                    return feature.properties.neighbourhood_group === borough;
                },

                style: function(feature, layer) {
                    return areaStyle1(feature);
                },
                onEachFeature: function(feature, layer) {
                    layer.bindTooltip("<h4>" + feature.properties.neighbourhood + "</h4> <hr> <h5> Reviews:" + feature.properties.Reviews + "</h5>", { className: 'myCSSClass' });
                }
            }).addTo(layers.Reviews);

            // Creating Price Layer per Borough
            geojsonlayer3 = L.geoJSON(merged_feature, {
                filter: function(feature, layer) {
                    return feature.properties.neighbourhood_group === borough;
                },

                style: function(feature, layer) {
                    return areaStyleP(feature);
                },
                onEachFeature: function(feature, layer) {
                    layer.bindTooltip("<h3>" + feature.properties.neighbourhood + "</h3> <hr> <h4> Price:" + feature.properties.Price + "</h4>", { className: 'myCSSClass' });
                }
            }).addTo(layers.avg_price);
        });
    });

    // Creating the Overlay layers
    var overlayMaps = {
        "Listing Count": layers.Count,
        "Reviews": layers.Reviews,
        "avg_price": layers.avg_price
    };
    // Removing the BaseControl and adding new layer control
    myMap.removeControl(baseControl);
    myMap.addLayer(layers.Count)
    LayerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

};


// Creating the Listing Legend
var legendL = L.control({ position: 'bottomright' });
legendL.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 50, 100, 500, 1000, 1500],

        labels = [];
    div.innerHTML += '<b>Listing Count</b><br>' // Legend Title
        // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getValue(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// Creating the Legend for reviews
var legendR = L.control({ position: 'bottomright' });
legendR.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 500, 1000, 2000, 5000, 10000],

        labels = [];
    div.innerHTML += '<b>Reviews</b><br>' // Legend Title
        // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getValue1(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// Creating the Legend for Price
var legendP = L.control({ position: 'bottomright' });
legendP.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 50, 100, 150, 200],

        labels = [];
    div.innerHTML += '<b>Avg Price</b><br>' // Legend Title
        // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getValueP(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};


legendL.addTo(myMap);

// Adding the Legends
myMap.on('overlayadd', function(eventLayer) {
    // Switch to the Permafrost legend...
    if (eventLayer.name === 'Listing Count') {
        this.removeControl(legendR);
        this.removeControl(legendP);
        legendL.addTo(this)
    } else if (eventLayer.name === 'Reviews') {
        this.removeControl(legendL);
        this.removeControl(legendP);
        legendR.addTo(this);

    } else { // Or switch to the Price legend...
        this.removeControl(legendL);
        this.removeControl(legendR);
        legendP.addTo(this);
    }
});

myMap.on('overlayremove', function(eventLayer) {
    // Switch to the Permafrost legend...
    if (eventLayer.name === 'Listing Count') {
        this.removeControl(legendL);
    } else if (eventLayer.name === 'Reviews') {
        this.removeControl(legendR);
    } else { // Or switch to the Price legend...
        this.removeControl(legendP);

    }
});