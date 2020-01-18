// Building the Graph Average price of Room type by Borough
function buildCharts(Room) {
    var bor = `http://127.0.0.1:5000/boroughP/${Room}`;
    // @TODO: Use `d3.json` to fetch the Borough data for the plots
    // @TODO: Build a Bubble Chart using the Borough data
    var boroughs = []
    var Price = []
    var Percent = []
    d3.json(bor, function(data) {
        console.log(data)
        data.forEach(Element => {
            boroughs.push(Element.Borough)
            Price.push(Element.Price)
            Percent.push(Element.Percent)
        })
        console.log(boroughs)
        console.log(Price)
            // boroughs = boroughs
            // var colors = 'rgba(207, 114, 255, 0.5)'
        var trace1 = {
            y: boroughs,
            x: Price,
            name: 'Avg Price',
            type: "bar",
            orientation: "h",
            marker: {
                color: 'rgba(55,128,191,0.6)',
                width: 1
            },
            text: Price.map(String),
            textposition: 'auto'

        };
        var trace2 = {
            y: boroughs,
            x: Percent,
            name: 'Listing Percent',
            type: "bar",
            orientation: "h",
            marker: {
                color: 'rgba(255,153,51,0.6)',
                width: 1
            },
            text: Percent.map(String),
            textposition: 'auto'

        };

        // Create the data array for the bar plot
        var data = [trace1, trace2];
        // Define the bar plot layout
        var layout = {
            autosize: false,
            barmode: 'stack',
            title: {
                text: 'Average Price per Borough',
                font: {
                    // family: 'Courier New, monospace',
                    size: 20
                }
            },
            height: 500,
            width: 500,
            margin: {
                l: 120,
                r: 50,
                b: 20,
                t: 30,
                pad: 0
            },
            font: {
                size: 16,
                weight: 'bold'
            },
            yaxis: {
                autorange: 'reversed',
            },

            config: {
                'displayModeBar': true
            }

        };

        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("plot1", data, layout);

    });
};