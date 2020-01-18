Chart.pluginService.register({
    beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
            //Get ctx from string
            var ctx = chart.chart.ctx;

            //Get options from the center object in options
            var centerConfig = chart.config.options.elements.center;
            var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text;
            var color = centerConfig.color || '#000';
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
                //Start with a base font of 30px
            ctx.font = "30px " + fontStyle;

            //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);
            var elementHeight = (chart.innerRadius * 2);

            // Pick a new font size so it will not be larger than the height of label.
            var fontSizeToUse = Math.min(newFontSize, elementHeight);

            //Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = color;

            //Draw text in center
            ctx.fillText(txt, centerX, centerY);
        }
    }
});



// doughnut charts 
function daughnut(Borough) {
    var room = `http://127.0.0.1:5000/Room/${Borough}`
    var ctx = document.getElementById("myChart");
    var ctx1 = document.getElementById("myChart2");

    d3.json(room, function(d) {
        var percent = []
        var B = []
        var avg = []
        d.forEach(element => {
            percent.push(element.percent)
            B.push(element.Room_Type)
            avg.push(element.Avg_price)
        })
        console.log(percent)

        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: B,
                datasets: [{
                    label: 'Number of Listings per room type',
                    data: percent,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1,
                    borderAlign: 'inner'
                }]
            },
            options: {
                elements: {
                    center: {
                        text: Borough,
                        color: '#36A2EB', //Default black
                        fontStyle: 'Helvetica', //Default Arial
                        sidePadding: 15 //Default 20 (as a percentage)
                    }
                },
                plugins: {
                    labels: {
                        render: function(args) {
                            return args.value + '%';
                        },
                        // render: 'value',
                        fontSize: 15,
                        fontStyle: 'bold'
                    }
                },
                cutoutPercentage: 40,
                responsive: true,
                title: {
                    display: true,
                    position: 'top',
                    fontSize: 18,
                    fontStyle: 'bold',
                    text: "Percent of Room Type Listing per Borough"
                },
                legend: {
                    position: 'right',
                    labels: {
                        fontColor: "black",
                        boxWidth: 30,
                        padding: 30
                    }
                },
                maintainAspectRatio: false


            }
        });

        var myChart1 = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: B,
                datasets: [{
                    label: 'AVG Prices per Room Type',
                    data: avg,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                elements: {
                    center: {
                        text: Borough,
                        color: '#36A2EB', //Default black
                        fontStyle: 'Helvetica', //Default Arial
                        sidePadding: 15 //Default 20 (as a percentage)
                    }
                },

                plugins: {
                    labels: {
                        render: function(args) {
                            // args will be something like:
                            // { label: 'Label', value: 123, percentage: 50, index: 0, dataset: {...} }
                            return '$' + args.value;
                        },
                        // render: 'value',
                        fontSize: 15,
                        fontStyle: 'bold'

                    }
                },
                cutoutPercentage: 40,
                responsive: true,
                title: {
                    display: true,
                    position: 'top',
                    fontSize: 18,
                    fontStyle: 'bold',
                    text: "Average Price of Room Type  per Borough"
                },
                legend: {
                    position: 'right',
                    labels: {
                        fontColor: "black",
                        boxWidth: 30,
                        padding: 30
                    }
                },
                maintainAspectRatio: false

            }
        });
    })


};