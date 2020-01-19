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
                text: Room + ' per Borough',
                font: {
                    // family: 'Courier New, monospace',
                    size: 20,
                    Style: 'bold',
                    Color: 'balck',
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


// Building the Graph Average price of Room type by Borough
function buildCharts2(borough) {
    var room = `http://127.0.0.1:5000/Room/${borough}`
        // @TODO: Use `d3.json` to fetch the Borough data for the plots
        // @TODO: Build a Bubble Chart using the Borough data

    d3.json(room, function(d) {

        var RoomType = []
        var RRate = []
        var RClean = []
        var RValue = []
        var HostResponseR = []

        d.forEach(element => {
            RoomType.push(element.Room_Type)
            RRate.push(element.RRate)
            RClean.push(element.RClean)
            RValue.push(element.RValue)
            HostResponseR.push(element.HostResponseR)
        })
        console.log(RRate)
            // boroughs = boroughs
            // var colors = 'rgba(207, 114, 255, 0.5)'
        trace1 = {
            type: 'scatter',
            x: RoomType,
            y: RRate,
            mode: 'lines',
            name: 'Review Rating',
            line: {
                color: 'rgb(219, 64, 82)',
                width: 3
            }
        };

        trace2 = {
            type: 'scatter',
            x: RoomType,
            y: RClean,
            mode: 'lines',
            name: 'Cleanliness Rate',
            line: {
                color: '#581078',
                width: 3
            }
        };

        trace3 = {
            type: 'scatter',
            x: RoomType,
            y: RValue,
            mode: 'lines',
            name: 'Value Rate',
            line: {
                color: 'rgb(55, 128, 191)',
                width: 3
            }
        };

        trace4 = {
            type: 'scatter',
            x: RoomType,
            y: HostResponseR,
            mode: 'lines',
            name: 'Host Response Rate',
            line: {
                color: '#31652e',
                width: 3
            }
        };

        var layout = {
            autosize: false,
            barmode: 'stack',
            title: {
                text: borough + ' Rating',
                font: {
                    // family: 'Courier New, monospace',
                    size: 20
                }
            },
            font: {
                size: 16,
                weight: 'bold'
            },

            config: {
                'displayModeBar': true
            },
            xaxis: {
                title: {
                    text: 'Room Type',
                    font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                    }
                },
            },
            yaxis: {
                title: {
                    text: 'Average Rate(100%)',
                    font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                    }
                }
            }

        };

        var data = [trace1, trace2, trace3, trace4];

        Plotly.newPlot("myChart2", data, layout);

    });
};