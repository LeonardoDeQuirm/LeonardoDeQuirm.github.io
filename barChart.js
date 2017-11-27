"use strict";

//window.onload = renderMyChart;

 function triggerBarHighlight(Month) {
    document.getElementById(Month+'Bar').classList.remove('bar');
    document.getElementById(Month+'Bar').classList.add('barHover');
}

function triggerBarReset(Month){
    document.getElementById(Month+'Bar').classList.remove('barHover');
    document.getElementById(Month+'Bar').classList.add('bar');
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
    d3.csv("MassShootingMonthFrequency.csv", function (d) {
        // change the y value
        d.Frequency = +d.Frequency;
        return d;
    }, function (error, data) {
        if (error) throw error;

        x.domain(data.map(function (d) { return d.allYearMonths; }));
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
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 150)
            .attr("y", height + 50)
            .text("Month");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("text-anchor", "end")
            .attr("y", 10)
            .attr("x", -200)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Frequency");

        svg.append("text")
            .attr("x", ((width/2)+ 60))
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .text("Incidents by Month (Click to see points)")

var allMonths = [0,0,0,0,0,0,0,0,0,0,0,0];
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.allYearMonths); })
            .attr("y", function (d) { return y(d.Frequency); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.Frequency); })
            .attr("id", function(d){return d.allYearMonths + "Bar";})
            //giving each state bar in the chart an ID so that each can be reached later for manipulation
            
            .on("click", function(d){
                console.log(d.allYearMonths);
                if( allMonths[d.allYearMonths-1] === 0){
                    allMonths[d.allYearMonths-1]=1;
                    triggerMapPoints(d.allYearMonths);
                    triggerBarHighlight(d.allYearMonths);
                }
                else{
                    allMonths[d.allYearMonths-1]=0;                    
                    triggerBarReset(d.allYearMonths);
                    triggerMapReset(allMonths);
                }
            });
    });
}
