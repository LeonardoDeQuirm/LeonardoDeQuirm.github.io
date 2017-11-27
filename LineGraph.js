"use strict";
function renderMyLine() {

    // set the dimensions and margins of the graph
    var margin = { top: 100, right: 100, bottom: 100, left: 100 },
        width = 600,
        height = 450;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b");

    // format/parse time
    var formatTime = d3.timeFormat("%e %B");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the 1st line
    var valueline = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.sam); });

    //define the 2nd line    
    var valueline2 = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.joe); });

    //define the 3rd line
    var valueline3 = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.kyle); });

    //define the 4th line
    var valueline4 = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.tom); });

    //declare div
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3.select("#lineChartDiv").append("svg:svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("data.csv", function (error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function (d) {
            d.date = parseTime(d.date);
            d.sam = +d.sam;
            d.joe = +d.joe;
            d.kyle = +d.kyle;
            d.tom = +d.tom;

        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return Math.max(d.sam, d.joe, d.kyle, d.tom); })]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the valueline2 path
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "red")
            .attr("d", valueline2);

        // Add the valueline3 path
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "black")
            .attr("d", valueline3);

        // Add the valueline4 path
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "green")
            .attr("d", valueline4);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // add the steelblue line legend
        svg.append("text")
            .attr("x", 0)
            .attr("y", 500)
            .attr("class", "legend")
            .style("fill", "steelblue")
            .text("2014");

        // add the red line legend
        svg.append("text")
            .attr("x", 0)
            .attr("y", 515)
            .attr("class", "legend")
            .style("fill", "red")
            .text("2015");

        // add the black line legend
        svg.append("text")
            .attr("x", 0)
            .attr("y", 530)
            .attr("class", "legend")
            .style("fill", "black")
            .text("2016");

        // add the green line legend
        svg.append("text")
            .attr("x", 0)
            .attr("y", 545)
            .attr("class", "legend")
            .style("fill", "green")
            .text("2017");

        // add title to line graph
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "underline")
            .text("Yealy Incident Report");
            
        // add the dots with tooltips
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function (d) { return x(d.date); })
            .attr("cy", function (d) { return y(d.sam); })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(formatTime(d.date) + "<br/>" + d.sam)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });
}
