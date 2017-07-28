import c3 from 'c3';
import $ from 'jquery';
import * as d3 from 'd3';
import * as constants from './constants';

export default class AgeChart {

	constructor (watcherData, countryData) {
		const buckets = ['13-14', '15-17', '18-22', '23-30', '30+', 'Unknown'];

        const data = this.formatAgeData(watcherData, this.getAgeBucket, buckets);
        // this.drawChart();

		const slicedData = data;
		slicedData.splice(buckets.length-1, 1); // Remove unknown data
		this.drawChart("#ageChart", slicedData, buckets);


        console.log("unknown Ages: " + this.unknownCount);
    }

	drawChart (id, data, buckets) {

		const containerHeight = 600;
		const containerWidth = 300;

		const total = d3.sum(data, function(d) { return d.values });
		console.log("HERE" + $(id).width());
		var margin = {top: 50, right: 50, bottom: 50, left: 50},
    		width = containerHeight - margin.left - margin.right,
    		height = containerWidth - margin.top - margin.bottom;

		// Scales
		var x = d3.scale.ordinal().rangeRoundBands([0, width], .2);
		var y = d3.scale.linear().range([height, 0]);

		// Axis
		var xAxis = d3.svg.axis().scale(x).orient("bottom");
		// var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

		// SVG
		var svg = d3.select("#ageChart").append("svg")
			.attr("class", "bar-chart")
			.attr("viewBox", "0 0 " + containerHeight + " " + containerWidth)
			.attr("preserveAspectRatio", "xMidYMid meet")
  			.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  	x.domain(data.map(function(d) { return d.key }));
	  	y.domain([0, d3.max(data, function(d) { return d.values; })]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "middle")
				.attr("dy", "1em")

		var bars = svg.selectAll("bar")
			.data(data)
			.enter().append("g");

		bars.append("rect")
			.style("fill", "steelblue")
			.attr("x", function(d) { return x(d.key); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.values); })
			.attr("height", function(d) { return height - y(d.values); });

		bars.append("text")
			.text(function(d) {
				return Math.round(100 * d.values/total) + "%";
			})
			.attr("x", function(d) { return x(d.key) + 40; })
			.attr("y", function(d) { return y(d.values) - 5; })
			.style("text-anchor", "middle")

	}


    formatAgeData(watcherData, getAgeBucket, buckets) {
		var data = d3.nest()
			.key(function(d) { return getAgeBucket(d.age, buckets) })
			.rollup(function(d) {
				return d.length;
			}).entries(watcherData);

		// Sort data
		data.sort(function(a,b) {return (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0);} );

		return data;
    }

	getAgeBucket(age, buckets) {
        if (age !== null) {
            var age = parseInt(age);
            switch(true) {
                case (age <= 14):
                    return buckets[0];
                case (age <= 17):
                    return buckets[1];
                case (age <= 22):
                    return buckets[2];
                case (age <= 30):
                    return buckets[3];
                default:
                    return buckets[4];
            }
        } else {
            return buckets[5];
        }
	}
}
