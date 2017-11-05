"use strict";

//window.onload = renderMyChart;

function triggerBarHighlight(stateName) {
    document.getElementById(stateName+'Bar').classList.remove('bar');
    document.getElementById(stateName+'Bar').classList.add('barHover');
}

function triggerBarReset(stateName){
    document.getElementById(stateName+'Bar').classList.remove('barHover');
    document.getElementById(stateName+'Bar').classList.add('bar');
}

function renderMyChart() {
    var svg = d3.select("#svgHolderDiv").append("svg:svg")
        .attr("width", 600)//canvasWidth)
        .attr("height", 500),//canvasHeight);
        margin = { top: 20, right: 20, bottom: 30, left: 70 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // change the dataset
    d3.csv("MassShooting.csv", function (d) {
        // change the y value
        d.Frequency = +d.Frequency;
        return d;
    }, function (error, data) {
        if (error) throw error;

        x.domain(data.map(function (d) { return d.Month; }));
        y.domain([0, d3.max(data, function (d) { return d.Frequency; })]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Population");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.Month); })
            .attr("y", function (d) { return y(d.Frequency); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.Frequency); })
            .attr("id", function(d){return d.Month + "Bar";})
            //giving each state bar in the chart an ID so that each can be reached later for manipulation
            .on("mouseover", function(d){
                triggerMapHighlight(d.States);
            })
            .on("mouseout", function (d){
                triggerMapReset(d.States);
            })
    });
}
