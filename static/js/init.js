//  Rendering all the Graphs on each selection

// Retreiving Data
var nbs = "http://127.0.0.1:5000/borough";
var rmt = "http://127.0.0.1:5000/RoomT";

function SetView(borough) {
    if (borough === 'Bronx') {
        myMap.setView(new L.LatLng(40.84, -73.8659), 12);
    } else if (borough === 'Manhattan') {
        myMap.setView(new L.LatLng(40.78343, -73.96625), 12);
    } else if (borough === 'Brooklyn') {
        myMap.setView(new L.LatLng(40.650002, -73.949997), 12);
    } else if (borough === 'Queens') {
        myMap.setView(new L.LatLng(40.68149, -73.83652), 12);
    } else {
        myMap.setView(new L.LatLng(40.579021, -74.151535), 12);
    }
};

// Removing All Layers before rendering the new once
function removeLayer() {
    console.log("Removing layer");
    myMap.removeLayer(layers.Count);
    myMap.removeLayer(layers.Reviews);
    myMap.removeLayer(layers.avg_price);
    myMap.removeControl(LayerControl);
    baseControl.addTo(myMap);
};


// Building the Map and daughnut graphs
function buildDash() {
    var borough = d3.select("#sel1").node().value;
    console.log(borough);
    removeLayer()
    BuildMap(borough)
    SetView(borough)
    daughnut(borough)
    buildCharts2(borough)
        // buildCharts(testID);
};

// Builting the bar graph function
function buildch() {
    var room = d3.select("#sel2").node().value;
    console.log(room);
    buildCharts(room);

}

// Creating Init Function to Initialize the Graphs
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#sel1");
    var selector2 = d3.select('#sel2');

    // Use the list of Borough names to populate the select options
    d3.json(nbs, function(borough) {
        nbhoods = borough.dis.sort();
        console.log(nbhoods);
        nbhoods.forEach((neibr) => {
            selector
                .append("option")
                .text(neibr)
                .property("value", neibr);
        });

        // Use the first neibr from the list to build the initial map and daughnuts
        const firstbr = nbhoods[0];
        daughnut(firstbr);
        BuildMap(firstbr);
        buildCharts2(firstbr)
    });

    // RoomType Dropdown
    d3.json(rmt, function(rm) {
        roomt = rm.room
        console.log(roomt)
        roomt.forEach((rt) => {
            selector2
                .append("option")
                .text(rt)
                .property("value", rt);
        });

        // Use the first neibr from the list to build the initial plots
        const roomtype = roomt[0];
        buildCharts(roomtype);
    });
}

// Initialize the dashboard
init();

// On change Rebuild the graphs
d3.selectAll("#sel1").on("change", buildDash);
d3.selectAll("#sel2").on("change", buildch);